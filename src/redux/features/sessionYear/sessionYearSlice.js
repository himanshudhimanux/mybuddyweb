import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/api";

// Async Thunks
export const fetchSessionYears = createAsyncThunk("sessionYears/fetchSessionYears", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/session-years");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createSessionYear = createAsyncThunk("sessionYears/createSessionYear", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post("/create-session-year", data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateSessionYear = createAsyncThunk("sessionYears/updateSessionYear", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/update-session-year/${id}`, updates);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteSessionYear = createAsyncThunk("sessionYears/deleteSessionYear", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/delete-session-year/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const sessionYearSlice = createSlice({
  name: "sessionYears",
  initialState: {
    sessionYears: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionYears.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionYears.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionYears = action.payload;
      })
      .addCase(fetchSessionYears.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSessionYear.fulfilled, (state, action) => {
        state.sessionYears.push(action.payload.sessionYear);
      })
      .addCase(updateSessionYear.fulfilled, (state, action) => {
        const index = state.sessionYears.findIndex((year) => year._id === action.payload.sessionYear._id);
        if (index !== -1) {
          state.sessionYears[index] = action.payload.sessionYear;
        }
      })
      .addCase(deleteSessionYear.fulfilled, (state, action) => {
        state.sessionYears = state.sessionYears.filter(
          (year) => year._id !== action.payload.sessionYear._id
        );
      });
  },
});

export default sessionYearSlice.reducer;
