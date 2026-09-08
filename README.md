# safety-net
A decentralized marketplace for security,
in pursuit of a bottom-up libertarian revolution in ideology and civil government.

## Political and Economic Theory

A social system free of monopoly and taxation
<details>
<summary>Descriptive Terms</summary>
Terms which may be used to describe the system include, but are not limited to:
- Natural Order
- Ordered Anarchy
- Private Property Anarchism
- Free Market Anarchism
- Anarcho-Capitalism
- Auto-Government
- Private Law Society
- Pure Capitalism
</details>

## Development
### Get Started
- npm start (expo start)
- Run in web browser

### Express Server
- Run `node server.js`

### Android App Emulator
1. Install Android Studio
1. Tools > AVD (Android Virtual Device) Manager
1. Create a device if one doesn't exist (~7.5GB)
1. Launch AVD in emulator

### Build Android App
#### Local Build (testing)
1. Configure `app.json`
1. `export ANDROID_SDK_ROOT=~/Library/Android/sdk`
1. expo run:android --variant release

#### Cloud Build
1. Configure `app.json`
1. expo build:android -t apk
- might want to `expo fetch:android:keystore`
1. Follow the link to see the built artifact
1. Download to computer/phone
1. Install & Enjoy!

#### Other Builds (not tried yet)
1. expo build:android -t app-bundle
1. eas build -p android --profile preview

## Todo
1. Instructions page on how to get started running `safetynet-db`
1. Read from a blockchain
1. user-specific data access
1. Project-task UI
1. Get web url to show properly through all navigation
    - https://medium.com/@purujit.bansal9/url-integration-in-react-native-web-apps-using-react-navigation-f53d4cef0b30
    - https://reactnavigation.org/docs/nesting-navigators
    - https://reactnavigation.org/docs/configuring-links/
1. shop for domain names around 'safety net'
1. Find source code with more developed readme and components
1. Remove un-necessary files from git repo (inside .expo)

### Cleanup Tasks
1. Ensure all users have roles
1. Clean up SignUp navigational clutter
1. SignIn 'return' key executes submit
1. All files consistently jsx or tsx

### Nice to haves
1. Email string validation
1. Stronger password requirements in SignUp
1. Timers on page components
1. Feedback system
1. Read more about on a tab with its own navigation stack
1. Add 'Screen' suffix from screen object names
1. All screens have their own button
1. Themed styles
1. Firebase reconciliation tools
1. Badge System
1. User-User Messaging
1. Animated objects overlay
1. voice transcription mapped to actions
1. use firefoo https://firefoo.app/

### Creating a new screen
1. Create screen component
1. Update `types.tsx` > RootStackParamList
1. Update `navigation/LinkingConfiguration.ts`
1. Import and add screen to `navigation/index.tsx`

### Create a new API resource
Backend focused
1. Create mongodb collection (ensure plural naming)
1. Create mongoose model in `models/` (ensure singular naming)
1. Include new model in `models/index.js`
1. Create new controller in `controllers/`
1. Create new routes in `routes/`
1. Update `server.js` to use new routes
1. Restart backend server and test with Postman
Don't need to check:
- `database/db.config.js`

### Connect to API resource
F = Frontend
B = Backend
1. (F) Use Effect and State to hold data
1. (F) Call a function describing what you would like to do (resulting in error)
1. (F) Add to or create a service in `services/<model>`
1. (F) Import service into rendered page
1. (B) Create new route in `routes/<model>`
1. (B) Create new controller in `controllers/`
1. Restart API server and test to see if it works!

### safetynet-db (macOS)
1. brew tap mongodb/brew
1. brew install mongodb-community@5.0
1. start mongo `brew services start mongodb-community@5.0` or `mongod --config /usr/local/etc/mongod.conf --fork`
1. verify that MongoDB is running `brew services list` or `ps aux | grep -v grep | grep mongod`
1. connect to the running instance `mongosh`
1. stop mongo `brew services stop mongodb-community@5.0` or `mongosh` > `shutdown`
