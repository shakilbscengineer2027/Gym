# REST API Specification & Contract Guidelines

This document defines the REST API protocol, endpoint taxonomy, payload conventions, error standards, and synchronization endpoints for **ApexPulse** version `v1`.

---

## 1. General Protocol Conventions

- **Base URL**: `https://api.apexpulse.app/api/v1`
- **Transport**: HTTPS with TLS 1.3 only.
- **Data Serialization**: JSON (`application/json; charset=utf-8`).
- **Authentication**: Bearer Token in HTTP Authorization Header:
  ```http
  Authorization: Bearer <access_token>
  ```
- **Idempotency**: All mutation routes (`POST`, `PUT`, `PATCH`) accept an optional `Idempotency-Key` header with a client-generated UUIDv7 to prevent accidental duplicate actions.
- **Client Metadata**: Mobile clients must include:
  ```http
  X-Client-Platform: iOS | Android
  X-Client-Version: 1.0.0
  X-Client-Build: 104
  ```

---

## 2. Standard Response & Error Envelopes

### 2.1 Standard Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-11-06T21:30:00.000Z",
    "requestId": "019304a2-7b83-7c22-b5e1-889345abcdef"
  }
}
```

### 2.2 Paginated Success Envelope
```json
{
  "success": true,
  "data": [ ... ],
  "error": null,
  "meta": {
    "timestamp": "2026-11-06T21:30:00.000Z",
    "requestId": "019304a2-7b83-7c22-b5e1-889345abcdef",
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalRecords": 142,
      "totalPages": 8,
      "hasNext": true,
      "nextCursor": "019304a2-7b83-7c22-b5e1-889345abcdef"
    }
  }
}
```

### 2.3 Standard Error Envelope
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The payload failed structural schema validation.",
    "details": [
      {
        "field": "weightKg",
        "issue": "weightKg must be greater than or equal to 0"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-11-06T21:30:00.000Z",
    "requestId": "019304a2-7b83-7c22-b5e1-889345abcdef"
  }
}
```

### 2.4 Canonical Error Codes
| HTTP Status | Error Code | Description |
| :---: | :--- | :--- |
| `400` | `BAD_REQUEST` / `VALIDATION_FAILED` | Malformed payload or validation pipe failure. |
| `401` | `UNAUTHORIZED` / `TOKEN_EXPIRED` | Missing, malformed, or expired access token. |
| `403` | `FORBIDDEN` / `HEALTH_CONSENT_REQUIRED` | Missing permissions or required GDPR consent. |
| `404` | `RESOURCE_NOT_FOUND` | Target entity does not exist or has been soft-deleted. |
| `409` | `RESOURCE_CONFLICT` / `SYNC_COLLISION` | Duplicate unique constraint or sync version mismatch. |
| `429` | `RATE_LIMIT_EXCEEDED` | Request threshold breached. |
| `500` | `INTERNAL_SERVER_ERROR` | Unexpected server fault (details masked from client). |

---

## 3. Comprehensive Endpoint Taxonomy

### Module 01: Authentication & User Profiles
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/register` | Register new user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate email/password; returns JWT pair | Public |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh token; returns new pair | Public |
| `POST` | `/api/v1/auth/logout` | Revoke active refresh token family | Bearer |
| `GET` | `/api/v1/users/me` | Fetch authenticated user profile & entitlements | Bearer |
| `PATCH`| `/api/v1/users/me` | Update display name, avatar, or preferences | Bearer |

### Module 02: Home Dashboard
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/dashboard/summary` | Aggregated dashboard: streak, daily goal, readiness | Bearer |

### Module 03: Exercise Library
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/exercises` | List exercises with muscle & equipment filters | Bearer |
| `GET` | `/api/v1/exercises/:id` | Get exercise details, history, and video URL | Bearer |
| `POST` | `/api/v1/exercises` | Create user custom exercise | Bearer |

### Module 04: Workout Management
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/workouts/templates` | List user routine templates | Bearer |
| `POST` | `/api/v1/workouts/templates` | Create workout template with supersets | Bearer |
| `GET` | `/api/v1/workouts/templates/:id` | Get full template configuration | Bearer |
| `PUT` | `/api/v1/workouts/templates/:id` | Update template layout & exercises | Bearer |
| `DELETE`| `/api/v1/workouts/templates/:id`| Soft delete workout template | Bearer |

### Module 05: Workout Tracking
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/tracking/sessions/start` | Start live workout session | Bearer |
| `POST` | `/api/v1/tracking/sessions/:id/sets`| Log or update individual set record | Bearer |
| `POST` | `/api/v1/tracking/sessions/:id/finish`| Finalize workout, calculate volume and PRs | Bearer |
| `GET` | `/api/v1/tracking/sessions` | Query paginated historical workout logs | Bearer |

### Module 06: Schedule & Calendar
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/calendar/events` | Query events within date range | Bearer |
| `POST` | `/api/v1/calendar/events` | Schedule workout template to a date | Bearer |
| `DELETE`| `/api/v1/calendar/events/:id` | Remove scheduled calendar event | Bearer |

### Module 07: Nutrition & Diet
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/nutrition/goals` | Fetch active macro & calorie targets | Bearer |
| `PUT` | `/api/v1/nutrition/goals` | Configure macro targets | Bearer |
| `GET` | `/api/v1/nutrition/meals` | List logged meals for a specific date | Bearer |
| `POST` | `/api/v1/nutrition/meals` | Log a meal with items & nutritional values | Bearer |

### Module 08: Body Measurements
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/measurements` | Query weight and circumference history | Bearer |
| `POST` | `/api/v1/measurements` | Record body weight / circumferences | Bearer |
| `POST` | `/api/v1/measurements/photos/upload-url`| Request pre-signed S3 upload URL | Bearer |

### Module 09: Fitness Progress & Analytics
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/analytics/volume-progression` | Muscle volume trends over time | Bearer |
| `GET` | `/api/v1/analytics/1rm/:exerciseId` | Estimated 1RM historical curve | Bearer |

### Module 10: Trainers & Coaching
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/coaching/clients` | List assigned clients (Trainer only) | Bearer (Trainer) |
| `POST` | `/api/v1/coaching/invite` | Issue trainer-client binding invite | Bearer |
| `POST` | `/api/v1/coaching/assign-routine`| Assign workout template to client | Bearer (Trainer) |

### Module 11: Notifications
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/notifications` | Fetch user notification inbox | Bearer |
| `PATCH`| `/api/v1/notifications/:id/read` | Mark notification as read | Bearer |
| `POST` | `/api/v1/notifications/push-token`| Register FCM / APNs device token | Bearer |

### Module 12: Community & Leaderboard
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/community/feed` | Paginated social activity feed | Bearer |
| `POST` | `/api/v1/community/posts` | Create public post | Bearer |
| `GET` | `/api/v1/community/leaderboard` | View opt-in monthly leaderboard | Bearer |

### Module 13: Subscriptions
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/subscriptions/status` | Current tier, expiry, and entitlement flags | Bearer |
| `POST` | `/api/v1/subscriptions/webhook` | Webhook ingress for Apple/Google/Stripe | Signature Verified |

### Module 14: Settings & GDPR Hub
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/gdpr/consents` | List current consent states | Bearer |
| `POST` | `/api/v1/gdpr/consents` | Grant or revoke specific consent | Bearer |
| `POST` | `/api/v1/gdpr/export` | Request full JSON/CSV data export archive | Bearer |
| `POST` | `/api/v1/gdpr/delete-account` | Initiate account deletion (30-day grace) | Bearer |

### Module 15: Offline Synchronization Engine
| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/sync/push` | Dispatch queued offline mutations | Bearer |
| `GET` | `/api/v1/sync/pull` | Delta sync: fetch entities updated since timestamp | Bearer |

---

## 4. Offline Sync Payload Specification

### Request: `POST /api/v1/sync/push`
```json
{
  "lastSyncedAt": "2026-11-06T18:00:00.000Z",
  "mutations": [
    {
      "mutationId": "019304b1-8891-7d11-a201-998877665544",
      "entity": "SET_LOG",
      "action": "CREATE",
      "clientTimestamp": "2026-11-06T19:15:22.100Z",
      "payload": {
        "id": "019304b1-8891-7d11-a201-998877665544",
        "workoutSessionId": "019304ae-1234-7d11-a201-001122334455",
        "exerciseId": "01930488-9999-7d11-a201-aabbccddeeff",
        "setNumber": 1,
        "weightKg": 100.0,
        "reps": 8,
        "rpe": 8.5
      }
    }
  ]
}
```

### Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "serverTimestamp": "2026-11-06T21:35:00.000Z",
    "appliedMutations": [
      "019304b1-8891-7d11-a201-998877665544"
    ],
    "conflicts": []
  },
  "error": null,
  "meta": {
    "timestamp": "2026-11-06T21:35:00.000Z",
    "requestId": "019304b2-0001-7c22-b5e1-112233445566"
  }
}
```

