import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const DB_NAME = 'apexpulse_offline.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase | null> => {
  if (Platform.OS === 'web') {
    return null; // SQLite is native-only; Web uses localStorage fallback
  }
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    await initDatabaseTables(dbInstance);
  }
  return dbInstance;
};

export const initDatabaseTables = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      primary_muscle TEXT NOT NULL,
      equipment TEXT NOT NULL,
      instructions TEXT,
      thumbnail_url TEXT,
      is_custom INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workout_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      fitness_level TEXT,
      duration_minutes INTEGER,
      estimated_calories INTEGER,
      exercises_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id TEXT PRIMARY KEY,
      template_id TEXT,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      duration_seconds INTEGER DEFAULT 0,
      total_volume_kg REAL DEFAULT 0,
      synced INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS set_logs (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      set_number INTEGER NOT NULL,
      set_type TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      reps INTEGER NOT NULL,
      rpe REAL,
      is_completed INTEGER DEFAULT 1,
      completed_at TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS body_measurements (
      id TEXT PRIMARY KEY,
      recorded_date TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      body_fat_percent REAL,
      chest_cm REAL,
      waist_cm REAL,
      left_arm_cm REAL,
      right_arm_cm REAL,
      synced INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS offline_mutation_queue (
      id TEXT PRIMARY KEY,
      mutation_id TEXT UNIQUE NOT NULL,
      entity TEXT NOT NULL,
      action TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      client_timestamp TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_started ON workout_sessions(started_at);
    CREATE INDEX IF NOT EXISTS idx_sets_session ON set_logs(session_id);
    CREATE INDEX IF NOT EXISTS idx_measurements_date ON body_measurements(recorded_date);
    CREATE INDEX IF NOT EXISTS idx_mutations_synced ON offline_mutation_queue(synced);
  `);
};
