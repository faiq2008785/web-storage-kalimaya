
import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

// Simple mock dropzone implementation since we don't have react-dropzone
interface DropzoneProps {
  onDrop: (files: File[]) => void;
}

const useDropzone = (options: { onDrop: (files: File[]) => void }) => {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    options.onDrop(files);
  };
  
  const getRootProps = () => ({
    onClick: () => document.getElementById('fileInput')?.click(),
  });
  
  const getInputProps = () => ({
    id: 'fileInput',
    type: 'file',
    multiple: true,
    style: { display: 'none' },
    onChange: onInputChange
  });
  
  return {
    getRootProps,
    getInputProps,
    isDragActive: false
  };
};
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface FileUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ isOpen, onClose, onUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to select files to upload
          </DialogDescription>
        </DialogHeader>
        <div 
          {...getRootProps()} 
          className="border-2 border-dashed rounded-lg p-10 mt-4 cursor-pointer flex flex-col items-center justify-center"
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          {isDragActive ? (
            <p className="text-center text-muted-foreground">Drop the files here...</p>
          ) : (
            <p className="text-center text-muted-foreground">
              Drag &amp; drop files here, or click to select files
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploader;
