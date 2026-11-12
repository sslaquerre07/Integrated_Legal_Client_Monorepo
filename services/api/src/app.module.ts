import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NodesModule } from './nodes/nodes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';
import { ItemNode } from './entities/node.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const urlConfig = databaseUrl ? parse(databaseUrl) : undefined;
        const host = configService.get<string>('DB_HOST') ? `/cloudsql/${configService.get<string>('DB_HOST')}` : urlConfig?.host;
        const username = configService.get<string>('DB_USER') || urlConfig?.user;
        const database = configService.get<string>('DB_NAME') || urlConfig?.database;

        if (!host || !username || !database) {
          throw new Error(
            'Set DB_HOST, DB_USER, and DB_NAME, or provide them through DATABASE_URL.',
          );
        }

        return {
          type: 'postgres',
          host,
          port: Number(configService.get<string>('DB_PORT') || urlConfig?.port || 5432),
          username,
          password: configService.get<string>('DB_PASSWORD') || urlConfig?.password,
          database,
          schema: configService.get<string>('DB_SCHEMA') || 'public',
          entities: [ItemNode],
          synchronize: configService.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
    NodesModule,
  ],
})
export class AppModule {}
