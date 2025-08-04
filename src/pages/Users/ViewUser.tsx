import React from 'react';
import { Card, Chip } from '@heroui/react'; // adjust imports if needed
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { getUserByIdService } from '@/services/user';

const ViewUser: React.FC = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const onBack = () => navigate(-1);

  const { data: userData } = useQuery({
    queryKey: ['users', 'data', userId],
    queryFn: async () => {
      if (!userId) throw new Error('noteId is undefined');
      const params = {};
      const response = await getUserByIdService(userId, params);

      return response?.data?.data;
    },
    enabled: Boolean(userId),
  });

  return (
    <AnimatedPage>
      <div className="min-w-full mx-auto p-4">
        <Card className="p-6 shadow-lg rounded-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">View User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <div className="text-lg text-gray-800 mt-1">{userData?.name || '-'}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                {userData?.email || '-'}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                {userData?.phone || '-'}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Role</p>
              <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                {userData?.role || '-'}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              {/* <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                {userData?.email || '-'}
              </div> */}

              <Chip
                className="capitalize"
                color={userData?.isActive ? 'success' : 'danger'}
                size="sm"
                variant="flat"
              >
                {userData?.isActive ? 'Active' : 'Inactive'}
              </Chip>
            </div>
          </div>
          {/* Submit Button */}
          <div className="text-right flex gap-2 justify-end">
            <AppButton color="secondary" title="Back" type="button" onClick={onBack} />
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default ViewUser;
