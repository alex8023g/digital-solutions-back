import express, { Request, Response } from 'express';
import cors from 'cors';
import { createRecords } from './createRecords';

const app = express();
const PORT = process.env.PORT || 3000;

let records = createRecords();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

type Record = {
  id: number;
  name: string;
};

let selectedRecords: Record[] = [];

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World! Express server is running.', records });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/v1/records', (req: Request, res: Response) => {
  console.log('🚀 ~/api/v1/records start');
  const { index } = req.body;
  console.log(req.body);
  let recordsBatch: Record[] = [];
  recordsBatch = records.slice(index, index + 20);
  console.log('🚀 ~ recordsBatch:', recordsBatch);
  return res.json(recordsBatch);
});
app.post('/api/v1/selected-records', (req: Request, res: Response) => {
  console.log('🚀 ~/api/v1/selected-records start');
  const { index } = req.body;
  return res.json(selectedRecords.slice(index, index + 20));
});

app.post('/api/v1/add-selected-record', (req: Request, res: Response) => {
  const { id } = req.body;
  const record = records.find((record) => record.id === id);
  if (record) {
    selectedRecords.push(record);
    records = records.filter((record) => record.id !== id);
  }
  console.log('🚀 ~ selectedRecords:', selectedRecords);
  return res.json(selectedRecords);
});

app.post('/api/v1/set-selected-records', (req: Request, res: Response) => {
  console.log('🚀 ~/api/v1/set-selected-records start');
  const body = req.body;
  selectedRecords = body.records;
  console.log('🚀 ~ selectedRecords:', selectedRecords);
  return res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
