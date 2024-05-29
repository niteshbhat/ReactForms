const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is up');
});

app.post('/start-powershell', (req, res) => {
    const data = req.body;
    // Save the JSON file
    const filePath = path.join(__dirname, 'example.json');
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Run the PowerShell script
        const scriptPath = path.join(__dirname, 'main.ps1');
        exec(`powershell.exe -File ${scriptPath}`, (err, stdout, stderr) => {
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