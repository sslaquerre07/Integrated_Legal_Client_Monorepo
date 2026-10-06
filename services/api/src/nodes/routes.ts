import { Router } from 'express';
import { NodesService } from './nodes.service';

const router = Router();
const nodesService = new NodesService();

router.get('/', async (_req, res) => {
  try {
    const nodes = await nodesService.getAllNodes();
    res.status(200).json({ success: true, data: nodes });
  } catch (error: unknown) {
    console.error('Database connection failed:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ success: false, error: message });
  }
});

export default router;
