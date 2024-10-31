const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

// CORS ja JSON middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello! Server is running. API endpoint is available at /api/register');
});


app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.create({
            data: { username, password },
        });
        res.status(201).json({ message: 'User created!', user });
    } catch (error) {
        res.status(400).json({ error: 'Username already exists or something went wrong!' });
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
