import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import AppButton from '@/components/AppButton';
import LoginImage from '@/assets/images/login.svg';
import { loginService } from '@/services/auth';
import { mutationOnErrorHandler } from '@/helpers';
import { AUTH_TOKEN, localStorageHandler } from '@/helpers/storage';
import { AppToast } from '@/helpers/toast';
import { LoginFormTypes } from '@/constants/formTypes';

const APP_NAME = import.meta.env.VITE_APP_NAME;

const LoginPage = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormTypes>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync: onLoginHandler, isPending } = useMutation({
    mutationKey: ['auth-login'],
    mutationFn: async (data: LoginFormTypes) => {
      const response = await loginService(data);

      return response;
    },
    onSuccess: (response) => {
      const authToken = response?.data?.data?.token;

      localStorageHandler('SET', AUTH_TOKEN, authToken);
      navigate('/', { replace: true });
    },
    onError: (error) => {
      console.log('🧑‍💻 || :46 || error:', error);
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const onSubmit = async (data: LoginFormTypes) => {
    AppToast(onLoginHandler(data), 'Login in process');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary-100 via-rose-50 to-primary-100 px-4">
      <div className="flex w-full max-w-6xl rounded-3xl overflow-hidden bg-white bg-opacity-80 backdrop-blur-lg">
        {/* Left */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-8 bg-primary-50">
          <div className="text-center space-y-4">
            <img alt="Login visual" className="max-w-xs mx-auto" src={LoginImage} />
            <h1 className="text-3xl font-bold text-primary-600">{APP_NAME.split('_').join(' ')}</h1>
            <p className="text-gray-500">Your favorite fashion destination</p>
          </div>
        </div>

        {/* Right - Login Card */}
        <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md border border-gray-200 shadow-xl rounded-2xl">
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Kiran Fashion</h2>
              {/* <p className="text-sm text-gray-500 mt-1">Please login to your account</p> */}
            </CardHeader>
            <CardBody className="space-y-5 px-6 pb-6">
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <div>
                  <label htmlFor="email">Email</label>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.email && errors.email.message}
                        id="email"
                        isInvalid={!!errors.email}
                        placeholder="example@domain.com"
                        radius="lg"
                        type="email"
                      />
                    )}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    }}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password">Password</label>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.password && errors.password.message}
                        id="password"
                        isInvalid={!!errors.password}
                        placeholder="Enter your password"
                        radius="lg"
                        type="password"
                      />
                    )}
                    rules={{ required: 'Password is required' }}
                  />
                </div>

                <AppButton
                  color="primary"
                  isLoading={isPending}
                  size="lg"
                  title="Sign In"
                  type="submit"
                />
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
