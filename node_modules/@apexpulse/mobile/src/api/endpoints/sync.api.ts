import { apiClient } from '../client';
import { SyncPushPayload, SyncPushResult } from '../types';

export const syncApi = {
  async pushMutations(payload: SyncPushPayload): Promise<SyncPushResult> {
    return apiClient.post<SyncPushResult>('/sync/push', payload);
  },

  async pullDelta(sinceTimestamp: string): Promise<any> {
    return apiClient.get(`/sync/pull?since=${encodeURIComponent(sinceTimestamp)}`);
  },
};
