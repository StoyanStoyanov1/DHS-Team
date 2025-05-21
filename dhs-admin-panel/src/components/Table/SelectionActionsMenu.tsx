'use client';

import React, { useState } from 'react';
import { MoreHorizontal, PencilIcon, Trash2 } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface SelectionActionsMenuProps {
  selectedCount: number;
  onUpdate: () => void;
  onDelete: () => void;
  showUpdateOption: boolean;
}

const SelectionActionsMenu: React.FC<SelectionActionsMenuProps> = ({
  selectedCount,
  onUpdate,
  onDelete,
  showUpdateOption = true,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none">
        <MoreHorizontal size={16} className="text-gray-600 dark:text-gray-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 mb-1">
          Actions for {selectedCount} selected
        </div>

        {showUpdateOption && (
          <DropdownMenuItem 
            className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
            onClick={onUpdate}
          >
            <PencilIcon size={16} className="mr-2 text-indigo-600 dark:text-indigo-300" />
            <span className="dark:text-white">Update</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem 
          className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 rounded-sm text-red-600 dark:text-red-400"
          onClick={onDelete}
        >
          <Trash2 size={16} className="mr-2" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectionActionsMenu;
