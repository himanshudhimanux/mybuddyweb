import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import api from '../../utils/api';
import { loginSuccess } from '../../redux/features/auth/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // ✅ Start loading

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token, role } = response.data;

      localStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token, role }));

      toast.success('Login Successful');
      switch (role) {
        case 'admin':
          navigate('/');
          break;
        case 'teacher':
          navigate('/students/list');
          break;
        case 'account':
          navigate('/fees');
          break;
        default:
          navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="flex overflow-hidden flex-col justify-center items-center px-20 py-40 bg-zinc-50 max-md:px-5 max-md:py-24">
      <div className="flex flex-col max-w-full w-[549px]">
        <h1 className="gap-4 self-stretch text-4xl font-semibold text-center text-neutral-600 max-md:max-w-full">
          Welcome, Log into your account
        </h1>
        <div className="flex overflow-hidden flex-col justify-center items-center self-center px-14 py-16 mt-14 max-w-full text-sm font-medium bg-white w-[512px] max-md:px-5 max-md:mt-10">
          <div className="flex flex-col max-w-full w-[500px]">
            <p className="text-base leading-6 text-center text-gray-500">
              It is our great pleasure to have you on board!
            </p>
            <form className="flex flex-col w-full gap-3.5 mt-8" onSubmit={handleLogin}>
              <div className="flex flex-col">
                <label htmlFor="email" className="sr-only">Enter Email Address</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter Email Address"
                  className="p-3.5 w-full rounded border border-neutral-400 text-zinc-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
              </div>
              <div className="flex flex-col">
                <label htmlFor="password" className="sr-only">Enter Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  className="p-3.5 w-full rounded border border-neutral-400 text-zinc-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
              </div>

              <button
                type="submit"
                className="dark-btn flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
