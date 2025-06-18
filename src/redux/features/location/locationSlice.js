// src/redux/slices/locationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api'

// Async thunk for fetching locations
export const fetchLocations = createAsyncThunk(
  'locations/fetchLocations',
  async () => {
    const response = await api.get('/locations');
    return response.data;
  }
);

// Async thunk for adding a location
export const addLocation = createAsyncThunk(
  'locations/addLocation',
  async (newLocation) => {
    const response = await api.post('/location', newLocation);
    return response.data.location;
  }
);

// Async thunk for updating a location
export const updateLocation = createAsyncThunk(
  'locations/updateLocation',
  async ({ id, updatedLocation }) => {
    const response = await api.put(`/location/${id}`, updatedLocation);
    return response.data.location;
  }
);

// Async thunk for deleting a location
export const deleteLocation = createAsyncThunk(
  'locations/deleteLocation',
  async (id) => {
    await api.delete(`/location/${id}`);
    return id;
  }
);

const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    locations: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addLocation.fulfilled, (state, action) => {
        state.locations.push(action.payload);
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        const index = state.locations.findIndex(location => location._id === action.payload._id);
        if (index !== -1) {
          state.locations[index] = action.payload;
        }
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.locations = state.locations.filter(location => location._id !== action.payload);
      });
  }
});

export default locationSlice.reducer;
