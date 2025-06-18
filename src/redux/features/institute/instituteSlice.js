import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api'; // Import your shared Axios instance

// Async thunks for CRUD operations

// Add a new institute
export const addInstitute = createAsyncThunk(
    'institutes/addInstitute',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/institute', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure file uploads work
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get all institutes
export const fetchInstitutes = createAsyncThunk(
    'institutes/fetchInstitutes',
    async ({ page, limit, search }, { rejectWithValue }) => {
        try {
            const response = await api.get('/institutes', {
                params: { page, limit, search },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Get a specific institute by ID
export const fetchInstituteById = createAsyncThunk(
    'institutes/fetchInstituteById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/institute/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Update an institute
export const updateInstitute = createAsyncThunk(
    'institutes/updateInstitute',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/institute/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete an institute
export const deleteInstitute = createAsyncThunk(
    'institutes/deleteInstitute',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/institute/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice definition
const instituteSlice = createSlice({
    name: 'institutes',
    initialState: {
        institutes: [],
        institute: null,
        loading: false,
        error: null,
        totalPages: 0,
        currentPage: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add Institute
            .addCase(addInstitute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addInstitute.fulfilled, (state, action) => {
                state.loading = false;
                state.institutes.push(action.payload);
            })
            .addCase(addInstitute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Institutes
            .addCase(fetchInstitutes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInstitutes.fulfilled, (state, action) => {
                state.loading = false;
                state.institutes = action.payload.institutes;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchInstitutes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Institute By ID
            .addCase(fetchInstituteById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInstituteById.fulfilled, (state, action) => {
                state.loading = false;
                state.institute = action.payload;
            })
            .addCase(fetchInstituteById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Institute
            .addCase(updateInstitute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateInstitute.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.institutes.findIndex(
                    (institute) => institute._id === action.payload._id
                );
                if (index !== -1) {
                    state.institutes[index] = action.payload;
                }
            })
            .addCase(updateInstitute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Institute
            .addCase(deleteInstitute.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteInstitute.fulfilled, (state, action) => {
                state.loading = false;
                state.institutes = state.institutes.filter(
                    (institute) => institute._id !== action.payload._id
                );
            })
            .addCase(deleteInstitute.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default instituteSlice.reducer;
