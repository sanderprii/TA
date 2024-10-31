
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const { engine } = require('express-handlebars');
const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

// CORS ja JSON middleware
app.use(cors());
app.use(express.json());

// hbs view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// server public folder
app.use(express.static('public'));

// protect routes middleware
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

// home page, protected route
app.get('/', ensureAuthenticated, (req, res) => {
    res.render('home', { title: 'Home' });
});

// register view
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Log in view
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// API for registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.create({
            data: { username, password },
        });
        res.status(201).json({ message: 'User created successfully!', user });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(400).json({ error: 'Username already exists or something went wrong!' });
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
            res.status(200).json({ message: 'Login successful!', user });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: 'An error occurred during login.' });
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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
