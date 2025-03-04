import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, FileIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ImageUploadProgressProps {
  imageNames: string[];
  uploadProgress: { fileIndex: number; progress: number }[];
}

export default function ImageUploadProgress({
  uploadProgress,
  imageNames,
}: ImageUploadProgressProps) {
  return (
    <>
      {uploadProgress.map((up) => (
        <div key={up.fileIndex} className="p-1">
          <Card className="w-full mb-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FileIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {imageNames?.[up.fileIndex]}
                  </span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  {up.progress === 100 ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    `${Math.round(up.progress)}%`
                  )}
                </span>
              </div>
              <Progress
                value={up.progress}
                className="h-2 transition-all duration-300 ease-in-out"
                style={{
                  background: `linear-gradient(90deg, 
                                var(--primary) 0%, 
                                var(--primary) ${up.progress}%, 
                                var(--muted) ${up.progress}%, 
                                var(--muted) 100%)`,
                }}
              />
            </CardContent>
          </Card>
        </div>
      ))}
    </>
  );
}
