import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchSessions,
  fetchLocations,
  setSessionYear,
  setLocationId,
  // setCourseId,
  setBatchName,
  createBatch,
  clearStatus
} from '../../redux/features/batch/batchSlice';
import toast from 'react-hot-toast';

const AddBatch = () => {
  const dispatch = useDispatch();
  const {
    sessions,
    locations,
    // courses,
    sessionYear,
    locationId,
    // courseId, // remains for UI even if unused in backend
    batchName,
    loading,
    status
  } = useSelector(state => state.batches);

  useEffect(() => {
    dispatch(fetchSessions());
    dispatch(fetchLocations());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && status === 'success') {
      toast.success('Batch created successfully!');
      dispatch(clearStatus());

      // Reset form fields
      dispatch(setBatchName(''));
      dispatch(setSessionYear(''));
      dispatch(setLocationId(''));
      // dispatch(setCourseId('')); // if course is used
    }
  }, [status, loading, dispatch]);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (batchName && sessionYear && locationId) {
      const batchData = {
        name: batchName,
        sessionYearId: sessionYear,
        locationId: [locationId], // backend expects array
      };
      dispatch(createBatch(batchData));
    } else {
      toast.error('Please fill out all required fields!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Batch</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="batchName" className="block text-gray-700 font-medium mb-2">Batch Name</label>
          <input
            id="batchName"
            type="text"
            value={batchName}
            onChange={(e) => dispatch(setBatchName(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Batch Name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="sessionYear" className="block text-gray-700 font-medium mb-2">Session Year</label>
          <select
            id="sessionYear"
            value={sessionYear}
            onChange={(e) => dispatch(setSessionYear(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select Session --</option>
            {sessions.map(session => (
              <option key={session._id} value={session._id}>{session.sessionTitle}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="locationId" className="block text-gray-700 font-medium mb-2">Location</label>
          <select
            id="locationId"
            value={locationId}
            onChange={(e) => dispatch(setLocationId(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select Location --</option>
            {locations.map(location => (
              <option key={location._id} value={location._id}>{location.name}</option>
            ))}
          </select>
        </div>

        {/* Optional course field shown in UI only */}
        {/* <div className="mb-4">
          <label htmlFor="courseId" className="block text-gray-700 font-medium mb-2">Course (Optional)</label>
          <select
            id="courseId"
            value={courseId}
            onChange={(e) => dispatch(setCourseId(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Course --</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.name}</option>
            ))}
          </select>
        </div> */}

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Batch'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBatch;
