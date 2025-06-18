import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select'; // For searchable dropdowns
import axios from 'axios';
import { createAttendance } from '../../redux/features/attendance/attendanceSlice';
import { Link } from 'react-router-dom';

const AddAttendace = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    sessionId: '',
    studentId: '',
    attendanceType: '',
    notificationSent: [],
    source: '',
    attendanceDate: '', // Added date field
    attendanceTime: '', // Added time field
  });
  const [sessions, setSessions] = useState([]);
  const [eligibleStudents, setEligibleStudents] = useState([]);

  // Fetch active sessions when the component is mounted
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('/api/sessions/active'); // Replace with your API endpoint
        setSessions(
          response.data.sessions.map((session) => ({
            value: session._id,
            label: session.name,
          }))
        );
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    fetchSessions();
  }, []);

  // Fetch eligible students based on the selected session
  const fetchEligibleStudents = async (sessionId) => {
    try {
      const response = await axios.get(`/api/sessions/${sessionId}/eligible-students`); // Replace with your API endpoint
      setEligibleStudents(
        response.data.students.map((student) => ({
          value: student._id,
          label: student.name,
        }))
      );
    } catch (error) {
      console.error('Error fetching eligible students:', error);
    }
  };

  const handleSessionChange = (selectedOption) => {
    setFormData({ ...formData, sessionId: selectedOption.value });
    fetchEligibleStudents(selectedOption.value);
  };

  const handleStudentChange = (selectedOption) => {
    setFormData({ ...formData, studentId: selectedOption.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAttendance(formData));
  };

  return (
    <>
      <div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-2xl font-bold mb-4">Mark Attendance</h2>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold">
          <Link to="/attendance/list" className="dark-btn">
            Attendances List
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* Searchable Select for Session */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Session</label>
          <Select
            options={sessions}
            onChange={handleSessionChange}
            placeholder="Search and select a session"
            className="w-full"
          />
        </div>

        {/* Searchable Select for Student */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Student</label>
          <Select
            options={eligibleStudents}
            onChange={handleStudentChange}
            placeholder="Search and select a student"
            className="w-full"
          />
        </div>

        {/* Attendance Date */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Date</label>
          <input
            type="date"
            value={formData.attendanceDate}
            onChange={(e) => setFormData({ ...formData, attendanceDate: e.target.value })}
            className="border p-2 w-full"
          />
        </div>

        {/* Attendance Time */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Time</label>
          <input
            type="time"
            value={formData.attendanceTime}
            onChange={(e) => setFormData({ ...formData, attendanceTime: e.target.value })}
            className="border p-2 w-full"
          />
        </div>

        {/* Attendance Type */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Type</label>
          <select
            value={formData.attendanceType}
            onChange={(e) => setFormData({ ...formData, attendanceType: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="">Select Type</option>
            <option value="In">In</option>
            <option value="Out">Out</option>
          </select>
        </div>

        {/* Notification Sent */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Notifications</label>
          <select
            multiple
            value={formData.notificationSent}
            onChange={(e) =>
              setFormData({
                ...formData,
                notificationSent: Array.from(e.target.selectedOptions, (opt) => opt.value),
              })
            }
            className="border p-2 w-full"
          >
            <option value="Push Notification">Push Notification</option>
            <option value="SMS">SMS</option>
            <option value="Mail">Mail</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Call">Call</option>
          </select>
        </div>

        {/* Source */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Source</label>
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="">Select Source</option>
            <option value="Face">Face</option>
            <option value="Manual">Manual</option>
            <option value="RF Id Card">RF Id Card</option>
          </select>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </>
  );
};

export default AddAttendace;
