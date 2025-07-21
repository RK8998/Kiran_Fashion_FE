import React from 'react';

const ErrorImageSlot: React.FC<{ imageSrc?: string; alt: string }> = ({ imageSrc, alt }) => {
  if (imageSrc) {
    return (
      <img
        alt={alt}
        className="mx-auto mb-8 max-h-75 w-auto select-none pointer-events-none"
        src={imageSrc}
      />
    );
  }

  return null;
};

export default ErrorImageSlot;
