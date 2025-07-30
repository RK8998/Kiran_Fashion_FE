import React, { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Pencil, Trash2, PlusIcon, Eye } from 'lucide-react';

import { AnimatedPage } from '@/components/AnimatedPage';
import AppPagination from '@/components/AppPagination';
import AppButton from '@/components/AppButton';

import { useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';

const dummyNotes = [
  { id: 1, title: 'Meeting notes', date: '2025-07-25' },
  { id: 2, title: 'Shopping list', date: '2025-07-20' },
  { id: 3, title: 'Ideas for new app', date: '2025-07-10' },
];

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const handleOpen = () => setIsOpenDelete(true);
  const handleClose = () => setIsOpenDelete(false);

  const onAddNotes = () => navigate('/notes/add');

  const handleView = (id: number) => {
    console.log('View:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Edit:', id);
  };

  const handleDelete = () => {
    console.log('Delete:');
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
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {dummyNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50 transition-all duration-150">
                    <td className="px-6 py-4 font-medium text-gray-800">{note.title}</td>
                    <td className="px-6 py-4 text-gray-500">{note.date}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AppPagination />
      </div>

      <ConfirmDeleteModal isOpen={isOpenDelete} onClose={handleClose} onConfirm={handleDelete} />
    </AnimatedPage>
  );
};

export default Notes;
