import express from 'express';
import cors from 'cors';
import type { User } from '@repo/types';
import nodesRouter from './nodes/routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/nodes', nodesRouter);

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
