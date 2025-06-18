import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { addTeacher, resetAddTeacherState } from '../../redux/features/teacher/teacherSlice';
import { fetchSubjects } from '../../redux/features/subject/subjectSlice';
import toast from 'react-hot-toast';

const AddTeacher = () => {
  const dispatch = useDispatch();
  const { addTeacherStatus, addTeacherError } = useSelector((state) => state.teachers);
  const { subjects, loading: subjectLoading } = useSelector((state) => state.subjects);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    subject: '',
    phone: '',
    gender: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData({
      ...formData,
      [id]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.phone || isNaN(formData.phone)) newErrors.phone = 'Valid phone number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    dispatch(addTeacher(data));
  };


  useEffect(() => {
    if (addTeacherStatus === 'succeeded') {
      toast.success('Teacher added Successfully!');
      setFormData({
        name: '',
        address: '',
        subject: '',
        phone: '',
        gender: '',
        photo: '',
      });
      dispatch(resetAddTeacherState());
    }

    if (addTeacherStatus === 'failed') {
      toast.error(addTeacherError?.message || 'Failed to add teacher');
      dispatch(resetAddTeacherState());
    }
  }, [addTeacherStatus, addTeacherError, dispatch]);




  return (
    <>
      {addTeacherError && <p className="text-red-500">{addTeacherError.message}</p>}

      <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <h1 className="text-2xl text-neutral-600">Add Teacher</h1>
        <Link to="/teachers/list" className="dark-btn">Teacher List</Link>
      </div>

      <hr />

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col px-20 py-custom bg-white max-md:px-5 max-md:pt-24">
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-6/12 max-md:w-full">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" className="addinput" placeholder="Name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <label htmlFor="address" className="mt-8">Address</label>
            <input type="text" id="address" className="addinput" placeholder="Address" value={formData.address} onChange={handleChange} />
            {errors.address && <p className="text-red-500">{errors.address}</p>}
          </div>

          <div className="w-6/12 max-md:w-full">
            <label htmlFor="subject">Subject</label>
            <select id="subject" className="addinput" value={formData.subject} onChange={handleChange}>
              <option value="">Select Subject</option>
              {subjectLoading ? (
                <option>Loading...</option>
              ) : (
                subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>

                ))
              )}
            </select>
            {errors.subject && <p className="text-red-500">{errors.subject}</p>}

            <label htmlFor="phone" className="mt-8">Phone</label>
            <input type="tel" id="phone" className="addinput" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>

          <div className="w-6/12 max-md:w-full">
            <label htmlFor="gender">Gender</label>
            <select id="gender" className="addinput" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && <p className="text-red-500">{errors.gender}</p>}

            <label htmlFor="photo" className="mt-8">Photo</label>
            <input type="file" id="photo" className="addinput" onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-center mt-14 w-full">
          <button type="submit" className="dark-btn" disabled={addTeacherStatus === 'loading'}>
            {addTeacherStatus === 'loading' ? 'Adding...' : 'Add Teacher'}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddTeacher;
