import React, { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Pencil, Trash2, PlusIcon, Eye, LockIcon } from 'lucide-react';
import { AxiosError } from 'axios';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Switch,
} from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { deleteUsersService, getUsersListService, updateUsersService } from '@/services/user';
import useDebounce from '@/hooks/useDebounce';
import { AppToast, displaySuccessToast } from '@/helpers/toast';
import { getFormattedDate, mutationOnErrorHandler } from '@/helpers';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

export const columns = [
  { name: 'NO', uid: 'no' },
  { name: 'NAME', uid: 'name' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'PHONE', uid: 'phone' },
  { name: 'ROLE', uid: 'role' },
  { name: 'STATUS', uid: 'isActive' },
  { name: 'ACTIONS', uid: 'actions' },
];

export type UserStatusTypes = {
  isActive: boolean;
};

const Users: React.FC = () => {
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

  const onAddNotes = () => navigate('/users/add');

  const {
    data: usersList,
    isLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['users', 'list', { page, search: debounceSearch }],
    queryFn: async () => {
      const params = {
        page,
        rows: rowsPerPage,
        search: debounceSearch,
      };
      const response = await getUsersListService(params);

      return response?.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: onDeleteUser } = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: async () => {
      const response = await deleteUsersService(deleteId);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      refetchUsers();
      handleClose();
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const { mutateAsync: onUpdateUsers } = useMutation({
    mutationKey: ['update-user'],
    mutationFn: async ({ userId, data }: { userId: string; data: UserStatusTypes }) => {
      if (!userId) throw new Error('userId is undefined');

      const response = await updateUsersService(userId, data);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      refetchUsers();
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const handleView = (id: number) => {
    navigate(`/users/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`edit/${id}`);
  };

  const handleStatus = (e: React.ChangeEvent<HTMLInputElement>, user: Record<string, any>) => {
    const updatedUser: UserStatusTypes = { isActive: e?.target?.checked };

    AppToast(
      onUpdateUsers({ userId: user._id, data: updatedUser }),
      'User status update in progress'
    );
  };

  const handleChangePassword = (id: number) => {
    navigate(`change-password/${id}`);
  };

  const handleDelete = () => {
    AppToast(onDeleteUser(), 'Delete user in progress');
  };

  const renderCell = React.useCallback(
    (record: any, columnKey: React.Key, rowIndex: number) => {
      const cellValue = record[columnKey as keyof any];

      switch (columnKey) {
        case 'no':
          return (page - 1) * rowsPerPage + rowIndex + 1;

        case 'created_at':
          return getFormattedDate(cellValue);

        case 'isActive':
          return (
            <Switch
              color="primary"
              isSelected={cellValue}
              onChange={(e) => handleStatus(e, record)}
            />
          );

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

              <Button
                className="text-yellow-500 bg-yellow-50"
                radius="full"
                size="sm"
                variant="flat"
                onPress={() => handleChangePassword(record._id)}
              >
                <LockIcon className="w-4 h-4" />
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
    return usersList?.total ? Math.ceil(usersList?.total / rowsPerPage) : 0;
  }, [usersList?.total, rowsPerPage]);

  const loadingState = isLoading ? 'loading' : 'idle';

  return (
    <AnimatedPage>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          {/* <h1 className="text-2xl font-semibold text-gray-800">Users</h1> */}

          {/* Right section: Search + Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Input
              className="w-full sm:w-64"
              placeholder="Search users..."
              radius="lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AppButton endIcon={<PlusIcon />} title="Add User" onClick={onAddNotes} />
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
                {usersList && usersList?.results?.length
                  ? usersList?.results?.map((row: any, index: number) => (
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
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Phone</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {dummyUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-all duration-150">
                    <td className="px-6 py-4">{index + 1}.</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">{user.isActive ? 'Active' : 'Inactive'}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        className="text-gray-500 bg-gray-50"
                        radius="full"
                        size="sm"
                        variant="flat"
                        onPress={() => handleView(user.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        className="text-primary-500 bg-primary-50"
                        radius="full"
                        size="sm"
                        variant="flat"
                        onPress={() => handleEdit(user.id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        className="text-red-500 bg-red-50"
                        radius="full"
                        size="sm"
                        variant="flat"
                        onPress={() => handleDelete(user.id)}
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

export default Users;
