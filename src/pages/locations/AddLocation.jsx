import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstitutes } from '../../redux/features/institute/instituteSlice';
import { addLocation } from '../../redux/features/location/locationSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [instituteId, setInstituteId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Access institutes state from Redux store
  const { institutes, loading: institutesLoading, error } = useSelector((state) => state.institutes);

  // Fetch institutes on searchQuery change or on component mount
  useEffect(() => {
    dispatch(fetchInstitutes({ page: 1, limit: 10, search: searchQuery }));
  }, [searchQuery, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newLocation = { name, instituteId };
      await dispatch(addLocation(newLocation));
      toast.success('Location added successfully');
      navigate('/locations/list');
    } catch (error) {
      toast.error('Error adding location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Add Location</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Location Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="instituteId" className="block text-sm font-medium text-gray-700">
            Search Institute
          </label>
          <input
            id="instituteId"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search for Institute"
          />
          {institutesLoading && <div>Loading institutes...</div>}
          {error && <div className="text-red-500">{error}</div>}

          {institutes.length > 0 && (
            <ul className="mt-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md">
              {institutes.map((institute) => (
                <li
                  key={institute._id}
                  onClick={() => setInstituteId(institute._id)}
                  className="cursor-pointer p-2 hover:bg-indigo-100"
                >
                  {institute.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white bg-blue-600 ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Location'}
        </button>
      </form>
    </div>
  );
};

export default AddLocation;
