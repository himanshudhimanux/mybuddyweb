import { Link } from "react-router-dom"
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaChalkboardTeacher, FaRegUserCircle } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaRegBuilding } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiChalkboardTeacher } from "react-icons/pi";

const Sidebar = () => {
  return (
    <>
      <div className="bg-blue-900 text-white w-64 p-4 flex flex-col">
        <nav className="space-y-4">

          <Link to="/" className="flex items-center p-2 custom-hover rounded">
            <MdOutlineSpaceDashboard />
            <span className="ml-2">Dashboard</span>
          </Link>

          <Link to="/teachers/list" className="flex items-center p-2 custom-hover rounded">
          <FaChalkboardTeacher />
            <span className="ml-2">Teachers</span>
          </Link>

          <Link to="/students/list" className="flex items-center p-2 custom-hover rounded">
            <FiUsers />
            <span className="ml-2">Students</span>
          </Link>

          <Link to="/attendance/list" className="flex items-center p-2 custom-hover rounded">
          <FaRegUserCircle />

            <span className="ml-2">Attendance</span>
          </Link>

          <Link to="/courses/list" className="flex items-center p-2 custom-hover rounded">
          <PiChalkboardTeacher />
            <span className="ml-2">Courses</span>
          </Link>

          <Link to="/subjects/list" className="flex items-center p-2 custom-hover rounded">
          <IoDocumentTextOutline />
            <span className="ml-2">Subjects</span>
          </Link>

          <Link to="/batches/list" className="flex items-center p-2 custom-hover rounded">
            <FaRegBuilding />
            <span className="ml-2">Batches</span>
          </Link>

          <Link to="/batch-students/list" className="flex items-center p-2 custom-hover rounded">
            <FaRegBuilding />
            <span className="ml-2">Batch Students</span>
          </Link>

          <Link to="/class-sessions/list" className="flex items-center p-2 custom-hover rounded">
            <FaRegBuilding />
            <span className="ml-2">Class Sessions</span>
          </Link>

          <Link to="/class-session/calendar" className="flex items-center p-2 custom-hover rounded">
            <FaRegBuilding />
            <span className="ml-2">Sessions View</span>
          </Link>

          <Link to="/institutes/list" className="flex items-center p-2 custom-hover rounded">
            <FaRegBuilding />
            <span className="ml-2">Centre/Institutes</span>
          </Link>

          <Link to="/location/list" className="flex items-center p-2 custom-hover rounded">
            <FaRegBuilding />
            <span className="ml-2">Locations</span>
          </Link>

          <Link to="/session-year/list" className="flex items-center p-2 custom-hover rounded">
            <FaRegBuilding />
            <span className="ml-2">Session Years</span>
          </Link>


        </nav>
      </div>
    </>
  )
}

export default Sidebar