import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api'; // Assuming `api.js` is at this path

// Initial State
const initialState = {
  attendanceRecords: [],
  eligibleStudents: [],
  currentAttendance: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalRecords: 0,
  },
  loading: false,
  error: null,
};

// Async Thunks

// Fetch attendance records with filters and pagination
export const fetchAttendanceRecords = createAsyncThunk(
  'attendance/fetchAttendanceRecords',
  async ({ sessionId, studentId, attendanceSource, attendanceType, page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await api.get('/attendances', {
        params: { sessionId, studentId, attendanceSource, attendanceType, page, limit },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch attendance records');
    }
  }
);

// Fetch eligible students for a session
export const fetchEligibleStudents = createAsyncThunk(
  'attendance/fetchEligibleStudents',
  async (sessionId, thunkAPI) => {
    try {
      const response = await api.get(`/sessions/${sessionId}/eligible-students`);
      return response.data.students;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch eligible students');
    }
  }
);

// Create a new attendance record
export const createAttendance = createAsyncThunk(
  'attendance/createAttendance',
  async (attendanceData, thunkAPI) => {
    try {
      const response = await api.post('/attendance', attendanceData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to create attendance record');
    }
  }
);

// Update an existing attendance record
export const updateAttendance = createAsyncThunk(
  'attendance/updateAttendance',
  async ({ id, updates }, thunkAPI) => {
    try {
      const response = await api.put(`/attendance/${id}`, updates);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to update attendance record');
    }
  }
);

// Delete an attendance record
export const deleteAttendance = createAsyncThunk(
  'attendance/deleteAttendance',
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete attendance record');
    }
  }
);

// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAttendance: (state) => {
      state.currentAttendance = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch attendance records
    builder
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch eligible students
    builder
      .addCase(fetchEligibleStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEligibleStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.eligibleStudents = action.payload;
      })
      .addCase(fetchEligibleStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create attendance
    builder
      .addCase(createAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords.push(action.payload.attendance);
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update attendance
    builder
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendanceRecords.findIndex((record) => record._id === action.payload.attendance._id);
        if (index !== -1) {
          state.attendanceRecords[index] = action.payload.attendance;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete attendance
    builder
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = state.attendanceRecords.filter((record) => record._id !== action.payload.id);
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentAttendance } = attendanceSlice.actions;

export default attendanceSlice.reducer;
