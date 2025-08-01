import knex, { Knex } from 'knex';
import { logger } from './logger';

let db: Knex;

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  pool: {
    min: 2,
    max: 10,
    createTimeoutMillis: 3000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100
  },
  acquireConnectionTimeout: 60000,
  migrations: {
    directory: '../database/migrations',
    extension: 'ts'
  },
  seeds: {
    directory: '../database/seeds',
    extension: 'ts'
  }
};

export async function connectDatabase(): Promise<Knex> {
  try {
    db = knex(config);
    
    // Test the connection
    await db.raw('SELECT 1');
    logger.info('Database connection established successfully');
    
    // Run migrations in production
    if (process.env.NODE_ENV === 'production') {
      await db.migrate.latest();
      logger.info('Database migrations completed');
    }
    
    return db;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

export function getDatabase(): Knex {
  if (!db) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return db;
}

export { db };