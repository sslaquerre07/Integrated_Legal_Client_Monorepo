// app/api/nodes/nodes.repository.ts
import pool from '../lib/db';

export class NodesRepository {
  async findAll() {
    // Modify columns matching your dev container initialized table schema
    const queryText = 'SELECT * FROM nodes LIMIT 50;';
    const { rows } = await pool.query(queryText);
    return rows;
  }
}
