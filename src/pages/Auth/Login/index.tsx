import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';

import AppButton from '@/components/AppButton';
import LoginImage from '@/assets/images/login.svg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary-100 via-rose-50 to-primary-100 px-4">
      <div className="flex w-full max-w-6xl shadow-lg rounded-3xl overflow-hidden bg-white bg-opacity-80 backdrop-blur-lg">
        {/* Left */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-8 bg-primary-50">
          <div className="text-center space-y-4">
            <img alt="Login visual" className="max-w-xs mx-auto" src={LoginImage} />
            <h1 className="text-3xl font-bold text-primary-600">Kiran Fashion</h1>
            <p className="text-gray-500">Your favorite fashion destination</p>
          </div>
        </div>

        {/* Right - Login Card */}
        <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
          <Card className="w-full max-w-md border border-gray-200 shadow-xl rounded-2xl">
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back 👋</h2>
              {/* <p className="text-sm text-gray-500 mt-1">Please login to your account</p> */}
            </CardHeader>
            <CardBody className="space-y-5 px-6 pb-6">
              <div>
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  placeholder="example@domain.com"
                  radius="lg"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  radius="lg"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <AppButton color="primary" size="lg" title="Sign In" onClick={handleLogin} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
