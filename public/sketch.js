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
  petals = int(random(5, 20));

  rectMode(CENTER);
  frameRate(1);
}

function draw() {
  background("#fef08a");
  for (i = 0; i < arrX.length; i++) {
    cuteShape(arrX[i], arrY[i], arrX[i] / 4, petals, petals);
  }
  if (touchCount > 0) {
    for (var i = 0; i < touches.length; i++) {
      //make a rectangle for each touch position
      fill(0);
      circle(touches[i].x, touches[i].y, 120);
    }
    if (posX != "null") {
      // cuteShape(posX, posY);
      cuteShape(posX, posY, posX / 4, petals, petals);
    }
  }
  // console.log(locations);
}

function touchEnded() {
  if (touchBegin == true) {
    touchCount++;
    console.log(touchCount);
    if (touchCount > 1) {
      rect(mouseX, mouseY, 15, 50);
      // createP("done planting");
      console.log("saved at: " + mouseX + ", " + mouseY + memory.value());
      // resizeCanvas(0, 0);
      posX = mouseX;
      posY = mouseY;
      // select("#thanks").show();
    }

    if (touchCount == 2) {
      select("#thanks").show();
      savedMemory.html(memory.value());
      savedMemory.position(posX, posY);

      let usermemory = memory.value();
      let positionX = posX;
      let positionY = posY;

      sendData(usermemory, positionX, positionY);
      // memoryMade = memory.value();
      // positionX = posX;
      // positionY = posY;
      console.log(locations);
    }
  }
  //memory typed by user, date created, position.x, position.y, randomPlantName all go to firebase. randomPlant and p.x p.y show on canvas
}

function cuteShape(x, y, radius, petalNum, petalWidth) {
  // fill(233, 33, 100, 30);
  fill(random(colorArr));
  noStroke();
  let angle = TWO_PI / petalNum;
  push();
  translate(x, y);
  rotate(-PI / 2);
  push();
  for (let a = 0; a < TWO_PI; a += angle) {
    let p1 = { x: 0, y: 0 };
    let p2 = { x: radius / 2, y: -petalWidth };
    let p3 = { x: radius, y: 0 };
    let p4 = { x: radius / 2, y: petalWidth };
    push();
    noStroke();
    rotate(a);
    beginShape();
    vertex(p1.x, p1.y);
    bezierVertex(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    bezierVertex(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y);
    vertex(p1.x, p1.y);
    endShape();
    pop();
  }
  pop();
  push();
  for (let a = 0; a < TWO_PI; a += angle) {
    let p1 = { x: 0, y: 0 };
    let p2 = { x: radius / 2, y: -petalWidth };
    let p3 = { x: radius, y: 0 };
    let p4 = { x: radius / 2, y: petalWidth };
    push();
    noFill();
    rotate(a);
    beginShape();
    vertex(p1.x, p1.y);
    bezierVertex(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    bezierVertex(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y);
    vertex(p1.x, p1.y);
    endShape();
    pop();
  }
  pop();
  pop();
}

function saveMem() {
  // console.log(memory.value());
  resizeCanvas(displayWidth, displayHeight);
  background("#fef08a");
  formWrite.addClass("hidden");
  select("#plant").show();
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
      // console.log(data);
      const obj = JSON.parse(data);
      locations = obj;
      Object.keys(locations).forEach((key) => {
        console.log(obj[key].pX, obj[key].pY);
        arrX.push(obj[key].pX);
        arrY.push(obj[key].pY);
      });
    })
    .catch((ex) => {
      console.error(ex);
    });
}
