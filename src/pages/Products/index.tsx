import React, { useState } from 'react';
import { Input } from '@heroui/input';
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
} from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { AnimatedPage } from '@/components/AnimatedPage';
import AppButton from '@/components/AppButton';
import useDebounce from '@/hooks/useDebounce';
import { deleteProductsService, getProductsListService } from '@/services/products';
import { AppToast, displaySuccessToast } from '@/helpers/toast';
import { getFormattedDate, mutationOnErrorHandler } from '@/helpers';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export const columns = [
  { name: 'NO', uid: 'no' },
  { name: 'NAME', uid: 'name' },
  { name: 'REMARK', uid: 'remark' },
  { name: 'ACTIONS', uid: 'actions' },
];

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const debounceSearch = useDebounce(search);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const onPageChange = (page: number) => setPage(page);

  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const handleOpen = () => setIsOpenDelete(true);
  const handleClose = () => setIsOpenDelete(false);

  const onAddNotes = () => navigate('/products/add');

  const {
    data: productsList,
    isLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['products', 'list', { page, search: debounceSearch }],
    queryFn: async () => {
      const params = {
        page,
        rows: rowsPerPage,
        search: debounceSearch,
      };
      const response = await getProductsListService(params);

      return response?.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: onDeleteProduct } = useMutation({
    mutationKey: ['delete-product'],
    mutationFn: async () => {
      const response = await deleteProductsService(deleteId);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      refetchProducts();
      handleClose();
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const handleView = (id: number) => {
    navigate(`/products/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`edit/${id}`);
  };

  const handleDelete = () => {
    AppToast(onDeleteProduct(), 'Delete user in progress');
  };

  const renderCell = React.useCallback(
    (record: any, columnKey: React.Key, rowIndex: number) => {
      const cellValue = record[columnKey as keyof any];

      switch (columnKey) {
        case 'no':
          return (page - 1) * rowsPerPage + rowIndex + 1;

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
    return productsList?.total ? Math.ceil(productsList?.total / rowsPerPage) : 0;
  }, [productsList?.total, rowsPerPage]);

  const loadingState = isLoading ? 'loading' : 'idle';

  return (
    <AnimatedPage>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>

          {/* Right section: Search + Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Input
              className="w-full sm:w-64"
              placeholder="Search products..."
              radius="lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AppButton endIcon={<PlusIcon />} title="Add Product" onClick={onAddNotes} />
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
              className="max-h-[400px] sm:max-h-[450px] md:max-h-[550px] lg:max-h-[650px] xl:max-h-[500px]"
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
                {productsList && productsList?.results?.length
                  ? productsList?.results?.map((row: any, index: number) => (
                      <TableRow key={row.key}>
                        {(columnKey) => <TableCell>{renderCell(row, columnKey, index)}</TableCell>}
                      </TableRow>
                    ))
                  : []}
              </TableBody>
            </Table>

            {/* <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-primary-50 from-purple-50 to-indigo-50 text-primary-600 font-semibold text-sm">
                <tr>
                  <th className="px-6 py-4 text-left">No.</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Remark</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {dummyProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-all duration-150">
                    <td className="px-6 py-4 font-normal text-gray-800">{index + 1}.</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-gray-500">{product.remark}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        className="text-gray-500 bg-gray-50"
                        radius="full"
                        size="sm"
                        variant="flat"
                        onPress={() => handleView(product.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        className="text-primary-500 bg-primary-50"
                        radius="full"
                        size="sm"
                        variant="flat"
                        onPress={() => handleEdit(product.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        className="text-red-500 bg-red-50"
                        radius="full"
                        size="sm"
                        variant="flat"
                        onPress={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
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

export default Products;
