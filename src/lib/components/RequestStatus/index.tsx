import React from 'react';

interface RequestStatusProps {
  isSuccess: boolean;
  isError: boolean;
  successMessage?: string | React.ReactNode;
  errorMessage?: string | React.ReactNode;
}

const RequestStatus: React.FunctionComponent<RequestStatusProps> = ({
  isSuccess,
  isError,
  successMessage = 'Everything fine!',
  errorMessage = 'Something went wrong!',
}) => {
  return (
    <>
      {isSuccess ? <p className="text-green-500 text-left">{successMessage}</p> : null}
      {isError ? <p className="text-red-500 text-left">{errorMessage}</p> : null}
    </>
  );
};

export default RequestStatus;
