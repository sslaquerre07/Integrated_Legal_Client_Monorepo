import { parse } from 'pg-connection-string';

// Configuration for the database connection
export function getDatabaseConfig(getEnv: (name: string) => string | undefined) {
  const databaseUrl = getEnv('DATABASE_URL');
  const urlConfig = databaseUrl ? parse(databaseUrl) : undefined;

  if (!urlConfig || !urlConfig?.host || !urlConfig?.user || !urlConfig?.database) {
    throw new Error(
      'Set DB_HOST, DB_USER, and DB_NAME, or provide them through DATABASE_URL.',
    );
  }

  return {
    type: 'postgres' as const,
    host: urlConfig.host,
    port: Number(urlConfig?.port ?? 5432),
    username: urlConfig.user,
    password: getEnv('DB_PASSWORD') || urlConfig?.password,
    database: urlConfig.database,
    schema: 'public',
    synchronize: false as const,
  };
}
