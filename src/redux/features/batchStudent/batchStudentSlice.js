import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

export const fetchBatchStudents = createAsyncThunk(
  "batchStudent/fetchBatchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/batch-students");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch batch students");
    }
  }
);

export const createBatchStudent = createAsyncThunk(
  "batchStudent/createBatchStudent",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/batch-student", formData);
      return data.batchStudent;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add batch student");
    }
  }
);

const batchStudentSlice = createSlice({
  name: "batchStudent",
  initialState: {
    batchStudents: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.batchStudents = action.payload;
      })
      .addCase(fetchBatchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBatchStudent.fulfilled, (state, action) => {
        state.batchStudents.push(action.payload);
      });
  },
});

export default batchStudentSlice.reducer;
