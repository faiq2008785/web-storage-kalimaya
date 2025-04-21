
import { FileItem } from './types';

// Simple UUID generator without external dependency
const uuidv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Generate mock data for files and folders
export const generateMockData = (): FileItem[] => {
  const rootFolder: FileItem = {
    id: 'root',
    name: 'Root',
    type: 'folder',
    size: 0,
    modified: new Date().toISOString(),
    path: '',
    parentId: null,
    isFolder: true
  };

  const documents: FileItem = {
    id: uuidv4(),
    name: 'Documents',
    type: 'folder',
    size: 0,
    modified: new Date().toISOString(),
    path: '/Documents',
    parentId: 'root',
    isFolder: true
  };

  const images: FileItem = {
    id: uuidv4(),
    name: 'Images',
    type: 'folder',
    size: 0,
    modified: new Date().toISOString(),
    path: '/Images',
    parentId: 'root',
    isFolder: true
  };

  const mockFiles: FileItem[] = [
    rootFolder,
    documents,
    images,
    {
      id: uuidv4(),
      name: 'Project Plan.pdf',
      type: 'pdf',
      size: 2500000,
      modified: new Date(Date.now() - 86400000).toISOString(),
      path: '/Documents/Project Plan.pdf',
      parentId: documents.id,
      isFolder: false,
      extension: 'pdf'
    },
    {
      id: uuidv4(),
      name: 'Budget.xlsx',
      type: 'excel',
      size: 1200000,
      modified: new Date(Date.now() - 172800000).toISOString(),
      path: '/Documents/Budget.xlsx',
      parentId: documents.id,
      isFolder: false,
      extension: 'xlsx'
    },
    {
      id: uuidv4(),
      name: 'Notes.txt',
      type: 'text',
      size: 5000,
      modified: new Date(Date.now() - 259200000).toISOString(),
      path: '/Documents/Notes.txt',
      parentId: documents.id,
      isFolder: false,
      extension: 'txt'
    },
    {
      id: uuidv4(),
      name: 'Profile.jpg',
      type: 'image',
      size: 1800000,
      modified: new Date(Date.now() - 345600000).toISOString(),
      path: '/Images/Profile.jpg',
      parentId: images.id,
      isFolder: false,
      extension: 'jpg'
    },
    {
      id: uuidv4(),
      name: 'Background.png',
      type: 'image',
      size: 3200000,
      modified: new Date(Date.now() - 432000000).toISOString(),
      path: '/Images/Background.png',
      parentId: images.id,
      isFolder: false,
      extension: 'png'
    },
    {
      id: uuidv4(),
      name: 'Logo.svg',
      type: 'image',
      size: 50000,
      modified: new Date(Date.now() - 518400000).toISOString(),
      path: '/Images/Logo.svg',
      parentId: images.id,
      isFolder: false,
      extension: 'svg'
    }
  ];

  return mockFiles;
};

// Utility functions for file operations
export const getFilesByParentId = (files: FileItem[], parentId: string | null): FileItem[] => {
  return files.filter(file => file.parentId === parentId);
};

export const getFileById = (files: FileItem[], id: string): FileItem | undefined => {
  return files.find(file => file.id === id);
};

export const getPathToFile = (files: FileItem[], fileId: string): string[] => {
  const pathSegments: string[] = [];
  let currentFile = getFileById(files, fileId);
  
  while (currentFile) {
    pathSegments.unshift(currentFile.name);
    if (currentFile.parentId === null) break;
    currentFile = getFileById(files, currentFile.parentId);
  }
  
  return pathSegments;
};

// Format file size to human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on file type/extension
export const getFileType = (file: FileItem): string => {
  if (file.isFolder) return 'folder';
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const spreadsheetExtensions = ['xls', 'xlsx', 'csv'];
  const presentationExtensions = ['ppt', 'pptx'];
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
  const codeExtensions = ['js', 'ts', 'html', 'css', 'json', 'xml', 'py', 'java', 'c', 'cpp'];
  
  const extension = file.extension?.toLowerCase() || '';
  
  if (imageExtensions.includes(extension)) return 'image';
  if (documentExtensions.includes(extension)) return 'document';
  if (spreadsheetExtensions.includes(extension)) return 'spreadsheet';
  if (presentationExtensions.includes(extension)) return 'presentation';
  if (archiveExtensions.includes(extension)) return 'archive';
  if (codeExtensions.includes(extension)) return 'code';
  
  return 'file';
};
