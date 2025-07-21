import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { Unauthorized } from '../Auth/Unauthorized';
import { PageNotFound } from '../Auth/PageNotFound';

import { AnimatedPage } from '@/components/AnimatedPage';

import ErrorImageSlot from '@/components/ErrorImageSlot';
import ErrorImage from '@/assets/images/error.svg';
import AppButton from '@/components/AppButton';

export function RouterErrorElement() {
  const error = useRouteError();

  // react-router error response (e.g., loader/action thrown responses)
  if (isRouteErrorResponse(error)) {
    const status = error.status;

    if (status === 404) {
      return <PageNotFound />;
    }

    if (status === 401 || status === 403) {
      return <Unauthorized />;
    }

    return (
      <AnimatedPage>
        <div className="w-full max-w-lg mx-auto text-center py-20 px-4">
          <ErrorImageSlot imageSrc={ErrorImage} alt="Route error" />
          <h2 className="text-2xl font-semibold mb-2">Route Error {status}</h2>
          <p className="text-gray-600 mb-8">{error.statusText || 'Something went wrong.'}</p>
          <AppButton title="Try Again" onClick={() => window.location.reload()} />
        </div>
      </AnimatedPage>
    );
  }

  // unknown error
  const message = error instanceof Error ? error.message : 'Unknown error';

  return (
    <AnimatedPage>
      <div className="w-full max-w-lg mx-auto text-center py-20 px-4">
        <ErrorImageSlot imageSrc={ErrorImage} alt="Unknown error" />
        <h2 className="text-2xl font-semibold mb-2">Unexpected Error</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        <AppButton title="Try Again" onClick={() => window.location.reload()} />
      </div>
    </AnimatedPage>
  );
}
