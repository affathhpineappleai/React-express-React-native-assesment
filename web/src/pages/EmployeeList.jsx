//import necessary modules and components
//web/src/pages/EmployeeList.jsx
import React, { useState, useEffect } from "react"; //import React and hooks
import { getEmployees, deleteEmployee } from "../api/api"; // Correct api path
import EmployeeCard from "../components/EmployeeCard"; //import EmployeeCard component
import DepartmentFilter from "../components/DepartmentFilter"; //import DepartmentFilter component
import "../styles/EmployeeList.css"; //import CSS for EmployeeList
import { Link, useNavigate } from "react-router-dom";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"; //import delete confirmation modal
import Loader from "../components/Loader"; //import Loader component
import Toast from "../components/Toast"; //import Toast component

//main EmployeeList component
export default function EmployeeList() {
  //state variables
  const [employees, setEmployees] = useState([]); //all employees from backend
  const [filteredEmployees, setFilteredEmployees] = useState([]); //employees after applying department filter
  const [loading, setLoading] = useState(true); //loading state
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  //state for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); //whether modal is visible
  const [employeeToDelete, setEmployeeToDelete] = useState(null); //employee id to delete

  //state for toast notifications
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // success, error, etc.
  });

  //list of departments for filter
  const departments = ["All", "HR", "IT", "Finance", "Marketing"];

  //fetch employees on component mount when the component is first rendered
  useEffect(() => {
    //async function to fetch employee data
    const fetchData = async () => {
      setLoading(true); //set loading state
      try {
        const data = await getEmployees(); //fetch employees from backend
        setEmployees(data); //set all employees
        setFilteredEmployees(data); //set filtered employees
      } catch (err) {
        console.error(err);
        showToast("Failed to load employees", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDepartment === "All")
      setFilteredEmployees(employees); //show all employees if "All" is selected
    //filter employees by selected department
    else
      setFilteredEmployees(
        employees.filter((emp) => emp.department === selectedDepartment) //filtering logic
      );
  }, [selectedDepartment, employees]); //update filtered employees when selectedDepartment or employees change

  const navigate = useNavigate();

  //handler for editing an employee
  const handleEdit = (id) => {
    navigate(`/employees/edit/${id}`);
    console.log("Edit employee", id);
  };

  // Function to show toast notification
  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  // Function to hide toast notification
  const hideToast = () => {
    setToast({
      ...toast,
      show: false,
    });
  };

  //handler for deleting an employee
  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id); //delete employee from backend
      setEmployees((prev) => prev.filter((emp) => emp._id !== id)); //remove deleted employee from state

      // Show success toast
      showToast("Employee deleted successfully", "success");

      console.log("Deleted employee", id); //log deletion
    } catch (err) {
      console.error(err);
      // Show error toast
      showToast("Failed to delete employee", "error");
    }
  };

  //show loader while fetching employees
  if (loading) return <Loader message="Loading employees..." />;

    return (
    <div className="employee-list-container">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          duration={3000}
        />
      )}

      {/* Header section with title and button */}
      <div className="employee-header">
        <h1>Employees ({filteredEmployees.length})</h1>
        
        {/* Create Employee button */}
        <Link to="/employees/create">
          <button className="add-employee-btn">Add Employee</button>
        </Link>
      </div>

      <DepartmentFilter
        departments={departments}
        selectedDepartment={selectedDepartment}
        onSelect={setSelectedDepartment}
      />

      <div className="employee-grid">
        {filteredEmployees.map((emp) => (
          <EmployeeCard
            key={emp._id}
            employee={emp}
            onEdit={handleEdit}
            //instead of deleting directly, open the confirmation modal
            onDelete={(id) => {
              setEmployeeToDelete(id); //store the employee ID
              setShowDeleteModal(true); //show confirmation modal
            }}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          onConfirm={() => {
            handleDelete(employeeToDelete); // actually delete employee
            setShowDeleteModal(false); // close modal
            setEmployeeToDelete(null); // reset selected employee
          }}
          onCancel={() => {
            setShowDeleteModal(false); // just close modal
            setEmployeeToDelete(null); // reset selected employee
          }}
          message="Are you sure you want to delete this employee?"
        />
      )}
    </div>
  );
}
