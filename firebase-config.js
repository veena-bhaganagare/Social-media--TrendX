/* ==========================================================================
   TrendX — Firebase configuration

   1. Go to https://console.firebase.google.com and create a project.
   2. Project settings → General → "Your apps" → Add app → Web (</>).
   3. Copy the config object Firebase gives you and paste the values below.
   4. In the Firebase console, enable:
        Authentication → Sign-in method → Email/Password  (Enable)
        Authentication → Sign-in method → Google           (Enable)
        Firestore Database → Create database                (Start in
          production mode, then apply the security rules from the README)
   ========================================================================== */

var firebaseConfig = {
  apiKey: "AIzaSyDjIMIzZa9FfDzoW6EKALlPHw9JFMfuGXQ",
  authDomain: "trendx-97dd4.firebaseapp.com",
  projectId: "trendx-97dd4",
  storageBucket: "trendx-97dd4.firebasestorage.app",
  messagingSenderId: "513693994545",
  appId: "1:513693994545:web:a56025a34fbc8e6f8d8f10",
  measurementId: "G-C9JQ83QY5N"
};

firebase.initializeApp(firebaseConfig);
