import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../../redux/features/course/courseSlice';
import { fetchSubjects } from '../../redux/features/subject/subjectSlice';
import { fetchSessionYears } from '../../redux/features/sessionYear/sessionYearSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AddCourse = () => {
  const dispatch = useDispatch();

  const { subjects, loading: subjectsLoading, error: subjectsError } = useSelector((state) => state.subjects);
  const { sessionYears, loading: sessionsLoading, error: sessionError } = useSelector((state) => state.sessionYears);
  const { loading: courseLoading } = useSelector((state) => state.courses);

  const [formData, setFormData] = useState({
    name: '',
    courseType: 'online',
    courseFee: '',
    sessionYear: '',
    subjectIds: [],
  });

  // Load subjects and session years on mount
  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchSessionYears());
  }, [dispatch]);

  // Checkbox change handler
  const handleCheckboxChange = (id) => {
    setFormData((prev) => {
      const isSelected = prev.subjectIds.includes(id);
      let updatedSubjects;

      if (isSelected) {
        // remove subject
        updatedSubjects = prev.subjectIds.filter((subId) => subId !== id);
      } else {
        // add subject
        updatedSubjects = [...prev.subjectIds, id];
      }

      // Calculate total fee from selected subjects
      const selectedSubjects = subjects.filter((subj) => updatedSubjects.includes(subj._id));
      const totalFee = selectedSubjects.reduce((sum, subj) => sum + Number(subj.subjectFee || 0), 0);

      return {
        ...prev,
        subjectIds: updatedSubjects,
        courseFee: totalFee.toString(), // update courseFee as string to show in input
      };
    });
  };

  // For input change (only for fields other than courseFee)
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent manual editing of courseFee (since auto calculated)
    if (name === 'courseFee') return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.courseFee || !formData.sessionYear || formData.subjectIds.length === 0) {
      toast.error('Please fill all fields and select at least one subject');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        courseType: formData.courseType,
        courseFee: parseFloat(formData.courseFee),
        sessionYear: formData.sessionYear,
        subjectIds: formData.subjectIds,
      };

      await dispatch(createCourse(payload)).unwrap();
      toast.success('Course created successfully!');
      setFormData({ name: '', courseType: 'online', courseFee: '', sessionYear: '', subjectIds: [] });
    } catch (error) {
      toast.error(error?.message || 'Failed to create course');
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <h1 className="text-2xl text-neutral-600">Add New Course</h1>
        <Link to="/courses/list" className="dark-btn text-sm font-semibold">Courses List</Link>
      </div>

      <hr />

      <form onSubmit={handleSubmit} className="container mx-auto flex flex-col items-center px-20 py-8 bg-white max-w-full max-md:px-5">

        {/* Course Name */}
        <div className="mb-4 w-6/12 max-md:w-full">
          <label htmlFor="name" className="block text-sm font-bold mb-2">Course Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Course Fee (readonly) */}
        <div className="mb-4 w-6/12 max-md:w-full">
          <label htmlFor="courseFee" className="block text-sm font-bold mb-2">Course Fee (₹)</label>
          <input
            id="courseFee"
            name="courseFee"
            type="number"
            min="0"
            value={formData.courseFee}
            readOnly
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
            placeholder="Select subjects to calculate fee"
            required
          />
        </div>

        {/* Session Year (Dropdown) */}
        <div className="mb-4 w-6/12 max-md:w-full">
          <label htmlFor="sessionYear" className="block text-sm font-bold mb-2">Session Year</label>
          {sessionsLoading ? (
            <p>Loading session years...</p>
          ) : sessionError ? (
            <p className="text-red-500">Failed to load session years</p>
          ) : (
            <select
              id="sessionYear"
              name="sessionYear"
              value={formData.sessionYear}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Session Year --</option>
              {sessionYears?.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.sessionTitle}
                </option>
              ))}
            </select>

          )}
        </div>

        {/* Course Type */}
        <div className="mb-4 w-6/12 max-md:w-full">
          <label htmlFor="courseType" className="block text-sm font-bold mb-2">Course Type</label>
          <select
            id="courseType"
            name="courseType"
            value={formData.courseType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Subjects (Checkbox with fee display) */}
        <div className="mb-4 w-6/12 max-md:w-full">
          <label className="block text-sm font-bold mb-2">Select Subjects</label>
          {subjectsLoading ? (
            <p>Loading subjects...</p>
          ) : subjectsError ? (
            <p className="text-red-500">Failed to load subjects</p>
          ) : subjects && subjects.length > 0 ? (
            <div className="space-y-1 max-h-64 overflow-auto border p-2 rounded">
              {subjects.map((subject) =>
                subject?._id && subject?.name ? (
                  <div key={subject._id} className="flex items-center justify-between">
                    <div>
                      <input
                        type="checkbox"
                        id={subject._id}
                        checked={formData.subjectIds.includes(subject._id)}
                        onChange={() => handleCheckboxChange(subject._id)}
                        className="mr-2"
                      />
                      <label htmlFor={subject._id}>{subject.name}</label>
                    </div>
                    <span>₹{subject.subjectFee}</span>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <p>No subjects available</p>
          )}
        </div>

        <button
          type="submit"
          disabled={courseLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {courseLoading ? 'Creating...' : 'Add Course'}
        </button>
      </form>
    </>
  );
};

export default AddCourse;
