import React from 'react';

// Mock data: all tasks with assigned users
const tasksData = [
  {
    id: 1,
    title: "Design Dashboard",
    status: "Completed",
    assignedTo: [{ id: 1, name: "John Doe", email: "john@example.com" }],
  },
  {
    id: 2,
    title: "Fix Login Bug",
    status: "In Progress",
    assignedTo: [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ],
  },
  {
    id: 3,
    title: "Create API Docs",
    status: "Pending",
    assignedTo: [{ id: 2, name: "Jane Smith", email: "jane@example.com" }],
  },
  {
    id: 4,
    title: "Unit Test Modules",
    status: "Pending",
    assignedTo: [],
  },
];

const statusColors = {
  Completed: "bg-green-100 text-green-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Pending: "bg-red-100 text-red-700",
};

const Tasks = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Task Management</h2>

      <div className="space-y-6">
        {tasksData.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition-all"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[task.status]}`}
              >
                {task.status}
              </span>
            </div>

            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Assigned To:</h4>
              {task.assignedTo.length > 0 ? (
                <ul className="space-y-1">
                  {task.assignedTo.map((user) => (
                    <li
                      key={user.id}
                      className="text-gray-700 bg-gray-100 px-3 py-1 rounded-md text-sm"
                    >
                      {user.name} ({user.email})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">Not assigned to anyone yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
