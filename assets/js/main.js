// main.js - Kiosk and Operator Panel Functionality

const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:3000');

// Kiosk event handlers
socket.on('kioskEvent', (data) => {
    console.log('Kiosk Event Received:', data);
    // Handle kiosk-specific functions here
});

// Operator Panel event handlers
socket.on('operatorEvent', (data) => {
    console.log('Operator Event Received:', data);
    // Handle operator-specific functions here
});

// Emit test messages
setInterval(() => {
    socket.emit('testMessage', { message: 'Hello from Kiosk/Operator Panel!' });
}, 5000);

// Handle connection errors
socket.on('connect_error', (error) => {
    console.error('Connection Error:', error);
});

// Handle disconnection
socket.on('disconnect', () => {
    console.warn('Disconnected from server');
});