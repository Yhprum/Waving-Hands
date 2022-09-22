import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
// import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDp2fjUnTy_kNvyh-czQk6vZvbAm-2i1lY",
  authDomain: "waving-hands-game.firebaseapp.com",
  databaseURL: "https://waving-hands-game-default-rtdb.firebaseio.com",
  projectId: "waving-hands-game",
  storageBucket: "waving-hands-game.appspot.com",
  messagingSenderId: "685814823539",
  appId: "1:685814823539:web:98e9bc3101512e73510806",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

// const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));
setPersistence(auth, browserSessionPersistence);
