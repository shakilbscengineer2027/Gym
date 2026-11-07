export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  nextCursor?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: {
    timestamp: string;
    requestId?: string;
    pagination: PaginatedMeta;
  };
}

export interface SyncPushPayload {
  lastSyncedAt: string;
  mutations: Array<{
    mutationId: string;
    entity: string;
    action: string;
    clientTimestamp: string;
    payload: any;
  }>;
}

export interface SyncPushResult {
  serverTimestamp: string;
  appliedMutations: string[];
  conflicts: Array<{
    mutationId: string;
    reason: string;
  }>;
}
