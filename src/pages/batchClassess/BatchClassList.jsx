import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBatchClasses } from "../../redux/features/batchClass/batchClassSlice"; // Adjust path
import DataTable from "react-data-table-component";

const BatchClassList = () => {
    const dispatch = useDispatch();
    const { batchClasses, loading, error } = useSelector((state) => state.batchClasses);

    useEffect(() => {
        dispatch(fetchBatchClasses({ page: 1, limit: 10 }));
    }, [dispatch]);

    const columns = [
        { name: "Batch ID", selector: (row) => row.batchId?.name, sortable: true },
        { name: "Start Date", selector: (row) => new Date(row.startDate).toLocaleDateString(), sortable: true },
        { name: "End Date", selector: (row) => new Date(row.expectedEndDate).toLocaleDateString(), sortable: true },
        { name: "Start Time", selector: (row) => new Date(row.startTime).toLocaleTimeString(), sortable: true },
        { name: "End Time", selector: (row) => new Date(row.endTime).toLocaleTimeString(), sortable: true },
        { name: "Status", selector: (row) => row.status, sortable: true },
    ];


    return (
        <div className="container mt-4">
            <h2 className="mb-3">Batch Classes</h2>

            {loading && <div className="alert alert-info">Loading batch classes...</div>}
            {error && <div className="alert alert-danger">{error.message || JSON.stringify(error)}</div>}


            <DataTable
                columns={columns}
                data={Array.isArray(batchClasses) ? batchClasses : []}
                pagination
                highlightOnHover
                striped
                responsive
            />

        </div>
    );
};

export default BatchClassList;
