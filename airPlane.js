let time = 0, minute = 0, secunde = 0, intervalId = null, obstacleIntervalId = null;
let start = document.getElementById("button1");

function increaseTime() {
    time += 10;
    minute = Math.floor(time / 1000 / 60);
    secunde = Math.floor(time / 1000) % 60;
    document.getElementById("time").innerHTML = minute + ':' + secunde;
}

function generatePlane() { 
    intervalId = setInterval(increaseTime, 10); 
    start.style.display = "none";
    let planeDiv = document.createElement("div");
    planeDiv.classList.add('plane');
    document.getElementById("board").appendChild(planeDiv); 
    document.onkeydown = detectKey;
    obstacleIntervalId = setInterval(generateObstacol, 2000);   
}

let planeLeft = 150, planeTop = 405, boardWidth = 440, hundred = 100;

function detectKey(e) {
    let planeDiv = document.querySelector(".plane");
    if (e.keyCode == '37' && planeLeft > 0) {
        planeLeft -= 10;
    }
    else if (e.keyCode == '39' && planeLeft < boardWidth - hundred) {
        planeLeft += 10;
    }
        if (planeDiv) {
        planeDiv.style.top = planeTop + "px";
        planeDiv.style.left = planeLeft + "px";
    }
}

function generateObstacol() {
    let obstacle = document.createElement("div");
    obstacle.classList.add('obs');
    let  randomLeft = Math.floor((Math.random() * 80) + 300) +  "px";
    obstacle.style.left = randomLeft + "px";
    document.getElementById("board").appendChild(obstacle);
    let moveStoneInterval = setInterval(function() {
        moveStone(obstacle, moveStoneInterval);
    }, 1000); 
}

function moveStone(obstacle, interval) {
    let positionObs = obstacle.getBoundingClientRect();    
    if (positionObs.top >= 0 && positionObs.top < 500) {
        let newPosition = positionObs.top + 1;
        obstacle.style.top = newPosition + "px";
        if (checkCollision(document.querySelector(".plane"), obstacle)) {
            clearInterval(interval);
            obstacle.remove();
            gameOver();
            return; 
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
    document.getElementById("game-over").innerHTML = "Score Time "  + minute + ":" + secunde;
}

function resetGame() {  
    location.reload();
}