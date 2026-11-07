# ApexPulse — Premium Gym & Fitness Ecosystem

[![Architecture: Modular Monolith](https://img.shields.io/badge/Architecture-Modular%20Monolith-blue.svg)](./ARCHITECTURE.md)
[![Backend: NestJS](https://img.shields.io/badge/Backend-NestJS%2011-E0234E.svg)](https://nestjs.com/)
[![Mobile: React Native](https://img.shields.io/badge/Mobile-React%20Native%200.76-61DAFB.svg)](https://reactnative.dev/)
[![Database: PostgreSQL + Prisma](https://img.shields.io/badge/Database-PostgreSQL%2016%20%7C%20Prisma%206-336791.svg)](./DATABASE.md)
[![GDPR: Compliant](https://img.shields.io/badge/GDPR-Privacy%20By%20Design-green.svg)](./GDPR.md)
[![Security: Audited Standard](https://img.shields.io/badge/Security-Zero%20Trust%20%7C%20OWASP%20ASVS-orange.svg)](./SECURITY.md)

ApexPulse is an enterprise-grade, offline-first Gym and Fitness mobile ecosystem designed for iOS and Android, backed by a robust TypeScript NestJS modular monolith, PostgreSQL, Prisma ORM, and Redis.

---

## 🏛️ Repository Overview

This project is organized as an industrial monorepo using **npm / pnpm workspaces** to maximize code reuse between the backend API and the cross-platform mobile client while ensuring strict architectural boundaries.

```
gym-fitness-app/
├── apps/
│   ├── backend/               # NestJS 11+ REST API (Modular Monolith)
│   └── mobile/                # React Native 0.76+ (Expo SDK 52 Bare Workflow / Prebuild)
├── packages/
│   ├── shared/                # Universal business logic, DTO schemas, and utilities
│   ├── types/                 # Pure TypeScript domain and API contract interfaces
│   └── eslint-config/         # Standardized ESLint & Prettier configs
├── docker/                    # Docker Compose & container configurations
├── docs/                      # Architectural Decision Records (ADRs) and diagrams
├── ARCHITECTURE.md            # Comprehensive system & component blueprints
├── DATABASE.md                # PostgreSQL schema, ER design, and indexing strategies
├── API.md                     # REST API specification, conventions, and endpoint catalogue
├── SECURITY.md                # OWASP ASVS security architecture and RBAC specifications
├── GDPR.md                    # Privacy-by-design, data retention, and consent management
├── PROJECT_CONTEXT.md         # Business rationale, scope, and domain definitions
└── DEVELOPMENT_STATUS.md      # Roadmap, phase tracking, and risk registers
```

---

## 🚀 Technology Stack Summary

| Layer | Primary Technology | Selection Rationale |
| :--- | :--- | :--- |
| **Mobile Client** | **React Native 0.76+** with New Architecture (Fabric + TurboModules) | 60+ FPS native rendering, type safety, cross-platform parity (iOS & Android). |
| **Mobile Tooling** | **Expo SDK 52 (Prebuild Workflow)** | Predictable native builds, unified config plugins, no Expo lock-in, automated CI/CD. |
| **Mobile State** | **TanStack Query v5 + Zustand v5** | Server-state caching and synchronization separated from lightweight client UI state. |
| **Local Storage** | **OP-SQLite + react-native-keychain** | Ultra-fast C++ JSI-backed SQLite engine for offline synchronization + hardware-backed Keystore/Keychain. |
| **Backend Framework** | **NestJS 11 (TypeScript Strict)** | Enterprise modular monolith with DI, standard guards, interceptors, and OpenAPI generation. |
| **Database** | **PostgreSQL 16** | ACID compliance, JSONB support for workout logs, connection pooling with PgBouncer. |
| **ORM & Migrations** | **Prisma ORM 6** | End-to-end type safety, auto-generated TypeScript clients, robust schema-driven migrations. |
| **Cache & Queue** | **Redis 7 + BullMQ 5** | High-throughput distributed caching, rate-limiting, and resilient background job execution. |
| **API Protocol** | **RESTful API with OpenAPI 3.0 (Swagger)** | Explicit resource versioning (`/api/v1`), predictable payloads, standard error envelopes. |
| **Containerization** | **Docker & Docker Compose** | Reproducible multi-stage development, testing, and production runtime environments. |

---

## 🧭 Architectural Documentation Index

1. [**Project Context & Domain Scope** (`PROJECT_CONTEXT.md`)](./PROJECT_CONTEXT.md)  
   Detailed domain breakdown for all 14 core modules, business rules, target personas, and non-functional targets.
2. [**System Architecture & Roadmap** (`ARCHITECTURE.md`)](./ARCHITECTURE.md)  
   Complete multi-tier topology, offline-first sync algorithm (vector clocks/mutation queue), mobile/backend structures, and risk mitigation.
3. [**Database Blueprint & Data Models** (`DATABASE.md`)](./DATABASE.md)  
   Full PostgreSQL schema definition, indexing strategy, foreign keys, soft deletes, and audit log tables.
4. [**API Architecture & OpenAPI Catalog** (`API.md`)](./API.md)  
   Endpoint taxonomy, pagination protocols, idempotency key handling, response envelopes, and error codes.
5. [**Security Blueprint & Threat Model** (`SECURITY.md`)](./SECURITY.md)  
   Argon2id hashing, short-lived JWTs with rotating refresh tokens, RBAC & resource-level policies, and tamper resistance.
6. [**GDPR & Privacy-by-Design** (`GDPR.md`)](./GDPR.md)  
   Article 9 special category health consent, data export/erasure automation, retention schedules, and breach playbooks.
7. [**Development Status & Phase Tracker** (`DEVELOPMENT_STATUS.md`)](./DEVELOPMENT_STATUS.md)  
   Phase progress, gating milestones, change log, and Phase 01 completion verification.

---

## ⚙️ Initial Environment Prerequisites

Ensure the following tools are present on your host machine prior to Phase 02 dependency provisioning:
- **Node.js**: `v20.x LTS` (Iron) or `v22.x LTS`
- **Package Manager**: `pnpm` (recommended) or `npm v10+`
- **Docker Engine**: `v26.0+` & **Docker Compose** `v2.27+`
- **Mobile Tooling**:
  - Android Studio with Android SDK 34, NDK 26+, and CMake
  - Xcode 16+ (macOS host only, target iOS 16.0+)
  - JDK 17 (Eclipse Temurin or OpenJDK)

---

## 🔒 Phase Gating Notice

> **CURRENT STATUS: Phase 01 (Planning & Technical Architecture) COMPLETE.**  
> Application source code generation and dependency installations are suspended until explicit sign-off from the project stakeholder.

