import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import ErrorImageSlot from '@/components/ErrorImageSlot';
import NotFoundImage from '@/assets/images/404.svg';
import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';

export interface ErrorPageProps {
  title?: string;
  message?: string;
  children?: ReactNode; // allow custom extra UI
}

export function PageNotFound({
  title = 'Page Not Found',
  message = 'The page you are looking for doesn’t exist or has been moved.',
  children,
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="w-full max-w-lg mx-auto text-center py-20 px-4">
        <ErrorImageSlot alt="404 illustration" imageSrc={NotFoundImage} />
        <h1 className="text-4xl font-bold mb-2 text-primary">404</h1>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        {children}
        <div className="flex flex-wrap justify-center gap-3">
          <AppButton title="Go Home" onClick={() => navigate('/', { replace: true })} />
          <AppButton color="default" title="Go Back" onClick={() => navigate(-1)} />
        </div>
      </div>
    </AnimatedPage>
  );
}
