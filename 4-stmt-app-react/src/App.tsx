import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  fetchStatementsThunk,
  addStatementThunk,
  updateStatementThunk,
  deleteStatementThunk,
  setEditingIndex,
} from './store/statementsSlice';
import { StatementPayload } from './types';
import StatementForm from './components/StatementForm';
import StatementList from './components/StatementList';

function App() {
  const dispatch = useAppDispatch();
  const { rows, editingIndex, loading, error } = useAppSelector((state) => state.statements);

  useEffect(() => {
    dispatch(fetchStatementsThunk());
  }, [dispatch]);

  const handleAdd = async (data: StatementPayload): Promise<boolean> => {
    try {
      await dispatch(addStatementThunk(data)).unwrap();
      return true;
    } catch (e) {
      console.error(e);
      alert('Failed to add statement');
      return false;
    }
  };

  const handleEdit = (index: number) => {
    dispatch(setEditingIndex(index));
  };

  const handleSave = async (index: number, data: StatementPayload): Promise<boolean> => {
    const existing = rows[index];
    if (!existing || existing.id == null) {
      alert('Cannot update this row');
      return false;
    }

    try {
      await dispatch(updateStatementThunk({ id: existing.id, data })).unwrap();
      return true;
    } catch (e) {
      console.error(e);
      alert('Failed to save changes');
      return false;
    }
  };

  const handleCancel = () => {
    dispatch(setEditingIndex(null));
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Remove this entry?')) return;

    const existing = rows[index];
    if (!existing || existing.id == null) {
      alert('Cannot delete this row');
      return;
    }

    try {
      await dispatch(deleteStatementThunk(existing.id)).unwrap();
    } catch (e) {
      console.error(e);
      alert('Failed to remove');
    }
  };

  const totalCredit = rows.reduce((sum, r) => sum + (r.credit || 0), 0);
  const totalDebit = rows.reduce((sum, r) => sum + (r.debit || 0), 0);
  const balance = totalCredit - totalDebit;

  const formatNumber = (n: number): string => {
    return n.toLocaleString();
  };

  return (
    <main className="container mt-5 mb-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="mb-4">Statement Manager</h1>
          
          {error && (
            <div className="alert alert-danger alert-dismissible" role="alert">
              {error}
            </div>
          )}
          
          <section>
            <StatementForm onAdd={handleAdd} />

            <div className="row g-2 p-3 bg-secondary-subtle rounded-top fw-bold">
              <div className="col-md-1">#</div>
              <div className="col-md-2">Date</div>
              <div className="col-md-3">Header</div>
              <div className="col-md-2">Credit</div>
              <div className="col-md-2">Debit</div>
              <div className="col-md-2">Actions</div>
            </div>

            {loading && rows.length === 0 ? (
              <div className="p-4 text-center text-muted">Loading...</div>
            ) : (
              <StatementList
                rows={rows}
                editingIndex={editingIndex}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
              />
            )}

            <div className="mt-4 pt-3 border-top">
              <div className="row g-2 mb-3 p-3 bg-light rounded">
                <div className="col-md-6 fw-bold">Totals</div>
                <div className="col-md-2"><strong>{formatNumber(totalCredit)}</strong></div>
                <div className="col-md-2"><strong>{formatNumber(totalDebit)}</strong></div>
                <div className="col-md-2"></div>
              </div>
              <div className="row g-2 p-3 bg-white rounded">
                <div className="col-md-8 fw-bold">Balance</div>
                <div className="col-md-4 text-end"><strong>{formatNumber(balance)}</strong></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
