import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { fetchTeachers } from '../../redux/features/teacher/teacherSlice';
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { saveAs } from 'file-saver';

const TeacherList = () => {
    const dispatch = useDispatch();
    const { data, totalPages, currentPage, status } = useSelector((state) => state.teachers);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchTeachers({ page, limit: 10, search }));
    }, [dispatch, page, search]);

    const handleExport = () => {
        const csv = data
            .map((teacher) =>
                [teacher.name, teacher.email, teacher.phone, teacher.subject].join(',')
            )
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'teachers.csv');
    };

    const columns = [
        {
            name: 'Photo',
            selector: (row) => (
                <img src={row.photo} alt={row.name} width={40} height={40} style={{ borderRadius: '50%' }} />
            ),
        },
        { name: 'Name', selector: (row) => row.name, sortable: true },
        { name: 'Subject', selector: (row) => row.subject },
        { name: 'Gender', selector: (row) => row.gender },
        { name: 'Phone', selector: (row) => row.phone },
    ];

    return (
        <>
            <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 pl-4 text-center bg-white">
                <div className="self-stretch my-auto text-base font-medium text-neutral-600">
                    <h1 className="text-2xl">Teachers</h1>
                </div>
                <div className="flex gap-4 items-center self-stretch my-auto text-sm font-semibold w-[235px]">
                    <button className="btn" onClick={handleExport}>
                        Export CSV
                    </button>
                    <Link to="/teachers/add" className="dark-btn">
                        Add Teacher
                    </Link>
                </div>
            </div>
            <div className="input-container">
                <FiSearch />
                <input
                    type="text"
                    placeholder="Search for a teacher by name or email"
                    className="input-max"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <DataTable
                columns={columns}
                data={data}
                pagination
                paginationServer
                paginationTotalRows={totalPages * 10}
                onChangePage={(page) => setPage(page)}
                progressPending={status === 'loading'}
            />
        </>
    );
};

export default TeacherList;
