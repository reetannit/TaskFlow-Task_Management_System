import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskFilters from '../components/TaskFilters';
import TaskForm from '../components/TaskForm';
import Pagination from '../components/Pagination';
import { HiOutlinePlus, HiOutlineClipboardList } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      params.append('page', filters.page);
      params.append('limit', 10);

      const res = await API.get(`/tasks?${params.toString()}`);
      setTasks(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchTasks();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' ? { page: 1 } : {}),
    }));
  };

  const handleCreateTask = async (data) => {
    const res = await API.post('/tasks', data);
    toast.success('Task created successfully!');
    fetchTasks();
  };

  const handleUpdateTask = async (data) => {
    await API.put(`/tasks/${editingTask._id}`, data);
    toast.success('Task updated successfully!');
    setEditingTask(null);
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      if (task.status === 'done') {
        await API.put(`/tasks/${task._id}`, { status: 'todo' });
        toast.success('Task marked as todo');
      } else {
        await API.patch(`/tasks/${task._id}/complete`);
        toast.success('Task completed! 🎉');
      }
      fetchTasks();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <>
      <div className="top-bar">
        <h1>My Tasks</h1>
        <div className="top-bar-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <HiOutlinePlus />
            New Task
          </button>
        </div>
      </div>

      <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="loader-container">
          <div className="loader-spinner" />
          <span className="loader-text">Loading tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <HiOutlineClipboardList />
          <h3>No tasks found</h3>
          <p>
            {filters.search || filters.status || filters.priority
              ? 'Try adjusting your filters.'
              : 'Create your first task to get started!'}
          </p>
          {!filters.search && !filters.status && !filters.priority && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <HiOutlinePlus />
              Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
          <Pagination
            pagination={pagination}
            onPageChange={(page) => handleFilterChange('page', page)}
          />
        </>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onClose={handleCloseForm}
        />
      )}
    </>
  );
};

export default Dashboard;
