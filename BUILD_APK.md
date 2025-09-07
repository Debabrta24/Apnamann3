# Building APK for ApnaMann Mental Health App

Your ApnaMann app is now ready to be built as an Android APK! Here are your options:

## Option 1: GitHub Actions (Recommended - Automated)

1. **Push your code to GitHub** (if not already there)
2. **Enable GitHub Actions** in your repository settings
3. **Push any changes** to trigger the build automatically
4. **Download the APK** from:
   - Go to Actions tab in your GitHub repo
   - Click on the latest build
   - Download the `app-debug-apk` artifact
   - Or check the Releases section for tagged releases

## Option 2: Local Build (For Development)

### Prerequisites:
- Install [Android Studio](https://developer.android.com/studio)
- Install [Node.js](https://nodejs.org/) (version 18 or higher)

### Steps:
```bash
# 1. Install dependencies
npm install

# 2. Build the web app
npm run build

# 3. Sync with Android
npx cap sync android

# 4. Build the APK
cd android
./gradlew assembleDebug
```

Your APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Option 3: Open in Android Studio

```bash
# After syncing
npx cap open android
```

Then build directly in Android Studio (Build → Build APK(s))

## App Details

- **App Name**: ApnaMann - Mental Health Support
- **Package ID**: com.apnamanna.mentalhealth
- **Build Type**: Debug APK (for testing)

## Features Included

✅ AI-powered mental health chatbot
✅ Mental health screening (PHQ-9, GAD-7)  
✅ Counselor booking system
✅ Peer support forums
✅ Crisis intervention
✅ Mood tracking
✅ Educational resources
✅ Push notifications
✅ Local notifications
✅ Device haptics

## Production Build

For a production release APK, replace `assembleDebug` with `assembleRelease` and ensure you have proper signing keys configured.

---

**Need help?** The automated GitHub Actions build is the easiest option - just push your code and get the APK automatically!