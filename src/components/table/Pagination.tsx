import type { PaginationMeta } from "../../schemas/stateSchemas";

import style from "./style.module.css";

import arrowLeftIcon from "../../assets/icons/arrow-left.svg";
import arrowRightIcon from "../../assets/icons/arrow-right.svg";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page: currentPage, total_pages: totalPages } = meta;

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={style.paginationContainer}>
      <button
        className={style.paginationButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <img className={style.paginationButtonIcon} src={arrowLeftIcon} alt="Previous page" />
      </button>

      <div className={style.pageNumbers}>
        {getPageNumbers().map((page, index) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${index}`} className={style.ellipsis}>
              {page}
            </span>
          ) : (
            <button
              key={page}
              className={`${style.pageNumber} ${
                currentPage === page ? style.activePage : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className={style.paginationButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <img className={style.paginationButtonIcon} src={arrowRightIcon} alt="Next page" />
      </button>
    </div>
  );
}
