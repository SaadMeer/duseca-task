import React from 'react';

const getStatusPillColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'Pending':
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const UserTaskSection = ({ user, tasks }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{user.name}'s Tasks</h3>
      <ul className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="bg-white p-4 rounded shadow">
              <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusPillColor(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No tasks assigned.</p>
        )}
      </ul>
    </div>
  );
};

export default UserTaskSection;
