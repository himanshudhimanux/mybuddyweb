import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { fetchBatchStudents } from "../../redux/features/batchStudent/batchStudentSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const BatchStudentsList = () => {
  const dispatch = useDispatch();
  const { batchStudents, loading, error } = useSelector((state) => state.batchStudent);

  useEffect(() => {
    dispatch(fetchBatchStudents());
    if (error) toast.error(error);
  }, [dispatch, error]);

  const columns = [
    { name: "Student Name", selector: (row) => row.studentId.name, sortable: true },
    { name: "Roll No.", selector: (row) => row.studentRollNo, sortable: true },
    { name: "Batch Name", selector: (row) => row.batchId.name, sortable: true },
    { name: "Joining Date", selector: (row) => row.joiningDate, sortable: true },
    { name: "Payble Fees", selector: (row) => row.payableFees, sortable: true },
    { name: "Installment Type", selector: (row) => row.installmentType, sortable: true },
    { name: "Total Course Fee", selector: (row) => row.totalCourseFees, sortable: true },
    { name: "Comment", selector: (row) => row.discountComment, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
  ];

  return (

    <>
    
    <div className="flex mb-3 flex-wrap gap-10 justify-between items-center py-3.5 px-4 text-center bg-white">
        <div className="self-stretch my-auto text-base font-medium text-neutral-600">
          <h2 className="text-2xl font-bold mb-4">Batch Student List</h2>
        </div>
        <div className="flex gap-4 items-end  my-auto text-sm font-semibold ">
          <Link to="/batch-student/add" className="dark-btn">
            Add Student in Batch
          </Link>
        </div>
    </div>

  <div className="max-w-full mx-auto p-4">
      
      <div className="shadow-sm border rounded-lg bg-white">
        <DataTable
          columns={columns}
          data={batchStudents}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
        />
      </div>
    </div>

    </>


  );
};

export default BatchStudentsList;
