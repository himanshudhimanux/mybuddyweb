import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { addStudent, resetAddStudentState } from '../../redux/features/student/studentSlice';

const AddStudent = () => {

    const dispatch = useDispatch();
    const { addStudentStatus, addStudentError } = useSelector((state) => state.students);

    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        motherName: '',
        studentPhone: '',
        gender: '',
        fatherPhone: '',
        motherPhone: '',
        email: '',
        dob: '',
        address: '',
    });

    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { id, value, files } = e.target;
        setFormData({
            ...formData,
            [id]: files ? files[0] : value,
        });
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.fatherPhone || isNaN(formData.fatherPhone)) newErrors.fatherPhone = 'Valid Father phone number is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.fatherName) newErrors.fatherName = 'Father name is required';
        if (!formData.motherName) newErrors.motherName = 'Mother name is required';
        return newErrors;
    };

// Submit Form
const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    const data = new FormData();

    // Append all fields
    Object.keys(formData).forEach((key) => {
        if (key === "photo" && formData[key]) {
            data.append(key, formData[key]); // File upload
        } else if (key === "dob" && formData[key]) {
            data.append(key, new Date(formData[key]).toISOString()); // Convert DOB to ISO
        } else if (formData[key]) {
            data.append(key, formData[key]);
        }
    });

    // Dispatch Redux action
    dispatch(addStudent(data));
};


    

    // Handle success or error
    useEffect(() => {
        if (addStudentStatus === 'succeeded') {
            toast.success('Student added Successfully!');
            setFormData({
                name: '',
                fatherName: '',
                motherName: '',
                dob: '',
                email: '',
                address: '',
                studentPhone: '',
                fatherPhone: '',
                motherPhone: '',
                gender: '',
                photo: '',
            });
            dispatch(resetAddStudentState());
        }

        if (addStudentStatus === 'failed') {
            toast.error('Failed to add Student');
            dispatch(resetAddStudentState());
        }
    }, [addStudentStatus, addStudentError, dispatch]);

    return (

        <>

            {addStudentError && <p className="text-red-500">{addStudentError.message}</p>}

            <div
                className="flex flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white"
            >
                <div className="self-stretch my-auto text-base font-medium text-neutral-600">
                    <h1 className="text-2xl">Add Student</h1>
                </div>
                <div
                    className="flex gap-4 items-end  my-auto text-sm font-semibold "
                >
                    <Link to="/students/add"
                        className="dark-btn"
                    >
                        Student List
                    </Link>
                </div>
            </div>

            <hr />

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col items-start px-20 py-custom bg-white max-w-full max-md:px-5 max-md:pt-24">

                <div className="mt-8 w-full max-w-full max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col">
                        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col grow text-sm font-medium text-zinc-500 max-md:mt-10">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" className="addinput" required placeholder="Name"
                                  name='name'
                                  value={formData.name}
                                  onChange={handleChange}
                                />
                                {errors.name && <p className="text-red-500">{errors.name}</p>}

                                <label htmlFor="email" className="mt-8">Email Address</label>
                                <input type="email" id="email" className="addinput" required placeholder="Email Address"
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500">{errors.email}</p>}

                                <label htmlFor="fatherPhone" className="mt-8">Father Phone</label>
                                <input type="tel" id="fatherPhone" className="addinput" required placeholder="Father Phone" 
                                    name='fatherPhone'
                                    value={formData.fatherPhone}
                                    onChange={handleChange}
                                />
                                {errors.fatherPhone && <p className="text-red-500">{errors.fatherPhone}</p>}

                                <label htmlFor="address" className="mt-8">Address</label>
                                <input type="text" id="address" className="addinput" required placeholder="Address" 
                                    name='address'
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                                {errors.address && <p className="text-red-500">{errors.address}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col text-sm font-medium text-zinc-500 max-md:mt-10">
                                <label htmlFor="fatherName">Father Name</label>
                                <input type="text" id="fatherName" className="addinput" required placeholder="Father Name"
                                    name='fatherName'
                                    value={formData.fatherName}
                                    onChange={handleChange}
                                />
                                {errors.fatherName && <p className="text-red-500">{errors.fatherName}</p>}

                                <label htmlFor="dob" className="mt-8">Date of Birth</label>
                                <input type="date" id="dob" className="addinput"  
                                    name='dob'
                                    value={formData.dob}
                                    onChange={handleChange}
                                />
                                {errors.dob && <p className="text-red-500">{errors.dob}</p>}

                                <label htmlFor="motherPhone" className="mt-8">Mother Phone</label>
                                <input type="tel" id="motherPhone" className="addinput" required placeholder="Mother Phone (Optional)"
                                    name='motherPhone'
                                    value={formData.motherPhone}
                                    onChange={handleChange}
                                />
                                {errors.motherName && <p className="text-red-500">{errors.motherName}</p>}

                                <label htmlFor="photo" className="mt-8">Student Photo</label>
                                <input type="file" id="photo" className="addinput" onChange={handleChange}/>
                            </div>
                        </div>

                        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col text-sm font-medium text-zinc-500 max-md:mt-10">
                                <label htmlFor="motherName">Mother Name</label>
                                <input type="text" id="motherName" className="addinput" placeholder="Mother Name (Optional)"
                                    name='motherName'
                                    value={formData.motherName}
                                    onChange={handleChange}
                                />

                                <label htmlFor="gender" className="mt-8">Gender</label>
                                <select id="gender" className="addinput" required 
                                    name='gender'
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errors.gender && <p className="text-red-500">{errors.gender}</p>}

                                <label htmlFor="studentPhone" className="mt-8">Student Phone</label>
                                <input type="tel" id="studentPhone" className="addinput" placeholder="Student Phone (Optional)" 
                                    name='studentPhone'
                                    value={formData.studentPhone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-5 justify-center mt-14 max-w-full text-neutral-600 w-[100%] max-md:mt-10">
                    <button type="submit" className="dark-btn">
                        Add Student
                    </button>
                </div>
            </form>


        </>


    );
};

export default AddStudent;
