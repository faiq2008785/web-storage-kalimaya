
import React, { useState, useEffect, useRef } from 'react';
import FileManagerUI from './FileManagerUI';
import { FileItem } from './types';
import { generateMockData, getFilesByParentId, getPathToFile, getFileById } from './mockData';

const FileManagerMain: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>('root');
  const [currentPath, setCurrentPath] = useState<string[]>(['Root']);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState('all');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQuickPreviewOpen, setIsQuickPreviewOpen] = useState(false);
  const lastKeyWasSpaceRef = useRef(false);

  useEffect(() => {
    const mockData = generateMockData();
    const hasMusic = mockData.some(
      (f) => f.extension === "mp3" || (f.type === "music" || f.type === "audio")
    );
    if (!hasMusic) {
      mockData.push({
        id: `dummy-mp3`,
        name: "Sample Music.mp3",
        type: "music",
        extension: "mp3",
        size: 123456,
        modified: new Date().toISOString(),
        path: "Root/Sample Music.mp3",
        parentId: "root",
        isFolder: false,
      });
    }
    setFiles(mockData);
  }, []);

  const currentFiles = React.useMemo(() => {
    let filteredFiles = getFilesByParentId(files, currentFolder);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredFiles = filteredFiles.filter(file =>
        file.name.toLowerCase().includes(query)
      );
    }
    return filteredFiles;
  }, [files, currentFolder, searchQuery]);

  const handleFileSelect = (file: FileItem) => setSelectedFile(file);
  const handleFileOpen = (file: FileItem) => {
    if (file.isFolder) {
      setCurrentFolder(file.id);
      navigateToFolder(file.id);
    } else {
      console.log("Opening file:", file.name);
    }
  };

  const navigateToFolder = (folderId: string) => {
    const folder = getFileById(files, folderId);
    if (folder) {
      const path = getPathToFile(files, folderId);
      setCurrentPath(path);
      setCurrentFolder(folderId);
    }
  };

  const handleBreadcrumbNavigate = (index: number) => {
    if (index === 0) {
      setCurrentFolder('root');
      setCurrentPath(['Root']);
    } else {
      const pathToIndex = currentPath.slice(0, index + 1);
      const folderId = files.find(f => f.name === pathToIndex[pathToIndex.length - 1])?.id;
      if (folderId) {
        setCurrentFolder(folderId);
        setCurrentPath(pathToIndex);
      }
    }
  };

  const handleUpload = (uploadedFiles: File[]) => {
    const newFiles = uploadedFiles.map(file => {
      const extension = file.name.split('.').pop() || '';
      return {
        id: `new-${Date.now()}-${file.name}`,
        name: file.name,
        type: getFileTypeFromExtension(extension),
        size: file.size,
        modified: new Date().toISOString(),
        path: `${currentPath.join('/')}/${file.name}`,
        parentId: currentFolder,
        isFolder: false,
        extension
      };
    });
    setFiles(prev => [...prev, ...newFiles]);
    setIsUploadModalOpen(false);
  };

  const getFileTypeFromExtension = (extension: string): string => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
    const spreadsheetExtensions = ['xls', 'xlsx', 'csv'];
    const codeExtensions = ['js', 'ts', 'html', 'css', 'json', 'xml', 'py'];
    const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
    extension = extension.toLowerCase();
    if (imageExtensions.includes(extension)) return 'image';
    if (documentExtensions.includes(extension)) return 'document';
    if (spreadsheetExtensions.includes(extension)) return 'spreadsheet';
    if (codeExtensions.includes(extension)) return 'code';
    if (archiveExtensions.includes(extension)) return 'archive';
    return 'file';
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      size: 0,
      modified: new Date().toISOString(),
      path: `${currentPath.join('/')}/${name}`,
      parentId: currentFolder,
      isFolder: true
    };
    setFiles(prev => [...prev, newFolder]);
    setIsNewFolderModalOpen(false);
  };

  const handleRename = (newName: string) => {
    if (selectedFile) {
      setFiles(prev => prev.map(file => {
        if (file.id === selectedFile.id) {
          return { ...file, name: newName };
        }
        return file;
      }));
      setSelectedFile(prev => prev ? { ...prev, name: newName } : null);
    }
    setIsRenameModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedFile) {
      const filesToDelete = [selectedFile.id];
      if (selectedFile.isFolder) {
        const getAllChildren = (parentId: string): string[] => {
          const children = files.filter(f => f.parentId === parentId);
          return [
            ...children.map(c => c.id),
            ...children.filter(c => c.isFolder).flatMap(f => getAllChildren(f.id))
          ];
        };
        filesToDelete.push(...getAllChildren(selectedFile.id));
      }
      setFiles(prev => prev.filter(file => !filesToDelete.includes(file.id)));
      setSelectedFile(null);
    }
    setIsDeleteModalOpen(false);
  };

  const handleToggleStar = (file: FileItem) => {
    setFiles(prev => prev.map(f => {
      if (f.id === file.id) {
        return { ...f, starred: !f.starred };
      }
      return f;
    }));
    setSelectedFile(prev => prev && prev.id === file.id ?
      { ...prev, starred: !prev.starred } : prev
    );
  };

  const handleSidebarNavigate = (location: string) => {
    setCurrentLocation(location);
    if (location === 'all') {
      setCurrentFolder('root');
      setCurrentPath(['Root']);
    } else if (location === 'documents') {
      const documents = files.find(f => f.name === 'Documents' && f.isFolder);
      if (documents) {
        setCurrentFolder(documents.id);
        setCurrentPath(['Root', 'Documents']);
      }
    } else if (location === 'images') {
      const images = files.find(f => f.name === 'Images' && f.isFolder);
      if (images) {
        setCurrentFolder(images.id);
        setCurrentPath(['Root', 'Images']);
      }
    } else if (location === 'starred') {
      setCurrentFolder(null);
      setCurrentPath(['Starred Files']);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.code === "Space" || e.key === " ") &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        if (!isQuickPreviewOpen && selectedFile) {
          setIsQuickPreviewOpen(true);
        } else if (isQuickPreviewOpen) {
          setIsQuickPreviewOpen(false);
        }
        lastKeyWasSpaceRef.current = true;
      } else {
        lastKeyWasSpaceRef.current = false;
      }
      if (
        (e.code === "Escape" || e.key === "Escape") &&
        isQuickPreviewOpen
      ) {
        setIsQuickPreviewOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFile, isQuickPreviewOpen]);

  return (
    <FileManagerUI
      files={files}
      currentFiles={currentFiles}
      currentFolder={currentFolder}
      currentPath={currentPath}
      selectedFile={selectedFile}
      viewMode={viewMode}
      searchQuery={searchQuery}
      currentLocation={currentLocation}
      isUploadModalOpen={isUploadModalOpen}
      isNewFolderModalOpen={isNewFolderModalOpen}
      isRenameModalOpen={isRenameModalOpen}
      isDeleteModalOpen={isDeleteModalOpen}
      isShareModalOpen={isShareModalOpen}
      isQuickPreviewOpen={isQuickPreviewOpen}
      setViewMode={setViewMode}
      setIsUploadModalOpen={setIsUploadModalOpen}
      setIsNewFolderModalOpen={setIsNewFolderModalOpen}
      setIsRenameModalOpen={setIsRenameModalOpen}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      setIsShareModalOpen={setIsShareModalOpen}
      setIsQuickPreviewOpen={setIsQuickPreviewOpen}
      setSearchQuery={setSearchQuery}
      handleFileSelect={handleFileSelect}
      handleFileOpen={handleFileOpen}
      handleBreadcrumbNavigate={handleBreadcrumbNavigate}
      handleUpload={handleUpload}
      handleCreateFolder={handleCreateFolder}
      handleRename={handleRename}
      handleDelete={handleDelete}
      handleToggleStar={handleToggleStar}
      handleSidebarNavigate={handleSidebarNavigate}
    />
  );
};

export default FileManagerMain;
