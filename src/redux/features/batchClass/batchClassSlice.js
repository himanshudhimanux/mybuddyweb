import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";
import toast from "react-hot-toast";

// Fetch all batch classes
export const fetchBatchClasses = createAsyncThunk(
  "batchClass/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/batch-classess");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Create a batch class
export const createBatchClass = createAsyncThunk(
  "batchClass/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/batch-class", formData);
      toast.success("Batch Class created successfully");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create batch class");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Update a batch class
export const updateBatchClass = createAsyncThunk(
  "batchClass/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/batch-class/${id}`, formData);
      toast.success("Batch Class updated successfully");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update batch class");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete a batch class
export const deleteBatchClass = createAsyncThunk(
  "batchClass/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/batch-class/${id}`);
      toast.success("Batch Class deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete batch class");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const batchClassSlice = createSlice({
  name: "batchClass",
  initialState: {
    batchClasses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Batch Classes
      .addCase(fetchBatchClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBatchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.batchClasses = action.payload;
      })
      .addCase(fetchBatchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Batch Class
      .addCase(createBatchClass.fulfilled, (state, action) => {
        state.batchClasses.push(action.payload);
      })

      // Update Batch Class
      .addCase(updateBatchClass.fulfilled, (state, action) => {
        const index = state.batchClasses.findIndex((bc) => bc._id === action.payload._id);
        if (index !== -1) state.batchClasses[index] = action.payload;
      })

      // Delete Batch Class
      .addCase(deleteBatchClass.fulfilled, (state, action) => {
        state.batchClasses = state.batchClasses.filter((bc) => bc._id !== action.payload);
      });
  },
});

export default batchClassSlice.reducer;
