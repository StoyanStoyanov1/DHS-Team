'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/src/components/Layout';
import Table from '@/src/components/Table';
import type { ITableColumn } from '@/src/components/Table/interfaces';
import DeleteConfirmationDialog from '@/src/components/Table/DeleteConfirmationDialog';
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
    // Always return the predefined roles to ensure the filter has options
    return allRoles.map(role => ({
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

  const handleBulkEdit = async (selectedItems: User[], columnKey: string, newValue: any): Promise<void> => {
    console.log(`Bulk updating ${selectedItems.length} users:`, { columnKey, newValue });
    // In a real app, you would call an API here
    return new Promise<void>(resolve => setTimeout(resolve, 1000));
  };

  const columns: ITableColumn<User>[] = [
    {
      header: 'Name',
      key: 'name',
      filterable: true,
      filterType: 'search',
      hideable: true,
      sortable: true,
      searchFields: [
        { key: 'name', label: 'Name', path: 'name' }
      ],
      fieldDataType: 'text',
      recentSearches: ['John', 'admin', 'support']
    },
    {
      header: 'Email',
      key: 'email',
      filterable: true,
      filterType: 'search',
      hideable: true,
      sortable: true,
      searchFields: [
        { key: 'email', label: 'Email', path: 'email' }
      ],
      fieldDataType: 'text'
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
      sortable: false,
      fieldDataType: 'role'
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
        <span className="text-sm text-gray-500 dark:text-gray-300">{user.lastLogin}</span>
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
              columnKey: 'name',
              label: 'Name',
              type: 'text'
            },
            {
              columnKey: 'email',
              label: 'Email',
              type: 'text'
            },
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
        />

        {showDeleteConfirm && (
          <DeleteConfirmationDialog
            isOpen={showDeleteConfirm}
            itemCount={selectedUsers.length}
            itemType="users"
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
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
