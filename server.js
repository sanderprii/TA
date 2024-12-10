// server.js

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { engine } = require('express-handlebars');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
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

// Middleware to ensure user is an affiliate owner
function ensureAffiliateOwner(req, res, next) {
    if (req.session.isAffiliateOwner) {
        return next();
    } else {
        res.redirect('/');
    }
}





// Serve public folder
app.use(express.static('public'));

// Protect routes middleware
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        console.log('Authenticated user:', req.session.username);
        console.log('isAffiliateOwner:', req.session.isAffiliateOwner);
        return next();
    }

    // Check if it's an API request
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        // Redirect to login page
        res.redirect('/login');
    }
}


// Send username and isAffiliateOwner to templates
app.use((req, res, next) => {
    res.locals.username = req.session.username;
    res.locals.isAffiliateOwner = req.session.isAffiliateOwner || false;
    next();
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

// Statistics and Analysis view
app.get('/stat', ensureAuthenticated, (req, res) => {
    res.render('stat', { title: 'Statistics and Analysis' });
});

// Route to choose role after login
app.get('/choose-role', ensureAuthenticated, (req, res) => {
    if (req.session.isAffiliateOwner) {
        res.render('choose-role', { title: 'Choose Role' });
    } else {
        res.redirect('/'); // If not an affiliate owner, redirect to home
    }
});



//  route for /gym
app.get('/gym', ensureAuthenticated, ensureAffiliateOwner, (req, res) => {
    res.render('gym', { title: 'Affiliate Owner Dashboard', layout: 'owner' });
});

// route for plans
app.get('/plans', ensureAuthenticated, ensureAffiliateOwner, (req, res) => {
    res.render('plans', { title: 'Plans', layout: 'owner' });
});

// My Affiliate lehe kuvamine
app.get('/my-affiliate', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    try {
        const affiliate = await prisma.affiliate.findFirst({
            where: { ownerId: req.session.userId },
            include: {
                trainers: {
                    include: {
                        trainer: true
                    }
                }
            }
        });

        if (!affiliate) {
            // Pole veel affiliate infot
            return res.render('my-affiliate', {
                title: 'My Affiliate',
                noAffiliate: true,
                layout: 'owner'
            });
        }

        // Kui affiliate on olemas
        const trainers = affiliate.trainers.map(t => ({
            fullName: t.trainer.fullName || '',
            username: t.trainer.username,
            trainerId: t.trainerId
        }));

        res.render('my-affiliate', {
            title: 'My Affiliate',
            affiliate,
            trainers,
            layout: 'owner'
        });
    } catch (error) {
        console.error('Error loading affiliate:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Classes page for affiliate owners
app.get('/classes', ensureAuthenticated, ensureAffiliateOwner, (req, res) => {
    res.render('classes', { title: 'Classes', layout: 'owner' });
});





// Gym page for affiliate owners
app.get('/gym', ensureAuthenticated, (req, res) => {
    if (req.session.isAffiliateOwner) {
        res.render('gym', { title: 'Affiliate Owner Dashboard' });
    } else {
        res.redirect('/'); // Regular users are redirected to home
    }
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

// Function to validate password
function validatePassword(password) {
    // Define a regular expression that allows only certain characters
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+=\-{}[\]:;"'<>,.?/|~`]{1,}$/;

    if (!passwordRegex.test(password)) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long and can only contain letters, numbers, and special characters (!@#$%^&*()_+=-{}[]:"\'<>,.?/|~`).',
        };
    }
    // Disallow dangerous characters
    const dangerousCharRegex = /[`~\\]/; // Add any characters you consider dangerous
    if (dangerousCharRegex.test(password)) {
        return {
            isValid: false,
            message: 'Password contains invalid characters.',
        };
    }
    // Additional validation rules can be added here (e.g., minimum length, character types)

    return { isValid: true };
}

// API for registration
app.post('/api/register', async (req, res) => {
    const {
        username,
        password,
        email,
        isAffiliateOwner,
        sex,
        dateOfBirth,
    } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        // Check if email is unique if provided
        if (email) {
            const existingEmail = await prisma.user.findUnique({
                where: { email },
            });
            if (existingEmail) {
                return res.status(400).json({ error: 'Email already in use.' });
            }
        }

        // Validate the password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ error: passwordValidation.message });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword, // Store the hashed password
                email,
                isAffiliateOwner,
                sex,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            },
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

        if (user) {
            // Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                req.session.userId = user.id;
                req.session.username = user.username;
                req.session.isAffiliateOwner = user.isAffiliateOwner || false; // Store in session

                res.status(200).json({
                    message: 'Login successful!',
                    isAffiliateOwner: user.isAffiliateOwner || false,
                });
            } else {
                res.status(401).json({ error: 'Invalid username or password.' });
            }
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

// API endpoint for searching Default WODs
app.get('/api/search-default-wods', async (req, res) => {
    const query = req.query.q;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    try {
        const wods = await prisma.defaultWOD.findMany({
            where: {
                name: { contains: query.toUpperCase() },
            },
            take: 10,
        });

        res.json(wods);
    } catch (error) {
        console.error('Error searching Default WODs:', error);
        res.status(500).json({ error: 'Failed to search Default WODs.' });
    }
});


// API endpoint to fetch statistics
app.get('/api/statistics', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;

        // Total trainings
        const totalTrainings = await prisma.training.count({ where: { userId } });

        // Trainings per month for the last year
        const now = new Date();
        const months = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
            });
        }

        const trainingsPerMonth = [];
        for (const m of months) {
            const startDate = new Date(m.year, m.month - 1, 1);
            const endDate = new Date(m.year, m.month, 0);
            const count = await prisma.training.count({
                where: {
                    userId,
                    date: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
            });
            trainingsPerMonth.push({
                year: m.year,
                month: m.month,
                count,
            });
        }

        // Trainings by type
        const trainingsByType = await prisma.training.groupBy({
            by: ['type'],
            where: { userId },
            _count: {
                type: true,
            },
        });

        // Current month trainings
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const trainingsThisMonth = await prisma.training.count({
            where: {
                userId,
                date: {
                    gte: startOfMonth,
                    lt: now,
                },
            },
        });

        // User's monthly goal
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { monthlyGoal: true },
        });

        res.json({
            totalTrainings,
            trainingsPerMonth,
            trainingsByType,
            trainingsThisMonth,
            monthlyGoal: user.monthlyGoal,
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics.' });
    }
});

// API endpoint to update user's monthly goal
app.post('/api/user/monthly-goal', ensureAuthenticated, async (req, res) => {
    const { monthlyGoal } = req.body;
    try {
        await prisma.user.update({
            where: { id: req.session.userId },
            data: {
                monthlyGoal: parseInt(monthlyGoal),
            },
        });
        res.json({ message: 'Monthly goal updated successfully.' });
    } catch (error) {
        console.error('Error updating monthly goal:', error);
        res.status(500).json({ error: 'Failed to update monthly goal.' });
    }
});









// affiliate owner routes


// API endpoint to get classes within a date range
app.get('/api/classes', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    const ownerId = req.session.userId;
    const { start, end } = req.query;

    try {
        // Muuda kuupäeva alguse ja lõpu määratlust
        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999); // Veendu, et päev lõpeb õigesti

        const classes = await prisma.classSchedule.findMany({
            where: {
                ownerId,
                time: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { time: 'asc' }
        });

        res.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: 'Failed to fetch classes.' });
    }
});


// API endpoint to create a new class
app.post('/api/classes', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    const ownerId = req.session.userId;
    const {
        trainingName,
        date,
        time,
        trainer,
        memberCapacity,
        location,
        repeatWeekly
    } = req.body;

    try {
        const classData = {
            trainingName,
            time: new Date(`${date}T${time}`),
            trainer,
            memberCapacity: memberCapacity ? parseInt(memberCapacity) : null,
            location,
            repeatWeekly,
            ownerId
        };

        // Create the class
        const newClass = await prisma.classSchedule.create({
            data: classData
        });

// Assign seriesId to the original class
        await prisma.classSchedule.update({
            where: { id: newClass.id },
            data: { seriesId: newClass.id }
        });

// If repeatWeekly is true, create future classes
        if (repeatWeekly) {
            const repeats = [];
            let nextTime = new Date(newClass.time);
            for (let i = 1; i <= 52; i++) {
                nextTime = new Date(nextTime.getTime() + 7 * 24 * 60 * 60 * 1000);
                repeats.push({
                    trainingName,
                    time: new Date(nextTime),
                    trainer,
                    memberCapacity: newClass.memberCapacity,
                    location,
                    repeatWeekly,
                    ownerId,
                    seriesId: newClass.id // Assign the seriesId
                });
            }
            await prisma.classSchedule.createMany({ data: repeats });
        }

        res.status(201).json({ message: 'Class created successfully!' });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(500).json({ error: 'Failed to create class.' });
    }
});

// API endpoint to update a class
app.put('/api/classes/:id', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    const ownerId = req.session.userId;
    const classId = parseInt(req.params.id);
    const {
        trainingName,
        date,
        time,
        trainer,
        memberCapacity,
        location,
        repeatWeekly
    } = req.body;

    try {
        // Fetch existing class
        const existingClass = await prisma.classSchedule.findUnique({
            where: { id: classId }
        });

        if (!existingClass || existingClass.ownerId !== ownerId) {
            return res.status(403).json({ error: 'Not authorized to update this class.' });
        }

        const classData = {
            trainingName,
            time: new Date(`${date}T${time}`),
            trainer,
            memberCapacity: memberCapacity ? parseInt(memberCapacity) : null,
            location,
            repeatWeekly
        };

        // Update the class
        await prisma.classSchedule.update({
            where: { id: classId },
            data: classData
        });

        // Handle changes to repeatWeekly
        if (existingClass.repeatWeekly && !repeatWeekly) {
            // Changed from true to false
            // Delete future classes in the series
            await prisma.classSchedule.deleteMany({
                where: {
                    seriesId: existingClass.seriesId,
                    time: {
                        gt: existingClass.time
                    },
                    id: {
                        not: existingClass.id
                    }
                }
            });
        } else if (!existingClass.repeatWeekly && repeatWeekly) {
            // Changed from false to true
            // Create future classes
            const repeats = [];
            let nextTime = new Date(classData.time);
            for (let i = 1; i <= 52; i++) {
                nextTime = new Date(nextTime.getTime() + 7 * 24 * 60 * 60 * 1000);
                repeats.push({
                    trainingName,
                    time: new Date(nextTime),
                    trainer,
                    memberCapacity: classData.memberCapacity,
                    location,
                    repeatWeekly,
                    ownerId,
                    seriesId: existingClass.id
                });
            }
            await prisma.classSchedule.createMany({ data: repeats });

            // Update the seriesId of the existing class
            await prisma.classSchedule.update({
                where: { id: existingClass.id },
                data: { seriesId: existingClass.id }
            });
        }

        res.status(200).json({ message: 'Class updated successfully!' });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(500).json({ error: 'Failed to update class.' });
    }
});


app.delete('/api/classes/:id', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    const ownerId = req.session.userId;
    const classId = parseInt(req.params.id);

    try {
        const existingClass = await prisma.classSchedule.findUnique({
            where: { id: classId }
        });

        if (!existingClass || existingClass.ownerId !== ownerId) {
            return res.status(403).json({ error: 'Not authorized to delete this class.' });
        }

        if (existingClass.seriesId) {
            // Delete this class and future classes in the series
            await prisma.classSchedule.deleteMany({
                where: {
                    seriesId: existingClass.seriesId,
                    time: {
                        gte: existingClass.time
                    }
                }
            });
        } else {
            // Delete only this class
            await prisma.classSchedule.delete({
                where: { id: classId }
            });
        }

        res.status(200).json({ message: 'Class deleted successfully!' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ error: 'Failed to delete class.' });
    }
});

// API endpoint to get all plans
app.get('/api/plans', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    const ownerId = req.session.userId;

    try {
        const plans = await prisma.plan.findMany({
            where: {
                ownerId
            },
            orderBy: { id: 'asc' }
        });
        res.json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({ error: 'Failed to fetch plans.' });
    }
});

// API endpoint to create a new plan
app.post('/api/plans', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    const ownerId = req.session.userId;
    const {
        name,
        validityDays,
        price,
        additionalData
    } = req.body;

    try {
        const planData = {
            name,
            validityDays: parseInt(validityDays),
            price: parseFloat(price),
            additionalData,
            ownerId
        };

        // Create the plan
        const newPlan = await prisma.plan.create({
            data: planData
        });

        res.status(201).json({ message: 'Plan created successfully!', plan: newPlan });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ error: 'Failed to create plan.' });
    }
});

// API endpoint to update a plan
app.put('/api/plans/:id', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    const ownerId = req.session.userId;
    const planId = parseInt(req.params.id);
    const {
        name,
        validityDays,
        price,
        additionalData
    } = req.body;

    try {
        // Verify ownership
        const existingPlan = await prisma.plan.findUnique({
            where: { id: planId }
        });

        if (!existingPlan || existingPlan.ownerId !== ownerId) {
            return res.status(403).json({ error: 'Not authorized to update this plan.' });
        }

        const planData = {
            name,
            validityDays: parseInt(validityDays),
            price: parseFloat(price),
            additionalData
        };

        // Update the plan
        const updatedPlan = await prisma.plan.update({
            where: { id: planId },
            data: planData
        });

        res.status(200).json({ message: 'Plan updated successfully!', plan: updatedPlan });
    } catch (error) {
        console.error('Error updating plan:', error);
        res.status(500).json({ error: 'Failed to update plan.' });
    }
});

// API endpoint to delete a plan
app.delete('/api/plans/:id', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    const ownerId = req.session.userId;
    const planId = parseInt(req.params.id);

    try {
        // Verify ownership
        const existingPlan = await prisma.plan.findUnique({
            where: { id: planId }
        });

        if (!existingPlan || existingPlan.ownerId !== ownerId) {
            return res.status(403).json({ error: 'Not authorized to delete this plan.' });
        }

        await prisma.plan.delete({
            where: { id: planId }
        });

        res.status(200).json({ message: 'Plan deleted successfully!' });
    } catch (error) {
        console.error('Error deleting plan:', error);
        res.status(500).json({ error: 'Failed to delete plan.' });
    }
});

// API affiliate loomiseks või uuendamiseks
app.post('/api/affiliate', ensureAuthenticated, ensureAffiliateOwner, async (req, res) => {
    const { affiliateId, name, address, trainingType, trainers } = req.body;

    try {
        const trainerIds = Array.isArray(trainers) ? trainers.map(id => parseInt(id)) : [];

        if (affiliateId) {
            // Kontrolli, kas kasutajal on õigus seda affiliate't muuta
            const existing = await prisma.affiliate.findUnique({
                where: { id: parseInt(affiliateId) }
            });

            if (!existing || existing.ownerId !== req.session.userId) {
                return res.status(403).json({ error: 'Not authorized or affiliate not found' });
            }

            // Uuenda põhivälju
            await prisma.affiliate.update({
                where: { id: parseInt(affiliateId) },
                data: {
                    name,
                    address,
                    trainingType,
                }
            });

            // Leia olemasolevad treeneri seosed
            const existingTrainers = await prisma.affiliateTrainer.findMany({
                where: { affiliateId: parseInt(affiliateId) }
            });

            const existingTrainerIds = existingTrainers.map(t => t.trainerId);

            // Treenerid, mida tuleb lisada
            const newTrainerIds = trainerIds.filter(id => !existingTrainerIds.includes(id));

            // Treenerid, mida tuleb eemaldada
            const removedTrainerIds = existingTrainerIds.filter(id => !trainerIds.includes(id));

            // Lisa uued treenerid
            const createTrainers = newTrainerIds.map(tId => ({
                affiliateId: parseInt(affiliateId),
                trainerId: tId
            }));

            await prisma.affiliateTrainer.createMany({
                data: createTrainers
            });

            // Kustuta eemaldatud treenerid
            await prisma.affiliateTrainer.deleteMany({
                where: {
                    affiliateId: parseInt(affiliateId),
                    trainerId: { in: removedTrainerIds }
                }
            });

            res.status(200).json({ message: 'Affiliate updated successfully!' });
        } else {
            // Loo uus affiliate ja treeneriseosed
            const newAffiliate = await prisma.affiliate.create({
                data: {
                    name,
                    address,
                    trainingType,
                    ownerId: req.session.userId,
                }
            });

            const createTrainers = trainerIds.map(tId => ({
                affiliateId: newAffiliate.id,
                trainerId: tId
            }));

            await prisma.affiliateTrainer.createMany({
                data: createTrainers
            });

            res.status(201).json({ message: 'Affiliate created successfully!', affiliate: newAffiliate });
        }
    } catch (error) {
        console.error('Error saving affiliate info:', error);
        res.status(500).json({ error: 'Failed to save affiliate info.' });
    }
});




// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
