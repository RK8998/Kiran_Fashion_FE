import { Button } from 'antd';
import { Link, useRouteError } from 'react-router-dom';
import ErrorImage from '../../assets/images/error.png';

function ErrorBoundary() {
  let error = useRouteError();

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          gap: '20px',
        }}
      >
        <div style={{ width: '100%' }}>
          <h1 className="mb-2.5">500</h1>
          <h5 className="m-0 text-xl">Internal server error 👨🏻‍💻</h5>
          <img
            src={ErrorImage}
            alt="Error"
            style={{
              maxWidth: '90%', // Ensures it fits within the viewport width
              maxHeight: '70vh', // Ensures it doesn't overflow the viewport height
              objectFit: 'contain', // Maintains the aspect ratio
              margin: '0 auto', // Centers the image
            }}
          />
        </div>
        <Button type="primary" href="/" component={Link} className="px-5.5">
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
