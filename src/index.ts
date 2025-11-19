import express, { Request, Response } from 'express';
import cors from 'cors';
import { createRecords } from './createRecords';

const app = express();
const PORT = process.env.PORT || 3000;

const records = createRecords();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

type Record = {
  id: number;
  name: string;
};

const selectedRecords: Record[] = [];

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World! Express server is running.', records });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/v1/records', (req: Request, res: Response) => {
  const { index } = req.body;
  console.log(req.body);
  let recordsBatch: Record[] = [];
  recordsBatch = records.slice(index, index + 20);
  console.log('🚀 ~ recordsBatch:', recordsBatch);
  return res.json(recordsBatch);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
