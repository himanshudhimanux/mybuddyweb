import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AddStudent from './pages/student/AddStudent';
import StudentList from './pages/student/StudentList';
import Dashboard from './pages/Dashboard';
import AddTecher from './pages/teacher/AddTecher';
import TeacherList from './pages/teacher/TeacherList';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './routes/Unauthorized';
import InstituteList from './pages/institute/InstituteList';
import AddInstitute from './pages/institute/AddInstitute';
import AddAttendance from './pages/attendance/AddAttendance';
import AttendanceList from './pages/attendance/AttendanceList';
import AddCourse from './pages/courses/AddCourse';
import CoursesList from './pages/courses/CoursesList';
import AddLocation from './pages/locations/AddLocation';
import LocationList from './pages/locations/LocationList';
import AddBatch from './pages/batch/AddBatch';
import BatchList from './pages/batch/BatchList';
import AddClassSession from './pages/classSession/AddClassSession';
import ClassSessionList from './pages/classSession/ClassSessionsList';
import AddSessionYear from './pages/sessionYear/AddSessionYear';
import SessionYearsList from './pages/sessionYear/SessionYearsList'
import AddBatchStudent from './pages/batchStudent/AddBatchStudent'
import BatchStudentsList from './pages/batchStudent/BatchStudentsList';
import AddSubject from './pages/subjects/AddSubject';
import SubjectsList from './pages/subjects/SubjectsList';
import EditSessionList from './pages/classSession/EditClassSession'
import ClassSessionCalendar from './pages/classSession/ClassSessionCalendar';
import EditStudent from './pages/student/EditStudent';
import StudentDetailPage from './pages/student/StudentDetailPage'
import BatchClassList from './pages/batchClassess/BatchClassList';
import AddBatchClass from './pages/batchClassess/AddBatchClass';


function App() {
  const { isAuthenticated } = useSelector((state) => state.auth); // Get authentication state from Redux
  const location = useLocation();

  // Define routes where Header and Sidebar should be hidden
  const noSidebarRoutes = ['/login', '/register'];

  const showHeaderAndSidebar = !noSidebarRoutes.includes(location.pathname); // Check if the current route needs the Header/Sidebar

  return (
    <div className="app">
      {/* Conditionally Render Header and Sidebar */}
      {showHeaderAndSidebar && isAuthenticated && <Header />}
      <div className="layout">
        {showHeaderAndSidebar && isAuthenticated && <Sidebar />}
        <main className="content">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/add"
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <AddStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students/list"
              element={
                <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                  <StudentList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-student/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <EditStudent />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-student/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <StudentDetailPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teachers/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddTecher />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teachers/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <TeacherList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institute/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddInstitute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institutes/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <InstituteList />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/attendance/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddAttendance />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/attendance/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AttendanceList />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/batch-class/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddBatchClass />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/batch-class/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BatchClassList />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/course/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddCourse />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/courses/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <CoursesList />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/subject/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddSubject />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/subjects/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SubjectsList />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/location/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddLocation />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/location/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <LocationList />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/batch/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddBatch />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/batches/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BatchList />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/batch-student/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddBatchStudent />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/batch-students/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BatchStudentsList />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/class-session/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddClassSession />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/class-sessions/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ClassSessionList />
                </ProtectedRoute>
              }
              
            />

            <Route path="/class-session/calendar" element={<ClassSessionCalendar />} />

            <Route
              path="/class-session/update/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <EditSessionList />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/session-year/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AddSessionYear />
                </ProtectedRoute>
              }
              
            />

            <Route
              path="/session-year/list"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SessionYearsList />
                </ProtectedRoute>
              }
              
            />

            {/* Fallback for undefined routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
