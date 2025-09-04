import React, { useMemo, useState } from 'react';
import { Button } from '@heroui/button';
import { Pencil, Trash2, PlusIcon, Eye } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Chip,
  DatePicker,
} from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import { DollarSign, TrendingUp, Package } from 'lucide-react';

import { AnimatedPage } from '@/components/AnimatedPage';
import AppButton from '@/components/AppButton';
import { AppToast, displaySuccessToast } from '@/helpers/toast';
import { getFormattedDate, mutationOnErrorHandler } from '@/helpers';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { deleteSalesService, getSalesListService } from '@/services/sales';

export const columns = [
  { name: 'NO', uid: 'no' },
  { name: 'SALE BY', uid: 'user_id' },
  { name: 'PRODUCT', uid: 'product_id' },
  { name: 'BASE AMOUNT', uid: 'base_amount' },
  { name: 'SELL AMOUNT', uid: 'sell_amount' },
  { name: 'DISCOUNT', uid: 'discount' },
  { name: 'PROFIT/LOSS', uid: 'profit' },
  { name: 'DATE', uid: 'created_at' },
  { name: 'ACTIONS', uid: 'actions' },
];

const Sales: React.FC = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const onPageChange = (page: number) => setPage(page);

  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(today(getLocalTimeZone()));

  const formattedDate = useMemo(() => {
    if (!selectedDate) return '';

    const jsDate = selectedDate.toDate(getLocalTimeZone());
    const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(jsDate.getDate()).padStart(2, '0');
    const year = jsDate.getFullYear();

    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const handleOpen = () => setIsOpenDelete(true);
  const handleClose = () => setIsOpenDelete(false);

  const onAddNotes = () => navigate('/sales/add');

  const {
    data: salesList,
    isLoading,
    refetch: refetchSales,
  } = useQuery({
    queryKey: ['sales', 'list', { page, formattedDate }],
    queryFn: async () => {
      const params = {
        page,
        rows: rowsPerPage,
        start_date: formattedDate,
        end_date: formattedDate,
      };
      const response = await getSalesListService(params);

      return response?.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: onDeleteSales } = useMutation({
    mutationKey: ['delete-sales'],
    mutationFn: async () => {
      const response = await deleteSalesService(deleteId);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      refetchSales();
      handleClose();
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const handleView = (id: number) => {
    navigate(`/sales/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`edit/${id}`);
  };

  const handleDelete = () => {
    AppToast(onDeleteSales(), 'Delete user in progress');
  };

  const renderCell = React.useCallback(
    (record: any, columnKey: React.Key, rowIndex: number) => {
      const cellValue = record[columnKey as keyof any];

      switch (columnKey) {
        case 'no':
          return (page - 1) * rowsPerPage + rowIndex + 1;

        case 'user_id':
          return cellValue?.name || '-';

        case 'product_id':
          return cellValue?.name || '-';

        case 'profit':
          return (
            <Chip
              className={cellValue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              radius="sm"
              size="md"
              variant="solid"
            >
              ₹{cellValue}
            </Chip>
          );

        case 'created_at':
          return getFormattedDate(cellValue);

        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Button
                className="text-gray-500 bg-gray-50"
                radius="full"
                size="sm"
                variant="flat"
                onPress={() => handleView(record._id)}
              >
                <Eye className="w-4 h-4" />
              </Button>

              <Button
                className="text-primary-500 bg-primary-50"
                radius="full"
                size="sm"
                variant="flat"
                onPress={() => handleEdit(record._id)}
              >
                <Pencil className="w-4 h-4" />
              </Button>

              <Button
                className="text-red-500 bg-red-50"
                radius="full"
                size="sm"
                variant="flat"
                onPress={() => {
                  setDeleteId(record._id);
                  handleOpen();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [page]
  );

  const pages = React.useMemo(() => {
    return salesList?.total ? Math.ceil(salesList?.total / rowsPerPage) : 0;
  }, [salesList?.total, rowsPerPage]);

  const loadingState = isLoading ? 'loading' : 'idle';

  return (
    <AnimatedPage>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          {/* Title */}
          {/* <h1 className="text-2xl font-semibold text-gray-800">Sales</h1> */}

          {/* Right section: Search + Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <DatePicker
              showMonthAndYearPickers
              className="w-full sm:w-64"
              selectorButtonPlacement="end"
              value={selectedDate}
              onChange={(value) => setSelectedDate(value)}
            />
            <AppButton endIcon={<PlusIcon />} title="Add Sale" onClick={onAddNotes} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-4 rounded-lg shadow-sm border border-gray-200 ${stat.bg}`}
            >
              <div className="p-2 bg-white rounded-full shadow-sm">{stat.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          ))} */}
          <div
            key={'total_products'}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-sm border border-gray-200 bg-purple-50`}
          >
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Package className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-lg font-semibold">{salesList?.totalProducts || 0}</p>
            </div>
          </div>
          <div
            key={'total_sale'}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-sm border border-gray-200 bg-blue-50`}
          >
            <div className="p-2 bg-white rounded-full shadow-sm">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sale</p>
              <p className="text-lg font-semibold">₹ {salesList?.totalSales || 0}</p>
            </div>
          </div>
          <div
            key={'total_profit'}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-sm border border-gray-200 bg-green-50`}
          >
            <div className="p-2 bg-white rounded-full shadow-sm">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Profit</p>
              <p className="text-lg font-semibold">₹ {salesList?.totalProfit || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              isHeaderSticky
              aria-label="Example table with dynamic content"
              bottomContent={
                pages > 0 ? (
                  <div className="flex w-full justify-center">
                    <Pagination
                      isCompact
                      showControls
                      showShadow
                      color="primary"
                      page={page}
                      total={pages}
                      onChange={onPageChange}
                    />
                  </div>
                ) : null
              }
              // className="max-h-[400px] sm:max-h-[450px] md:max-h-[550px] lg:max-h-[650px] xl:max-h-[500px]"
              className="max-h-[100%] sm:max-h-[500px] md:max-h-[550px] lg:max-h-[650px] xl:max-h-[500px]"
            >
              <TableHeader>
                {columns.map((column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                ))}
              </TableHeader>
              <TableBody
                emptyContent="No Records Found."
                loadingContent={<Spinner />}
                loadingState={loadingState}
              >
                {salesList && salesList?.results?.length ? (
                  <>
                    {salesList.results.map((row: any, index: number) => (
                      <TableRow key={row._id}>
                        {(columnKey) => <TableCell>{renderCell(row, columnKey, index)}</TableCell>}
                      </TableRow>
                    ))}
                  </>
                ) : (
                  []
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* <AppPagination /> */}
      </div>

      {isOpenDelete && (
        <ConfirmDeleteModal isOpen={isOpenDelete} onClose={handleClose} onConfirm={handleDelete} />
      )}
    </AnimatedPage>
  );
};

export default Sales;
