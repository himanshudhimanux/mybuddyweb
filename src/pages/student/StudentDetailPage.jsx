import React from "react";

const StudentDetailPage = () => {
  const student = {
    photo: "https://via.placeholder.com/150", // Replace with actual photo URL
    registrationNo: "123456",
    name: "John Doe",
    fatherName: "Richard Doe",
    motherName: "Emily Doe",
    dob: "2005-08-15",
    gender: "Male",
    address: "123 Main Street, City, State, PIN",
    fatherPhone: "9876543210",
    motherPhone: "9876543211",
    studentPhone: "9876543212",
    email: "johndoe@example.com",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col items-center p-6 border-b">
          <img
            src={student.photo}
            alt="Student"
            className="w-32 h-32 rounded-full border-2 border-blue-500"
          />
          <h1 className="text-2xl font-bold mt-4">{student.name}</h1>
          <p className="text-gray-600">Registration No: {student.registrationNo}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Father's Name:</span>
            <span>{student.fatherName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Mother's Name:</span>
            <span>{student.motherName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Date of Birth:</span>
            <span>{student.dob}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Gender:</span>
            <span>{student.gender}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Address:</span>
            <span>{student.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Father's Phone:</span>
            <span>{student.fatherPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Mother's Phone:</span>
            <span>{student.motherPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Student's Phone:</span>
            <span>{student.studentPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{student.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
