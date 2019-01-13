const RABBIT = document.getElementById("gamer");
const SCENE = document.querySelector(".game");
const RESULT = document.getElementById("result");
const HEALTH = document.getElementById("health");

const TOP_RABBIT = RABBIT.getBoundingClientRect().top;
const MAX_WIDTH = SCENE.getBoundingClientRect().width - 130;
const MAX_HEIGHT = SCENE.getBoundingClientRect().height;

let itemArray = [];

// 37 left
// 39 right

var left = 0;
var right = 0;
var count = 0;
var health = 3;

window.onkeydown = function(e) {
  left = e.keyCode === 37 ? -20 : 0;
  right = e.keyCode === 39 ? 20 : 0;
  if (left) {
    RABBIT.classList.add("direction");
  } else {
    RABBIT.classList.remove("direction");
  }
};

window.onkeyup = function(e) {
  left = 0;
  right = 0;
};

setInterval(() => {
  if (health < 1) return;
  var i = factoryItem();
  if (i)
    itemArray.push({
      element: i,
      a: 1 + parseInt(Math.random() * 5)
    });
}, 1000);

setInterval(function() {
  if (health < 1) return;
  var currentPos = parseInt(RABBIT.style.left);
  currentPos += left + right;
  if (currentPos > 0 && currentPos < MAX_WIDTH) {
    RABBIT.style.left = `${currentPos}px`;
  }
  //функция колбек, формирует массив из яблок которые имеют позицию(т.е. не удаленных)
  itemArray = itemArray.filter(({ element, a }) => {
    var newPos = parseInt(element.style.top);
    var x = parseInt(element.style.left);

    newPos += a;
    if (newPos + 50 > TOP_RABBIT && (currentPos < x && currentPos + 130 > x)) {
      if (element.src.includes("apple2") && health < 3) {
        health++;
        HEALTH.innerHTML = `x${health}`;
      }
      count++;
      RESULT.innerHTML = `Result: ${count}`;
      element.parentElement.removeChild(element);
      return false;
    } else if (newPos < MAX_HEIGHT) {
      element.style.top = `${newPos}px`;
      return true;
    } else {
      element.parentElement.removeChild(element);
      return false;
    }
  });
}, 50);

// фабрика шишек)
function factoryItem() {
  let img = document.createElement("img");
  const R = Math.random();
  if (R < 0.5) {
    img.src = "image/apple.png";
    img.className = "apple item";
  } else if (R < 0.6) {
    img.src = "image/apple2.png";
    img.className = "apple item";
  } else {
    img.src = "image/cone.png";
    img.className = "cone item";
    img.style.top = 0;
    img.style.left = `${Math.random() * MAX_WIDTH}px`;

    SCENE.appendChild(img);
    var left = RABBIT.getBoundingClientRect().left;

    setTimeout(() => {
      img.style.top = `${TOP_RABBIT + 30}px`;
      img.style.left = `${left + 30}px`;
      setTimeout(() => {
        var pos = RABBIT.getBoundingClientRect();

        if (
          pos.top < parseInt(img.style.top) &&
          pos.left < parseInt(img.style.left) &&
          pos.left + 65 > parseInt(img.style.left)
        ) {
          health--;
          HEALTH.innerHTML = `x${health}`;
          if (!health) {
            var nextGame = confirm("Do you want to start a new game?");
            if (nextGame) location.reload();
          }
        }
        // debugger;
        img.parentElement.removeChild(img);
      }, 5000);
    }, 500);

    return null;
  }
  img.style.top = 0;
  img.style.left = `${Math.random() * MAX_WIDTH}px`;
  SCENE.appendChild(img);

  return img;
}
