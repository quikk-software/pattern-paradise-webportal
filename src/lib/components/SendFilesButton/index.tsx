import React from 'react';
import { Button } from '@/components/ui/button';
import { useSendPatterns } from '@/lib/api/pattern';
import RequestStatus from '@/lib/components/RequestStatus';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import { Mail } from 'lucide-react';

interface SendFilesButtonProps {
  productId?: string;
  language?: string;
  channel?: string;
}

const SendFilesButton: React.FunctionComponent<SendFilesButtonProps> = ({
  channel,
  productId,
  language,
}) => {
  const {
    mutate: sendPatterns,
    isLoading: sendPatternsIsLoading,
    isSuccess: sendPatternsIsSuccess,
    isError: sendPatternsIsError,
    errorDetail,
  } = useSendPatterns();

  const handleSendPatterns = (productId: string, language: string, channel: string) => {
    sendPatterns(productId, language, channel).then();
  };

  const disabled = !productId || !language || !channel;

  return (
    <div className="flex flex-col gap-2">
      <Button
        disabled={sendPatternsIsLoading || sendPatternsIsSuccess || disabled}
        onClick={() => {
          if (disabled) {
            return;
          }
          handleSendPatterns(productId, language, channel);
        }}
      >
        {sendPatternsIsLoading ? (
          <LoadingSpinnerComponent size="sm" className="text-white" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Send files via mail
      </Button>
      <RequestStatus
        isSuccess={sendPatternsIsSuccess}
        isError={sendPatternsIsError}
        successMessage={"We've sent the pattern to your mail. Please also check your spam folder."}
        errorMessage={errorDetail}
      />
    </div>
  );
};

export default SendFilesButton;
