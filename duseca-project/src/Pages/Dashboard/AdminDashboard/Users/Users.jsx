import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllManagers,
  AssignManagerToUser,
} from "../../../../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColors = {
  Completed: "bg-green-100 text-green-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Pending: "bg-red-100 text-red-700",
};

const capitalize = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [managersData, setManagersData] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getAllUsers();
        const managers = await getAllManagers();
        setUsersData(users);
        setManagersData(managers);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch users or managers.");
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (userId) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedManager) {
      toast.warn("Please select both a manager and a user");
      return;
    }

    setIsAssigning(true);
    try {
      const payload = {
        userId: selectedUser,
        managerId: selectedManager,
      };
      await AssignManagerToUser(payload);
      toast.success("Manager assigned successfully!");
      setSelectedUser("");
      setSelectedManager("");
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error("Failed to assign manager. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User Management</h2>

      {/* Assign Section */}
      <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm mb-10">
        <h3 className="text-lg font-semibold mb-4">Assign Manager to User</h3>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select
            value={selectedManager}
            onChange={(e) => setSelectedManager(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/3"
          >
            <option value="">Select Manager</option>
            {managersData.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.name}
              </option>
            ))}
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/3"
          >
            <option value="">Select User</option>
            {usersData.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssign}
            disabled={isAssigning}
            className={`px-5 py-2 rounded font-medium transition-all ${isAssigning
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>

      {/* Managers */}
      <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-6">Managers</h2>
      <div className="grid grid-cols-3 gap-4 space-y-6">
        {managersData.map((manager) => (
          <div
            key={manager._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleExpand(manager._id)}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {manager.name}
                </h3>
                <p className="text-sm text-gray-500">{manager.email}</p>
                <span className="text-xs inline-block mt-1 px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                  Role: Manager
                </span>
              </div>
              <span className="text-sm text-purple-600">
                {expandedUserId === manager._id ? "Hide Users ▲" : "View Users ▼"}
              </span>
            </div>

            {/* Users under this manager */}
            {expandedUserId === manager._id && (
              <div className="px-6 pb-4">
                <h4 className="text-md font-semibold text-gray-700 mt-2 mb-2">
                  Assigned Users:
                </h4>
                {usersData.filter((user) => user.managerId === manager._id).length >
                  0 ? (
                  usersData
                    .filter((user) => user.managerId === manager._id)
                    .map((user) => (
                      <div
                        key={user._id}
                        className="mb-4 bg-gray-50 border p-3 rounded"
                      >
                        <div className="mb-1">
                          <span className="font-medium">{user.name}</span>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <h5 className="text-sm font-semibold mt-2 mb-1">
                          Tasks:
                        </h5>
                        {user.assignedTasks?.length > 0 ? (
                          <ul className="space-y-1">
                            {user.assignedTasks.map((task) => {
                              const status = capitalize(task.status);
                              return (
                                <li
                                  key={task._id}
                                  className="flex justify-between items-center bg-white px-3 py-1 rounded border"
                                >
                                  <span>{task.title}</span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[status] ||
                                      "bg-gray-200 text-gray-700"
                                      }`}
                                  >
                                    {status}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400">
                            No tasks assigned.
                          </p>
                        )}
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-400">No users assigned.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Users with Expandable Tasks */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6 mt-10">User</h2>
      <div className="grid grid-cols-3 gap-4 space-y-6">        {usersData.map((user) => (
        <div
          key={user._id}
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => toggleExpand(user._id)}
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="text-xs inline-block mt-1 px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                Role: {capitalize(user.role)}
              </span>
            </div>
            <span className="text-sm text-blue-600">
              {expandedUserId === user._id ? "Hide Tasks ▲" : "View Tasks ▼"}
            </span>
          </div>

          {/* Assigned Tasks */}
          {expandedUserId === user._id && (
            <div className="px-6 pb-4">
              <h4 className="text-md font-semibold text-gray-700 mt-2 mb-2">
                Assigned Tasks:
              </h4>
              {user.assignedTasks?.length > 0 ? (
                <ul className="space-y-2">
                  {user.assignedTasks.map((task) => {
                    const status = capitalize(task.status);
                    return (
                      <li
                        key={task._id}
                        className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md"
                      >
                        <span className="text-gray-800">{task.title}</span>
                        <span
                          className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[status] || "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {status}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No tasks assigned.</p>
              )}
            </div>
          )}
        </div>
      ))}
      </div>



    </div>
  );
};

export default Users;
