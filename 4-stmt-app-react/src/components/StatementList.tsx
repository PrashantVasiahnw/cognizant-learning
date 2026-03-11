import { StatementRow, StatementPayload } from '../types';
import StatementRowComponent from './StatementRow';

interface StatementListProps {
  rows: StatementRow[];
  editingIndex: number | null;
  onEdit: (index: number) => void;
  onSave: (index: number, data: StatementPayload) => Promise<boolean>;
  onCancel: () => void;
  onDelete: (index: number) => void;
}

function StatementList({
  rows,
  editingIndex,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: StatementListProps) {
  return (
    <div id="stmtRows">
      {rows.map((row, index) => (
        <StatementRowComponent
          key={row.id ?? index}
          row={row}
          index={index}
          isEditing={editingIndex === index}
          onEdit={() => onEdit(index)}
          onSave={(data) => onSave(index, data)}
          onCancel={onCancel}
          onDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
}

export default StatementList;
