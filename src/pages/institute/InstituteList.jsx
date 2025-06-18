import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstitutes, deleteInstitute } from '../../redux/features/institute/instituteSlice';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const InstituteList = () => {
    const dispatch = useDispatch();
    const { institutes, loading, totalPages, currentPage } = useSelector((state) => state.institutes);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchInstitutes({ page, limit: 10, search }));
    }, [dispatch, page, search]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this institute?')) {
            dispatch(deleteInstitute(id))
                .unwrap()
                .then(() => {
                    toast.success('Institute deleted successfully');
                    dispatch(fetchInstitutes({ page, limit: 10, search }));
                })
                .catch((err) => toast.error(`Error: ${err.message}`));
        }
    };

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: (row) => row.phone,
        },
        {
            name: 'Contact Person',
            selector: (row) => row.contact,
        },
        {
            name: 'Address',
            selector: (row) => row.address,
        },
        {
            name: 'Logo',
            cell: (row) => (
                <img
                    src={row.logo}
                    alt={row.name}
                    className="h-10 w-10 rounded-full object-cover"
                />
            ),
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => alert(`Edit Institute: ${row.name}`)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    return (

        <>

<div className="flex flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h1 className="text-2xl">Institutes List</h1>
        </div>
        <div className="flex gap-4 items-end  my-auto text-sm font-semibold ">
          <Link to="/institute/add" className="dark-btn">
            Add Institute
          </Link>
        </div>
      </div>

        <div className="p-5 bg-white rounded shadow">
            <div className="mb-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded w-1/3"
                />
            </div>
            <DataTable
                columns={columns}
                data={institutes}
                pagination
                paginationServer
                paginationTotalRows={totalPages * 10} // Adjust based on items per page
                onChangePage={(page) => setPage(page)}
                progressPending={loading}
                className="border rounded"
            />
        </div>

        </>
    );
};

export default InstituteList;
