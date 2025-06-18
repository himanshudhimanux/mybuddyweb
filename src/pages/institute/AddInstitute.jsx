import { useState } from "react";
import { useDispatch } from "react-redux";
import { addInstitute } from "../../redux/features/institute/instituteSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AddInstitute = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contact: "",
  });
  const [logo, setLogo] = useState(null); // Separate state for the file

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLogo(e.target.files[0]); // Capture the selected file
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    if (logo) {
      data.append("logo", logo); // Add the file to the form data
    }

    dispatch(addInstitute(data))
      .unwrap()
      .then(() => toast.success("Institute added successfully"))
      .catch((err) => toast.error(`Error: ${err.message}`));
  };

  return (
    <>
      <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h1 className="text-2xl">Add Institute</h1>
        </div>
        <div className="flex gap-4 items-end  my-auto text-sm font-semibold ">
          <Link to="/institutes/list" className="dark-btn">
            Institutes List
          </Link>
        </div>
      </div>

      <hr />

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col items-start px-20 py-custom bg-white max-w-full max-md:px-5 max-md:pt-24"
      >
        <div className="mt-8 w-full max-w-full max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="mb-4 p-2 border rounded w-full"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="mb-4 p-2 border rounded w-full"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="mb-4 p-2 border rounded w-full"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="mb-4 p-2 border rounded w-full"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <input
                type="text"
                name="contact"
                placeholder="Contact Person"
                className="mb-4 p-2 border rounded w-full"
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <input
                type="file"
                name="logo"
                accept=".jpg, .jpeg, .png"
                className="mb-4 p-2 border rounded w-full"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Institute
        </button>
      </form>
    </>
  );
};

export default AddInstitute;
