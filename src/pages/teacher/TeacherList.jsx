import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';

import {
  fetchTeachers,
  deleteTeacher,
} from '../../redux/features/teacher/teacherSlice';

const TeacherList = () => {
  const dispatch = useDispatch();
  const { data, status, deleteStatus } = useSelector((state) => state.teachers);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch, deleteStatus]);

  const handleExport = () => {
    const csv = data
      .map((teacher) =>
        [teacher.name, teacher.subject, teacher.gender, teacher.phone].join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'teachers.csv');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      dispatch(deleteTeacher(id));
    }
  };

  const columns = [
    {
      name: 'Photo',
      selector: (row) => (
        <img
          src={row.photo || '/default-avatar.png'}
          alt={row.name}
          width={40}
          height={40}
          style={{ borderRadius: '50%' }}
        />
      ),
    },
    { name: 'Name', selector: (row) => row.name, sortable: true },
    { name: 'Subject', selector: (row) => row.subject?.name },
    { name: 'Gender', selector: (row) => row.gender },
    { name: 'Phone', selector: (row) => row.phone },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-3">
          <Link to={`/teachers/edit/${row._id}`} className="text-blue-500 hover:text-blue-700">
            <FiEdit size={18} />
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 pl-4 text-center bg-white">
        <h1 className="text-2xl font-medium text-neutral-600">Teachers</h1>
        <div className="flex gap-4 items-center text-sm font-semibold">
          <button className="btn" onClick={handleExport}>
            <FiDownload className="inline-block mr-2" />
            Export CSV
          </button>
          <Link to="/teachers/add" className="dark-btn">
            Add Teacher
          </Link>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        progressPending={status === 'loading'}
        highlightOnHover
        pagination
      />
    </>
  );
};

export default TeacherList;
