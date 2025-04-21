
import React from 'react';
import {
  File,
  FileImage,
  FileText,
  Folder,
  FolderOpen,
  FileCode,
  FileArchive,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileItem, FileViewProps } from './types';
import { formatFileSize } from './mockData';

interface FileIconProps {
  file: FileItem;
  size?: number;
}

const FileIcon: React.FC<FileIconProps> = ({ file, size = 20 }) => {
  if (file.isFolder) {
    return <Folder size={size} className="text-blue-500" />;
  }

  // Select icon based on file type or extension
  switch (file.type) {
    case 'image':
      return <FileImage size={size} className="text-green-500" />;
    case 'pdf':
      return <File size={size} className="text-red-500" />;
    case 'text':
      return <FileText size={size} className="text-gray-500" />;
    case 'excel': 
    case 'spreadsheet':
      return <File size={size} className="text-green-700" />;
    case 'code':
      return <FileCode size={size} className="text-purple-500" />;
    case 'archive':
      return <FileArchive size={size} className="text-yellow-500" />;
    default:
      return <File size={size} className="text-gray-500" />;
  }
};

const FileList: React.FC<FileViewProps> = ({
  files,
  selectedFile,
  onFileSelect,
  onFileOpen
}) => {
  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium text-sm">Name</th>
            <th className="text-left p-3 font-medium text-sm">Type</th>
            <th className="text-left p-3 font-medium text-sm hidden md:table-cell">Last Modified</th>
            <th className="text-right p-3 font-medium text-sm">Size</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className={cn(
                "border-b hover:bg-accent/50 cursor-pointer transition-colors",
                selectedFile?.id === file.id && "bg-accent"
              )}
              onClick={() => onFileSelect(file)}
              onDoubleClick={() => onFileOpen(file)}
            >
              <td className="p-3 flex items-center gap-2">
                <FileIcon file={file} />
                <span className="truncate max-w-[300px]">{file.name}</span>
              </td>
              <td className="p-3 text-sm text-muted-foreground">
                {file.isFolder ? 'Folder' : file.extension?.toUpperCase() || 'File'}
              </td>
              <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">
                {new Date(file.modified).toLocaleDateString()}
              </td>
              <td className="p-3 text-sm text-muted-foreground text-right">
                {file.isFolder ? '--' : formatFileSize(file.size)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
