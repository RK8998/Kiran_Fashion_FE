import { Button } from '@heroui/button';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorImageSlot from '@/components/ErrorImageSlot';
import { AnimatedPage } from '@/components/AnimatedPage';

export interface ErrorPageProps {
  title?: string;
  message?: string;
  imageSrc?: string; // optional: path to PNG / SVG
  children?: ReactNode; // allow custom extra UI
}

export function Unauthorized({
  title = 'Unauthorized',
  message = 'You don’t have permission to view this page.',
  imageSrc,
  children,
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="w-full max-w-lg mx-auto text-center py-20 px-4">
        <ErrorImageSlot imageSrc={imageSrc} alt="401 illustration" />
        <h1 className="text-4xl font-bold mb-2 text-warning">401</h1>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        {children}
        <div className="flex flex-wrap justify-center gap-3">
          <Button color="primary" onPress={() => navigate('/', { replace: true })}>
            Go Home
          </Button>
          <Button variant="flat" onPress={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </AnimatedPage>
  );
}
