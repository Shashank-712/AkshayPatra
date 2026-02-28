import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      socket.emit('join', userId);
    });
    
    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });
  }
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};