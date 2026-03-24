import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total } = pagination;

  const getPageNumbers = () => {
    const nums = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(pages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      nums.push(i);
    }
    return nums;
  };

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <HiOutlineChevronLeft />
      </button>

      {getPageNumbers().map((num) => (
        <button
          key={num}
          className={`page-btn ${num === page ? 'active' : ''}`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}

      <span className="page-info">{total} task{total !== 1 ? 's' : ''}</span>

      <button
        className="page-btn"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        <HiOutlineChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
