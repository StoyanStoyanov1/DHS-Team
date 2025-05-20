# Firebase Deployment Command

To deploy your Next.js application to Firebase, you need to follow these steps:

## Step 1: Build your application
First, build your Next.js application for production:
```bash
npm run export
```
This command will create a static export of your application in the `out` directory.

## Step 2: Authenticate with Firebase
Before deploying, you need to authenticate with Firebase:
```bash
npx firebase login
```
This will open a browser window where you can log in with your Google account that has access to the Firebase project.

## Step 3: Deploy to Firebase
After successful authentication, deploy your application to Firebase:
```bash
npx firebase deploy
```

## All-in-one command
If you want to do everything in one command, you can use:
```bash
npm run export && npx firebase deploy
```

## Note
You can also restore the original deploy script in package.json:
```json
"deploy": "npm run export && npx firebase deploy"
```
And then simply run:
```bash
npm run deploy
```

For more detailed information about the deployment process, please refer to the DEPLOYMENT_NOTES.md file.