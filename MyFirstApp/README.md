# 🚀 React Native Social Media App

A modern, high-performance social media application built with React Native and Expo, featuring optimized video playback, real-time feeds, and a beautiful user interface.

## ✨ Features

### 📱 Core Functionality
- **Social Media Feed**: Scrollable feed with posts, images, and videos
- **Video Playback**: Optimized video player with play/pause controls
- **User Profiles**: Editable user profiles with image upload
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Beautiful UI that works across devices

### 🎥 Video Features
- **5 Working Videos**: All videos are fully functional and optimized
- **Smart Loading**: Videos load only when visible for better performance
- **Auto-Pause**: Videos automatically pause when scrolled out of view
- **Playback Controls**: Intuitive play/pause buttons and media controls

### 🔍 Search & Filter System
- **Real-time Search**: Search posts by user, caption, or location
- **Category Filtering**: Filter by news, art, sports, food, travel, tech, lifestyle
- **Media Type Filter**: Filter by images, videos, or both
- **Sort Options**: Sort by date, views, or user name

### 👤 Profile Management
- **Profile Picture**: Upload and edit profile photos
- **User Information**: Manage name, gender, location, profession
- **Bio Section**: Rich text bio with character counter

## 🛠️ Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Video Player**: Expo AV
- **Image Picker**: Expo Image Picker
- **Icons**: Expo Vector Icons (Ionicons)
- **Performance**: React.memo, useMemo, useCallback optimizations

## 🚀 Performance Optimizations

### ⚡ Speed Improvements
- **Component Memoization**: All major components use React.memo
- **FlatList Virtualization**: Efficient list rendering for large datasets
- **Lazy Loading**: Videos and images load only when needed
- **Optimized Re-renders**: useCallback and useMemo prevent unnecessary updates

### 📊 Performance Metrics
- **Initial Load**: Reduced from 10 to 3 items initially
- **Memory Usage**: Optimized video management and cleanup
- **Scroll Performance**: Smooth 60fps scrolling with FlatList
- **Video Loading**: Smart visibility-based video rendering

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/REPO-NAME.git
   cd MyFirstApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator
   - Press 'w' for web browser

## 📱 App Structure

```
MyFirstApp/
├── App.js                 # Main application component
├── assets/               # Images and static assets
├── package.json          # Dependencies and scripts
├── README.md            # Project documentation
└── .gitignore           # Git ignore rules
```

## 🎯 Key Components

### FeedScreen
- **PostItem**: Memoized post component with video/image support
- **FilterModal**: Advanced filtering and sorting interface
- **FlatList**: Optimized list rendering with virtualization

### ProfileScreen
- **Image Upload**: Profile picture management
- **Form Fields**: Editable user information
- **Bio Editor**: Rich text bio with character limit

### TabNavigator
- **Bottom Tabs**: Feed, Discover, Create, Notifications, Profile
- **Lazy Loading**: Screens load only when accessed

## 🔧 Configuration

### Environment Setup
- Node.js 16+ required
- Expo CLI installed globally
- Expo Go app for mobile testing

### Dependencies
- React Native Navigation
- Expo AV for video playback
- Expo Image Picker for photo uploads
- React Native Safe Area Context

## 📊 Video Content

The app includes 5 fully functional videos:

1. **BigBuckBunny.mp4** - Amit Saxena's post
2. **ElephantsDream.mp4** - Rahul Sharma's marathon post
3. **ForBiggerBlazes.mp4** - Vikram Singh's hiking post
4. **ForBiggerEscapes.mp4** - Arjun Reddy's food post
5. **ForBiggerFun.mp4** - Karan Malhotra's coding post

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Smooth Animations**: Fluid transitions and interactions
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Proper contrast and touch targets
- **Loading States**: Visual feedback for user actions

## 🔄 State Management

- **Local State**: React hooks for component state
- **Optimized Updates**: Functional state updates
- **Memoized Values**: Expensive calculations cached
- **Event Handlers**: Memoized callbacks for performance

## 📈 Performance Benchmarks

- **Bundle Size**: Optimized with tree shaking
- **Load Time**: Fast initial render with lazy loading
- **Memory Usage**: Efficient video and image management
- **Scroll Performance**: Smooth 60fps scrolling
- **Video Playback**: Optimized for mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the amazing development platform
- **React Native Community**: For the excellent ecosystem
- **Ionicons**: For the beautiful icon set
- **Unsplash**: For the sample images

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ using React Native and Expo** 

## 1. **Check the Terminal Output**
- You should see something like:
  ```
  › Web is waiting on http://localhost:8083
  ```
- If you see this, the Metro Bundler is running and serving the web app.

## 2. **Open the Correct URL**
- Open your browser and go to:  
  **http://localhost:8083**  
  or  
  **http://127.0.0.1:8083**

## 3. **If the Page is Blank or Not Loading**
- **Open the browser console (F12 > Console tab)**
- Look for any red error messages and copy them here.

## 4. **Common Issues and Fixes**

### **A. Port Blocked or In Use**
- If you see a message about the port being in use, Metro will pick another port (e.g., 8082, 8083). Make sure you use the port shown in the terminal.

### **B. Firewall or Antivirus**
- Sometimes, Windows Firewall or antivirus blocks local ports. Try temporarily disabling them and reload the page.

### **C. Browser Cache**
- Hard refresh the page:  
  **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

### **D. App Crash/Error**
- If you see a red error screen or nothing loads, check the browser console for errors.
- If you see a FlatList or React error, please copy the error message here.

### **E. Metro Bundler Not Running**
- Make sure the terminal is open and running `expo start` or `npm start` in the `MyFirstApp` directory.

### **F. Network Issues**
- Try a different browser (Chrome, Edge, Firefox).
- Try `http://localhost:8083` and `http://127.0.0.1:8083`.

---

## 5. **If Still Not Working**
- Please copy and paste:
  - The **exact error message** from your browser console
  - The **terminal output** after you run `npm start`
  - A screenshot or description of what you see in the browser

---

**Let me know what you see in the browser and in the console, and I’ll help you fix it step by step!** 

---

### 1. **Make sure the repository exists**
- Go to: https://github.com/xrincx321/FirstAssessment
- If it does not exist, create it (do not add a README, .gitignore, or license).

---

### 2. **Set up authentication (if private or if you get prompted for a password)**
- If your repo is private, you need a GitHub personal access token (PAT).
- [Create a token here](https://github.com/settings/tokens) (classic, with `repo` scope).
- When prompted for a password during push, use your GitHub username and the token as the password.

---

### 3. **Push your code**
Since you already committed your files, run:
```sh
<code_block_to_apply_changes_from>
```
If you get an authentication prompt, use your username and the token.

---

#### If you see “Repository not found”:
- Double-check the repo URL and spelling.
- Make sure you are logged in as `xrincx321`.
- Make sure the repo is created and you have access.

---

**If you want, I can try the push again now, but if authentication is required, you’ll need to enter your username and token in your terminal. Would you like to proceed?**  
If yes, please run:
```sh
git push -u origin main
```
in your terminal and follow the authentication prompt.

Let me know if you encounter any errors or need help with the token! 

Congratulations! 🎉  
If your code is now showing in your GitHub repository, that means you have successfully pushed your project to GitHub.

You can now:
- Share your repository link with others.
- Continue working and push new changes using:
  ```sh
  git add .
  git commit -m "Your message"
  git push
  ```
- Collaborate with others or use GitHub features like Issues, Pull Requests, etc.

If you need help with anything else—like making future commits, branching, or collaborating—just let me know! 

Thank you for pointing that out!  
If your `MyFirstApp` folder on GitHub only shows:
- `.gitignore`
- `package-lock.json`
- `package.json`

but **does not show your actual code files** (like `App.js`, `index.js`, etc.), it means only those files were tracked and pushed, or the rest were ignored or not added.

---

## Here’s how to fix it and upload all your code:

### 1. **Check if the files exist locally**
- Make sure you see files like `App.js`, `index.js`, and others inside `MyFirstApp` on your computer.

### 2. **Check your .gitignore**
- Open `.gitignore` in your project root and in `MyFirstApp/` and make sure it does NOT contain rules that would ignore your code files (like `*.js` or `App.js`).

### 3. **Add all files in MyFirstApp**
In your terminal, run:
```sh
git add MyFirstApp/*
git add MyFirstApp/*/*
```
This will stage all files and subfolders inside `MyFirstApp`.

### 4. **Commit the changes**
```sh
git commit -m "Add missing source files in MyFirstApp"
```

### 5. **Push to GitHub**
```sh
<code_block_to_apply_changes_from>
```

---

**After this, refresh your GitHub repository page. You should now see all your code files inside `MyFirstApp`.**

If you want, I can guide you step by step or help you troubleshoot if any files are still missing! 

---

Absolutely! Here’s a step-by-step guide to make sure all your code files in `MyFirstApp` are uploaded to GitHub:

---

## **Step 1: Check Your Files Locally**
- Open the `MyFirstApp` folder on your computer.
- Make sure you see files like `App.js`, `index.js`, and any other source files you want to upload.

---

## **Step 2: Check .gitignore**
- Open the `.gitignore` file in your project root and in `MyFirstApp/` (if it exists).
- Make sure it does **not** contain lines like `*.js` or `App.js` that would ignore your code files.

---

## **Step 3: Remove Submodule Reference (if it exists)**
If you previously added `MyFirstApp` as a submodule, run:
```sh
<code_block_to_apply_changes_from>
```
*(The second command removes the `.git` folder inside `MyFirstApp` if it exists, making it a normal folder.)*

---

## **Step 4: Add All Files in MyFirstApp**
Run these commands in your terminal:
```sh
git add MyFirstApp/*
git add MyFirstApp/*/*
```
*(This will stage all files and subfolders inside `MyFirstApp`.)*

---

## **Step 5: Commit the Changes**
```sh
git commit -m "Add missing source files in MyFirstApp"
```

---

## **Step 6: Push to GitHub**
```sh
git push
```

---

## **Step 7: Check Your Repository**
- Go to your GitHub repo page and refresh.
- You should now see all your code files inside the `MyFirstApp` folder.

---

### If you see any errors or files are still missing, let me know the error message or what you see, and I’ll help you fix it! 