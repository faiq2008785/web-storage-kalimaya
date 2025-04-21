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

const FilePreview: React.FC<{ file: FileItem }> = ({ file }) => {
  if (file.isFolder) return null;

  const url =
    file.type === "image"
      ? `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&q=80`
      : file.type === "video"
      ? "https://www.w3schools.com/html/mov_bbb.mp4"
      : file.type === "music"
      ? "https://www.w3schools.com/html/horse.mp3"
      : undefined;

  if (file.type === "image") {
    return (
      <div className="mb-4 w-full flex justify-center">
        <img
          src={url}
          alt={file.name}
          className="max-w-full max-h-48 rounded shadow border"
          style={{ objectFit: "contain" }}
        />
      </div>
    );
  }

  if (
    file.extension &&
    (file.extension.toLowerCase() === "pdf" || file.type === "pdf")
  ) {
    return (
      <div className="mb-4 w-full flex justify-center">
        <iframe
          src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          title="PDF Preview"
          className="w-full h-48 rounded border"
        />
      </div>
    );
  }

  if (
    file.extension &&
    ["txt", "md", "js", "ts", "json", "log"].includes(
      file.extension.toLowerCase()
    )
  ) {
    return (
      <div className="mb-4 bg-muted/50 rounded p-2 h-32 overflow-auto text-xs font-mono border">
        This is a preview of a text file. You can display file contents here.
      </div>
    );
  }

  if (file.type === "music" || file.type === "audio") {
    return (
      <div className="mb-4 flex flex-col items-center">
        <audio controls className="w-full">
          <source src={url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <span className="text-xs mt-2 text-muted-foreground">
          Preview audio: {file.name}
        </span>
      </div>
    );
  }

  if (file.type === "video") {
    return (
      <div className="mb-4 flex flex-col items-center">
        <video controls className="w-full max-h-48 rounded border">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <span className="text-xs mt-2 text-muted-foreground">
          Preview video: {file.name}
        </span>
      </div>
    );
  }

  return null;
};

const FileDetails: React.FC<FileDetailsProps> = ({
  file,
  onDownload,
  onShare,
  onToggleStar,
}) => {
  if (!file) {
    return (
      <div className="w-72 border-l p-6 hidden lg:block bg-background h-full">
        <p className="text-muted-foreground text-center">
          Select a file to view details
        </p>
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
          {file.isFolder ? "Folder" : file.extension?.toUpperCase()}
        </p>
      </div>

      <Separator className="my-4" />

      <FilePreview file={file} />

      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Modified</p>
            <p className="text-sm">
              {new Date(file.modified).toLocaleString()}
            </p>
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
              {file.isFolder
                ? "Folder"
                : file.extension?.toUpperCase() || "File"}
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
          <Star
            className="h-4 w-4"
            fill={file.starred ? "currentColor" : "none"}
          />
          <span>{file.starred ? "Starred" : "Add to Starred"}</span>
        </Button>
      </div>
    </div>
  );
};

export default FileDetails;
