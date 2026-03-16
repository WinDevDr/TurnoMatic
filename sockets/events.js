module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('new_turn', (data) => {
            io.emit('turn_added', data);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};