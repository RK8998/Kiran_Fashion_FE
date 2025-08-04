import React, { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Pencil, Trash2, PlusIcon, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
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
import { AxiosError } from 'axios';

import { AnimatedPage } from '@/components/AnimatedPage';
// import AppPagination from '@/components/AppPagination';
import AppButton from '@/components/AppButton';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { deleteNotesService, getNotesListService } from '@/services/notes';
import { getFormattedDate, mutationOnErrorHandler } from '@/helpers';
import useDebounce from '@/hooks/useDebounce';
// import EmptyState from '@/components/EmptyState';
import { AppToast, displaySuccessToast } from '@/helpers/toast';

export const columns = [
  { name: 'No', uid: 'no' },
  { name: 'TITLE', uid: 'title' },
  { name: 'DESCRIPTION', uid: 'description' },
  { name: 'DATE', uid: 'created_at' },
  { name: 'ACTIONS', uid: 'actions' },
];

const Notes: React.FC = () => {
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

  const onAddNotes = () => navigate('/notes/add');

  const {
    data: notesList,
    isLoading,
    refetch: refetchNotes,
  } = useQuery({
    queryKey: ['notes', 'list', { page, search: debounceSearch }],
    queryFn: async () => {
      const params = {
        page,
        rows: rowsPerPage,
        search: debounceSearch,
      };
      const response = await getNotesListService(params);

      return response?.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  const { mutateAsync: onDeleteNote } = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: async () => {
      const response = await deleteNotesService(deleteId);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      refetchNotes();
      handleClose();
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const handleView = (id: number) => {
    navigate(`/notes/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`edit/${id}`);
  };

  const handleDelete = () => {
    AppToast(onDeleteNote(), 'Delete Notes in progress');
  };

  const renderCell = React.useCallback((record: any, columnKey: React.Key, rowIndex: number) => {
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
  }, []);

  const pages = React.useMemo(() => {
    return notesList?.total ? Math.ceil(notesList?.total / rowsPerPage) : 0;
  }, [notesList?.total, rowsPerPage]);

  const loadingState = isLoading ? 'loading' : 'idle';

  return (
    <AnimatedPage>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800">Notes</h1>

          {/* Right section: Search + Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Input
              className="w-full sm:w-64"
              placeholder="Search notes..."
              radius="lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <AppButton endIcon={<PlusIcon />} title="Add Note" onClick={onAddNotes} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table
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
                {notesList && notesList?.results?.length
                  ? notesList?.results?.map((row: any, index: number) => (
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
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Description</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {notesList && notesList?.results?.length ? (
                  notesList?.results?.map((note: { [key: string]: any }, index: number) => (
                    <tr key={note.id} className="hover:bg-gray-50 transition-all duration-150">
                      <td className="px-6 py-4">{index + 1}.</td>
                      <td className="px-6 py-4">{note.title}</td>
                      <td className="px-6 py-4">{note.description}</td>
                      <td className="px-6 py-4">{getFormattedDate(note.created_at)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          className="text-gray-500 bg-gray-50"
                          radius="full"
                          size="sm"
                          variant="flat"
                          onPress={() => handleView(note._id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          className="text-primary-500 bg-primary-50"
                          radius="full"
                          size="sm"
                          variant="flat"
                          onPress={() => handleEdit(note._id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          className="text-red-500 bg-red-50"
                          radius="full"
                          size="sm"
                          variant="flat"
                          onPress={() => {
                            setDeleteId(note._id);
                            handleOpen();
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyState colSpan={5} />
                )}
              </tbody>
            </table> */}
          </div>
        </div>

        {/* <AppPagination
          currentPage={page}
          totalRecords={notesList?.total}
          onPageChange={onPageChange}
        /> */}
      </div>

      {isOpenDelete && (
        <ConfirmDeleteModal isOpen={isOpenDelete} onClose={handleClose} onConfirm={handleDelete} />
      )}
    </AnimatedPage>
  );
};

export default Notes;
