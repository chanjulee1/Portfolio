import React from 'react';
import { NavLink } from 'react-router-dom';

const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
  const pageNumbers = Math.ceil(totalPosts / postsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pageNumbers; i++) {
      pages.push(i);
    }
    return pages.map(number => (
      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
        <NavLink className="page-link" onClick={() => paginate(number)}>
          {number}
        </NavLink>
      </li>
    ));
  };
  console.log(currentPage);
  return (
    <nav>
      <ul className='pagination' aria-label="Page navigation example">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <NavLink className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </NavLink>
        </li>
        {renderPageNumbers()}
        <li className={`page-item ${currentPage === pageNumbers ? 'disabled' : ''}`}>
          <NavLink className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers}>
            Next
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
