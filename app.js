const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
const { v4: uuidv4 } = require('uuid');

app.use(cors());

// Store connected clients
const clients = {};

app.get('/events', (req, res) => {
    // Headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientId = uuidv4();
    clients[clientId] = res;

    res.write(`data: Welcome! Your ID is ${clientId}\n\n`);

    // Handle client disconnect
    req.on('close', () => {
        console.log(`Client ${clientId} disconnected`);
        delete clients[clientId];
    });
});

/**
 * Function to send updates to all connected clients.
 * @param {Object} data - The data to be sent to clients.
 */
function sendUpdateToClients(data) {
    Object.values(clients).forEach(client => {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
}

/**
 * simulate sending updates every 5 seconds
 */
setInterval(() => {
    const updateData = {
        message: 'New update!',
        timestamp: new Date().toISOString()
    };
    sendUpdateToClients(updateData);
}, 5000);


app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});