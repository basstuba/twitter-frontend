import firebase from "firebase";

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyDcI3TR7bJ0hW2u_UjpvZ9S_ijAvyy-5rQ",
        authDomain: "twitter-frontend-3ba32.firebaseapp.com",
        projectId: "twitter-frontend-3ba32",
        storageBucket: "twitter-frontend-3ba32.appspot.com",
        messagingSenderId: "12831780523",
        appId: "1:12831780523:web:2819d2e783fb39b14b91ee",
        measurementId: "G-1K0PGGLP6E"
    });
}

export default firebase;