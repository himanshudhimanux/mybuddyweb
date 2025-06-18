import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceRecords, deleteAttendance } from '../../redux/features/attendance/attendanceSlice';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';

const AttendanceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { records } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchAttendanceRecords());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      dispatch(deleteAttendance(id));
    }
  };

  const columns = [
    { name: 'Student', selector: (row) => row.studentId.name },
    { name: 'Session', selector: (row) => row.sessionId.title },
    { name: 'Type', selector: (row) => row.attendanceType },
    {
      name: 'Actions', cell: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/edit/${row._id}`)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
          <button onClick={() => handleDelete(row._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
        </div>
      )
    },
  ];

  return (

    <>

      <div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-2xl font-bold mb-4">Attendances List</h2>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold">
          <Link to="/attendance/add" className="dark-btn">
            Mark Attendance
          </Link>
        </div>
      </div>

      <div className="p-4">
        <DataTable columns={columns} data={records} pagination />
      </div>

    </>


  );
};

export default AttendanceList;
