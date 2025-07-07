import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadFeedbackStatusOverlayProps {
  uploadStage: 'idle' | 'running' | 'complete' | 'error';
}

export default function UploadFeedbackStatusOverlay({
  uploadStage,
}: UploadFeedbackStatusOverlayProps) {
  return uploadStage === 'complete' || uploadStage === 'error' ? (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-background backdrop-blur-sm rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
          className="mx-auto mb-4"
        >
          {uploadStage === 'complete' ? (
            <CheckCircle className="size-16 text-green-500 mx-auto" />
          ) : (
            <AlertCircle className="size-16 text-red-500 mx-auto" />
          )}
        </motion.div>
        <h3 className="text-xl font-bold mb-2">
          {uploadStage === 'complete' ? 'Upload Complete!' : 'Upload Failed'}
        </h3>
        <p className="text-muted-foreground mb-4">
          {uploadStage === 'complete'
            ? 'Successfully uploaded pattern'
            : 'An error occurred during upload. Please try again.'}
        </p>
      </div>
    </motion.div>
  ) : null;
}
