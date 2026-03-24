import { HiOutlineSearch } from 'react-icons/hi';

const TaskFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="filters-bar">
      <div className="search-wrapper">
        <HiOutlineSearch />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <select
        className="filter-select"
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
      >
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        className="filter-select"
        value={filters.priority}
        onChange={(e) => onFilterChange('priority', e.target.value)}
      >
        <option value="">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        className="filter-select"
        value={filters.sortBy}
        onChange={(e) => onFilterChange('sortBy', e.target.value)}
      >
        <option value="createdAt">Sort: Newest</option>
        <option value="dueDate">Sort: Due Date</option>
        <option value="priority">Sort: Priority</option>
        <option value="title">Sort: Title</option>
      </select>

      <select
        className="filter-select"
        value={filters.sortOrder}
        onChange={(e) => onFilterChange('sortOrder', e.target.value)}
        style={{ minWidth: 100 }}
      >
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  );
};

export default TaskFilters;
