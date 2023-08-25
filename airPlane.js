
let time = 0, minutes = 0, seconds = 0, intervalId = null, addObstacleInterval = null;
let start = document.getElementById("button1");
let TEN = 10, SIXTY = 60, THOUSAND = 1000, twoThousand = 2000, fiveHUNDRED = 500;

function increaseTime() {
    time += TEN;
    minutes = Math.floor(time / THOUSAND / SIXTY);
    seconds = Math.floor(time / THOUSAND) % SIXTY;
    document.getElementById("time").innerHTML = minutes + ':' + seconds;
}

function generatePlane() { 
    intervalId = setInterval(increaseTime, TEN); 
    start.style.display = "none";
    let planeDiv = document.createElement("div");
    planeDiv.classList.add('plane');
    document.getElementById("board").appendChild(planeDiv); 
    document.onkeydown = detectKey;
    startAddingObstacles();  
}

let planeLeft = 150, planeTop = 405, boardWidth = 440, HUNDRED = 100;

function detectKey(e) {
    let planeDiv = document.querySelector(".plane");
    if (e.keyCode == '37' && planeLeft > 0) {
        planeLeft -= TEN;
    } else if (e.keyCode == '39' && planeLeft < boardWidth - HUNDRED) {
        planeLeft += TEN;
    }
    if (planeDiv) {
        planeDiv.style.top = planeTop + "px";
        planeDiv.style.left = planeLeft + "px";
    }
}

let avoidedObstacle = 0;
let addObstacle = [15, 100, 150, 250, 300]; 
let addObstacleIndex = 0; 

function generateObstacole() {
    if (addObstacleIndex < addObstacle.length) {
        let obstacle = document.createElement("div");
        obstacle.classList.add('obs');
        obstacle.style.left = addObstacle[addObstacleIndex] + "px";
        document.getElementById("board").appendChild(obstacle);
        ++addObstacleIndex;
        return obstacle;
    } else {
        addObstacleIndex = 0;
    }
}  

function moveObstacle(obstacle) {
    let moveInterval = setInterval(function () {
        let positionObs = obstacle.getBoundingClientRect();
        let newPosition = positionObs.top + 1;
        obstacle.style.top = newPosition + "px";
        if (checkCollision(document.querySelector(".plane"), obstacle)) {
            clearInterval(moveInterval);
            obstacle.remove();
            clearInterval(addObstacleInterval);
            gameOver();
            return; 
        } 
        if (parseInt(obstacle.style.top) > (fiveHUNDRED - HUNDRED)  && parseInt(obstacle.style.top) <= fiveHUNDRED) {        
            ++avoidedObstacle;
            obstacle.remove();
            clearInterval(moveInterval); 
        }
    }, fiveHUNDRED);
}

function startAddingObstacles() {
    addObstacleInterval = setInterval(function () {
        let obstacle = generateObstacole();
        moveObstacle(obstacle);
    }, twoThousand);     
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
    return false;
}

function gameOver() {
    clearInterval(intervalId);
    let image = document.createElement("img");
    image.classList.add('img');
    document.getElementById("board").appendChild(image);     
    document.getElementById("game-over").innerHTML = "Avoided Obstacle " + avoidedObstacle;
}

function resetGame() {  
    location.reload();
}