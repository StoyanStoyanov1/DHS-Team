'use client';

import React from 'react';
import { CheckSquare, Square, Minus } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface SelectionOptionsMenuProps {
  selectedCount: number;
  totalCount: number;
  currentPageCount: number;
  onSelectCurrentPage: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  isAllSelected?: boolean;
  isPartiallySelected?: boolean;
  isAllCurrentPageSelected?: boolean;
}

const SelectionOptionsMenu: React.FC<SelectionOptionsMenuProps> = ({
  selectedCount,
  totalCount,
  currentPageCount,
  onSelectCurrentPage,
  onSelectAll,
  onClearSelection,
  isAllSelected = false,
  isPartiallySelected = false,
  isAllCurrentPageSelected = false,
}) => {
  // Determine which icon to show based on selection state
  const renderSelectionIcon = () => {
    if (isAllSelected) {
      return <CheckSquare size={16} className="text-indigo-600 dark:text-indigo-300" />;
    } else if (isPartiallySelected) {
      return <Minus size={16} className="text-indigo-600 dark:text-indigo-300" />;
    } else if (isAllCurrentPageSelected) {
      return <CheckSquare size={16} className="text-gray-600 dark:text-gray-300" />;
    } else {
      return <Square size={16} className="text-gray-600 dark:text-gray-300" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm">
        {renderSelectionIcon()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 mb-1">
          {selectedCount > 0 ? `${selectedCount} selected` : 'Select items'}
        </div>

        <DropdownMenuItem 
          className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
          onClick={onSelectCurrentPage}
        >
          <CheckSquare size={16} className="mr-2 text-indigo-600 dark:text-indigo-300" />
          <span className="dark:text-white">Select all on this page ({currentPageCount})</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm"
          onClick={onSelectAll}
        >
          <CheckSquare size={16} className="mr-2 text-indigo-600 dark:text-indigo-300" />
          <span className="dark:text-white">Select all items ({totalCount})</span>
        </DropdownMenuItem>

        {selectedCount > 0 && (
          <DropdownMenuItem 
            className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm text-red-600 dark:text-red-400"
            onClick={onClearSelection}
          >
            <Square size={16} className="mr-2" />
            <span className="dark:text-white">Clear selection</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectionOptionsMenu;
