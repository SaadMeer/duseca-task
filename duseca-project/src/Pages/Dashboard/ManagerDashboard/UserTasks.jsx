// src/pages/UserTasks.jsx
import React from 'react';
import UserTaskSection from './UserTaskSection';

const teamMembers = [
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

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

const getTasksForUser = (userId) =>
  tasksData.filter((task) =>
    task.assignedTo.some((user) => user.id === userId)
  );

const UserTasks = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Users Tasks</h2>
      {teamMembers.map((member) => (
        <UserTaskSection
          key={member.id}
          user={member}
          tasks={getTasksForUser(member.id)}
        />
      ))}
    </div>
  );
};

export default UserTasks;
