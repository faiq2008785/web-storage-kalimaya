
// File and folder types
export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  modified: string;
  path: string;
  parentId: string | null;
  isFolder: boolean;
  extension?: string;
  starred?: boolean;
}

export interface FileViewProps {
  files: FileItem[];
  currentPath: string[];
  selectedFile: FileItem | null;
  onFileSelect: (file: FileItem) => void;
  onFileOpen: (file: FileItem) => void;
  onFileDrop?: (fileId: string, destinationId: string) => void;
}

export interface ToolbarProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onUpload: () => void;
  onCreateFolder: () => void;
  onDelete: () => void;
  onRename: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  canDelete: boolean;
  canRename: boolean;
}

export interface BreadcrumbProps {
  path: string[];
  onNavigate: (index: number) => void;
}

export interface SidebarItemProps {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}
