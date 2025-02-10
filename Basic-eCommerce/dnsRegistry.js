const express = require('express');
const app = express();
const PORT = 4000;

let servers = ["http://localhost:3001", "http://localhost:3002"];
let currentServerIndex = 0;

app.get('/getServer', (req, res) => {
    res.json({ code: 200, server: servers[currentServerIndex] });
});

app.post('/switchServer', (req, res) => {
    currentServerIndex = (currentServerIndex + 1) % servers.length;
    res.json({ code: 200, message: "Switched to backup server", newServer: servers[currentServerIndex] });
});

app.listen(PORT, () => {
    console.log(`DNS Registry running on port ${PORT}`);
});