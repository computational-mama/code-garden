let memory;
let submit;
let cnv;
let formWrite;
let plantOK;
let touchBegin = false;
let touchCount = 0;
let posX;
let posY;
let savedMemory;
let memoryMade;
let positionX;
let positionY;
let locations = {};
let arrX = [];
let arrY = [];
let petals;
let colorArr = ["#a03443", "#340dsa", "#300ee3"];
let plant1;
let plant2;
let plant3;
let plant4;
let plant5;
let chosenPlant;
let planted = [];
let plants = [];
let t = 0;

function preload() {
  plant1 = loadImage("assets/1.png");
  plant2 = loadImage("assets/2.png");
  plant3 = loadImage("assets/3.png");
  plant4 = loadImage("assets/4.png");
  plant5 = loadImage("assets/5.png");
  for (i = 0; i < 4; i++) {
    plants = loadImage("assets/" + (i + 1) + ".png");
  }
}
function setup() {
  createCanvas(0, 0);
  memory = createInput("");
  memory.addClass("border-2 border-gray-500 rounded-md w-full h-32 mt-4");
  submit = createButton("Save");
  submit.addClass("px-8 py-4 rounded-full bg-green-200 mt-4");

  memory.parent("#submitMemory");
  submit.parent("#submitMemory");

  formWrite = select("#write");
  plantOK = select("#done");
  savedMemory = select("#savedMemory");

  submit.mousePressed(saveMem);
  plantOK.mousePressed(savePlant);
  let plantArr = [plant1, plant2, plant3, plant4, plant5];
  // chosenPlant =console.log(random(plants));
  chosenPlant = getRandomItem(plantArr);
  console.log(chosenPlant[0], chosenPlant[1]);
  rectMode(CENTER);
  // frameRate(1);

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
      arrX.push(data[key].pX);
      arrY.push(data[key].pY);
      planted.push(data[key].plant);
    });
  });
  console.log(planted);
}

function draw() {
  background("#fef08a");

  for (i = 0; i < arrX.length; i++) {
    // if (planted[i] != "null") {
    plantPlant(arrX[i], arrY[i]);
    // }
  }
  if (touchCount > 0) {
    for (var i = 0; i < touches.length; i++) {
      //make a rectangle for each touch position
      if (touchCount <= 3) {
        fill(230);
        noStroke();
        circle(touches[i].x, touches[i].y, 60);
      }
    }
    if (posX != "null" && touchCount == 3) {
      plantPlant(posX, posY);
    }
  }
  if (savedMemory.html != "null") {
    savedMemory.position(posX, posY + t);
    t--;
  }
}

function touchEnded() {
  if (touchBegin == true) {
    touchCount++;
    console.log(touchCount);
    if (touchCount > 1) {
      // console.log("saved at: " + mouseX + ", " + mouseY + memory.value());
      posX = mouseX;
      posY = mouseY;
    }

    if (touchCount == 2) {
      // savedMemory.removeClass("hidden");
      // savedMemory.addClass("block");
      savedMemory.html(memory.value());
      let usermemory = memory.value();
      let positionX = posX;
      let positionY = posY;
      sendData(
        usermemory,
        positionX,
        positionY
        // JSON.stringify(chosenPlant[0])
      );
      setInterval(() => {
        select("#thanks").show();
      }, 2500);
    }
  }
  //memory typed by user, date created, position.x, position.y, randomPlantName all go to firebase. randomPlant and p.x p.y show on canvas
}

function plantPlant(x, y) {
  // console.log(chosenPlant);
  image(chosenPlant[0], x, y, 50, 80);
}

function saveMem() {
  // console.log(memory.value());
  resizeCanvas(displayWidth, displayHeight);
  background("#fef08a");
  formWrite.addClass("hidden");
  select("#plant").show();
  // for (i = 0; i < arrX.length; i++) {
  //   if (planted[i] != "null") {
  //     // planted[i] = planted[i].replace(/"/g, "");
  //     plantPlant(arrX[i], arrY[i], planted[i]);
  //   }
  // }
}

function savePlant() {
  select("#plant").hide();
  touchBegin = true;
}

async function sendData(mem, px, py) {
  const promptdata = {
    memory: mem,
    posx: px,
    posy: py,
    // plantName: plantName,
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(promptdata),
  };

  fetch("/api", options)
    .then((response) => {
      console.log(response);
      return response.text();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((ex) => {
      console.error(ex);
    });
}

function getRandomItem(arr) {
  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);
  // get random item
  const item = arr[randomIndex];

  return [item, randomIndex];
}
