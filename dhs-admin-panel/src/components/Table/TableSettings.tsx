import React, { useState, useEffect, useRef } from 'react';
import { Settings, Eye, EyeOff, Columns, Filter, SortAsc, Download, Printer, Palette, Layout, Layers, RefreshCw, X } from 'lucide-react';
import { ITableColumn } from './interfaces';

interface TableSettingsProps<T> {
  columns: ITableColumn<T>[];
  visibleColumns: ITableColumn<T>[];
  onToggleColumnVisibility: (columnKey: string) => void;
  onResetAllFilters: () => void;
  onClearAllSorting: () => void;
  onRefreshData?: () => void;
  onExportData?: (format: 'csv' | 'excel' | 'pdf') => void;
  onPrint?: () => void;

  // Density settings
  density: 'compact' | 'normal' | 'relaxed';
  onChangeDensity: (density: 'compact' | 'normal' | 'relaxed') => void;

  // Theme settings
  theme: 'light' | 'dark' | 'site';
  onChangeTheme: (theme: 'light' | 'dark' | 'site') => void;
}

function TableSettings<T>({
  columns,
  visibleColumns,
  onToggleColumnVisibility,
  onResetAllFilters,
  onClearAllSorting,
  onRefreshData,
  onExportData,
  onPrint,
  density,
  onChangeDensity,
  theme,
  onChangeTheme
}: TableSettingsProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'columns' | 'display' | 'export'>('columns');
  const settingsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close settings menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen && 
        settingsRef.current && 
        buttonRef.current && 
        !settingsRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    // Add event listener when settings menu is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
        title="Table settings"
      >
        <Settings size={16} />
      </button>

      {isOpen && (
        <div 
          ref={settingsRef}
          className="absolute right-0 top-full mt-2 z-50 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Table Settings</h3>
          </div>

          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`flex-1 py-2 text-xs font-medium ${activeTab === 'columns' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              onClick={() => setActiveTab('columns')}
            >
              <div className="flex items-center justify-center">
                <Columns size={14} className="mr-1" />
                Columns
              </div>
            </button>
            <button
              className={`flex-1 py-2 text-xs font-medium ${activeTab === 'display' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              onClick={() => setActiveTab('display')}
            >
              <div className="flex items-center justify-center">
                <Layout size={14} className="mr-1" />
                Display
              </div>
            </button>
            <button
              className={`flex-1 py-2 text-xs font-medium ${activeTab === 'export' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              onClick={() => setActiveTab('export')}
            >
              <div className="flex items-center justify-center">
                <Download size={14} className="mr-1" />
                Export
              </div>
            </button>
          </div>

          <div className="p-3 max-h-80 overflow-y-auto">
            {activeTab === 'columns' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">Column Visibility</h4>
                  <div className="flex space-x-2">
                    <button
                      className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      onClick={() => columns.forEach(col => {
                        if (col.hidden) onToggleColumnVisibility(col.key);
                      })}
                    >
                      Show All
                    </button>
                    <button
                      className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                      onClick={() => visibleColumns.forEach(col => {
                        if (!col.hidden && col.hideable !== false) onToggleColumnVisibility(col.key);
                      })}
                    >
                      Hide All
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {columns.map(column => (
                    <div key={column.key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{column.header}</span>
                      <button
                        onClick={() => onToggleColumnVisibility(column.key)}
                        className={`p-1 rounded-md ${column.hidden ? 'text-gray-400 hover:text-gray-600' : 'text-indigo-600 hover:text-indigo-800'}`}
                        disabled={column.hideable === false}
                        title={column.hidden ? 'Show column' : 'Hide column'}
                      >
                        {column.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Data Controls</h4>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={onResetAllFilters}
                      className="flex items-center text-xs text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <Filter size={14} className="mr-1.5" />
                      Reset All Filters
                    </button>
                    <button
                      onClick={onClearAllSorting}
                      className="flex items-center text-xs text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <SortAsc size={14} className="mr-1.5" />
                      Clear All Sorting
                    </button>
                    {onRefreshData && (
                      <button
                        onClick={onRefreshData}
                        className="flex items-center text-xs text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <RefreshCw size={14} className="mr-1.5" />
                        Refresh Data
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'display' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Row Density</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onChangeDensity('compact')}
                      className={`px-2 py-1 text-xs rounded-md ${density === 'compact' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      Compact
                    </button>
                    <button
                      onClick={() => onChangeDensity('normal')}
                      className={`px-2 py-1 text-xs rounded-md ${density === 'normal' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => onChangeDensity('relaxed')}
                      className={`px-2 py-1 text-xs rounded-md ${density === 'relaxed' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      Relaxed
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onChangeTheme('light')}
                      className={`px-2 py-1 text-xs rounded-md ${theme === 'light' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => onChangeTheme('dark')}
                      className={`px-2 py-1 text-xs rounded-md ${theme === 'dark' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => onChangeTheme('site')}
                      className={`px-2 py-1 text-xs rounded-md ${theme === 'site' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      Site
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Export Options</h4>

                {onExportData && (
                  <div className="space-y-2">
                    <button
                      onClick={() => onExportData('csv')}
                      className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                    >
                      <Download size={14} className="mr-1.5" />
                      Export as CSV
                    </button>

                    <button
                      onClick={() => onExportData('excel')}
                      className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                    >
                      <Download size={14} className="mr-1.5" />
                      Export as Excel
                    </button>

                    <button
                      onClick={() => onExportData('pdf')}
                      className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                    >
                      <Download size={14} className="mr-1.5" />
                      Export as PDF
                    </button>
                  </div>
                )}

                {onPrint && (
                  <button
                    onClick={onPrint}
                    className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                  >
                    <Printer size={14} className="mr-1.5" />
                    Print Table
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableSettings;
