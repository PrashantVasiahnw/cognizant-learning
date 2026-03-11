export interface StatementRow {
  id?: number;
  date: string;
  header: string;
  credit: number;
  debit: number;
}

export type StatementPayload = Omit<StatementRow, 'id'>;
