
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BreadcrumbProps } from './types';

const FileBreadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  return (
    <nav className="flex items-center p-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Button 
            variant="ghost" 
            className="flex items-center text-sm font-medium"
            onClick={() => onNavigate(0)}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </li>
        
        {path.slice(1).map((segment, index) => (
          <li key={index} className="inline-flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <Button 
              variant="ghost" 
              className="text-sm font-medium"
              onClick={() => onNavigate(index + 1)}
            >
              {segment}
            </Button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default FileBreadcrumb;
