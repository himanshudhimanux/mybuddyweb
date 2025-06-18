// redux/slices/courseBatchMapSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';


// ✅ Add batches to course
export const addBatchesToCourse = createAsyncThunk(
  'courseBatchMap/addBatchesToCourse',
  async ({ courseId, batchIds }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/add-batches`, { courseId, batchIds });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

// ✅ Get batches for a course
export const getBatchesByCourseId = createAsyncThunk(
  'courseBatchMap/getBatchesByCourseId',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/batchebycourse/${courseId}/batches`);
      return { courseId, batches: response.data.batches };
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

// ✅ Remove a batch from course
export const removeBatchFromCourse = createAsyncThunk(
  'courseBatchMap/removeBatchFromCourse',
  async ({ courseId, batchId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/remove-batch`, {
        data: { courseId, batchId }
      });
      return { courseId, batchId };
    } catch (err) {
      return rejectWithValue(err.response.data.message || err.message);
    }
  }
);

// ✅ Initial State
const initialState = {
  courseBatches: {}, // { [courseId]: [batchObj, batchObj] }
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ Slice
const courseBatchMapSlice = createSlice({
  name: 'courseBatchMap',
  initialState,
  reducers: {
    clearCourseBatchMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // ADD BATCHES
      .addCase(addBatchesToCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBatchesToCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(addBatchesToCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BATCHES
      .addCase(getBatchesByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBatchesByCourseId.fulfilled, (state, action) => {
        const { courseId, batches } = action.payload;
        state.loading = false;
        state.courseBatches[courseId] = batches;
      })
      .addCase(getBatchesByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REMOVE BATCH
      .addCase(removeBatchFromCourse.fulfilled, (state, action) => {
        const { courseId, batchId } = action.payload;
        if (state.courseBatches[courseId]) {
          state.courseBatches[courseId] = state.courseBatches[courseId].filter(
            (batch) => batch._id !== batchId
          );
        }
      });
  },
});

export const { clearCourseBatchMessages } = courseBatchMapSlice.actions;

export default courseBatchMapSlice.reducer;
