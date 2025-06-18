import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

// Thunk to fetch teachers
export const fetchTeachers = createAsyncThunk(
    'teachers/fetchTeachers',
    async ({ page, limit, search }) => {
        const response = await api.get('/teachers', {
            params: { page, limit, search },
        });
        return response.data;
    }
);

// Thunk to add a new teacher
export const addTeacher = createAsyncThunk(
    'teachers/addTeacher',
    async (teacherData, { rejectWithValue }) => {
        try {
            const response = await api.post('/teacher', teacherData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const teacherSlice = createSlice({
    name: 'teachers',
    initialState: {
        data: [],
        totalPages: 0,
        currentPage: 1,
        status: 'idle',
        addTeacherStatus: 'idle', // Status for adding a teacher
        addTeacherError: null,   // Error for adding a teacher
    },
    reducers: {
        resetAddTeacherState: (state) => {
            state.addTeacherStatus = 'idle';
            state.addTeacherError = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch teachers
        builder
            .addCase(fetchTeachers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTeachers.fulfilled, (state, action) => {
                state.data = action.payload.teachers;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.status = 'succeeded';
            })
            .addCase(fetchTeachers.rejected, (state) => {
                state.status = 'failed';
            });

        // Add teacher
        builder
            .addCase(addTeacher.pending, (state) => {
                state.addTeacherStatus = 'loading';
                state.addTeacherError = null;
            })
            .addCase(addTeacher.fulfilled, (state, action) => {
                state.addTeacherStatus = 'succeeded';
                state.data.unshift(action.payload); // Add the new teacher to the list
            })
            .addCase(addTeacher.rejected, (state, action) => {
                state.addTeacherStatus = 'failed';
                state.addTeacherError = action.payload;
            });
    },
});

export const { resetAddTeacherState } = teacherSlice.actions;
export default teacherSlice.reducer;
