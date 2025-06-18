import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer from "../redux/features/auth/authSlice";
import studentSlice from "../redux/features/student/studentSlice";
import teacherReducer from '../redux/features/teacher/teacherSlice'
import instituteReducer from '../redux/features/institute/instituteSlice';
import subjectReducer from '../redux/features/subject/subjectSlice'
import courseReducer from '../redux/features/course/courseSlice';
import locationReducer from '../redux/features/location/locationSlice';
import batchReducer from '../redux/features/batch/batchSlice'
import sessionYearReducer from '../redux/features/sessionYear/sessionYearSlice'
import batchStudentReducer from '../redux/features/batchStudent/batchStudentSlice'
import classSessionReducer from '../redux/features/classSession/classSessionSlice';
import attendanceReducer from '../redux/features/attendance/attendanceSlice'
import sessionApi from "./features/classSession/sessionApiSlice";
import batchClassReducer from "./features/batchClass/batchClassSlice";
import courseBatchMapReducer from "./features/courseBatchMapSlice";

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  students: studentSlice,
  teachers: teacherReducer,
  institutes: instituteReducer,
  subjects: subjectReducer,
  sessionYears: sessionYearReducer,
  courses: courseReducer,
  locations: locationReducer,
  batches: batchReducer,
  batchStudent:batchStudentReducer,
  classSession: classSessionReducer,
  attendance: attendanceReducer,
  batchClasses: batchClassReducer,
  courseBatchMap: courseBatchMapReducer,
  [sessionApi.reducerPath]: sessionApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore redux-persist actions
      },
    }).concat(sessionApi.middleware),
});

export const persistor = persistStore(store);
export default store;