import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { type Disaster } from './useDisasters';

export function useDisasterWebSocket() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/telemetry');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Telemetry feed streaming securely...");
    };

    ws.onmessage = (event) => {
      try {
        const newDisaster: Disaster = JSON.parse(event.data);

        queryClient.setQueryData<Disaster[]>(['disasters'], (oldData) => {
          if (!oldData) return [newDisaster];
          return [newDisaster, ...oldData];
        });
      } catch (err) {
        console.error("Failed to parse incoming telemetry frame:", err);
      }
    };

    ws.onclose = () => {
      console.log("Telemetry link disconnected.");
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  return wsRef.current;
}