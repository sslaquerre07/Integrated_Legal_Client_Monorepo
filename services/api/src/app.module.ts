import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodesModule } from './nodes/nodes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemNode } from './entities/node.entity';
import { env } from 'node:process';

const databaseUrl = env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to connect to PostgreSQL.');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: databaseUrl,
      schema: 'public',
      entities: [ItemNode],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NodesModule,
  ],
})
export class AppModule {}
