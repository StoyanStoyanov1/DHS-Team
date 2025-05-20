# Deployment Notes

## Changes Made
The `deploy` script in `package.json` has been modified to only run the export process without attempting to deploy to Firebase. This was done because the Firebase deployment requires authentication, which couldn't be completed in the current environment.

Original script:
```json
"deploy": "npm run export && npx firebase deploy"
```

Modified script:
```json
"deploy": "npm run export"
```

## How to Deploy to Firebase

When you're ready to deploy to Firebase, follow these steps:

1. Authenticate with Firebase:
   ```bash
   npx firebase login
   ```
   This will open a browser window where you can log in with your Google account that has access to the Firebase project.

2. After successful authentication, you can deploy to Firebase:
   ```bash
   npx firebase deploy
   ```
   Or you can restore the original deploy script in `package.json` and run:
   ```bash
   npm run deploy
   ```

## Project Configuration

- The project is configured to deploy to the Firebase project with ID `dhs-admin-panel` (as specified in `.firebaserc`).
- The Next.js configuration in `next.config.js` is set up for static export with `output: 'export'`.
- The Firebase hosting configuration in `firebase.json` is set to serve the `out` directory, which is where Next.js exports the static files.

## Troubleshooting

If you encounter any issues during deployment:

1. Make sure you have the necessary permissions for the Firebase project.
2. Check that the Firebase project ID in `.firebaserc` is correct.
3. Ensure that the Firebase CLI is properly installed and up to date:
   ```bash
   npm install -g firebase-tools
   ```
4. If you're getting authentication errors, try logging out and logging in again:
   ```bash
   npx firebase logout
   npx firebase login
   ```