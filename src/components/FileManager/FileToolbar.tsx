
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Upload,
  FolderPlus,
  Trash2,
  Edit,
  Grid,
  List,
  Search
} from 'lucide-react';
import { ToolbarProps } from './types';

const FileToolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onViewModeChange,
  onUpload,
  onCreateFolder,
  onDelete,
  onRename,
  searchQuery,
  onSearchChange,
  canDelete,
  canRename
}) => {
  return (
    <div className="p-4 flex flex-col sm:flex-row items-center gap-4 border-b bg-background">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button variant="outline" onClick={onUpload} className="flex items-center gap-1">
          <Upload size={18} />
          <span className="hidden sm:inline-block">Upload</span>
        </Button>
        
        <Button variant="outline" onClick={onCreateFolder} className="flex items-center gap-1">
          <FolderPlus size={18} />
          <span className="hidden sm:inline-block">New Folder</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onDelete} 
          disabled={!canDelete}
          className="flex items-center gap-1"
        >
          <Trash2 size={18} />
          <span className="hidden sm:inline-block">Delete</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onRename} 
          disabled={!canRename}
          className="flex items-center gap-1"
        >
          <Edit size={18} />
          <span className="hidden sm:inline-block">Rename</span>
        </Button>
      </div>
      
      <div className="flex-1 flex items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex items-center gap-1 border rounded-md">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'ghost'} 
            size="sm"
            className="p-1 h-8 w-8"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid size={18} />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="sm"
            className="p-1 h-8 w-8"
            onClick={() => onViewModeChange('list')}
          >
            <List size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileToolbar;
