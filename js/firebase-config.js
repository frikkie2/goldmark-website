/* ===== FIREBASE CONFIGURATION ===== */

const firebaseConfig = {
  apiKey: "AIzaSyCi-nK8TgWb9Fc23rfqw2u6HJ0eut4uHnM",
  authDomain: "goldmark-realestate-website.firebaseapp.com",
  projectId: "goldmark-realestate-website",
  storageBucket: "goldmark-realestate-website.firebasestorage.app",
  messagingSenderId: "889699019121",
  appId: "1:889699019121:web:ecce247e57e17fa204eed0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore reference
const db = firebase.firestore();
