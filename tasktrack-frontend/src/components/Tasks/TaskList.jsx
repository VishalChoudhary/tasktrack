import React from "react";
import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onDelete }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first task to get started
        </p>
        <a
          href="/tasks/create"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition"
        >
          ➕ Create First Task
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard key={task._id || task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
