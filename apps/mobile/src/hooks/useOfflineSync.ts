import { useState, useCallback, useEffect } from 'react';
import { syncQueue, PendingMutation } from '../storage/syncQueue';
import { syncApi } from '../api/endpoints/sync.api';

export interface UseOfflineSyncReturn {
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
  syncError: string | null;
  triggerSync: () => Promise<void>;
  refreshPendingCount: () => Promise<void>;
}

export function useOfflineSync(): UseOfflineSyncReturn {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const refreshPendingCount = useCallback(async () => {
    try {
      const items = await syncQueue.getPendingMutations();
      setPendingCount(items.length);
    } catch {
      // Ignore initial query errors
    }
  }, []);

  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  const triggerSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncError(null);

    try {
      const mutations: PendingMutation[] = await syncQueue.getPendingMutations();
      if (mutations.length === 0) {
        setIsSyncing(false);
        return;
      }

      const payload = {
        lastSyncedAt: lastSyncedAt || new Date(0).toISOString(),
        mutations: mutations.map((m) => ({
          mutationId: m.mutationId,
          entity: m.entity,
          action: m.action,
          clientTimestamp: m.clientTimestamp,
          payload: m.payload,
        })),
      };

      const result = await syncApi.pushMutations(payload);

      // Acknowledge applied mutations
      for (const id of result.appliedMutations) {
        await syncQueue.markMutationSynced(id);
      }
      await syncQueue.clearSyncedMutations();

      setLastSyncedAt(result.serverTimestamp);
      await refreshPendingCount();
    } catch (err: any) {
      setSyncError(err.message || 'Offline sync postponed');
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, lastSyncedAt, refreshPendingCount]);

  return {
    isSyncing,
    pendingCount,
    lastSyncedAt,
    syncError,
    triggerSync,
    refreshPendingCount,
  };
}
