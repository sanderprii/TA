// server.js

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { engine } = require('express-handlebars');
const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

// CORS and JSON middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Set up Handlebars view engine
app.engine('handlebars', engine({
    helpers: {
        eq: (a, b) => a === b,
    },
    defaultLayout: 'main',
    extname: '.handlebars',
}));

app.set('view engine', 'handlebars');
app.set('views', './views');

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Send username to templates
app.use((req, res, next) => {
    res.locals.username = req.session.username;
    next();
});

// Serve public folder
app.use(express.static('public'));

// Protect routes middleware
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }

    // Kontrollime, kas tegemist on API-päringuga
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        // Kui pole API-päring, suuname kasutaja sisse logima
        res.redirect('/login');
    }
}

// Home page, protected route
app.get('/', ensureAuthenticated, (req, res) => {
    res.render('home', { title: 'Home' });
});

// Register view
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Login view
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Training route, protected
app.get('/training', ensureAuthenticated, (req, res) => {
    res.render('training', { title: 'Add Training' });
});

// Training sessions
app.get('/sessions', ensureAuthenticated, async (req, res) => {
    try {
        // Fetch trainings for the current user
        const trainings = await prisma.training.findMany({
            where: { userId: req.session.userId },
            include: { exercises: true },
        });

        // Pass trainings to the view
        res.render('sessions', {
            title: 'Training Sessions',
            username: req.session.username,
            trainings: JSON.stringify(trainings), // Pass as JSON string
        });
    } catch (error) {
        console.error('Error fetching trainings:', error);
        res.status(500).send('An error occurred while fetching trainings.');
    }
});

// API for registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        const user = await prisma.user.create({
            data: { username, password },
        });
        res.status(201).json({ message: 'User created successfully!', user });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

// API for login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (user && user.password === password) {
            req.session.userId = user.id;
            req.session.username = user.username;
            res.status(200).json({ message: 'Login successful!', user });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

// Profile view, protected
app.get('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });

        // Age
        const calculateAge = (birthDate) => {
            const today = new Date();
            const birthDateObj = new Date(birthDate);
            let age = today.getFullYear() - birthDateObj.getFullYear();
            const monthDiff = today.getMonth() - birthDateObj.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
                age--;
            }
            return age;
        };

        const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : null;

        res.render('profile', {
            title: 'My Profile',
            user,
            age
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Edit profile
app.post('/profile', ensureAuthenticated, async (req, res) => {
    const { fullName, dateOfBirth, sex } = req.body;
    try {
        await prisma.user.update({
            where: { id: req.session.userId },
            data: {
                fullName,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                sex,
            },
        });

        // Send a success response back to the client
        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating user profile:', error);

        // Send an error response back to the client
        res.status(500).json({ error: 'An error occurred while updating your profile.' });
    }
});

// Log out API
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// API for adding training, protected
app.post('/api/training', ensureAuthenticated, async (req, res) => {
    const {
        type,
        date,
        score,
        wodName,
        wodType,
        exercises,
    } = req.body;

    try {
        // Validate request data
        if (!type || !date || !Array.isArray(exercises) || exercises.length === 0) {
            return res.status(400).json({ error: 'Invalid training data.' });
        }

        // Build the data object
        const trainingData = {
            type,
            wodName: wodName || null,
            wodType: wodType || null,
            date: new Date(date),
            score: score || null,
            userId: req.session.userId,
            exercises: {
                create: exercises.map((exercise) => ({
                    exerciseData: exercise.exerciseData || '',
                })),
            },
        };

        // Save training with associated exercises
        const training = await prisma.training.create({
            data: trainingData,
            include: { exercises: true },
        });

        // Load all trainings for response
        const allTrainings = await prisma.training.findMany({
            where: { userId: req.session.userId },
            include: { exercises: true },
            orderBy: { date: 'desc' },
        });
        res.status(201).json({ message: 'Training added successfully!', trainings: allTrainings });
    } catch (error) {
        console.error('Error saving training:', error);
        res.status(500).json({ error: 'Failed to save training.', details: error.message });
    }
});

// Get trainings, protected
app.get('/api/trainings', ensureAuthenticated, async (req, res) => {
    try {
        const allTrainings = await prisma.training.findMany({
            where: { userId: req.session.userId },
            include: {
                exercises: true,
            },
            orderBy: { date: 'desc' },
        });
        res.json(allTrainings);
    } catch (error) {
        console.error("Error fetching trainings:", error);
        res.status(500).json({ error: 'Failed to load trainings.' });
    }
});

// Delete training
app.delete('/api/training/:id', ensureAuthenticated, async (req, res) => {
    const trainingId = parseInt(req.params.id);

    try {
        // Check if the training exists and if the user is authorized to delete it
        const training = await prisma.training.findUnique({
            where: { id: trainingId },
            include: { user: true },
        });

        if (!training || training.userId !== req.session.userId) {
            return res.status(404).json({ error: 'Training not found or not authorized.' });
        }

        await prisma.exercise.deleteMany({
            where: { trainingId },
        });

        await prisma.training.delete({
            where: { id: trainingId },
        });

        res.status(200).json({ message: 'Training deleted successfully!' });
    } catch (error) {
        console.error("Error deleting training:", error);
        res.status(500).json({ error: 'Failed to delete training.', details: error.message });
    }
});

// Records view
app.get('/records', ensureAuthenticated, (req, res) => {
    res.render('records', { title: 'Records' });
});

// API for Records
app.get('/api/records', ensureAuthenticated, async (req, res) => {
    const type = req.query.type || 'WOD';

    try {
        const records = await prisma.record.findMany({
            where: {
                userId: req.session.userId,
                type,
            },
            orderBy: {
                date: 'desc',
            },
        });

        // Group records by name and get the latest one
        const latestRecords = [];
        const namesSet = new Set();

        records.forEach((record) => {
            if (!namesSet.has(record.name)) {
                latestRecords.push(record);
                namesSet.add(record.name);
            }
        });

        res.json(latestRecords);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Failed to fetch records.' });
    }
});

// API endpoint to fetch records by name

app.get('/api/records/:name', ensureAuthenticated, async (req, res) => {
    const name = req.params.name;
    const type = req.query.type || 'WOD';

    try {
        const records = await prisma.record.findMany({
            where: {
                userId: req.session.userId,
                type,
                name,
            },
            orderBy: {
                date: 'desc',
            },
            select: {
                id: true,
                date: true,
                score: true,
                weight: true,
                time: true,
                // Lisa teised väljad vastavalt vajadusele
            },
        });

        res.json(records);
    } catch (error) {
        console.error('Error fetching records by name:', error);
        res.status(500).json({ error: 'Failed to fetch records by name.' });
    }
});


app.post('/api/records', ensureAuthenticated, async (req, res) => {
    const { type, name, date, score, weight, time } = req.body;

    try {
        const recordData = {
            type,
            name,
            date: new Date(date),
            userId: req.session.userId,
            score: score || null,
            weight: weight ? parseFloat(weight) : null,
            time: time || null,
        };

        await prisma.record.create({
            data: recordData,
        });

        res.status(201).json({ message: 'Record added successfully!' });
    } catch (error) {
        console.error('Error adding record:', error);
        res.status(500).json({ error: 'Failed to add record.' });
    }
});

// Kustuta rekord
app.delete('/api/records/:id', ensureAuthenticated, async (req, res) => {
    const recordId = parseInt(req.params.id);

    try {
        // Kontrolli, kas rekord eksisteerib ja kasutaja on volitatud seda kustutama
        const record = await prisma.record.findUnique({
            where: { id: recordId },
        });

        if (!record || record.userId !== req.session.userId) {
            return res.status(404).json({ error: 'Record not found or not authorized.' });
        }

        await prisma.record.delete({
            where: { id: recordId },
        });

        res.status(200).json({ message: 'Record deleted successfully!' });
    } catch (error) {
        console.error("Error deleting record:", error);
        res.status(500).json({ error: 'Failed to delete record.', details: error.message });
    }
});




// API endpoint to fetch another user's records by exercise name
app.get('/api/user-records/:userId/exercise/:name', ensureAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.userId);
    const name = req.params.name;
    const type = req.query.type || 'WOD';

    try {
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!userExists) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const records = await prisma.record.findMany({
            where: {
                userId: userId,
                type,
                name,
            },
            orderBy: {
                date: 'desc',
            },
            select: {
                id: true,
                date: true,
                score: true,
                weight: true,
                time: true,
            },
        });

        res.json(records);
    } catch (error) {
        console.error('Error fetching user records by name:', error);
        res.status(500).json({ error: 'Failed to fetch user records by name.' });
    }
});

// API endpoint to fetch another user's records
app.get('/api/user-records/:userId', ensureAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.userId);
    const type = req.query.type || 'WOD';

    try {
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });

        if (!userExists) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const records = await prisma.record.findMany({
            where: {
                userId: userId,
                type,
            },
            orderBy: {
                date: 'desc',
            },
        });

        // Group records by name and get the latest one
        const latestRecords = [];
        const namesSet = new Set();

        records.forEach((record) => {
            if (!namesSet.has(record.name)) {
                latestRecords.push(record);
                namesSet.add(record.name);
            }
        });

        res.json(latestRecords);
    } catch (error) {
        console.error('Error fetching user records:', error);
        res.status(500).json({ error: 'Failed to fetch user records.' });
    }
});

// **Find Users Functionality**

// Route to display the Find Users page
app.get('/find-users', ensureAuthenticated, (req, res) => {
    res.render('findu', { title: 'Find Users' });
});

// API endpoint for searching users
app.get('/api/search-users', ensureAuthenticated, async (req, res) => {
    const query = req.query.q;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: query } },
                    { fullName: { contains: query } },
                ],
                id: { not: req.session.userId }, // Exclude the current user
            },
            select: {
                id: true,
                username: true,
                fullName: true,
            },
            take: 10, // Limit the number of results
        });

        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to view another user's records
app.get('/user-records/:id', ensureAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                fullName: true,
            },
        });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        res.render('user-records', {
            title: `${user.username}'s Records`,
            user,
        });
    } catch (error) {
        console.error('Error fetching user records:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Update training API
app.put('/api/training/:id', ensureAuthenticated, async (req, res) => {
    const trainingId = parseInt(req.params.id);
    const { type, date, wodName, wodType, score, exercises } = req.body;

    try {
        // Verify ownership
        const training = await prisma.training.findUnique({
            where: { id: trainingId },
        });

        if (!training || training.userId !== req.session.userId) {
            return res.status(403).json({ error: 'Not authorized to update this training.' });
        }

        // Update the training
        const updatedTraining = await prisma.training.update({
            where: { id: trainingId },
            data: {
                type,
                date: new Date(date),
                wodName,
                wodType,
                score,
                exercises: {
                    deleteMany: {}, // Clear existing exercises
                    create: exercises.map((exercise) => ({
                        exerciseData: exercise.exerciseData || '',
                    })),
                },
            },
            include: { exercises: true },
        });

        res.status(200).json({ message: 'Training updated successfully!', training: updatedTraining });
    } catch (error) {
        console.error('Error updating training:', error);
        res.status(500).json({ error: 'Failed to update training.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
