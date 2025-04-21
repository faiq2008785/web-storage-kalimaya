
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  FolderOpen,
  FolderArchive,
  Star,
  HardDrive,
  Image,
  File,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarItemProps } from './types';

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active = false, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start mb-1 p-2",
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="mr-2 h-5 w-5" />
      <span>{label}</span>
    </Button>
  );
};

interface FileSidebarProps {
  onNavigate: (location: string) => void;
  currentLocation: string;
}

const FileSidebar: React.FC<FileSidebarProps> = ({ onNavigate, currentLocation }) => {
  return (
    <div className="w-64 h-full p-4 border-r bg-background">
      <h2 className="text-xl font-semibold mb-6">File Manager</h2>
      
      <div className="mb-6">
        <SidebarItem 
          icon={HardDrive} 
          label="All Files" 
          active={currentLocation === 'all'} 
          onClick={() => onNavigate('all')}
        />
        <SidebarItem 
          icon={FolderOpen} 
          label="Documents" 
          active={currentLocation === 'documents'} 
          onClick={() => onNavigate('documents')}
        />
        <SidebarItem 
          icon={Image} 
          label="Images" 
          active={currentLocation === 'images'} 
          onClick={() => onNavigate('images')}
        />
        <SidebarItem 
          icon={File} 
          label="Other Files" 
          active={currentLocation === 'other'} 
          onClick={() => onNavigate('other')}
        />
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Favorites</h3>
        <SidebarItem 
          icon={Star} 
          label="Starred" 
          active={currentLocation === 'starred'} 
          onClick={() => onNavigate('starred')}
        />
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Storage</h3>
        <SidebarItem 
          icon={FolderArchive} 
          label="Archives" 
          active={currentLocation === 'archives'} 
          onClick={() => onNavigate('archives')}
        />
      </div>

      <div className="mt-auto pt-4">
        <SidebarItem 
          icon={Trash2} 
          label="Trash" 
          active={currentLocation === 'trash'} 
          onClick={() => onNavigate('trash')}
        />
      </div>
    </div>
  );
};

export default FileSidebar;
