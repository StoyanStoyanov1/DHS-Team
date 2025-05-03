'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/src/components/Layout';
import Table from '@/src/components/Table';
import type { ITableColumn } from '@/src/components/Table';
import { FilterGroup, SelectedFilters } from '@/src/components/Filter/interfaces';
import { Edit, Trash2, FileText, MoreVertical, UserIcon, ShieldCheck, Activity } from 'lucide-react';
import { User, mockUsers } from '@/src/data/mock/users';
import ClientOnly from '@/src/components/ClientOnly';

// Separate the actual content into a client component
function UsersListContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Get all unique roles for default selection
  const allRoles = ['Admin', 'Editor', 'Viewer', 'Support', 'Manager', 'Analyst', 'Developer'];
  
  // Initialize filters with all roles selected
  const [filters, setFilters] = useState<SelectedFilters>({
    role: allRoles
  });
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);

  // Define filter groups for the users table
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

  // Generate role filter options dynamically
  const getRoleFilterOptions = (data: User[]) => {
    const uniqueRoles = Array.from(new Set(data.map(user => user.role)));
    return uniqueRoles.map(role => ({
      id: role.toLowerCase(),
      label: role,
      value: role
    }));
  };

  // Generate status filter options dynamically
  const getStatusFilterOptions = (data: User[]) => {
    const uniqueStatuses = Array.from(new Set(data.map(user => user.status)));
    return uniqueStatuses.map(status => ({
      id: status.toLowerCase(),
      label: status,
      value: status
    }));
  };

  // Apply filters whenever they change
  useEffect(() => {
    let result = [...mockUsers];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        user => user.name.toLowerCase().includes(searchTerm) || 
                user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply role filter (multiselect)
    if (filters.role && Array.isArray(filters.role)) {
      if (filters.role.length > 0) {
        result = result.filter(user => filters.role.includes(user.role));
      }
      // If no roles are selected, we don't filter (show all)
    }
    
    // Apply status filter (select)
    if (filters.isActive !== undefined) {
      result = result.filter(user => user.isActive === filters.isActive);
    }
    
    setFilteredUsers(result);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (selectedFilters: SelectedFilters) => {
    setFilters(selectedFilters);
  };

  // Custom sort function for the lastLogin field
  const sortLastLogin = (a: User, b: User, direction: 'asc' | 'desc' | null) => {
    const dateA = new Date(a.lastLogin);
    const dateB = new Date(b.lastLogin);
    
    if (direction === 'asc') {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
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
      // Add search fields for both name and email
      searchFields: [
        { key: 'name', label: 'Name', path: 'name' },
        { key: 'email', label: 'Email', path: 'email' }
      ],
      fieldDataType: 'text',
      // Add example recent searches
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
      defaultSelectAll: true, // Explicitly set to select all by default
      hideable: true,
      sortable: true
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
      sortable: true
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
      sortFn: sortLastLogin  // Custom sort function for dates
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
      sortable: false  // Actions column doesn't need sorting
    }
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Users List</h1>
          <p className="text-gray-600">Manage your users and their permissions</p>
        </div>

        {/* Users Table with column-specific filters, visibility options, and sorting */}
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
          multiSort={true} // Enable multi-column sorting
          // Optional: Set default sorting criteria if needed
          // defaultSortCriteria={[
          //   { key: 'role', direction: 'asc' },
          //   { key: 'isActive', direction: 'desc' }
          // ]}
          // Global filter props (optional)
          filterGroups={filterGroups}
          initialFilterValues={{}}
          onFilterChange={handleFilterChange}
          showFilter={false} // We'll use column filters instead
          filterTitle="Filter Users"
        />
      </div>
    </Layout>
  );
}

// Export a wrapper that ensures client-side only rendering
export default function UsersListPage() {
  return (
    <ClientOnly>
      <UsersListContent />
    </ClientOnly>
  );
}