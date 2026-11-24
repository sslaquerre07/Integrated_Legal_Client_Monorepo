import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database.config';

export default new DataSource({
  ...getDatabaseConfig((name) => process.env[name]),
  entities: [join(__dirname, '**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
});