import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api'; // Import your Axios instance

// Async Thunks
export const fetchSubjects = createAsyncThunk('subjects/fetchSubjects', async (_, thunkAPI) => {
  try {
    const response = await api.get('/subjects');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
  }
});

export const createSubject = createAsyncThunk('subjects/createSubject', async (newSubject, thunkAPI) => {
  try {
    const response = await api.post('/create_subject', newSubject);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
  }
});

export const updateSubject = createAsyncThunk('subjects/updateSubject', async ({ id, updatedData }, thunkAPI) => {
  try {
    const response = await api.put(`/update_subject/${id}`, updatedData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
  }
});

export const deleteSubject = createAsyncThunk('subjects/deleteSubject', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/delete_subject/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
  }
});

// Slice
const subjectSlice = createSlice({
  name: 'subjects',
  initialState: {
    subjects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Subject
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload.subject);
      })
      // Update Subject
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex((subject) => subject._id === action.payload.subject._id);
        if (index !== -1) state.subjects[index] = action.payload.subject;
      })
      // Delete Subject
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter((subject) => subject._id !== action.meta.arg);
      });
  },
});

export default subjectSlice.reducer;
