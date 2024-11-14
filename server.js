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

// Send username

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
    res.redirect('/login');
}



// Find Users lehe kuvamine
app.get('/find-users', ensureAuthenticated, (req, res) => {

    res.render('findu', { title: 'Find Users' });
});


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

// API for training, protected
app.post('/api/training', ensureAuthenticated, async (req, res) => {
    const {
        type,
        date,
        wodName,
        wodType,
        sets,
        every,
        forTime,
        minutes,
        rounds,
        work,
        rest,
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
            userId: req.session.userId,
            exercises: {
                create: exercises.map((exercise) => ({
                    exerciseName: exercise.exerciseName,
                    inputValue: exercise.inputValue || null,
                    count: exercise.count ? parseInt(exercise.count) : null,
                    rounds: exercise.rounds ? parseInt(exercise.rounds) : null,
                    time: exercise.time || null,
                })),
            },
        };

        // Add optional fields based on wodType
        if (wodType === 'For Time' && sets) {
            trainingData.sets = parseInt(sets);
        } else if (wodType === 'EMOM') {
            trainingData.every = parseInt(every);
            trainingData.forTime = parseInt(forTime);
            trainingData.sets = parseInt(sets);
        } else if (wodType === 'AMRAP' && minutes) {
            trainingData.minutes = parseInt(minutes);
        } else if (wodType === 'Tabata') {
            trainingData.rounds = parseInt(rounds);
            trainingData.work = parseInt(work);
            trainingData.rest = parseInt(rest);
        }

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
        });
        res.json(allTrainings);
    } catch (error) {
        console.error("Error fetching trainings:", error);
        res.status(500).json({ error: 'Failed to load trainings.' });
    }
});

//Delete training

app.delete('/api/training/:id', ensureAuthenticated, async (req, res) => {
    const trainingId = parseInt(req.params.id);

    try {
        // Controls if the training exists and if the user is authorized to delete it
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

// Records insert

app.get('/records', ensureAuthenticated, async (req, res) => {
    const defaultRecords = [
        { label: 'Back squat', value: 0 },
        { label: 'Front squat', value: 0 },
        { label: 'Deadlift', value: 0 },
        { label: 'Snatch', value: 0 },
        { label: 'Clean and Jerk', value: 0 }
    ];

    try {
        const records = await prisma.record.findMany({
            where: { userId: req.session.userId }
        });

        const recordsWithDefaults = defaultRecords.map(record => {
            const dbRecord = records.find(r => r.label === record.label);
            return {
                label: record.label,
                value: dbRecord ? dbRecord.value : record.value
            };
        });

        res.render('records', { title: 'Records', records: recordsWithDefaults });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Records update

app.post('/records', ensureAuthenticated, async (req, res) => {
    const [label] = Object.keys(req.body);
    const value = parseInt(req.body[label]);

    try {
        await prisma.record.upsert({
            where: {
                userId_label: { userId: req.session.userId, label }
            },
            update: {
                value
            },
            create: {
                userId: req.session.userId,
                label,
                value
            }
        });

        res.status(200).json({ message: 'Record updated successfully!' });
    } catch (error) {
        console.error('Error updating record:', error);
        res.status(500).json({ error: 'Failed to update record.' });
    }
});





// API endpoint for searching users
app.get('/api/search-users', ensureAuthenticated, async (req, res) => {
    const query = req.query.q;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                fullName: true,
            },
        });

        const queryLower = query.toLowerCase();

        const filteredUsers = allUsers.filter(user => {
            const usernameMatch = user.username.toLowerCase().includes(queryLower);
            const fullNameMatch = user.fullName && user.fullName.toLowerCase().includes(queryLower);
            return usernameMatch || fullNameMatch;
        });

        const users = filteredUsers.slice(0, 10);

        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







// View user records
app.get('/user-records/:id', ensureAuthenticated, async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                fullName: true,
                records: {
                    select: {
                        label: true,
                        value: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        res.render('user-records', { title: `${user.username}'s Records`, user });
    } catch (error) {
        console.error('Error fetching user records:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Send username
app.get('/', (req, res) => {
    console.log('GET / - req.session.username:', req.session.username);
    if (req.session.userId) {
        res.render('main', { username: req.session.username });
    } else {
        res.redirect('/login');
    }
});
app.use((req, res, next) => {
    res.locals.username = req.session.username;
    next();
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
