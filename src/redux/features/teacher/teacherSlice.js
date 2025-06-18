import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

// Fetch all teachers (no pagination/search)
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/teachers');
      return response.data.data; // Assuming res.json({ success: true, data: [...] })
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single teacher by ID
export const fetchTeacherById = createAsyncThunk(
  'teachers/fetchTeacherById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/teacher/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add a new teacher
export const addTeacher = createAsyncThunk(
  'teachers/addTeacher',
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await api.post('/teacher', teacherData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a teacher
export const updateTeacher = createAsyncThunk(
  'teachers/updateTeacher',
  async ({ id, teacherData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/teacher/${id}`, teacherData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a teacher
export const deleteTeacher = createAsyncThunk(
  'teachers/deleteTeacher',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/delete/teacher/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const teacherSlice = createSlice({
  name: 'teachers',
  initialState: {
    data: [],
    currentTeacher: null,
    status: 'idle',
    error: null,
    addTeacherStatus: 'idle',
    addTeacherError: null,
    updateStatus: 'idle',
    deleteStatus: 'idle',
  },
  reducers: {
    resetAddTeacherState: (state) => {
      state.addTeacherStatus = 'idle';
      state.addTeacherError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = 'idle';
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTeachers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch one
      .addCase(fetchTeacherById.pending, (state) => {
        state.status = 'loading';
        state.currentTeacher = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTeacher = action.payload;
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Add
      .addCase(addTeacher.pending, (state) => {
        state.addTeacherStatus = 'loading';
        state.addTeacherError = null;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.addTeacherStatus = 'succeeded';
        state.data.unshift(action.payload);
      })
      .addCase(addTeacher.rejected, (state, action) => {
        state.addTeacherStatus = 'failed';
        state.addTeacherError = action.payload;
      })

      // Update
      .addCase(updateTeacher.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.data.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updateTeacher.rejected, (state) => {
        state.updateStatus = 'failed';
      })

      // Delete
      .addCase(deleteTeacher.pending, (state) => {
        state.deleteStatus = 'loading';
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.data = state.data.filter(t => t._id !== action.payload);
      })
      .addCase(deleteTeacher.rejected, (state) => {
        state.deleteStatus = 'failed';
      });
  },
});

export const {
  resetAddTeacherState,
  resetUpdateStatus,
  resetDeleteStatus,
} = teacherSlice.actions;

export default teacherSlice.reducer;
