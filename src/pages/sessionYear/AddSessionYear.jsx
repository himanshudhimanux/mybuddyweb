import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSessionYear } from "../../redux/features/sessionYear/sessionYearSlice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const AddSessionYear = () => {
  const dispatch = useDispatch();

  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [defaultYear, setDefaultYear] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startMonth || !startYear || !endYear) {
      toast.error("All fields are required");
      return;
    }

    const newSessionYear = {
      startMonth,
      startYear: Number(startYear),
      endYear: Number(endYear),
      defaultYear,
    };

    dispatch(createSessionYear(newSessionYear))
      .unwrap()
      .then(() => {
        toast.success("Session year created successfully");
        setStartMonth("");
        setStartYear("");
        setEndYear("");
        setDefaultYear(false);
      })
      .catch((err) => toast.error(err.message || "Failed to create session year"));
  };

  return (
    <>
      <div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-2xl font-bold mb-4">Add Session Year</h2>
        </div>
        <div className="flex gap-4 items-end my-auto text-sm font-semibold">
          <Link to="/session-year/list" className="dark-btn">
            Session Years List
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Start Month</label>
            <select
              className="border p-2 w-full"
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value)}
            >
              <option value="">Select month</option>
              {["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block">Start Year</label>
            <input
              type="number"
              className="border p-2 w-full"
              placeholder="e.g. 2025"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
            />
          </div>

          <div>
            <label className="block">End Year</label>
            <input
              type="number"
              className="border p-2 w-full"
              placeholder="e.g. 2027"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
            />
          </div>

          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={defaultYear}
                onChange={() => setDefaultYear(!defaultYear)}
                className="mr-2"
              />
              Default Year
            </label>
          </div>

          <button type="submit" className="dark-btn">
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default AddSessionYear;
