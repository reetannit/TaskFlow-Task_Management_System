import {
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCalendar,
} from 'react-icons/hi';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const statusLabels = {
    todo: 'Todo',
    'in-progress': 'In Progress',
    done: 'Done',
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'done') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div
      className={`task-card priority-${task.priority} ${task.status === 'done' ? 'done' : ''}`}
    >
      {/* Checkbox */}
      <button
        className={`task-checkbox ${task.status === 'done' ? 'checked' : ''}`}
        onClick={() => onToggleComplete(task)}
        title={task.status === 'done' ? 'Mark as todo' : 'Mark as done'}
      >
        {task.status === 'done' && <HiOutlineCheck />}
      </button>

      {/* Content */}
      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
        <div className="task-meta">
          <span className={`task-badge badge-${task.status}`}>
            {statusLabels[task.status]}
          </span>
          <span className={`task-badge badge-${task.priority}`}>
            {task.priority}
          </span>
          {task.dueDate && (
            <span className={`task-due ${isOverdue() ? 'overdue' : ''}`}>
              <HiOutlineCalendar />
              {isOverdue() ? 'Overdue: ' : ''}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        <button
          className="task-action-btn"
          onClick={() => onEdit(task)}
          title="Edit"
        >
          <HiOutlinePencil />
        </button>
        <button
          className="task-action-btn delete"
          onClick={() => onDelete(task._id)}
          title="Delete"
        >
          <HiOutlineTrash />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
