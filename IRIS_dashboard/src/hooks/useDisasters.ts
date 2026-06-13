import {useQuery} from '@tanstack/react-query';

export interface Disaster {
  id: string;
  title: string;
  type: string;
  latitude: number;
  longitude: number;
  severity: number;
  timestamp: string;
  source: string;
}

const API_URL = 'http://localhost:8000/api/disasters';

async function fetchDisasters(): Promise<Disaster[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Network response error');
  }
  return response.json();
}

export function useDisasters() {
  return useQuery<Disaster[]>({
    queryKey: ['disasters'],
    queryFn: fetchDisasters,
    refetchInterval: 60000,
  });
}