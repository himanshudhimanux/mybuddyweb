import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { FaRegBell } from "react-icons/fa";

const HeaderBar = () => {

  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    toast.success('Logout Successfully')
    navigate('/login')

  };


  return (
    <div className="flex items-center justify-between bg-white p-4 shadow">
      {/* Description */}
      <div className="text-gray-700">
        <h1 className="text-2xl font-bold">My Buddy</h1>
      </div>


      <div className="flex items-center space-x-4">

        <div className="relative">

          <FaRegBell className="text-3xl" />

          <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full text-xs px-1">
            1
          </span>
        </div>
        {isAuthenticated ? (
          <>
            <p>Role: {role}</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded-3xl hover:bg-red-600" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (

          <Link className='className="bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600"' to="/login">Log In</Link>

        )}


      </div>
    </div>
  );
};

export default HeaderBar;
