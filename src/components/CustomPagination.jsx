// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui';

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange
}) {
  return <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => onPageChange(Math.max(1, currentPage - 1))} className="flex items-center gap-1">
            <span>‹</span>
            <span>上一页</span>
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
          <PaginationNext onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} className="flex items-center gap-1">
            <span>下一页</span>
            <span>›</span>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>;
}