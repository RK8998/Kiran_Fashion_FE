import React from 'react';
import { Pagination } from '@heroui/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AppPagination: React.FC = () => {
  return (
    <div className="flex items-center justify-end">
      <Pagination initialPage={1} total={10} />
    </div>
  );
};

export default AppPagination;
