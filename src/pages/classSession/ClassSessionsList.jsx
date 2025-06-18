import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useGetSessionsQuery, useDeleteSessionMutation, useUpdateSessionMutation } from "../../redux/features/classSession/sessionApiSlice";
import { Link } from "react-router-dom";

const AddSessionsList = () => {
  const { data, error, isLoading } = useGetSessionsQuery();

  const [deleteSession] = useDeleteSessionMutation();
  const [updateSession] = useUpdateSessionMutation();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [formData, setFormData] = useState({}); // Form data for editing



  // Define columns for the table
  const columns = [
    {
      name: "Batch Class Name",
      selector: (row) => row.batchClassId || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Class Type",
      selector: (row) => row.classType,
      sortable: true,
    },
    {
      name: "Session Type",
      selector: (row) => row.sessionType,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => new Date(row.startDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => new Date(row.endDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Edit handler
  const handleEdit = (session) => {
    setSelectedSession(session);
    setFormData({ ...session }); // Pre-fill form data with session details
    setEditModalOpen(true); // Open edit modal
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await deleteSession(id).unwrap();
        alert("Session deleted successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to delete session. Please try again.");
      }
    }
  };

  // Submit handler for updating session
  const handleUpdateSubmit = async () => {
    try {
      await updateSession({ id: selectedSession._id, ...formData }).unwrap();
      alert("Session updated successfully!");
      setEditModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update session. Please try again.");
    }
  };

  // Loading and error handling
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching sessions!</p>;
  }

  return (

    <>

      <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h1 className="text-2xl font-bold mb-4">Session List</h1>

        </div>
        <div className="flex gap-4 items-end  my-auto text-sm font-semibold ">
          <Link to="/class-session/add" className="dark-btn">
            Create Class Session
          </Link>
        </div>
      </div>

      <div className="p-4">
        <DataTable
          columns={columns}
          data={data?.data || []} // Ensure data is an array
          pagination
          highlightOnHover
          striped
          responsive
          persistTableHead
          noDataComponent={<p>No sessions found</p>}
        />

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Edit Session</h2>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Batch Class ID</label>
                <input
                  type="text"
                  name="batchClassId"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.batchClassId}
                  onChange={(e) => setFormData({ ...formData, batchClassId: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Status</label>
                <select
                  name="status"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Holidays - Calendar">Holidays - Calendar</option>
                  <option value="Holidays - Batch">Holidays - Batch</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              {/* Add additional fields as necessary */}
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={handleUpdateSubmit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </>


  );
};

export default AddSessionsList;
