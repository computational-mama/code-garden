let memory;
let arrX = [];
let para;

function setup() {
  noCanvas();

  const firebaseConfig = {
    apiKey: "AIzaSyAfTyAtO1mGJzukO3AOI-2ik83xGCBNIjQ",
    authDomain: "garden2-d3bec.firebaseapp.com",
    databaseURL: "https://garden2-d3bec-default-rtdb.firebaseio.com",
    projectId: "garden2-d3bec",
    storageBucket: "garden2-d3bec.appspot.com",
    messagingSenderId: "818543115760",
    appId: "1:818543115760:web:1881e6b1eb5efc4086f135",
    measurementId: "G-L7B1JWZVM1",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the database
  // var database = firebase.database();

  var starCountRef = firebase.database().ref("/runs/seeds");
  starCountRef.on("value", (snapshot) => {
    const data = snapshot.val();
    Object.keys(data).forEach((key) => {
      // arrX.push(data[key].userMemory);
      mem = data[key].userMemory;
      para = createP(mem);
      para.parent("#memList");
      para.addClass("p-6 mx-4 my-7 bg-yellow-100/60");
    });
  });

  // arrX.forEach((el) => {
  //   console.log(el);
  // });
}
