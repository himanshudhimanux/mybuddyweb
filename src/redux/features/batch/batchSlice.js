import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';


// Async thunks for fetching session, location, and course
export const fetchSessions = createAsyncThunk('batches/fetchSessions', async () => {
  const response = await api.get('/session-years');
  return response.data;
});


export const fetchLocations = createAsyncThunk('batches/fetchLocations', async () => {
  const response = await api.get('/locations');
  return response.data;
});


export const fetchCourses = createAsyncThunk('batches/fetchCourses', async () => {
  const response = await api.get('/courses');
  return response.data;
});


// GOOD: only return the batch list
export const fetchBatches = createAsyncThunk('batches/fetchBatches', async () => {
  const response = await api.get('/batches');
  return response.data.data; // ✅ assuming response = { success, message, data: [...] }
});


// Async thunk for batch creation and deletion
export const createBatch = createAsyncThunk('batches/createBatch', async (batchData) => {
  const response = await api.post('/create-batch', batchData);
  return response.data;
});


export const deleteBatch = createAsyncThunk('batches/deleteBatch', async (batchId) => {
  await api.delete(`/delete-batch/${batchId}`);
  return batchId;
});


// Slice
const batchSlice = createSlice({
  name: 'batches',
  initialState: {
    batches: [],
    loading: false,
    error: null,
    sessions: [],
    locations: [],
    courses: [],
    sessionYear: null,
    locationId: null,
    courseId: null,
    batchName: '',
    status: null,
  },
  reducers: {
    setSessionYear: (state, action) => {
      state.sessionYear = action.payload;
    },
    setLocationId: (state, action) => {
      state.locationId = action.payload;
    },
    setCourseId: (state, action) => {
      state.courseId = action.payload;
    },
    setBatchName: (state, action) => {
      state.batchName = action.payload;
    },
      clearStatus: (state) => {
    state.status = null;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload; // ✅ payload is now an array
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

    .addCase(createBatch.fulfilled, (state, action) => {
      state.batches.push(action.payload.batch);
      state.status = 'success'; // ✅ Set status for toast tracking
    })
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.batches = state.batches.filter((batch) => batch._id !== action.payload);
      });
  },
});

export const { setSessionYear, setLocationId, setCourseId, setBatchName, clearStatus  } = batchSlice.actions;
export default batchSlice.reducer;
