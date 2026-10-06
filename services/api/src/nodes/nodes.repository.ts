// app/api/nodes/nodes.repository.ts
import { Injectable } from '@nestjs/common';
import pool from '../lib/db';

@Injectable()
export class NodesRepository {
  async findAll() {
    // Modify columns matching your dev container initialized table schema
    const queryText = 'SELECT * FROM nodes LIMIT 50;';
    const { rows } = await pool.query(queryText);
    return rows;
  }
}
