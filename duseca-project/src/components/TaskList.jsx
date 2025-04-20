// ========== components/TaskList.jsx ==========
import React, { useState } from 'react'

const tasks = [
    { id: 1, title: 'Task A', status: 'completed', due: '2024-09-01', user: 'Alice' },
    { id: 2, title: 'Task B', status: 'pending', due: '2024-09-10', user: 'Bob' },
]

const TaskList = ({ role }) => {
    const [filter, setFilter] = useState('')

    const filtered = tasks.filter(task =>
        (role === 'admin' || task.user === 'Alice') &&
        (!filter || task.status === filter)
    )

    return (
        <div>
            <div className="mb-4">
                <select onChange={e => setFilter(e.target.value)} className="border p-2">
                    <option value="">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
            <ul>
                {filtered.map(task => (
                    <li key={task.id} className="p-2 border-b">{task.title} - {task.status} - Due: {task.due}</li>
                ))}
            </ul>
        </div>
    )
}

export default TaskList