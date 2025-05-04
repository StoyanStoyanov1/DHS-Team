'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/src/components/Layout';
import Table from '@/src/components/Table';
import type { ITableColumn } from '@/src/components/Table';
import { FilterGroup, SelectedFilters } from '@/src/components/Filter/interfaces';
import { Edit, Trash2, FileText, MoreVertical, UserIcon, ShieldCheck, Activity } from 'lucide-react';
import { User, mockUsers } from '@/src/data/mock/users';
import ClientOnly from '@/src/components/ClientOnly';

function UsersListContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const allRoles = ['Admin', 'Editor', 'Viewer', 'Support', 'Manager', 'Analyst', 'Developer'];
  
  const [filters, setFilters] = useState<SelectedFilters>({
    role: allRoles
  });
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filterGroups: FilterGroup[] = [
    {
      id: 'search',
      label: 'Search Users',
      type: 'search',
      placeholder: 'Search by name or email',
      icon: <UserIcon size={16} />,
    },
    {
      id: 'role',
      label: 'Role',
      type: 'multiselect',
      options: [
        { id: 'admin', label: 'Admin', value: 'Admin' },
        { id: 'editor', label: 'Editor', value: 'Editor' },
        { id: 'viewer', label: 'Viewer', value: 'Viewer' },
        { id: 'support', label: 'Support', value: 'Support' },
        { id: 'manager', label: 'Manager', value: 'Manager' },
        { id: 'analyst', label: 'Analyst', value: 'Analyst' },
        { id: 'developer', label: 'Developer', value: 'Developer' },
      ],
      icon: <ShieldCheck size={16} />,
      initialValue: allRoles,
    },
    {
      id: 'isActive',
      label: 'Status',
      type: 'select',
      options: [
        { id: 'active', label: 'Active', value: true },
        { id: 'inactive', label: 'Inactive', value: false },
      ],
      icon: <Activity size={16} />,
    },
  ];

  const getRoleFilterOptions = (data: User[]) => {
    if (!data || !Array.isArray(data)) {
      return allRoles.map(role => ({
        id: role.toLowerCase(),
        label: role,
        value: role
      }));
    }

    const uniqueRoles = Array.from(new Set(data.map(user => user.role)));
    return uniqueRoles.map(role => ({
      id: role.toLowerCase(),
      label: role,
      value: role
    }));
  };

  const getStatusFilterOptions = (data: User[]) => {
    if (!data || !Array.isArray(data)) {
      return [
        { id: 'active', label: 'Active', value: 'Active' },
        { id: 'inactive', label: 'Inactive', value: 'Inactive' }
      ];
    }

    const uniqueStatuses = Array.from(new Set(data.map(user => user.status)));
    return uniqueStatuses.map(status => ({
      id: status.toLowerCase(),
      label: status,
      value: status
    }));
  };

  useEffect(() => {
    let result = [...mockUsers];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        user => user.name.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.role && Array.isArray(filters.role)) {
      if (filters.role.length > 0) {
        result = result.filter(user => filters.role.includes(user.role));
      }
    }
    
    if (filters.isActive !== undefined) {
      result = result.filter(user => user.isActive === filters.isActive);
    }
    
    setFilteredUsers(result);
  }, [filters]);

  const handleFilterChange = (selectedFilters: SelectedFilters) => {
    setFilters(selectedFilters);
  };

  const sortLastLogin = (a: User, b: User, direction: 'asc' | 'desc' | null) => {
    const dateA = new Date(a.lastLogin);
    const dateB = new Date(b.lastLogin);
    
    if (direction === 'asc') {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  };

  const handleSelectionChange = (selected: User[]) => {
    setSelectedUsers(selected);
  };

  const handleDelete = () => {
    if (selectedUsers.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    setFilteredUsers(prev => 
      prev.filter(user => !selectedUsers.find(selected => selected.id === user.id))
    );
    setSelectedUsers([]);
    setShowDeleteConfirm(false);
  };

  const handleUpdate = () => {
    // The BulkEditBar will automatically show when items are selected
  };

  const handleBulkEdit = async (selectedItems: User[], columnKey: string, newValue: any) => {
    console.log(`Bulk updating ${selectedItems.length} users:`, { columnKey, newValue });
    // In a real app, you would call an API here
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

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
      ),
      filterable: true,
      filterType: 'search',
      hideable: true,
      sortable: true,
      searchFields: [
        { key: 'name', label: 'Name', path: 'name' },
        { key: 'email', label: 'Email', path: 'email' }
      ],
      fieldDataType: 'text',
      recentSearches: ['John', 'admin', 'support']
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
      ),
      filterable: true,
      filterType: 'multiselect',
      getFilterOptions: getRoleFilterOptions,
      labelAll: 'All Roles',
      defaultSelectAll: true,
      hideable: true,
      sortable: false // Disable sorting for Role
    },
    {
      header: 'Status',
      key: 'isActive',
      render: (user) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {user.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
      filterable: true,
      filterType: 'boolean',
      labelTrue: 'Active',
      labelFalse: 'Inactive',
      labelAll: 'All Statuses',
      hideable: true,
      sortable: false // Disable sorting for Status
    },
    {
      header: 'Last Login',
      key: 'lastLogin',
      render: (user) => (
        <span className="text-sm text-gray-500">{user.lastLogin}</span>
      ),
      filterable: true,
      filterType: 'daterange',
      hideable: true,
      sortable: true,
      sortFn: sortLastLogin
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
      ),
      filterable: false,
      hideable: false,
      sortable: false
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Users List</h1>
          <p className="text-gray-600">Manage your users and their permissions</p>
        </div>

        {selectedUsers.length > 0 && (
          <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-indigo-700 mr-4">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-3"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Selected
              </button>
              <button
                onClick={handleUpdate}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit size={16} className="mr-2" />
                Update Selected
              </button>
            </div>
          </div>
        )}

        <Table 
          columns={columns}
          data={filteredUsers}
          keyExtractor={(user) => user.id}
          emptyMessage="No users found"
          pagination={true}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPageOptions={[5, 10, 15, 25, 50]}
          fixedTableSize={true}
          showTableSizeControls={true}
          defaultSortKey={undefined}
          defaultSortDirection={null}
          multiSort={true}
          showSelectionColumn={true}
          onSelectionChange={handleSelectionChange}
          editableColumns={[
            {
              columnKey: 'isActive',
              label: 'Status',
              type: 'boolean'
            },
            {
              columnKey: 'role',
              label: 'Role',
              type: 'select',
              options: [
                { label: 'Admin', value: 'Admin' },
                { label: 'Editor', value: 'Editor' },
                { label: 'Viewer', value: 'Viewer' },
                { label: 'Support', value: 'Support' },
                { label: 'Manager', value: 'Manager' },
                { label: 'Analyst', value: 'Analyst' },
                { label: 'Developer', value: 'Developer' }
              ]
            }
          ]}
          onBulkEdit={handleBulkEdit}
          filterGroups={filterGroups}
          initialFilterValues={{}}
          onFilterChange={handleFilterChange}
          showFilter={false}
          filterTitle="Filter Users"
        />

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-sm w-full mx-4">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete {selectedUsers.length} selected user{selectedUsers.length > 1 ? 's' : ''}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function UsersListPage() {
  return (
    <ClientOnly>
      <UsersListContent />
    </ClientOnly>
  );
}