import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers } from '../../redux/features/teacher/teacherSlice';  
import { createSubject } from '../../redux/features/subject/subjectSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AddSubject = () => {
  const dispatch = useDispatch();
  const { data: teachers, status, error } = useSelector((state) => state.teachers);  // Accessing 'data' instead of 'list'

  const [formData, setFormData] = useState({ name: '', subjecttype: '', subjectFee: '', FacultyId: [] });

  // Fetch teachers on component mount
  useEffect(() => {
    if (teachers.length === 0) {
      dispatch(fetchTeachers({ page: 1, limit: 10, search: '' })); 
    }
  }, [dispatch, teachers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFacultyChange = (e) => {
    const selectedFaculty = e.target.value;
    setFormData({ ...formData, FacultyId: [selectedFaculty] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createSubject(formData)).unwrap();
      toast.success('Subject added successfully!');
      setFormData({ name: '', subjecttype: '', FacultyId: [] });
    } catch (error) {
      toast.error(error || 'Failed to add subject. Please try again.');
    }
  };

  if (status === 'loading') {
    return <div>Loading teachers...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h1 className="text-2xl">Add New Subject</h1>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold ">
          <Link to="/subjects/list" className="dark-btn">
            Subjects List
          </Link>
        </div>
      </div>
      <hr />
      <form className="container mx-auto flex flex-col items-center px-20 py-custom bg-white max-w-full max-md:px-5 max-md:pt-24" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <label className="block text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4 flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <label className="block text-sm font-bold mb-2" htmlFor="subjecttype">Subject Type</label>
          <input
            id="subjecttype"
            name="subjecttype"
            type="text"
            value={formData.subjecttype}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="mb-4 flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <label className="block text-sm font-bold mb-2" htmlFor="subjectFee">Subject Fee</label>
          <input
            id="subjectFee"
            name="subjectFee"
            type="text"
            value={formData.subjectFee}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Faculty Selection Dropdown */}
        <div className="mb-4 flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <label className="block text-sm font-bold mb-2" htmlFor="faculty">Assign Faculty</label>
          <select
            id="faculty"
            name="FacultyId"
            value={formData.FacultyId[0] || ''}
            onChange={handleFacultyChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Faculty</option>
            {teachers && teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Subject
        </button>
      </form>
    </>
  );
};

export default AddSubject;
