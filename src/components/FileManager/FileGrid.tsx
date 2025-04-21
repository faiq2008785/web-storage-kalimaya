
import React from 'react';
import {
  File,
  FileImage,
  FileText,
  File as FilePdf,
  FileCode,
  FileArchive,
  File as FileSpreadsheet,
  Folder,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileItem, FileViewProps } from './types';
import { formatFileSize } from './mockData';

interface FileIconProps {
  file: FileItem;
  size?: number;
}

const FileIcon: React.FC<FileIconProps> = ({ file, size = 40 }) => {
  if (file.isFolder) {
    return <Folder size={size} className="text-blue-500" />;
  }

  // Select icon based on file type or extension
  switch (file.type) {
    case 'image':
      return <FileImage size={size} className="text-green-500" />;
    case 'pdf':
      return <FilePdf size={size} className="text-red-500" />;
    case 'text':
      return <FileText size={size} className="text-gray-500" />;
    case 'excel': 
    case 'spreadsheet':
      return <FileSpreadsheet size={size} className="text-green-700" />;
    case 'code':
      return <FileCode size={size} className="text-purple-500" />;
    case 'archive':
      return <FileArchive size={size} className="text-yellow-500" />;
    default:
      return <File size={size} className="text-gray-500" />;
  }
};

const FileGrid: React.FC<FileViewProps> = ({
  files,
  selectedFile,
  onFileSelect,
  onFileOpen
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {files.map((file) => (
        <div
          key={file.id}
          className={cn(
            "border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-accent/50 transition-colors",
            selectedFile?.id === file.id && "bg-accent"
          )}
          onClick={() => onFileSelect(file)}
          onDoubleClick={() => onFileOpen(file)}
        >
          <div className="mb-3">
            <FileIcon file={file} />
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium truncate w-full">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {file.isFolder ? '--' : formatFileSize(file.size)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;
