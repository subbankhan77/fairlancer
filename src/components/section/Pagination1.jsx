"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// Create a wrapper component that uses searchParams
function PaginationContent({ totalItems = 300, itemsPerPage = 10 }) {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current page from URL or default to 1
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;

    // Create new URL with updated page parameter
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.push(`${path}?${params.toString()}`);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Logic for middle pages
    if (currentPage > 3) pages.push("...");

    // Show 1 or 2 pages before current page if possible
    if (currentPage > 2) pages.push(currentPage - 1);

    // Current page (unless it's 1 or last)
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }

    // Show 1 or 2 pages after current page if possible
    if (currentPage < totalPages - 1) pages.push(currentPage + 1);

    // Show ellipsis before last page
    if (currentPage < totalPages - 2) pages.push("...");

    // Always show last page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  // Calculate displayed items range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`mbp_pagination text-center ${
        path === "/blog-2" || path === "/blog-3" ? "mb40-md" : ""
      } ${path === "/shop-list" ? "mt30" : ""}`}
    >
      <ul className="page_navigation">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a
            className="page-link"
            onClick={() => changePage(currentPage - 1)}
            style={{ cursor: "pointer" }}
          >
            <span className="fas fa-angle-left" />
          </a>
        </li>

        {getPageNumbers().map((page, index) => (
          <li
            key={index}
            className={`page-item ${page === currentPage ? "active" : ""} ${
              page === "..." ? "disabled" : ""
            }`}
          >
            <a
              className="page-link"
              onClick={() => page !== "..." && changePage(page)}
              style={{ cursor: page !== "..." ? "pointer" : "default" }}
            >
              {page}{" "}
              {page === currentPage && (
                <span className="sr-only">(current)</span>
              )}
            </a>
          </li>
        ))}

        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <a
            className="page-link"
            onClick={() => changePage(currentPage + 1)}
            style={{ cursor: "pointer" }}
          >
            <span className="fas fa-angle-right" />
          </a>
        </li>
      </ul>
      <p className="mt10 mb-0 pagination_page_count text-center">
        {startItem} - {endItem} of {totalItems}+ property available
      </p>
    </div>
  );
}

// Main component with Suspense boundary
export default function Pagination1({ totalItems = 300, itemsPerPage = 10 }) {
  return (
    <Suspense fallback={<div>Loading pagination...</div>}>
      <PaginationContent totalItems={totalItems} itemsPerPage={itemsPerPage} />
    </Suspense>
  );
}
