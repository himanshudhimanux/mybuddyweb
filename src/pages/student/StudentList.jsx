import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { fetchStudents, deleteStudent } from "../../redux/features/student/studentSlice";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaEdit, FaRegEye, FaRegTrashAlt } from "react-icons/fa";

const StudentList = () => {
  const dispatch = useDispatch();
  const { data, totalPages, currentPage, status, error, deleteStudentStatus, deleteStudentError } = useSelector(
    (state) => state.students
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({});

  // Fetch students when page or search changes
  useEffect(() => {
    dispatch(fetchStudents({ page, limit: 10, search, filter }));
  }, [dispatch, page, search, filter]);

  // Export CSV
  const exportCSV = () => {
    const csvData = data.map(({ _id, ...rest }) => rest); // Remove _id for cleaner export
    const csvString = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    saveAs(blob, "students.csv");
  };

  // Handle student deletion
  const handleDelete = (id) => {
    dispatch(deleteStudent(id))
      .unwrap()
      .then(() => {
        alert("Student deleted successfully");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const columns = [
    { name: "Registration No.", selector: (row) => row.registrationNumber, sortable: true },
    {
      name: "Photo",
      selector: (row) => (
        <img src={row.photo} alt={row.name} width={40} height={40} style={{ borderRadius: "50%" }} />
      ),
    },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Father Name", selector: (row) => row.fatherName, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/view-student/${row._id}`}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            <FaRegEye />
          </Link>
          <Link
            to={`/edit-student/${row._id}`}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            <FaEdit />
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-10 justify-between items-center py-3.5 pl-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h1 className="text-2xl">Students</h1>
        </div>
        <div className="flex gap-4 items-center self-stretch my-auto text-sm font-semibold w-[235px]">
          <button className="btn" onClick={exportCSV}>
            Export CSV
          </button>
          <Link to="/students/add" className="dark-btn">
            Add Student
          </Link>
        </div>
      </div>
      <div className="input-container">
        <FiSearch />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="studentSearch"
          placeholder="Search for a student by name or email"
          className="input-max"
        />
      </div>

      {status === "loading" && <p>Loading students...</p>}
      {status === "failed" && <p>Error: {error}</p>}

      <DataTable
        columns={columns}
        data={data}
        pagination
        paginationServer
        paginationTotalRows={totalPages * 10}
        onChangePage={(page) => setPage(page)}
        progressPending={status === "loading"}
      />
    </>
  );
};

export default StudentList;
