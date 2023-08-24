
let time = 0, minutes = 0, seconds = 0, intervalId = null, obstacleIntervalId = null;
let start = document.getElementById("button1");
let TEN = 10, SIXTY = 60, THOUSAND = 1000, twoThousand = 2000, EIGHTY = 80;

function increaseTime() {
    time += TEN;
    minutes = Math.floor(time / THOUSAND / SIXTY);
    secunde = Math.floor(time / THOUSAND) % SIXTY;
    document.getElementById("time").innerHTML = minutes + ':' + seconds;
}

function generatePlane() { 
    intervalId = setInterval(increaseTime, TEN); 
    start.style.display = "none";
    let planeDiv = document.createElement("div");
    planeDiv.classList.add('plane');
    document.getElementById("board").appendChild(planeDiv); 
    document.onkeydown = detectKey;
    obstacleIntervalId = setInterval(generateObstacole, twoThousand);   
}

let planeLeft = 150, planeTop = 405, boardWidth = 440, hundred = 100;

function detectKey(e) {
    let planeDiv = document.querySelector(".plane");
    if (e.keyCode == '37' && planeLeft > 0) {
        planeLeft -= TEN;
    }
    else if (e.keyCode == '39' && planeLeft < boardWidth - hundred) {
        planeLeft += TEN;
    }
        if (planeDiv) {
        planeDiv.style.top = planeTop + "px";
        planeDiv.style.left = planeLeft + "px";
    }
}

let avoidedObstacle = 0;
function generateObstacole() {
    let obstacle = document.createElement("div");
    obstacle.classList.add('obs');
    let  randomLeft = Math.floor((Math.random() * EIGHTY) + (hundred * 3)) +  "px";
    obstacle.style.left = randomLeft + "px";
    document.getElementById("board").appendChild(obstacle);
    let moveStoneInterval = setInterval(function() {
        moveStone(obstacle, moveStoneInterval);
    }, 1000); 
}

function moveStone(obstacle, interval) {
    let positionObs = obstacle.getBoundingClientRect();  
    if (positionObs.top >= 0 && positionObs.top < (THOUSAND / 2)) {
        let newPosition = positionObs.top + 1;
        obstacle.style.top = newPosition + "px";
        if (checkCollision(document.querySelector(".plane"), obstacle)) {
            clearInterval(interval);
            obstacle.remove();
            gameOver();
            return; 
        } console.log(obstacle.style.top);
         if (obstacle.style.top > (400 + "px") && obstacle.style.top <= (500+ "px")) {        
            ++avoidedObstacle;
        }
        
    } else {
        obstacle.style.top = "0px";
    }   
}

function checkCollision(plane, obstacle) {
    let positionObs = obstacle.getBoundingClientRect();
    let positionPlane = plane.getBoundingClientRect();
    if (positionObs.left < positionPlane.right && 
        positionObs.right > positionPlane.left && 
        positionObs.bottom > positionPlane.top &&
        positionObs.top < positionPlane.bottom ) {
        return true;
    }
}

function gameOver() {
    clearInterval(intervalId);
    intervalId = null;
    clearInterval(obstacleIntervalId); 
    obstacleIntervalId = null; 
    let image = document.createElement("img");
    image.classList.add('img');
    document.getElementById("board").appendChild(image);     
    document.getElementById("game-over").innerHTML = "Avoided Obstacle " + avoidedObstacle ;
}

function resetGame() {  
    location.reload();
}


