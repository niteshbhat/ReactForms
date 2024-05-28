const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.post('/submit', (req, res) => {
    const data = req.body;

    // Save the JSON file
    const filePath = path.join(__dirname, 'example.json');
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Run the PowerShell script
        exec('powershell.exe -File ./main.ps1', (err, stdout, stderr) => {
            if (err) {
                console.error('Error executing PowerShell script:', err);
                return res.status(500).send('Internal Server Error');
            }

            console.log('PowerShell script output:', stdout);
            console.error('PowerShell script errors:', stderr);
            res.send('Configuration submitted successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});