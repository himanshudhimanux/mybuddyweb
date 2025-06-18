import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

// Fetch all courses
export const fetchCourses = createAsyncThunk('courses/fetchCourses', async (_, thunkAPI) => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Create a new course
export const createCourse = createAsyncThunk('courses/createCourse', async (courseData, thunkAPI) => {
  try {

    console.log("courseData", courseData)
    const response = await api.post('/create_course', courseData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Update a course
export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ id, updatedData }, thunkAPI) => {
  try {
    const response = await api.put(`/update_course/${id}`, updatedData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Delete a course
export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id, thunkAPI) => {
  try {
    const response = await api.delete(`/delete_course/${id}`);
    return { id, ...response.data }; // Return the deleted course ID for removal in state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Slice
const courseSlice = createSlice({
  name: 'courses',
  initialState: { courses: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload.course); // Add the new course
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const updatedCourse = action.payload.course;
        const index = state.courses.findIndex((course) => course._id === updatedCourse._id);
        if (index !== -1) {
          state.courses[index] = updatedCourse; // Update the specific course
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((course) => course._id !== action.payload.id);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
