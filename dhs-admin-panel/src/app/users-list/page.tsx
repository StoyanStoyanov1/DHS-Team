'use client';

import React, { useState } from 'react';
import Layout from '@/src/components/Layout';
import Table, { ITableColumn } from '@/src/components/Table';
import { Edit, Trash2, FileText, MoreVertical, ChevronDown } from 'lucide-react';
import { User, mockUsers } from '@/src/data/mock/users';

export default function UsersListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isTableSizeOpen, setIsTableSizeOpen] = useState(false); // State for dropdown visibility

  // Define columns for the user table
  const columns: ITableColumn<User>[] = [
    {
      header: 'User',
      key: 'name',
      render: (user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      key: 'role',
      render: (user) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
            user.role === 'Editor' ? 'bg-blue-100 text-blue-800' : 
            'bg-green-100 text-green-800'}`}>
          {user.role}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (user) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {user.status}
        </span>
      )
    },
    {
      header: 'Last Login',
      key: 'lastLogin',
      render: (user) => (
        <span className="text-sm text-gray-500">{user.lastLogin}</span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (user) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900" title="View Details">
            <FileText size={18} />
          </button>
          <button className="text-green-600 hover:text-green-900" title="Edit User">
            <Edit size={18} />
          </button>
          <button className="text-red-600 hover:text-red-900" title="Delete User">
            <Trash2 size={18} />
          </button>
          <button className="text-gray-600 hover:text-gray-900" title="More Options">
            <MoreVertical size={18} />
          </button>
        </div>
      )
    }
  ];

  // Handle click on dropdown
  const toggleTableSizeDropdown = () => {
    setIsTableSizeOpen(!isTableSizeOpen);
  };

  // Handle selection of row count
  const handleRowCountSelect = (count: number) => {
    setItemsPerPage(count);
    setIsTableSizeOpen(false);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Users List</h1>
          <p className="text-gray-600">Manage your users and their permissions</p>
        </div>

        {/* Table Size Controls - Modern Dropdown Design */}
        <div className="mb-4 relative">
          <label htmlFor="tableSize" className="block text-sm font-medium text-gray-700 mb-1">
            Table Size:
          </label>
          <div className="relative inline-block text-left w-40">
            <button
              type="button"
              onClick={toggleTableSizeDropdown}
              className="inline-flex w-full justify-between items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="table-size-button"
              aria-expanded={isTableSizeOpen}
              aria-haspopup="true"
            >
              {itemsPerPage} rows
              <ChevronDown className="h-4 w-4 ml-2" aria-hidden="true" />
            </button>

            {/* Dropdown Menu */}
            {isTableSizeOpen && (
              <div 
                className="absolute right-0 z-10 mt-1 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="table-size-button"
                tabIndex={-1}
              >
                <div className="py-1">
                  {[5, 10, 15, 25, 50].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleRowCountSelect(size)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        itemsPerPage === size
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      role="menuitem"
                      tabIndex={-1}
                    >
                      {size} rows
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Click outside listener */}
          {isTableSizeOpen && (
            <div 
              className="fixed inset-0 z-0" 
              onClick={() => setIsTableSizeOpen(false)}
            />
          )}
        </div>

        {/* Users Table */}
        <Table 
          columns={columns}
          data={mockUsers}
          keyExtractor={(user) => user.id}
          emptyMessage="No users found"
          pagination={true}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPageOptions={[5, 10, 15, 25, 50]}
          fixedTableSize={true} // Включваме фиксиран размер на таблицата
        />
      </div>
    </Layout>
  );
}