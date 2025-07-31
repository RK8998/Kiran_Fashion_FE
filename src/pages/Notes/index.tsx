import React, { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Pencil, Trash2, PlusIcon, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { AnimatedPage } from '@/components/AnimatedPage';
import AppPagination from '@/components/AppPagination';
import AppButton from '@/components/AppButton';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import { getNotesListService } from '@/services/notes';
import { getFormattedDate } from '@/helpers';
import useDebounce from '@/hooks/useDebounce';
import EmptyState from '@/components/EmptyState';

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const debounceSearch = useDebounce(search);

  const [page, setPage] = useState(1);

  const onPageChange = (page: number) => setPage(page);

  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const handleOpen = () => setIsOpenDelete(true);
  const handleClose = () => setIsOpenDelete(false);

  const onAddNotes = () => navigate('/notes/add');

  const { data: notesList } = useQuery({
    queryKey: ['notes', 'list', { page, search: debounceSearch }],
    queryFn: async () => {
      const params = {
        page,
        rows: 10,
        search: debounceSearch,
      };
      const response = await getNotesListService(params);

      return response?.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  const handleView = (id: number) => {
    // console.log('View:', id);
  };

  const handleEdit = (id: number) => {
    // console.log('Edit:', id);
  };

  const handleDelete = () => {
    // console.log('Delete:');
  };

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
            <table className="min-w-full divide-y divide-gray-200 text-sm">
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
                          onPress={() => handleView(note.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Button
                          className="text-primary-500 bg-primary-50"
                          radius="full"
                          size="sm"
                          variant="flat"
                          onPress={() => handleEdit(note.id)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Button
                          className="text-red-500 bg-red-50"
                          radius="full"
                          size="sm"
                          variant="flat"
                          onPress={() => handleOpen()}
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
            </table>
          </div>
        </div>

        <AppPagination
          currentPage={page}
          totalRecords={notesList?.total}
          onPageChange={onPageChange}
        />
      </div>

      <ConfirmDeleteModal isOpen={isOpenDelete} onClose={handleClose} onConfirm={handleDelete} />
    </AnimatedPage>
  );
};

export default Notes;
