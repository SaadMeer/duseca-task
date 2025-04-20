import React from 'react';

const managerTasks = [
    { id: 1, title: "Review Budget Proposal", status: "In Progress" },
    { id: 2, title: "Team Meeting Prep", status: "Completed" },
];

const statusColors = {
    Completed: "bg-green-100 text-green-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Pending: "bg-red-100 text-red-700",
};

const ManagerTasks = () => {
    return (
        <div className="space-y-4">
            {managerTasks.map((task) => (
                <div
                    key={task.id}
                    className="p-4 bg-white border border-gray-200 rounded shadow-sm flex justify-between"
                >
                    <div className="text-gray-800 font-medium">{task.title}</div>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[task.status]}`}
                    >
                        {task.status}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ManagerTasks;
