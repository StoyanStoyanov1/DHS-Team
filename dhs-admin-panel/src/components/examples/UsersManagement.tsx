import React, { useState } from 'react';
import { useUsersService } from '../../hooks/useUsersService';
import { User } from '../../data/mock/users';

/**
 * Примерен компонент за управление на потребители, който използва CRUD сервизите
 */
const UsersManagement: React.FC = () => {
  // Използване на CRUD сервиза за потребители
  const {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    changeUserRole,
    searchUsers
  } = useUsersService();

  // Локални състояния за управление на формуляри
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    isActive: true
  });

  // Обработка на промени в страницирането
  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, pagination.pageSize);
  };

  // Обработка на промени в размера на страницата
  const handlePageSizeChange = (newPageSize: number) => {
    fetchUsers(1, newPageSize);
  };

  // Обработка на промени в полетата на формата за създаване/редактиране
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Обработка на checkbox полета
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Изпращане на формата за създаване на потребител
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Текуща дата за lastLogin
    const lastLogin = new Date().toISOString().split('T')[0];
    
    await createUser({
      ...formData,
      status: formData.isActive ? 'Active' : 'Inactive',
      lastLogin
    });
    
    // Връщане на формата към начални стойности след създаване
    setFormData({
      name: '',
      email: '',
      role: 'Viewer',
      isActive: true
    });
  };

  // Изпращане на формата за редактиране на потребител
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      await updateUser(editingUser.id, {
        ...formData,
        status: formData.isActive ? 'Active' : 'Inactive'
      });
      
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'Viewer',
        isActive: true
      });
    }
  };

  // Започване на редактирането на потребител
  const handleEditClick = async (userId: number) => {
    const user = await fetchUserById(userId);
    
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      });
    }
  };

  // Изтриване на потребител
  const handleDeleteClick = async (userId: number) => {
    if (window.confirm('Сигурни ли сте, че искате да изтриете този потребител?')) {
      await deleteUser(userId);
    }
  };

  // Промяна на статуса на потребител
  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    await toggleUserStatus(userId, !currentStatus);
  };

  // Промяна на ролята на потребител
  const handleRoleChange = async (userId: number, newRole: string) => {
    await changeUserRole(userId, newRole);
  };

  // Търсене на потребители
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchUsers(searchTerm);
  };

  // Филтриране по роля
  const handleRoleFilterChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    setRoleFilter(role);
    
    if (role) {
      fetchUsers(1, pagination.pageSize, undefined, undefined, { role });
    } else {
      fetchUsers(1, pagination.pageSize);
    }
  };

  // Изчистване на филтрите
  const handleClearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    fetchUsers(1, pagination.pageSize);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Управление на потребители</h1>
      
      {/* Съобщение за грешка */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          <p className="font-medium">Грешка: {error}</p>
        </div>
      )}
      
      {/* Зареждане */}
      {loading && (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Форма за търсене */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Търсене на потребители</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Търси по име или имейл"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <select
                value={roleFilter}
                onChange={handleRoleFilterChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Всички роли</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
                <option value="Support">Support</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                Търси
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Изчисти
              </button>
            </div>
          </form>
        </div>
        
        {/* Форма за създаване/редактиране */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            {editingUser ? 'Редактиране на потребител' : 'Създаване на потребител'}
          </h2>
          <form onSubmit={editingUser ? handleUpdateSubmit : handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Име</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Име на потребителя"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Имейл</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Роля</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
                <option value="Support">Support</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Активен потребител
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {editingUser ? 'Запази' : 'Създай'}
              </button>
              {editingUser && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setFormData({
                      name: '',
                      email: '',
                      role: 'Viewer',
                      isActive: true
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Отказ
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Таблица с потребители */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Име
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Имейл
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Роля
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Последно влизане
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-2 py-1 border rounded-md"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                    <option value="Support">Support</option>
                    <option value="Manager">Manager</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Developer">Developer</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Активен' : 'Неактивен'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(user.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Редактирай
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Изтрий
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Пагинация */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Показване на {(pagination.page - 1) * pagination.pageSize + 1} до {Math.min(pagination.page * pagination.pageSize, pagination.total)} от {pagination.total} потребители
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Назад
          </button>
          {[...Array(pagination.totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 border rounded-md ${
                pagination.page === index + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-white'
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Напред
          </button>
          <select
            value={pagination.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-1 border rounded-md"
          >
            <option value="5">5 / страница</option>
            <option value="10">10 / страница</option>
            <option value="15">15 / страница</option>
            <option value="25">25 / страница</option>
            <option value="50">50 / страница</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;