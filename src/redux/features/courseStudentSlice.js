import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

export const fetchCourseStudents = createAsyncThunk(
  "courseStudent/fetchCourseStudents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/batch-students");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch batch students");
    }
  }
);

export const createCourseStudent = createAsyncThunk(
  "courseStudent/createCourseStudent",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/batch-student", formData);
      return data.batchStudent;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add batch student");
    }
  }
);

const courseStudentSlice = createSlice({
  name: "courseStudent",
  initialState: {
    courseStudents: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.batchStudents = action.payload;
      })
      .addCase(fetchCourseStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCourseStudent.fulfilled, (state, action) => {
        state.batchStudents.push(action.payload);
      });
  },
});

export default courseStudentSlice.reducer;
