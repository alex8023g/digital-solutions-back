import express, { Request, Response } from 'express';
import cors from 'cors';
import { createRecords } from './createRecords';
import { nanoid } from 'nanoid';

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
let filteredSelectedRecords: Record[] = [];

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, World! Express server is running.', records });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/v1/records', (req: Request, res: Response) => {
  console.log('🚀 ~/api/v1/records start');
  const { index, filter } = req.body;
  console.log(req.body);
  let recordsBatch: Record[] = [];
  if (filter.length === 0) {
    recordsBatch = records.slice(index, index + 20);
    console.log('🚀 ~ recordsBatch:', recordsBatch);
    return res.json(recordsBatch);
  } else {
    recordsBatch = records
      .filter((record) => filter.includes(record.id))
      .slice(index, index + 20);
    console.log('🚀 ~ recordsBatch:', recordsBatch);
    return res.json(recordsBatch);
  }
});

app.post('/api/v1/selected-records', (req: Request, res: Response) => {
  console.log('🚀 ~/api/v1/selected-records start');
  const { index, filter } = req.body;
  if (filter.length === 0) {
    return res.json(selectedRecords.slice(index, index + 20));
  } else {
    filteredSelectedRecords = selectedRecords.filter((record) =>
      filter.includes(record.id)
    );
    return res.json(filteredSelectedRecords.slice(index, index + 20));
  }
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
app.post('/api/v1/remove-selected-record', (req: Request, res: Response) => {
  const { id } = req.body;
  selectedRecords = selectedRecords.filter((record) => record.id !== id);
  return res.json({ status: 'ok' });
});

app.post('/api/v1/save-selected-order', (req: Request, res: Response) => {
  console.log('🚀 ~/api/v1/save-selected-records start');
  const selectedRecordsInView = req.body.records;
  console.log('🚀 ~ selectedRecordsInView:', selectedRecordsInView);
  const filter = req.body.filter;
  if (filter.length === 0) {
    selectedRecords = [
      ...selectedRecordsInView,
      ...selectedRecords.slice(selectedRecordsInView.length, selectedRecords.length),
    ];
    console.log('🚀 ~ selectedRecords:', selectedRecords);
  } else {
    const selectedRecordsClone = [...selectedRecords];
    filteredSelectedRecords.forEach((record, i) => {
      const index = selectedRecords.findIndex((r) => r?.id === record?.id);
      if (index !== -1) {
        selectedRecordsClone[index] = selectedRecordsInView[i];
      }
    });
    selectedRecords = selectedRecordsClone;
    filteredSelectedRecords = selectedRecordsClone.filter((record) =>
      filter.includes(record.id)
    );
    console.log('🚀 ~ selectedRecordsClone:', selectedRecordsClone);
    return res.json({ status: 'ok' });
  }
});

app.post('/api/v1/add-new-record', (req: Request, res: Response) => {
  const { id } = req.body;
  const record = records.find((record) => record.id === id);
  if (record) {
    return res.json({ status: 'error', message: 'Record already exists' });
  }
  const newRecord = { id, name: nanoid() };
  records.push(newRecord);
  return res.json({ status: 'success', record: newRecord });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
