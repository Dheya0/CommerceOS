import { useState, useEffect } from 'react';

export interface SystemHealthData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  platform: string;
  version: string;
  checks: {
    database: {
      status: 'up' | 'down';
      latencyMs?: number;
      error?: string;
    };
    memory: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
    };
  };
}

export function useHealth(pollIntervalMs: number = 30000) {
  const [health, setHealth] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/v1/health');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHealth(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch health metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const timer = setInterval(fetchHealth, pollIntervalMs);
    return () => clearInterval(timer);
  }, [pollIntervalMs]);

  return { health, loading, error, refetch: fetchHealth };
}
