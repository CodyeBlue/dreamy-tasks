const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// ROUTE 1: Save a single task to the txt file
app.post('/api/save', (req, res) => {
    const task = req.body.task;

    fs.appendFile('tasks.txt', task + '\n', (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.status(200).json({ status: 'success' });
    });
});

// ROUTE 2: Read all tasks from the txt file to send to React
app.get('/api/read', (req, res) => {
    fs.readFile('tasks.txt', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(200).json([]);
            }
            return res.status(500).json({ status: 'error', message: err.message });
        }
        
        const tasks = data.split('\n').filter(task => task.trim() !== '');
        res.status(200).json(tasks);
    });
});

// ROUTE 3: Clear everything inside the txt file
app.delete('/api/clear', (req, res) => {
    fs.writeFile('tasks.txt', '', (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.status(200).json({ status: 'success' });
    });
});

app.listen(5000);
