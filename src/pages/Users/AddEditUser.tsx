import React, { useEffect } from 'react';
import { Input, Card } from '@heroui/react'; // adjust imports if needed
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';

import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { UserFormTypes } from '@/constants/formTypes';
import { mutationOnErrorHandler } from '@/helpers';
import { AppToast, displaySuccessToast } from '@/helpers/toast';
import { createUsersService, getUserByIdService, updateUsersService } from '@/services/user';

const AddEditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const isEditMode = Boolean(userId);

  const onBack = () => navigate(-1);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UserFormTypes>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const { mutateAsync: onAddUser, isPending: isPendingCreate } = useMutation({
    mutationKey: ['add-user'],
    mutationFn: async (data: UserFormTypes) => {
      const response = await createUsersService(data);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      navigate('/users');
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const { mutateAsync: onUpdateUsers, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['update-user'],
    mutationFn: async (data: UserFormTypes) => {
      if (!userId) throw new Error('userId is undefined');

      const response = await updateUsersService(userId, data);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      navigate('/users');
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const onSubmit = async (data: UserFormTypes) => {
    if (!isEditMode) {
      AppToast(onAddUser(data), 'User adding in progress');
    } else {
      AppToast(onUpdateUsers(data), 'User update in progress');
    }
  };

  const { data: userData } = useQuery({
    queryKey: ['user', 'data', userId],
    queryFn: async () => {
      if (!userId) throw new Error('user is undefined');
      const params = {};
      const response = await getUserByIdService(userId, params);

      return response?.data?.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (userData) {
      const { name, email, phone } = userData;

      reset({
        name,
        email,
        phone,
      });
    }
  }, [userData]);

  return (
    <AnimatedPage>
      {/* <div className="max-w-2xl mx-auto p-4"> */}
      <div className="min-w-full mx-auto p-4">
        <Card className="p-6 shadow-sm rounded-2xl">
          <div className="flex gap-2 justify-start items-center mb-6">
            {/* <ArrowLeft className="cursor-pointer" onClick={onBack} /> */}

            {/* <h2 className="text-2xl font-semibold text-gray-800">
              {isEditMode ? 'Edit' : 'Create'} User
            </h2> */}
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Name
              </label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.name && errors.name.message}
                    id="name"
                    isInvalid={!!errors.name}
                    placeholder="Enter name"
                    radius="lg"
                    type="text"
                  />
                )}
                rules={{ required: 'Name is required' }}
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Email
              </label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.email && errors.email.message}
                    id="email"
                    isInvalid={!!errors.email}
                    placeholder="Enter email address"
                    radius="lg"
                    type="text"
                  />
                )}
                rules={{
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/, message: 'Invalid email format' },
                }}
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Phone
              </label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.phone && errors.phone.message}
                    id="phone"
                    isInvalid={!!errors.phone}
                    placeholder="Enter user phone"
                    radius="lg"
                    type="number"
                  />
                )}
                rules={{
                  required: 'Phone number is required',
                  validate: {
                    isValidPhone: (value) => {
                      if (!value) return false;

                      const cleanedValue = value.replace(/\D/g, '');

                      if (cleanedValue.length !== 10) {
                        return 'Phone number must be 10 digits';
                      }

                      const isAllSameDigit = cleanedValue
                        .split('')
                        .every((digit) => digit === cleanedValue[0]);

                      if (isAllSameDigit) {
                        return 'Phone number must be a valid number';
                      }

                      return true;
                    },
                  },
                }}
              />
            </div>

            {/* Password Field */}
            {!isEditMode ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                  Password
                </label>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      errorMessage={errors.password && errors.password.message}
                      id="password"
                      isInvalid={!!errors.password}
                      placeholder="Enter note title"
                      radius="lg"
                      type="password"
                    />
                  )}
                  rules={{ required: 'Password is required' }}
                />
              </div>
            ) : null}

            {/* Submit Button */}
            <div className="text-right flex gap-2 justify-end flex-col-reverse md:flex-row">
              <AppButton color="secondary" title="Back" type="button" onClick={onBack} />
              <AppButton
                color="primary"
                isLoading={isPendingCreate || isPendingUpdate}
                title={isEditMode ? 'Update' : 'Save User'}
                type="submit"
              />
            </div>
          </form>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default AddEditUser;
