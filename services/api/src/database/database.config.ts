import { parse } from 'pg-connection-string';

export function getDatabaseConfig(getEnv: (name: string) => string | undefined) {
  const databaseUrl = getEnv('DATABASE_URL');
  const urlConfig = databaseUrl ? parse(databaseUrl) : undefined;
  const dbHost = getEnv('DB_HOST');
  const host = dbHost ? `/cloudsql/${dbHost}` : urlConfig?.host;
  const username = getEnv('DB_USER') || urlConfig?.user;
  const database = getEnv('DB_NAME') || urlConfig?.database;

  if (!host || !username || !database) {
    throw new Error(
      'Set DB_HOST, DB_USER, and DB_NAME, or provide them through DATABASE_URL.',
    );
  }

  return {
    type: 'postgres' as const,
    host,
    port: Number(getEnv('DB_PORT') || urlConfig?.port || 5432),
    username,
    password: getEnv('DB_PASSWORD') || urlConfig?.password,
    database,
    schema: getEnv('DB_SCHEMA') || 'public',
    synchronize: false as const,
  };
}
