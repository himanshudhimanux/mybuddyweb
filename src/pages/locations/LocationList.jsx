// src/components/LocationList.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocations, deleteLocation } from '../../redux/features/location/locationSlice';
import ReactDataTable from 'react-data-table-component';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const LocationList = () => {
  const dispatch = useDispatch();
  const { locations, loading } = useSelector((state) => state.locations);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteLocation(id));
    toast.success('Location deleted successfully');
  };

  const filteredLocations = Array.isArray(locations)
    ? locations.filter(location =>
        location.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Institute',
      selector: row => row.instituteId?.name,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      ),
    },
  ];

  return (

  <>

    <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 pl-4 text-center bg-white">
          <div className="self-stretch my-auto text-base font-medium text-neutral-600">
              <h1 className="text-2xl">Location List</h1>
          </div>
          <div className="flex gap-4 items-center self-stretch my-auto text-sm font-semibold w-[235px]">

              <Link to="/location/add" className="dark-btn">
                  Add Institute Location
              </Link>
          </div>
      </div>

    <div className="container mx-auto p-4">
      <input
        type="text"
        className="border border-gray-300 p-2 mb-4 w-full"
        placeholder="Search Location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ReactDataTable
        columns={columns}
        data={filteredLocations}
        pagination
        progressPending={loading}
      />
    </div>

  </>

  );
};

export default LocationList;
