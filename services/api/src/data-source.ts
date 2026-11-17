import { DataSource } from 'typeorm';
import { getDatabaseConfig } from './database/database.config';

export default new DataSource({
  ...getDatabaseConfig((name) => process.env[name]),
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/migrations/*{.ts,.js}'],
});