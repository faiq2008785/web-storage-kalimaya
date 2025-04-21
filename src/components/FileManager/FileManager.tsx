import React, { useState, useEffect } from 'react';
import FileSidebar from './FileSidebar';
import FileToolbar from './FileToolbar';
import FileBreadcrumb from './FileBreadcrumb';
import FileGrid from './FileGrid';
import FileList from './FileList';
import FileDetails from './FileDetails';
import FileUploader from './FileUploader';
import { ThemeToggle } from './ThemeToggle';
import { RenameModal, NewFolderModal, DeleteModal, ShareModal } from './FileModals';
import { FileItem } from './types';
import { generateMockData, getFilesByParentId, getPathToFile, getFileById } from './mockData';
import { FileQuickPreview } from "./FileQuickPreview";

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>('root');
  const [currentPath, setCurrentPath] = useState<string[]>(['Root']);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState('all');
  
  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQuickPreviewOpen, setIsQuickPreviewOpen] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    const mockData = generateMockData();
    setFiles(mockData);
  }, []);

  // Get current files based on folder and search
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

  // Handle file selection
  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
  };

  // Handle file/folder opening
  const handleFileOpen = (file: FileItem) => {
    if (file.isFolder) {
      setCurrentFolder(file.id);
      navigateToFolder(file.id);
    } else {
      // In a real app, this would open a preview of the file
      console.log("Opening file:", file.name);
    }
  };

  // Handle folder navigation
  const navigateToFolder = (folderId: string) => {
    const folder = getFileById(files, folderId);
    if (folder) {
      const path = getPathToFile(files, folderId);
      setCurrentPath(path);
      setCurrentFolder(folderId);
    }
  };

  // Handle breadcrumb navigation
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

  // Handle upload files
  const handleUpload = (uploadedFiles: File[]) => {
    // In a real app, this would upload files to server
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

  // Helper to determine file type from extension
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

  // Handle create new folder
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

  // Handle rename file/folder
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

  // Handle delete file/folder
  const handleDelete = () => {
    if (selectedFile) {
      const filesToDelete = [selectedFile.id];
      
      // If it's a folder, also find and delete all children
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

  // Toggle star status for a file
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

  // Handle sidebar navigation
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
      // Show starred files from all locations
      setCurrentFolder(null);
      setCurrentPath(['Starred Files']);
    }
  };

  // Listen for spacebar (spasi) to show preview popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.code === "Space" || e.key === " ") &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        if (selectedFile) {
          setIsQuickPreviewOpen(true);
          e.preventDefault();
        }
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
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-2 bg-background border-b">
        <h1 className="text-xl font-bold px-2">Web Vault Explorer</h1>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <FileSidebar 
          onNavigate={handleSidebarNavigate}
          currentLocation={currentLocation}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <FileToolbar 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onUpload={() => setIsUploadModalOpen(true)}
            onCreateFolder={() => setIsNewFolderModalOpen(true)}
            onDelete={() => setIsDeleteModalOpen(true)}
            onRename={() => setIsRenameModalOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            canDelete={!!selectedFile}
            canRename={!!selectedFile}
          />
          
          {/* Breadcrumbs */}
          <FileBreadcrumb 
            path={currentPath}
            onNavigate={handleBreadcrumbNavigate}
          />
          
          {/* File View */}
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full">
              <div className="flex-1 overflow-y-auto">
                {viewMode === 'grid' ? (
                  <FileGrid 
                    files={currentFiles}
                    currentPath={currentPath}
                    selectedFile={selectedFile}
                    onFileSelect={handleFileSelect}
                    onFileOpen={handleFileOpen}
                  />
                ) : (
                  <FileList 
                    files={currentFiles}
                    currentPath={currentPath}
                    selectedFile={selectedFile}
                    onFileSelect={handleFileSelect}
                    onFileOpen={handleFileOpen}
                  />
                )}
              </div>
              
              {/* Details Panel */}
              <FileDetails 
                file={selectedFile}
                onDownload={() => console.log('Download', selectedFile?.name)}
                onShare={() => setIsShareModalOpen(true)}
                onToggleStar={handleToggleStar}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Look (spasi) Preview Modal */}
      <FileQuickPreview
        open={isQuickPreviewOpen}
        onClose={() => setIsQuickPreviewOpen(false)}
        file={selectedFile}
      />

      {/* Modals */}
      <FileUploader 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
      
      <NewFolderModal 
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
      
      <RenameModal 
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        file={selectedFile}
        onRename={handleRename}
      />
      
      <DeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        file={selectedFile}
        onDelete={handleDelete}
      />
      
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        file={selectedFile}
      />
    </div>
  );
};

export default FileManager;
