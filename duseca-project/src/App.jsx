import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./Pages/LoginForm";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard/AdminDashboard";
import DashboardLayout from "./Pages/Dashboard/DashboardLayout";
import Tasks from "./Pages/Dashboard/AdminDashboard/Tasks/Tasks";
import Users from "./Pages/Dashboard/AdminDashboard/Users/Users";
import ManagerDashboard from "./Pages/Dashboard/ManagerDashboard/ManagerDashboard";
import DashboardManagerLayout from "./Pages/Dashboard/DashboardManagerLayout";
import UserTasks from "./Pages/Dashboard/ManagerDashboard/UserTasks";
import Unauthorized from "./Pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import 'react-toastify/dist/ReactToastify.css';
import DashboardUserLayout from "./Pages/Dashboard/DashboardUserLayout";
import UserDashboard from "./Pages/Dashboard/UserDashboard/UserDashboard";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <>
      <ToastContainer />

      <Routes>

        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute element={<DashboardLayout />} requiredRole="admin" />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          {/* <Route path="tasks" element={<Tasks />} /> */}
        </Route>

        {/* Manager Routes */}
        <Route
          path="/dashboard-manager"
          element={
            <ProtectedRoute element={<DashboardManagerLayout />} requiredRole="manager" />
          }
        >
          <Route index element={<ManagerDashboard />} />
          <Route path="usertasks" element={<UserTasks />} />
        </Route>



        {/* User Routes */}
        <Route
          path="/dashboard-user"
          element={
            <ProtectedRoute element={<DashboardUserLayout />} requiredRole="user" />
          }>
          <Route index element={<UserDashboard />} />
          <Route path="usertasks" element={<UserTasks />} />
        </Route>

        {/* Fallback for unauthorized access */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>

  );
}

export default App;


// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import LoginForm from "./Pages/LoginForm";
// import AdminDashboard from "./Pages/Dashboard/AdminDashboard/AdminDashboard";
// import DashboardLayout from "./Pages/Dashboard/DashboardLayout";
// import Tasks from "./Pages/Dashboard/AdminDashboard/Tasks/Tasks";
// import Users from "./Pages/Dashboard/AdminDashboard/Users/Users";
// import ManagerDashboard from "./Pages/Dashboard/ManagerDashboard/ManagerDashboard";
// import DashboardManagerLayout from "./Pages/Dashboard/DashboardManagerLayout";
// import UserTasks from "./Pages/Dashboard/ManagerDashboard/UserTasks";

// const App = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<LoginForm />} />
//       <Route path="/login" element={<LoginForm />} />

//       <Route path="/dashboard-admin" element={<DashboardLayout />}>
//         <Route index element={<AdminDashboard />} />
//         <Route path="users" element={<Users />} />
//         <Route path="tasks" element={<Tasks />} />
//       </Route>

//       <Route path="/dashboard-manager" element={<DashboardManagerLayout />}>
//         <Route index element={<ManagerDashboard />} />
//         <Route path="usertasks" element={<UserTasks />} />
//       </Route>
//     </Routes>
//   );
// };

// export default App;