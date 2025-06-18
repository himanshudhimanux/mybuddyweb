import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../redux/features/course/courseSlice';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

import {
  addBatchesToCourse,
  getBatchesByCourseId,
  removeBatchFromCourse,
  clearCourseBatchMessages
} from '../../redux/features/courseBatchMapSlice';

import { fetchBatches } from '../../redux/features/batch/batchSlice'; // adjust import path

const CoursesList = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const { courseBatches, loading: batchLoading } = useSelector((state) => state.courseBatchMap);
  const { batches: allBatches } = useSelector((state) => state.batches); // assuming you put batches here

  const [filterText, setFilterText] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Modal state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoadingBatchId, setRemoveLoadingBatchId] = useState(null);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchBatches());
  }, [dispatch]);

  useEffect(() => {
    if (courses) {
      setFilteredCourses(
        courses.filter((course) =>
          course.name.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    }
  }, [filterText, courses]);

  // Open modal and fetch batches for that course
  const openBatchModal = (course) => {
    setSelectedCourse(course);
    setSelectedBatchId('');
    dispatch(getBatchesByCourseId(course._id));
  };

  // Close modal
  const closeBatchModal = () => {
    setSelectedCourse(null);
    setSelectedBatchId('');
    dispatch(clearCourseBatchMessages());
  };

  // Add batch to course
  const handleAddBatch = async () => {
    if (!selectedBatchId) return;
    setAddLoading(true);
    try {
      await dispatch(addBatchesToCourse({ courseId: selectedCourse._id, batchIds: [selectedBatchId] })).unwrap();
      // Refresh batches after adding
      await dispatch(getBatchesByCourseId(selectedCourse._id));
      setSelectedBatchId('');
    } catch (err) {
      // Handle error if needed
    }
    setAddLoading(false);
  };

  // Remove batch from course
  const handleRemoveBatch = async (batchId) => {
    setRemoveLoadingBatchId(batchId);
    try {
      await dispatch(removeBatchFromCourse({ courseId: selectedCourse._id, batchId })).unwrap();
      // Refresh batches after removing
      await dispatch(getBatchesByCourseId(selectedCourse._id));
    } catch (err) {
      // Handle error if needed
    }
    setRemoveLoadingBatchId(null);
  };

  // Columns + new Manage Batches column
  const columns = [
    {
      name: 'Course Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Course Type',
      selector: (row) => row.courseType,
      sortable: true,
    },
    {
      name: 'Course Fee',
      selector: (row) => row.courseFee,
      sortable: true,
    },
    {
      name: 'Session',
      selector: (row) => row.sessionYear?.sessionTitle,
      sortable: true,
    },
    {
      name: 'Subjects',
      selector: (row) =>
        row.subjectIds && row.subjectIds.length > 0
          ? row.subjectIds.map((sub) => sub.name).join(', ')
          : 'N/A',
    },
    {
      name: 'Batches',
      cell: (row) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => openBatchModal(row)}
        >
          Manage Batches
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error.message || 'Something went wrong!'}</p>;

  return (
    <>
      <div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h1 className="text-2xl">Courses List</h1>
        </div>
        <div className="flex gap-4 items-end  my-auto text-sm font-semibold ">
          <Link to="/course/add" className="dark-btn">
            Add Course
          </Link>
        </div>
      </div>

      <div className="container mx-auto">
        <input
          type="text"
          placeholder="Search by course name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="mb-4 w-full p-2 border rounded"
        />

        <DataTable
          columns={columns}
          data={filteredCourses}
          pagination
          highlightOnHover
          responsive
          defaultSortField="name"
          className="border rounded"
        />
      </div>

      {/* Batch Management Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Manage Batches for: {selectedCourse.name}
            </h2>

            {/* List of current batches */}
            <h3 className="font-medium mb-2">Assigned Batches:</h3>
            {batchLoading ? (
              <p>Loading batches...</p>
            ) : (
              <ul className="mb-4 max-h-48 overflow-y-auto border rounded p-2">
                {(courseBatches[selectedCourse._id] && courseBatches[selectedCourse._id].length > 0) ? (
                  courseBatches[selectedCourse._id].map((batch) => (
                    <li key={batch._id} className="flex justify-between items-center mb-1">
                      <span>{batch.name}</span>
                      <button
                        disabled={removeLoadingBatchId === batch._id}
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveBatch(batch._id)}
                      >
                        {removeLoadingBatchId === batch._id ? 'Removing...' : 'Remove'}
                      </button>
                    </li>
                  ))
                ) : (
                  <p>No batches assigned.</p>
                )}
              </ul>
            )}

            {/* Add batch dropdown */}
            <div className="flex gap-2 mb-4 items-center">
              <select
                className="border p-2 rounded flex-grow"
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
              >
                <option value="">Select batch to add</option>
                {allBatches && allBatches.length > 0 && allBatches.map((batch) => {
                  // Disable batch options that are already assigned
                  const isAssigned = courseBatches[selectedCourse._id]?.some(b => b._id === batch._id);
                  return (
                    <option
                      key={batch._id}
                      value={batch._id}
                      disabled={isAssigned}
                    >
                      {batch.name} {isAssigned ? "(Already added)" : ""}
                    </option>
                  );
                })}
              </select>

              <button
                className="btn btn-primary"
                disabled={!selectedBatchId || addLoading}
                onClick={handleAddBatch}
              >
                {addLoading ? 'Adding...' : 'Add'}
              </button>
            </div>

            <button
              className="btn btn-secondary"
              onClick={closeBatchModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursesList;
