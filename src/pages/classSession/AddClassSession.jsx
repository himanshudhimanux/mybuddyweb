import React, { useEffect, useState } from "react";
import { fetchSubjects } from "../../redux/features/subject/subjectSlice";
import { useDispatch, useSelector } from "react-redux";

const AddClassSession = () => {

  const dispatch = useDispatch()

  // Fetch subjects from Redux store
  const { subjects, loading: subjectsLoading, error: subjectsError } = useSelector((state) => state.subjects);

  const [sessionType, setSessionType] = useState("Single");
  const [formData, setFormData] = useState({
    batchClassId: "",
    batchDate: "",
    status: "Active",
    classType: "Regular",
    sessionMode: "Online",
    subjectId: "",
    teacherId: "",
    absentNotification: false,
    presentNotification: false,
    scheduleDetails: {
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      weeklyDays: [],
      repeatEvery: 1,
      onDay: "",
      onThe: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      scheduleDetails: {
        ...prev.scheduleDetails,
        [name]: value,
      },
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleWeeklyDaysChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      scheduleDetails: {
        ...prev.scheduleDetails,
        weeklyDays: checked
          ? [...prev.scheduleDetails.weeklyDays, value]
          : prev.scheduleDetails.weeklyDays.filter((day) => day !== value),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    // You can send formData to the backend here
  };


  useEffect(() => {
    if (!subjects || subjects.length === 0) {
      dispatch(fetchSubjects()); // Dispatch the fetchSubjects action if subjects are not available
    }
  }, [dispatch, subjects]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create Session</h2>
      <form onSubmit={handleSubmit}>


        {/* Batch Class ID */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Batch Class ID</label>
          <input
            type="text"
            name="batchClassId"
            className="w-full border rounded-lg px-3 py-2"
            value={formData.batchClassId}
            onChange={handleInputChange}
          />
        </div>

        {/* Batch Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Batch Date</label>
          <input
            type="date"
            name="batchDate"
            className="w-full border rounded-lg px-3 py-2"
            value={formData.batchDate}
            onChange={handleInputChange}
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Status</label>
          <select
            name="status"
            className="w-full border rounded-lg px-3 py-2"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Active">Active</option>
            <option value="Holidays - Calendar">Holidays - Calendar</option>
            <option value="Holidays - Batch">Holidays - Batch</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Class Type */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Class Type</label>
          <select
            name="classType"
            className="w-full border rounded-lg px-3 py-2"
            value={formData.classType}
            onChange={handleInputChange}
          >
            <option value="Regular">Regular</option>
            <option value="Exam">Exam</option>
            <option value="Revision">Revision</option>
            <option value="Guest Lecture">Guest Lecture</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Session Mode */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Session Mode</label>
          <select
            name="sessionMode"
            className="w-full border rounded-lg px-3 py-2"
            value={formData.sessionMode}
            onChange={handleInputChange}
          >
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Subject</label>
          <input
            type="text"
            name="subjectId"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter Subject ID"
            value={formData.subjectId}
            onChange={handleInputChange}
          />
        </div>

        {/* Teacher */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Teacher</label>
          <input
            type="text"
            name="teacherId"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter Teacher ID"
            value={formData.teacherId}
            onChange={handleInputChange}
          />
        </div>

        {/* Session Type */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Session Type</label>
          <select
            name="sessionType"
            className="w-full border rounded-lg px-3 py-2"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
          >
            <option value="Single">Single</option>
            <option value="Every Day">Every Day</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {/* Session Details Based on Type */}
        {sessionType === "Single" && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.startDate}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.endDate}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.startTime}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.endTime}
                onChange={handleScheduleChange}
              />
            </div>
          </div>
        )}

        {sessionType === "Every Day" && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.startDate}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.endDate}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.startTime}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.endTime}
                onChange={handleScheduleChange}
              />
            </div>
          </div>
        )}

        {sessionType === "Weekly" && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.startDate}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.endDate}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Repeat Every (Weeks)</label>
              <input
                type="number"
                name="repeatEvery"
                className="w-full border rounded-lg px-3 py-2"
                min="1"
                value={formData.scheduleDetails.repeatEvery}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Days of the Week</label>
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                (day) => (
                  <div key={day} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="weeklyDays"
                      value={day}
                      checked={formData.scheduleDetails.weeklyDays.includes(day)}
                      onChange={handleWeeklyDaysChange}
                    />
                    <label className="ml-2 text-gray-700">{day}</label>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {sessionType === "Monthly" && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.startDate}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.endDate}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Repeat Every (Months)</label>
              <input
                type="number"
                name="repeatEvery"
                className="w-full border rounded-lg px-3 py-2"
                min="1"
                value={formData.scheduleDetails.repeatEvery}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">On Day</label>
              <input
                type="number"
                name="onDay"
                className="w-full border rounded-lg px-3 py-2"
                min="1"
                max="31"
                value={formData.scheduleDetails.onDay}
                onChange={handleScheduleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">On the</label>
              <select
                name="onThe"
                className="w-full border rounded-lg px-3 py-2"
                value={formData.scheduleDetails.onThe}
                onChange={handleScheduleChange}
              >
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Third">Third</option>
                <option value="Fourth">Fourth</option>
                <option value="Last">Last</option>
              </select>
            </div>
          </div>
        )}


        {/* Absent Notification */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="absentNotification"
            checked={formData.absentNotification}
            onChange={handleCheckboxChange}
          />
          <label className="ml-2 text-gray-700">Send Absent Notification</label>
        </div>

        {/* Present Notification */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="presentNotification"
            checked={formData.presentNotification}
            onChange={handleCheckboxChange}
          />
          <label className="ml-2 text-gray-700">Send Present Notification</label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClassSession;