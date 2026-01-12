import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmployeeListPage from "./pages/EmployeeList";
import CreateEmployee from "./pages/createEmployee";
import EditEmployee from "./pages/editEmployee";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect default / to /employees */}
        <Route path="/" element={<Navigate to="/employees" replace />} />

        {/* Employee List */}
        <Route path="/employees" element={<EmployeeListPage />} />

        {/* Create Employee */}
        <Route path="/employees/create" element={<CreateEmployee />} />

        {/* Edit Employee */}
        <Route path="/employees/edit/:id" element={<EditEmployee />} />

        {/* Fallback */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
