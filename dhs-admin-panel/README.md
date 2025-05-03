## Project Overview

This project is an admin panel built with [Next.js](https://nextjs.org), designed to manage and monitor application data. It includes features such as user authentication, role-based access control, and dynamic navigation.

### Features

- **Authentication**: Secure login, registration, and token-based authentication.
- **Role Management**: Manage user roles and permissions.
- **Dynamic Navigation**: Sidebar and header navigation with responsive design.
- **Validation**: Client-side and server-side validation for forms.
- **Testing**: Comprehensive unit and integration tests using Jest and React Testing Library.

### Project Structure

The project is organized as follows:

- **`src/app/`**: Contains the main application pages, including authentication pages (`login` and `register`).
- **`src/components/`**: Reusable UI components such as `Alert`, `Breadcrumb`, `Header`, and `Sidebar`.
- **`src/hooks/`**: Custom React hooks like `useAuth` for managing authentication state.
- **`src/services/`**: API services for handling authentication and other backend interactions.
- **`src/utils/`**: Utility functions for cookies, validation, and other helpers.
- **`src/tests/`**: Test files for components, hooks, and services.

### How to Use

1. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

   If changes are not visible on the page, see:
   - [Troubleshooting Guide](TROUBLESHOOTING.md) - Step-by-step instructions to resolve the issue
   - [Solution Document](SOLUTION.md) - Detailed explanation of the issue and its solutions

   Or run the automated fix script:
   ```bash
   # Make the script executable first
   chmod +x restart-dev.sh

   # Then run it
   ./restart-dev.sh
   ```

2. **Authentication**:
   - Navigate to `/auth/login` to log in.
   - Navigate to `/auth/register` to create a new account.

3. **Navigation**:
   - Use the sidebar to access different sections of the admin panel.

4. **Testing**:
   - Run tests using:
     ```bash
     npm test
     ```

### Deployment

Deploy the app using [Vercel](https://vercel.com) or any other hosting platform that supports Next.js.

### Contributing

Contributions are welcome! Please follow the guidelines below:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

### License

This project is licensed under the MIT License.
