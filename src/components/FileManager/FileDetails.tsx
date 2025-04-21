
import React from 'react';
import { FileItem } from './types';
import { formatFileSize } from './mockData';
import {
  File,
  FileImage,
  FileText,
  Folder,
  Clock,
  HardDrive,
  Tag,
  Download,
  Share2,
  Star,
  File as FilePdf,
  FileArchive,
  FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FileDetailsProps {
  file: FileItem | null;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onToggleStar: (file: FileItem) => void;
}

interface FileIconProps {
  file: FileItem;
  size?: number;
}

const FileIcon: React.FC<FileIconProps> = ({ file, size = 64 }) => {
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
      return <File size={size} className="text-green-700" />;
    case 'code':
      return <FileCode size={size} className="text-purple-500" />;
    case 'archive':
      return <FileArchive size={size} className="text-yellow-500" />;
    default:
      return <File size={size} className="text-gray-500" />;
  }
};

const FileDetails: React.FC<FileDetailsProps> = ({ 
  file, 
  onDownload, 
  onShare, 
  onToggleStar 
}) => {
  if (!file) {
    return (
      <div className="w-72 border-l p-6 hidden lg:block bg-background h-full">
        <p className="text-muted-foreground text-center">Select a file to view details</p>
      </div>
    );
  }

  return (
    <div className="w-72 border-l p-6 hidden lg:block bg-background h-full overflow-y-auto">
      <div className="flex flex-col items-center mb-4">
        <div className="mb-3">
          <FileIcon file={file} />
        </div>
        <h3 className="text-lg font-medium text-center">{file.name}</h3>
        <p className="text-sm text-muted-foreground text-center">
          {file.isFolder ? 'Folder' : file.extension?.toUpperCase()}
        </p>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Modified</p>
            <p className="text-sm">{new Date(file.modified).toLocaleString()}</p>
          </div>
        </div>

        {!file.isFolder && (
          <div className="flex items-start gap-2">
            <HardDrive className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Size</p>
              <p className="text-sm">{formatFileSize(file.size)}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2">
          <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="text-sm">
              {file.isFolder ? 'Folder' : file.extension?.toUpperCase() || 'File'}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        {!file.isFolder && (
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => onDownload(file)}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        )}
        
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-center"
          onClick={() => onShare(file)}
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
        
        <Button 
          variant={file.starred ? "default" : "outline"} 
          className="w-full flex items-center gap-2 justify-center"
          onClick={() => onToggleStar(file)}
        >
          <Star className="h-4 w-4" fill={file.starred ? "currentColor" : "none"} />
          <span>{file.starred ? "Starred" : "Add to Starred"}</span>
        </Button>
      </div>
    </div>
  );
};

export default FileDetails;
