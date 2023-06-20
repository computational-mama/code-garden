import express from "express";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getDatabase,
  ref,
  child,
  push,
  update,
  onValue,
  orderByKey,
  query,
} from "firebase/database";
import { updateDoc, serverTimestamp } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FBAPI,
  authDomain: "garden2-d3bec.firebaseapp.com",
  databaseURL: "https://garden2-d3bec-default-rtdb.firebaseio.com",
  projectId: "garden2-d3bec",
  storageBucket: "garden2-d3bec.appspot.com",
  messagingSenderId: "818543115760",
  appId: "1:818543115760:web:1881e6b1eb5efc4086f135",
  measurementId: "G-L7B1JWZVM1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
dotenv.config();
const port = process.env.PORT || "5500";
var appExpress = express();

// For parsing application/json
appExpress.use(express.json());

// For parsing application/x-www-form-urlencoded
appExpress.use(express.urlencoded({ extended: true }));

appExpress.use(express.static("public"));

//add api
appExpress.post("/api", (request, response, next) => {
  console.log("i got a request");
  const data = request.body;
  let memory = data.memory;
  let posX = data.posx;
  let posY = data.posy;
  writeNewPost(memory, posX, posY);

  function getList() {
    const db = getDatabase();
    return onValue(
      ref(db, "/runs/seeds"),
      (snapshot) => {
        const list = snapshot.val();
        console.log(list);
        response.send(list);
        // return list;
        // ...
      },
      {
        onlyOnce: true,
      }
    );
  }
  getList();
});
// Server setup
appExpress.listen(port, () => {
  console.log("server running");
});

// const analytics = getAnalytics(app);

function writeNewPost(userMemory, pX, pY) {
  const db = getDatabase();
  const postData = {
    userMemory: userMemory,
    createdOn: serverTimestamp(),
    pX: pX,
    pY: pY,
  };

  // Get a key for a new Post.
  const newPostKey = push(child(ref(db), "runs/seeds")).key;
  // console.log(newPostKey)

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates["/runs/seeds/" + newPostKey] = postData;
  return update(ref(db), updates);
}

// appExpress.post("/gallery", (req, res, next) => {

// });
