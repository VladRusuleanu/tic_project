import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5g4m_MfhiVXGn03lrRfaw4l7qFys6ymU",
  authDomain: "tic-project-6184f.firebaseapp.com",
  projectId: "tic-project-6184f",
  storageBucket: "tic-project-6184f.firebasestorage.app",
  messagingSenderId: "409294064308",
  appId: "1:409294064308:web:e308a1b0d2c97a906525e1"
};


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { auth }