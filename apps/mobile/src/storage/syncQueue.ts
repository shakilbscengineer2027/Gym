import { getDatabase } from './sqliteDatabase';
import { Platform } from 'react-native';

export type SyncEntity = 'WORKOUT_SESSION' | 'SET_LOG' | 'MEASUREMENT' | 'WORKOUT_TEMPLATE';
export type SyncAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface PendingMutation {
  id: string;
  mutationId: string;
  entity: SyncEntity;
  action: SyncAction;
  payload: any;
  clientTimestamp: string;
  synced: boolean;
}

// In-memory fallback for web
const webMemoryQueue: PendingMutation[] = [];

export const syncQueue = {
  async enqueueMutation(
    entity: SyncEntity,
    action: SyncAction,
    payload: Record<string, any>
  ): Promise<string> {
    const mutationId = `mut_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const clientTimestamp = new Date().toISOString();

    if (Platform.OS === 'web') {
      webMemoryQueue.push({
        id: mutationId,
        mutationId,
        entity,
        action,
        payload,
        clientTimestamp,
        synced: false,
      });
      return mutationId;
    }

    const db = await getDatabase();
    if (db) {
      await db.runAsync(
        `INSERT INTO offline_mutation_queue (id, mutation_id, entity, action, payload_json, client_timestamp, synced)
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [mutationId, mutationId, entity, action, JSON.stringify(payload), clientTimestamp]
      );
    }

    return mutationId;
  },

  async getPendingMutations(): Promise<PendingMutation[]> {
    if (Platform.OS === 'web') {
      return webMemoryQueue.filter((m) => !m.synced);
    }

    const db = await getDatabase();
    if (!db) return [];

    const rows = await db.getAllAsync<any>(
      `SELECT * FROM offline_mutation_queue WHERE synced = 0 ORDER BY client_timestamp ASC`
    );

    return rows.map((r) => ({
      id: r.id,
      mutationId: r.mutation_id,
      entity: r.entity as SyncEntity,
      action: r.action as SyncAction,
      payload: JSON.parse(r.payload_json),
      clientTimestamp: r.client_timestamp,
      synced: r.synced === 1,
    }));
  },

  async markMutationSynced(mutationId: string): Promise<void> {
    if (Platform.OS === 'web') {
      const item = webMemoryQueue.find((m) => m.mutationId === mutationId);
      if (item) item.synced = true;
      return;
    }

    const db = await getDatabase();
    if (db) {
      await db.runAsync(
        `UPDATE offline_mutation_queue SET synced = 1 WHERE mutation_id = ?`,
        [mutationId]
      );
    }
  },

  async clearSyncedMutations(): Promise<void> {
    if (Platform.OS === 'web') {
      const idx = webMemoryQueue.findIndex((m) => m.synced);
      if (idx !== -1) webMemoryQueue.splice(idx, 1);
      return;
    }

    const db = await getDatabase();
    if (db) {
      await db.runAsync(`DELETE FROM offline_mutation_queue WHERE synced = 1`);
    }
  },
};
