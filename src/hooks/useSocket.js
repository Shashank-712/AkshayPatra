import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSocket = (userId, onNewFood) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(
      process.env.REACT_APP_API_URL || "http://localhost:5000",
      { transports: ["websocket"] }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Connected to socket:", socket.id);
      socket.emit("join", userId);
    });

    socket.on("new-food-nearby", (data) => {
      console.log("🔔 New food received:", data);
      onNewFood && onNewFood(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};

export default useSocket;