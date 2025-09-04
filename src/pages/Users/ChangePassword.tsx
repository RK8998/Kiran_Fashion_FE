import { Input } from '@heroui/input';
import { Card } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ArrowLeft, Eye, EyeClosed } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { mutationOnErrorHandler } from '@/helpers';
import { changePasswordService } from '@/services/user';
import AppButton from '@/components/AppButton';
import { ApiChangePasswordFormTypes, ChangePasswordFormTypes } from '@/constants/formTypes';
import { AppToast, displaySuccessToast } from '@/helpers/toast';
import { AnimatedPage } from '@/components/AnimatedPage';
import { useState } from 'react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [isVisibleNewPass, setIsVisibleNewPass] = useState(false);
  const toggleVisibilityNewPass = () => setIsVisibleNewPass(!isVisibleNewPass);

  const [isVisibleConPass, setIsVisibleConPass] = useState(false);
  const toggleVisibilityConPass = () => setIsVisibleConPass(!isVisibleConPass);

  const onBack = () => navigate(-1);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChangePasswordFormTypes>({
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  });

  const { mutateAsync: ChangePassword, isPending: isPendingCreate } = useMutation({
    mutationKey: ['change-password'],
    mutationFn: async (data: ApiChangePasswordFormTypes) => {
      const response = await changePasswordService(data);

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

  const onSubmit = async (data: ChangePasswordFormTypes) => {
    const payload = {
      password: data.new_password,
      user_id: userId,
    };

    AppToast(ChangePassword(payload), 'change passwords in progress');
  };

  return (
    <AnimatedPage>
      {/* <div className="max-w-2xl mx-auto p-4"> */}
      <div className="min-w-full mx-auto p-4">
        <Card className="p-6 shadow-sm rounded-2xl">
          <div className="flex gap-2 justify-start items-center mb-6">
            {/* <ArrowLeft className="cursor-pointer" onClick={onBack} /> */}

            {/* <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2> */}
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* New Password Field */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                New Password
              </label>
              <Controller
                control={control}
                name="new_password"
                render={({ field }) => (
                  <Input
                    {...field}
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-solid outline-transparent"
                        type="button"
                        onClick={toggleVisibilityNewPass}
                      >
                        {isVisibleNewPass ? (
                          <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    errorMessage={errors.new_password && errors.new_password.message}
                    id="new_password"
                    isInvalid={!!errors.new_password}
                    placeholder="Enter new password."
                    radius="lg"
                    type={isVisibleNewPass ? 'text' : 'password'}
                  />
                )}
                rules={{ required: 'New Password is required' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Confirm Password
              </label>
              <Controller
                control={control}
                name="confirm_password"
                render={({ field }) => (
                  <Input
                    {...field}
                    endContent={
                      <button
                        aria-label="toggle password visibility"
                        className="focus:outline-solid outline-transparent"
                        type="button"
                        onClick={toggleVisibilityConPass}
                      >
                        {isVisibleConPass ? (
                          <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    errorMessage={errors.confirm_password && errors.confirm_password.message}
                    id="confirm_password"
                    isInvalid={!!errors.confirm_password}
                    placeholder="Enter confirm password."
                    radius="lg"
                    type={isVisibleConPass ? 'text' : 'password'}
                  />
                )}
                rules={{ required: 'Confirm Password is required' }}
              />
            </div>

            {/* Submit Button */}
            <div className="text-right flex gap-2 justify-end flex-col-reverse md:flex-row">
              <AppButton color="secondary" title="Back" type="button" onClick={onBack} />
              <AppButton color="primary" isLoading={isPendingCreate} title={'Save'} type="submit" />
            </div>
          </form>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default ChangePassword;
