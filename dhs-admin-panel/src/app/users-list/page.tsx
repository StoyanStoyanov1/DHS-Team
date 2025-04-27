'use client';

import React, { useState } from 'react';
import Layout from '@/src/components/Layout';
import Table, { ITableColumn } from '@/src/components/Table';
import { Edit, Trash2, FileText, MoreVertical } from 'lucide-react';

// User interface definition
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

// Mock user data - само 2 потребители за тестване на запълването с празни редове
const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2023-04-23',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2023-04-22',
  }
];

export default function UsersListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Users List</h1>
          <p className="text-gray-600">Manage your users and their permissions</p>
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
          fixedRowsCount={itemsPerPage} // Използваме itemsPerPage като брой на фиксирани редове
        />
      </div>
    </Layout>
  );
}