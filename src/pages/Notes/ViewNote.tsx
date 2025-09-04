import React from 'react';
import { Card } from '@heroui/react'; // adjust imports if needed
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { getNoteByIdService } from '@/services/notes';
// import { ArrowLeft } from 'lucide-react';

const ViewNote: React.FC = () => {
  const navigate = useNavigate();
  const { id: noteId } = useParams();

  const onBack = () => navigate(-1);

  const { data: noteData } = useQuery({
    queryKey: ['notes', 'data', noteId],
    queryFn: async () => {
      if (!noteId) throw new Error('noteId is undefined');
      const params = {};
      const response = await getNoteByIdService(noteId, params);

      return response?.data?.data;
    },
    enabled: Boolean(noteId),
  });

  return (
    <AnimatedPage>
      <div className="min-w-full mx-auto p-4">
        <Card className="p-6 shadow-sm rounded-2xl">
          <div className="flex gap-2 justify-start items-center mb-6">
            {/* <ArrowLeft className="cursor-pointer" onClick={onBack} /> */}

            {/* <h2 className="text-2xl font-semibold text-gray-800">View Note</h2> */}
          </div>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Title Block */}
            <div>
              <p className="text-sm font-medium text-gray-500">Title</p>
              <div className="text-lg text-gray-800 mt-1">{noteData?.title || '-'}</div>
            </div>

            {/* Description Block */}
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                {noteData?.description || '-'}
              </div>
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

export default ViewNote;
