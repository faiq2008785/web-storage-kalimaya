
import React from 'react';
import FileSidebar from './FileSidebar';
import FileToolbar from './FileToolbar';
import FileBreadcrumb from './FileBreadcrumb';
import FileGrid from './FileGrid';
import FileList from './FileList';
import FileDetails from './FileDetails';
import FileUploader from './FileUploader';
import { ThemeToggle } from './ThemeToggle';
import { RenameModal, NewFolderModal, DeleteModal, ShareModal } from './FileModals';
import { FileQuickPreview } from "./FileQuickPreview";
import { FileItem } from './types';

interface FileManagerUIProps {
  files: FileItem[],
  currentFiles: FileItem[],
  currentFolder: string | null,
  currentPath: string[],
  selectedFile: FileItem | null,
  viewMode: 'grid' | 'list',
  searchQuery: string,
  currentLocation: string,
  isUploadModalOpen: boolean,
  isNewFolderModalOpen: boolean,
  isRenameModalOpen: boolean,
  isDeleteModalOpen: boolean,
  isShareModalOpen: boolean,
  isQuickPreviewOpen: boolean,
  setViewMode: (m: 'grid' | 'list') => void,
  setIsUploadModalOpen: (v: boolean) => void,
  setIsNewFolderModalOpen: (v: boolean) => void,
  setIsRenameModalOpen: (v: boolean) => void,
  setIsDeleteModalOpen: (v: boolean) => void,
  setIsShareModalOpen: (v: boolean) => void,
  setIsQuickPreviewOpen: (v: boolean) => void,
  setSearchQuery: (v: string) => void,
  handleFileSelect: (file: FileItem) => void,
  handleFileOpen: (file: FileItem) => void,
  handleBreadcrumbNavigate: (index: number) => void,
  handleUpload: (files: File[]) => void,
  handleCreateFolder: (name: string) => void,
  handleRename: (name: string) => void,
  handleDelete: () => void,
  handleToggleStar: (file: FileItem) => void,
  handleSidebarNavigate: (location: string) => void,
}

const FileManagerUI: React.FC<FileManagerUIProps> = (props) => {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-2 bg-background border-b">
        <h1 className="text-xl font-bold px-2">Web Vault Explorer</h1>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <FileSidebar
          onNavigate={props.handleSidebarNavigate}
          currentLocation={props.currentLocation}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <FileToolbar
            viewMode={props.viewMode}
            onViewModeChange={props.setViewMode}
            onUpload={() => props.setIsUploadModalOpen(true)}
            onCreateFolder={() => props.setIsNewFolderModalOpen(true)}
            onDelete={() => props.setIsDeleteModalOpen(true)}
            onRename={() => props.setIsRenameModalOpen(true)}
            searchQuery={props.searchQuery}
            onSearchChange={props.setSearchQuery}
            canDelete={!!props.selectedFile}
            canRename={!!props.selectedFile}
          />
          <FileBreadcrumb
            path={props.currentPath}
            onNavigate={props.handleBreadcrumbNavigate}
          />
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full">
              <div className="flex-1 overflow-y-auto">
                {props.viewMode === 'grid' ? (
                  <FileGrid
                    files={props.currentFiles}
                    currentPath={props.currentPath}
                    selectedFile={props.selectedFile}
                    onFileSelect={props.handleFileSelect}
                    onFileOpen={props.handleFileOpen}
                  />
                ) : (
                  <FileList
                    files={props.currentFiles}
                    currentPath={props.currentPath}
                    selectedFile={props.selectedFile}
                    onFileSelect={props.handleFileSelect}
                    onFileOpen={props.handleFileOpen}
                  />
                )}
              </div>
              <FileDetails
                file={props.selectedFile}
                onDownload={() => console.log('Download', props.selectedFile?.name)}
                onShare={() => props.setIsShareModalOpen(true)}
                onToggleStar={props.handleToggleStar}
              />
            </div>
          </div>
        </div>
      </div>
      <FileQuickPreview
        open={props.isQuickPreviewOpen}
        onClose={() => props.setIsQuickPreviewOpen(false)}
        file={props.selectedFile}
      />
      <FileUploader
        isOpen={props.isUploadModalOpen}
        onClose={() => props.setIsUploadModalOpen(false)}
        onUpload={props.handleUpload}
      />
      <NewFolderModal
        isOpen={props.isNewFolderModalOpen}
        onClose={() => props.setIsNewFolderModalOpen(false)}
        onCreateFolder={props.handleCreateFolder}
      />
      <RenameModal
        isOpen={props.isRenameModalOpen}
        onClose={() => props.setIsRenameModalOpen(false)}
        file={props.selectedFile}
        onRename={props.handleRename}
      />
      <DeleteModal
        isOpen={props.isDeleteModalOpen}
        onClose={() => props.setIsDeleteModalOpen(false)}
        file={props.selectedFile}
        onDelete={props.handleDelete}
      />
      <ShareModal
        isOpen={props.isShareModalOpen}
        onClose={() => props.setIsShareModalOpen(false)}
        file={props.selectedFile}
      />
    </div>
  );
};

export default FileManagerUI;
