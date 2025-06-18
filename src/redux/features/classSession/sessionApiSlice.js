import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API Slice
export const sessionApi = createApi({
    reducerPath: 'sessionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://mybuddy-backend.onrender.com/api',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Session'],
    endpoints: (builder) => ({
        getSessions: builder.query({
            query: () => '/sessions',
            providesTags: ['Session'],
        }),
        getSessionById: builder.query({
            query: (id) => `/sessions/${id}`,
            providesTags: (result, error, id) => [{ type: 'Session', id }],
        }),
        createSession: builder.mutation({
            query: (newSession) => ({
                url: '/sessions',
                method: 'POST',
                body: newSession,
            }),
            invalidatesTags: ['Session'],
        }),
        updateSession: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/sessions/${id}`,
                method: 'PUT',
                body: updatedData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Session', id }],
        }),
        deleteSession: builder.mutation({
            query: (id) => ({
                url: `/sessions/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Session'],
        }),

        // Additional Endpoints: Batch Classes, Teachers, Subjects
        getBatchClasses: builder.query({
            query: () => '/batch-classes',
        }),
        getTeachers: builder.query({
            query: () => '/teachers',
        }),
        getSubjects: builder.query({
            query: () => '/subjects',
        }),
    }),
});

// Export hooks for components
export const {
    useGetSessionsQuery,
    useGetSessionByIdQuery,
    useCreateSessionMutation,
    useUpdateSessionMutation,
    useDeleteSessionMutation,
    useGetBatchClassesQuery,
    useGetTeachersQuery,
    useGetSubjectsQuery,
} = sessionApi;

export default sessionApi;
