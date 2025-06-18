import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select/async";
import toast from "react-hot-toast";
import { createBatchStudent } from "../../redux/features/batchStudent/batchStudentSlice";
import api from "../../utils/api";
import { Link } from "react-router-dom";

const AddBatchStudent = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    batchId: "",
    status: "Attending",
    payableFees: "",
    discountComment: "",
    installmentType: "",
  });
  const [batches, setBatches] = useState([]);

  const dispatch = useDispatch();

  // Fetch Batches
  const fetchBatches = async () => {
    try {
      const response = await api.get("/batches");
      if (Array.isArray(response.data)) {
        setBatches(response.data);
      } else {
        toast.error("Failed to load batches: Unexpected API response.");
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Failed to load batches");
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Fetch students by query for react-select
  const fetchStudentsOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const response = await api.get(`/students?name=${inputValue}`);
      return response.data.students.map((student) => ({
        value: student._id,
        label: `${student.name} (${student.fatherName})`,
      }));
    } catch (error) {
      console.error("Error searching students:", error);
      toast.error("Failed to search students");
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStudentSelect = (selectedOption) => {
    setFormData({ ...formData, studentId: selectedOption.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.numberOfInstallments) {
      toast.error('Number of installments is required.');
      return;
    }

    try {
      await dispatch(createBatchStudent({ ...formData, payableFees: Number(formData.payableFees) })).unwrap();
      toast.success("Batch Student added successfully!");
      setFormData({
        studentId: "",
        batchId: "",
        status: "Attending",
        payableFees: "",
        discountComment: "",
        installmentType: "",
        numberOfInstallments: 1,
      });
    } catch (error) {
      console.error("Error creating batch student:", error);
      toast.error(error.message || "Failed to add Batch Student");
    }
  };



  return (
    <>
      <div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-2xl font-bold mb-4">Add Student Batch</h2>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold">
          <Link to="/batch-students/list" className="dark-btn">
            Batch Students List
          </Link>
        </div>
      </div>

      <div className="max-w-full mx-auto p-4 border rounded-lg shadow-sm bg-white">
        <form onSubmit={handleSubmit} className="space-y-4 p-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Search and Select Student */}
            <div>
              <label className="block text-sm font-medium">Search Student</label>
              <Select
                cacheOptions
                loadOptions={fetchStudentsOptions}
                onChange={handleStudentSelect}
                placeholder="Search by student name..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Select Batch */}
            <div>
              <label className="block text-sm font-medium">Select Batch</label>
              <select
                name="batchId"
                value={formData.batchId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                <option value="">-- Select Batch --</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Other Fields */}
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="Attending">Attending</option>
                <option value="Absconding">Absconding</option>
                <option value="Left">Left</option>
                <option value="Shifted">Shifted</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>

            {/* Payable Fees */}
            <div>
              <label className="block text-sm font-medium">Payable Fees</label>
              <input
                type="number"
                name="payableFees"
                value={formData.payableFees}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {/* Discount Comment */}
            <div>
              <label className="block text-sm font-medium">Discount Comment</label>
              <input
                type="text"
                name="discountComment"
                value={formData.discountComment}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            {/* Installment Type */}
            <div>
              <label className="block text-sm font-medium">Installment Type</label>
              <select
                name="installmentType"
                value={formData.installmentType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                <option value="">-- Select Plan --</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-yearly">Half-Yearly</option>
                <option value="One-Time">One-Time</option>
              </select>
            </div>
          </div>

          <div>
              <label className="block text-sm font-medium">Number of Installments</label>
              <input
                type="number"
                name="numberOfInstallments"
                value={formData.numberOfInstallments}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBatchStudent;
