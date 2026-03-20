// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui';

export default function CustomPagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  if (totalPages <= 1) return null;
  return <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevious} disabled={currentPage <= 1}>
            上一页
          </PaginationPrevious>
        </PaginationItem>
        
        {Array.from({
        length: Math.min(5, totalPages)
      }, (_, i) => {
        const pageNum = i + 1;
        return <PaginationItem key={pageNum}>
              <PaginationLink onClick={() => onPageChange(pageNum)} isActive={currentPage === pageNum}>
                {pageNum}
              </PaginationLink>
            </PaginationItem>;
      })}
        
        {totalPages > 5 && <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>}
        
        <PaginationItem>
          <PaginationNext onClick={handleNext} disabled={currentPage >= totalPages}>
            下一页
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>;
}