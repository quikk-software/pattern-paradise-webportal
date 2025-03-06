'use client';

import React, { useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Cloud, FileIcon, Loader2, Upload } from 'lucide-react';
import { PDFFile } from '@/components/product-form';
import UploadFeedbackStatusOverlay from '@/lib/components/UploadFeedbackStatusOverlay';

type CloudinaryFile = { url: string; name: string; status?: string; progress?: number };

type UploadFeedbackProps = {
  uploadStage: 'idle' | 'running' | 'complete' | 'error';
  images: CloudinaryFile[];
  patterns: PDFFile[];
  cloudinaryProgress: number;
  backendProgress: number;
  overallProgress: number;
  setOverallProgress: React.Dispatch<React.SetStateAction<number>>;
};

export default function UploadFeedback({
  uploadStage,
  images,
  patterns,
  cloudinaryProgress,
  backendProgress,
  overallProgress,
  setOverallProgress,
}: UploadFeedbackProps) {
  // Calculate overall progress
  useEffect(() => {
    setOverallProgress(() => {
      if (images.length === 0 && patterns.length === 0) {
        return 0;
      }

      if (patterns.length === 0) {
        return cloudinaryProgress;
      }

      if (images.length === 0) {
        return backendProgress;
      }

      const totalSteps = images.length + 1;
      const cloudinaryWeight = images.length / totalSteps;
      const backendWeight = 1 / totalSteps;

      const weightedProgress =
        cloudinaryProgress * cloudinaryWeight + backendProgress * backendWeight;

      return Math.round(weightedProgress);
    });
  }, [cloudinaryProgress, backendProgress, images.length, patterns.length]);

  const getUploadStageText = () => {
    switch (uploadStage) {
      case 'idle':
        return 'Ready to upload';
      case 'running':
        return 'Uploading files...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return '';
    }
  };

  const hasFiles = images.length > 0 || patterns.length > 0;

  return (
    <Card className="w-full relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Pattern
        </CardTitle>
        <CardDescription>{getUploadStageText()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasFiles ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        ) : null}

        {hasFiles ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All ({images.length + patterns.length})</TabsTrigger>
              <TabsTrigger value="cloudinary">Images ({images.length})</TabsTrigger>
              <TabsTrigger value="backend">Patterns ({patterns.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {images.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Images</h3>
                    {images.map((file) => (
                      <CloudinaryFileItem key={file.url} file={file} />
                    ))}
                  </div>
                )}

                {patterns.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Patterns</h3>
                    <BackendFilesItem
                      files={patterns}
                      progress={backendProgress}
                      status={uploadStage}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cloudinary" className="mt-4">
              <div className="space-y-2">
                {images.map((file, index) => (
                  <CloudinaryFileItem key={`${file.url}-${index}`} file={file} />
                ))}
                {images.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">No Images</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="backend" className="mt-4">
              <div className="space-y-2">
                {patterns.length > 0 ? (
                  <BackendFilesItem
                    files={patterns}
                    progress={backendProgress}
                    status={uploadStage}
                  />
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">No Patterns</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : null}

        {!hasFiles ? (
          <div className="py-8 text-center text-muted-foreground">
            <Cloud className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>No files to upload</p>
          </div>
        ) : null}
      </CardContent>
      <UploadFeedbackStatusOverlay uploadStage={uploadStage} />
    </Card>
  );
}

function CloudinaryFileItem({ file }: { file: CloudinaryFile }) {
  const getStatusIcon = () => {
    switch (file.status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
      <img src={file.url} alt={`Image ${file.name}`} className="h-8 w-8 bg-cover rounded-full" />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="truncate pr-2">
            <p className="text-sm font-medium truncate">{file.name}</p>
          </div>
          {getStatusIcon()}
        </div>

        <Progress
          value={file.progress}
          className={`h-1 mt-2 ${
            file.status === 'error'
              ? 'bg-destructive'
              : file.status === 'success'
                ? 'bg-green-500'
                : undefined
          }`}
        />
      </div>
    </div>
  );
}

function BackendFilesItem({
  files,
  progress,
  status,
}: {
  files: PDFFile[];
  progress: number;
  status: 'idle' | 'running' | 'complete' | 'error';
}) {
  const formatTotalSize = () => {
    const totalBytes = files.reduce((acc, file) => acc + file.file.size, 0);
    if (totalBytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(totalBytes) / Math.log(k));
    return Number.parseFloat((totalBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-background">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
        <FileIcon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="truncate pr-2">
            <p className="text-sm font-medium truncate">Pattern Files ({files.length})</p>
            <p className="text-xs text-muted-foreground">{formatTotalSize()} total • Patterns</p>
          </div>
          {getStatusIcon()}
        </div>

        <Progress
          value={progress}
          className={`h-1 mt-2 ${
            status === 'error'
              ? 'bg-destructive'
              : status === 'complete'
                ? 'bg-green-500'
                : undefined
          }`}
        />
      </div>
    </div>
  );
}
