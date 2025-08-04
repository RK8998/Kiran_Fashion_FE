import React, { useEffect } from 'react';
import { Input, Textarea, Card } from '@heroui/react'; // adjust imports if needed
import { useNavigate, useParams } from 'react-router-dom';

import { Controller, useForm } from 'react-hook-form';
import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';

import { NotesFormTypes } from '@/constants/formTypes';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { mutationOnErrorHandler } from '@/helpers';
import { AppToast, displaySuccessToast } from '@/helpers/toast';
import { createNotesService, getNoteByIdService, updateNotesService } from '@/services/notes';
import { MoveLeftIcon } from 'lucide-react';

const AddEditNotes: React.FC = () => {
  const navigate = useNavigate();
  const { id: noteId } = useParams();

  const isEditMode = Boolean(noteId);

  const onBack = () => navigate(-1);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<NotesFormTypes>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const { mutateAsync: onAddNotes, isPending: isPendingCreate } = useMutation({
    mutationKey: ['add-note'],
    mutationFn: async (data: NotesFormTypes) => {
      const response = await createNotesService(data);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      navigate('/notes');
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const { mutateAsync: onUpdateNotes, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['update-note'],
    mutationFn: async (data: NotesFormTypes) => {
      if (!noteId) throw new Error('noteId is undefined');

      const response = await updateNotesService(noteId, data);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      navigate('/notes');
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const onSubmit = async (data: NotesFormTypes) => {
    if (!isEditMode) {
      AppToast(onAddNotes(data), 'Notes adding in progress');
    } else {
      AppToast(onUpdateNotes(data), 'Notes update in progress');
    }
  };

  const { data: noteData } = useQuery({
    queryKey: ['notes', 'data', noteId],
    queryFn: async () => {
      if (!noteId) throw new Error('noteId is undefined');
      const params = {};
      const response = await getNoteByIdService(noteId, params);

      return response?.data?.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (noteData) {
      const { title, description } = noteData;

      reset({
        title,
        description,
      });
    }
  }, [noteData]);

  return (
    <AnimatedPage>
      {/* <div className="max-w-2xl mx-auto p-4"> */}
      <div className="min-w-full mx-auto p-4">
        <Card className="p-6 shadow-sm rounded-2xl">
          <div className="flex gap-2 justify-start items-center mb-6">
            <MoveLeftIcon className="cursor-pointer" onClick={onBack} />

            <h2 className="text-2xl font-semibold text-gray-800">
              {isEditMode ? 'Edit' : 'Create'} Note
            </h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Title
              </label>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.title && errors.title.message}
                    id="title"
                    isInvalid={!!errors.title}
                    placeholder="Enter note title"
                    radius="lg"
                    type="text"
                  />
                )}
                rules={{ required: 'Title is required' }}
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Description
              </label>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    required
                    errorMessage={errors.description && errors.description.message}
                    id="description"
                    isInvalid={!!errors.description}
                    placeholder="Write your note here..."
                    radius="lg"
                    rows={5}
                  />
                )}
                rules={{
                  required: 'Description is required',
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="text-right flex gap-2 justify-end">
              <AppButton color="secondary" title="Back" type="button" onClick={onBack} />
              <AppButton
                color="primary"
                isLoading={isPendingCreate || isPendingUpdate}
                title={isEditMode ? 'Update' : 'Save Note'}
                type="submit"
              />
            </div>
          </form>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default AddEditNotes;
