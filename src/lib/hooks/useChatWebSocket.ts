import { useEffect, useState, useRef } from 'react';
import { GetChatMessageResponse } from '@/@types/api-types';
import logger from '@/lib/core/logger';
import { useSession } from 'next-auth/react';

interface ChatWebSocketMessage {
  event: string;
  payload: GetChatMessageResponse;
}

interface UseChatWebSocketReturn {
  messages: ChatWebSocketMessage[];
  sendMessage: (message: ChatWebSocketMessage) => void;
  isConnected: boolean;
}

const useChatWebSocket = (url: string): UseChatWebSocketReturn => {
  const [messages, setMessages] = useState<ChatWebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  console.log({
    env: process.env.VERCEL_ENV,
  });

  const { data: session } = useSession();

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const token = session?.user.accessToken;

  const connectWebSocket = () => {
    if (!token) {
      logger.info("WebSocket connection can't be established");

      return;
    }

    logger.info('Try to establish WebSocket connection');

    const ws = new WebSocket(url, [token]);

    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      setIsConnected(true);
      logger.info('WebSocket connection established');
    };

    ws.onmessage = null;
    ws.onmessage = (event: MessageEvent) => {
      const parsedEvent = JSON.parse(event.data);
      const data: ChatWebSocketMessage = {
        event: parsedEvent.event,
        payload: JSON.parse(parsedEvent.payload),
      };
      logger.info('Received message:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    ws.onerror = null;
    ws.onerror = (error) => {
      logger.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      logger.info('WebSocket connection closed, attempting to reconnect...');
      setIsConnected(false);
      reconnectIntervalRef.current = setTimeout(connectWebSocket, 3000); // Attempt reconnection every 3 seconds
    };

    socketRef.current = ws;
  };

  const sendMessage = (message: ChatWebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectIntervalRef.current) {
        clearTimeout(reconnectIntervalRef.current);
      }
    };
  }, []);

  return { messages, sendMessage, isConnected };
};

export default useChatWebSocket;
