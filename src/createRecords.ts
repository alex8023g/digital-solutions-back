import { nanoid } from 'nanoid';

export function createRecords() {
  let records: { id: number; name: string }[] = [];

  for (let i = 1; i <= 1000_000; i++) {
    records.push({ id: i, name: nanoid() });
    if (i % 1000 === 0) {
      console.log(`Created ${i} records`);
    }
  }

  return records;
}
