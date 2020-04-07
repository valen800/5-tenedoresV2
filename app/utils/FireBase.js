import firebase from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyAqCRr3HuJn1t9kTpAbDzuY2Q-lOKYfL-c",
  authDomain: "tenedores-9e793.firebaseapp.com",
  databaseURL: "https://tenedores-9e793.firebaseio.com",
  projectId: "tenedores-9e793",
  storageBucket: "tenedores-9e793.appspot.com",
  messagingSenderId: "728019526047",
  appId: "1:728019526047:web:45984c75a2d91dbbc85daa",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
