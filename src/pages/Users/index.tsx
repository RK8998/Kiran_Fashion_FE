import React, { useState } from 'react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Pencil, Trash2, PlusIcon, Eye } from 'lucide-react';

import { AnimatedPage } from '@/components/AnimatedPage';
import AppPagination from '@/components/AppPagination';
import AppButton from '@/components/AppButton';

import { useNavigate } from 'react-router-dom';

const dummyUsers = [
  {
    id: 1,
    name: 'Meeting notes',
    email: '@gmail.com',
    phone: 9879854706,
    role: 'User',
    isActive: true,
  },
  {
    id: 2,
    name: 'Meeting notes',
    email: '@gmail.com',
    phone: 9879854706,
    role: 'User',
    isActive: true,
  },
  {
    id: 3,
    name: 'Meeting notes',
    email: '@gmail.com',
    phone: 9879854706,
    role: 'User',
    isActive: true,
  },
  {
    id: 4,
    name: 'Meeting notes',
    email: '@gmail.com',
    phone: 9879854706,
    role: 'User',
    isActive: true,
  },
];

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const onAddNotes = () => navigate('/products/add');

  const handleView = (id: number) => {
    console.log('View:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Edit:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete:', id);
  };

  return (
    <AnimatedPage>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>

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
            <table className="min-w-full divide-y divide-gray-200 text-sm">
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
            </table>
          </div>
        </div>

        <AppPagination />
      </div>
    </AnimatedPage>
  );
};

export default Users;
