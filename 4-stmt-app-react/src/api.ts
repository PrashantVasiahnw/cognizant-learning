import { StatementRow, StatementPayload } from './types';

const API_BASE = 'http://localhost:5001';

export async function fetchStatements(): Promise<StatementRow[]> {
  const res = await fetch(`${API_BASE}/statements`);
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
}

export async function createStatement(data: StatementPayload): Promise<StatementRow> {
  const res = await fetch(`${API_BASE}/statements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateStatement(id: number, data: StatementPayload): Promise<StatementRow> {
  const res = await fetch(`${API_BASE}/statements/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteStatement(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/statements/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete');
}
