import React from 'react';
import { Pagination } from '@heroui/react';

interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

const AppPagination: React.FC<PaginationProps> = ({ currentPage, totalRecords, onPageChange }) => {
  const total = Math.ceil(totalRecords / 10);

  if (!total || isNaN(total)) return null;

  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-gray-500 font-normal">10 Records per page</p>
      <Pagination page={currentPage} total={Math.ceil(totalRecords / 10)} onChange={onPageChange} />
    </div>
  );
};

export default AppPagination;
