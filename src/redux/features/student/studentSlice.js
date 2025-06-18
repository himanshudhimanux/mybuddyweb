import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

// Async thunk for fetching students
export const fetchStudents = createAsyncThunk(
    "students/fetchStudents",
    async ({ page, limit, search, filter }) => {
        const response = await api.get("/students", {
            params: { page, limit, search, filter },
        });
        return response.data;
    }
);

// Async thunk for adding a student
export const addStudent = createAsyncThunk(
    "students/addStudent",
    async (studentData, { rejectWithValue }) => {
        try {
            const response = await api.post("/student", studentData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.student; // Return the newly added student
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to add student");
        }
    }
);

// Async thunk for updating a student
export const updateStudent = createAsyncThunk(
    "students/updateStudent",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/update/student/${id}`, updatedData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.student; // Return the updated student
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to update student");
        }
    }
);

// Async thunk for deleting a student
export const deleteStudent = createAsyncThunk(
    "students/deleteStudent",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/delete/student/${id}`);
            return id; // Return the ID of the deleted student
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to delete student");
        }
    }
);

const studentSlice = createSlice({
    name: "students",
    initialState: {
        data: [],
        totalPages: 0,
        currentPage: 1,
        status: "idle",
        error: null,
        addStudentStatus: "idle",
        addStudentError: null,
        updateStudentStatus: "idle",
        updateStudentError: null,
        deleteStudentStatus: "idle",
        deleteStudentError: null,
    },
    reducers: {
        resetAddStudentState: (state) => {
            state.addStudentStatus = "idle";
            state.addStudentError = null;
        },
        resetUpdateStudentState: (state) => {
            state.updateStudentStatus = "idle";
            state.updateStudentError = null;
        },
        resetDeleteStudentState: (state) => {
            state.deleteStudentStatus = "idle";
            state.deleteStudentError = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch students
        builder
            .addCase(fetchStudents.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload.students;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });

        // Add student
        builder
            .addCase(addStudent.pending, (state) => {
                state.addStudentStatus = "loading";
                state.addStudentError = null;
            })
            .addCase(addStudent.fulfilled, (state, action) => {
                state.addStudentStatus = "succeeded";
                state.data.push(action.payload); // Add the new student to the list
            })
            .addCase(addStudent.rejected, (state, action) => {
                state.addStudentStatus = "failed";
                state.addStudentError = action.payload;
            });

        // Update student
        builder
            .addCase(updateStudent.pending, (state) => {
                state.updateStudentStatus = "loading";
                state.updateStudentError = null;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.updateStudentStatus = "succeeded";
                const index = state.data.findIndex((student) => student._id === action.payload._id);
                if (index !== -1) {
                    state.data[index] = action.payload; // Update the student in the list
                }
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.updateStudentStatus = "failed";
                state.updateStudentError = action.payload;
            });

        // Delete student
        builder
            .addCase(deleteStudent.pending, (state) => {
                state.deleteStudentStatus = "loading";
                state.deleteStudentError = null;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.deleteStudentStatus = "succeeded";
                state.data = state.data.filter((student) => student._id !== action.payload); // Remove the student from the list
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.deleteStudentStatus = "failed";
                state.deleteStudentError = action.payload;
            });
    },
});

export const {
    resetAddStudentState,
    resetUpdateStudentState,
    resetDeleteStudentState,
} = studentSlice.actions;

export default studentSlice.reducer;
