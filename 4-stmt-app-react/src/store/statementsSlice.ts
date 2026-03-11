import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StatementRow, StatementPayload } from '../types';
import {
  fetchStatements as apiFetch,
  createStatement as apiCreate,
  updateStatement as apiUpdate,
  deleteStatement as apiDelete,
} from '../api';

interface StatementsState {
  rows: StatementRow[];
  editingIndex: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatementsState = {
  rows: [],
  editingIndex: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchStatementsThunk = createAsyncThunk(
  'statements/fetch',
  async () => {
    const data = await apiFetch();
    return data;
  }
);

export const addStatementThunk = createAsyncThunk(
  'statements/add',
  async (data: StatementPayload) => {
    await apiCreate(data);
    const updatedData = await apiFetch();
    return updatedData;
  }
);

export const updateStatementThunk = createAsyncThunk(
  'statements/update',
  async ({ id, data }: { id: number; data: StatementPayload }) => {
    await apiUpdate(id, data);
    const updatedData = await apiFetch();
    return updatedData;
  }
);

export const deleteStatementThunk = createAsyncThunk(
  'statements/delete',
  async (id: number) => {
    await apiDelete(id);
    const updatedData = await apiFetch();
    return updatedData;
  }
);

const statementsSlice = createSlice({
  name: 'statements',
  initialState,
  reducers: {
    setEditingIndex(state, action: PayloadAction<number | null>) {
      state.editingIndex = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch statements
      .addCase(fetchStatementsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatementsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload;
      })
      .addCase(fetchStatementsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load statements';
        state.rows = [];
      })
      // Add statement
      .addCase(addStatementThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStatementThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload;
      })
      .addCase(addStatementThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add statement';
      })
      // Update statement
      .addCase(updateStatementThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatementThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload;
        state.editingIndex = null;
      })
      .addCase(updateStatementThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update statement';
      })
      // Delete statement
      .addCase(deleteStatementThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStatementThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload;
      })
      .addCase(deleteStatementThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete statement';
      });
  },
});

export const { setEditingIndex, clearError } = statementsSlice.actions;
export default statementsSlice.reducer;
