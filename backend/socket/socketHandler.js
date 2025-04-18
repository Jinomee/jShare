/**
 * Socket.io handler for real-time updates
 */
module.exports = (io) => {
  // Store active connections
  const activeConnections = new Map();

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    // Add connection to active connections
    activeConnections.set(socket.id, {
      id: socket.id,
      connectedAt: new Date()
    });
    
    // Update active users count
    updateActiveUsers();
    
    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      activeConnections.delete(socket.id);
      updateActiveUsers();
    });
    
    // Handle file upload progress
    socket.on('uploadProgress', (data) => {
      // Broadcast progress to all clients except sender
      socket.broadcast.emit('uploadProgress', data);
    });
    
    // Handle file download progress
    socket.on('downloadProgress', (data) => {
      // Broadcast progress to all clients except sender
      socket.broadcast.emit('downloadProgress', data);
    });
    
    // Handle client joining a share room
    socket.on('joinShare', (shareId) => {
      socket.join(`share-${shareId}`);
      console.log(`Client ${socket.id} joined share room: ${shareId}`);
    });
    
    // Handle client leaving a share room
    socket.on('leaveShare', (shareId) => {
      socket.leave(`share-${shareId}`);
      console.log(`Client ${socket.id} left share room: ${shareId}`);
    });
  });
  
  // Function to update active users count
  function updateActiveUsers() {
    const count = activeConnections.size;
    io.emit('activeUsers', { count });
  }
  
  // Make io instance available to the app
  return io;
};
