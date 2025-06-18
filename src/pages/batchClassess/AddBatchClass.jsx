import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBatchClass } from "../../redux/features/batchClass/batchClassSlice";
import { fetchBatches } from "../../redux/features/batch/batchSlice";  // Batch List API
import { fetchTeachers } from "../../redux/features/teacher/teacherSlice"; // Faculty List API
import toast from "react-hot-toast";
import Select from "react-select"

const AddBatchClass = () => {
    
    const dispatch = useDispatch();
    const { batches } = useSelector((state) => state.batches);
    const { data: teachers, status, error } = useSelector((state) => state.teachers);

    console.log("teachers", teachers)

    const [formData, setFormData] = useState({
        batchId: "",
        facultyIds: [],
        startDate: "",
        expectedEndDate: "",
        startTime: "",
        endTime: "",
        attendanceStartTime: "1 hour before",
        absenteeNotification: false,
        presentNotification: false,
        absentNotificationTime: "batch end time",
        notificationType: [],
        status: "Active",
        comments: "",
    });

    useEffect(() => {
        dispatch(fetchBatches());  // Backend se Batch list laane ke liye
        dispatch(fetchTeachers({ page: 1, limit: 50, search: "" }));
 // Faculty list fetch karne ke liye
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleMultiSelectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData({ ...formData, facultyIds: selectedOptions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.batchId) {
            toast.error("Please select a batch");
            return;
        }
        dispatch(createBatchClass(formData));
    };

    // Convert batches data for react-select
    const batchOptions = batches?.map(batch => ({
        value: batch._id,
        label: batch.name
    })) || [];

    // Convert teachers data for react-select (Single Select)
    const teacherOptions = teachers?.map(teacher => ({
        value: teacher._id,
        label: teacher.name
    })) || [];

    // Handle single batch selection
    const handleBatchChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            batchId: selectedOption ? selectedOption.value : "" // Save only ID
        }));
    };

    // Handle single faculty (teacher) selection
    const handleFacultyChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            facultyIds: selectedOption ? [selectedOption.value] : [] // Save as array but only one value
        }));
    };

    return (
        <div className="container mt-4">
            <h3>Add Batch Class</h3>
            <form onSubmit={handleSubmit} className="p-3 border rounded">


                {/* 🔹 Searchable Batch Dropdown */}
                <div className="mb-3">
                    <label className="form-label">Batch</label>
                    <Select
                        name="batchId"
                        options={batchOptions}
                        value={batchOptions.find(option => option.value === formData.batchId)}
                        onChange={handleBatchChange}
                        placeholder="Select Batch"
                        isSearchable
                    />
                </div>

                {/* 🔹 Single Select Faculty (Teacher) */}
                <div className="mb-3">
                    <label className="form-label">Faculty</label>
                    <Select
                        name="facultyIds"
                        options={teacherOptions}
                        value={teacherOptions.find(option => option.value === formData.facultyIds[0])}
                        onChange={handleFacultyChange}
                        placeholder="Select Faculty"
                        isSearchable
                    />
                </div>

                {/* Start Date & Expected End Date */}
                <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input type="date" name="startDate" className="form-control" value={formData.startDate} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Expected End Date</label>
                    <input type="date" name="expectedEndDate" className="form-control" value={formData.expectedEndDate} onChange={handleChange} />
                </div>

                {/* Start Time & End Time */}
                <div className="mb-3">
                    <label className="form-label">Start Time</label>
                    <input type="time" name="startTime" className="form-control" value={formData.startTime} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">End Time</label>
                    <input type="time" name="endTime" className="form-control" value={formData.endTime} onChange={handleChange} required />
                </div>

                {/* Attendance Start Time */}
                <div className="mb-3">
                    <label className="form-label">Attendance Start Time</label>
                    <select name="attendanceStartTime" className="form-control" value={formData.attendanceStartTime} onChange={handleChange}>
                        <option value="1/2 hour before">1/2 hour before</option>
                        <option value="1 hour before">1 hour before</option>
                        <option value="2 hours before">2 hours before</option>
                        <option value="5 hours before">5 hours before</option>
                        <option value="same day">Same day</option>
                    </select>
                </div>

                {/* Absent Notification */}
                <div className="mb-3">
                    <input type="checkbox" name="absenteeNotification" checked={formData.absenteeNotification} onChange={handleChange} />
                    <label className="form-label ms-2">Enable Absentee Notification</label>
                </div>

                {/* Notification Type (Multi-select) */}
                <div className="mb-3">
                    <label className="form-label">Notification Type</label>
                    <select name="notificationType" className="form-control" value={formData.notificationType} onChange={handleMultiSelectChange}>
                        <option value="Push Notification">Push Notification</option>
                        <option value="SMS">SMS</option>
                        <option value="Mail">Mail</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Call">Call</option>
                    </select>
                </div>

                {/* Status */}
                <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Deleted">Deleted</option>
                    </select>
                </div>

                {/* Comments */}
                <div className="mb-3">
                    <label className="form-label">Comments</label>
                    <textarea name="comments" className="form-control" value={formData.comments} onChange={handleChange}></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Create Batch Class</button>
            </form>
        </div>
    );
};

export default AddBatchClass;
