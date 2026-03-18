import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { TasksState, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '../types';
import { fetchTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../services/tasksService';

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'all',
};

export const fetchTasksThunk = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTasksApi();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message ?? 'Failed to fetch tasks');
    }
  }
);

export const createTaskThunk = createAsyncThunk(
  'tasks/create',
  async (payload: CreateTaskPayload, { rejectWithValue }) => {
    try {
      return await createTaskApi(payload);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message ?? 'Failed to create task');
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  'tasks/update',
  async (payload: UpdateTaskPayload, { rejectWithValue }) => {
    try {
      return await updateTaskApi(payload);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message ?? 'Failed to update task');
    }
  }
);

export const deleteTaskThunk = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTaskApi(id);
      return id;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message ?? 'Failed to delete task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TaskStatus | 'all'>) => {
      state.filter = action.payload;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksThunk.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => { state.isLoading = false; state.tasks = action.payload; })
      .addCase(fetchTasksThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(createTaskThunk.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(createTaskThunk.fulfilled, (state, action) => { state.isLoading = false; state.tasks.push(action.payload); })
      .addCase(createTaskThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(updateTaskThunk.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.tasks.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(updateTaskThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      .addCase(deleteTaskThunk.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export const { setFilter, clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;
