import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api"; // Adjust your API path

// API Endpoints (Adjust as per your backend routes)
const API_BASE_URL = "/class-sessions";

// Async Thunks

// Fetch all class sessions
export const fetchClassSessions = createAsyncThunk(
  "classSession/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch class sessions");
    }
  }
);

// Fetch a single class session by ID
export const fetchClassSessionById = createAsyncThunk(
  "classSession/fetchById",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${sessionId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch session");
    }
  }
);

// Create a new class session
export const addClassSession = createAsyncThunk(
  "classSession/add",
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE_URL, sessionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create session");
    }
  }
);

// Update an existing class session
export const updateClassSession = createAsyncThunk(
  "classSession/update",
  async ({ sessionId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${sessionId}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update session");
    }
  }
);

// Delete a class session
export const deleteClassSession = createAsyncThunk(
  "classSession/delete",
  async (sessionId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/${sessionId}`);
      return sessionId; // Return the deleted ID to remove from state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete session");
    }
  }
);

// Slice
const classSessionSlice = createSlice({
  name: "classSession",
  initialState: {
    sessions: [],
    selectedSession: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearSelectedSession: (state) => {
      state.selectedSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all sessions
      .addCase(fetchClassSessions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClassSessions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sessions = action.payload;
      })
      .addCase(fetchClassSessions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch single session
      .addCase(fetchClassSessionById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClassSessionById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedSession = action.payload;
      })
      .addCase(fetchClassSessionById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add a session
      .addCase(addClassSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addClassSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sessions.push(action.payload);
      })
      .addCase(addClassSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update session
      .addCase(updateClassSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateClassSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.sessions.findIndex((session) => session.id === action.payload.id);
        if (index !== -1) {
          state.sessions[index] = action.payload;
        }
      })
      .addCase(updateClassSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete session
      .addCase(deleteClassSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteClassSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sessions = state.sessions.filter((session) => session.id !== action.payload);
      })
      .addCase(deleteClassSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export actions & reducer
export const { clearSelectedSession } = classSessionSlice.actions;
export default classSessionSlice.reducer;
