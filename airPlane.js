
let time = 0, minutes = 0, seconds = 0, intervalId = null, addObstacleInterval = null;
let start = document.getElementById("button1");
let TEN = 10, SIXTY = 60, THOUSAND = 1000, twoThousand = 2000, fiveHUNDRED = 500, bulletWidth = 25;

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

let planeLeft = 150, planeTop = 415, boardWidth = 440, planeHeight = 80;

function detectKey(e) {
    let planeDiv = document.querySelector(".plane");
    if (e.keyCode == '37' && planeLeft > 0) {
        planeLeft -= TEN;
    } else if (e.keyCode == '39' && planeLeft < boardWidth - planeHeight) {
        planeLeft += TEN;
    }else if(e.keyCode == '32'){
        createBullet();
        setInterval(moveBullet, SIXTY);
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
    if(obstacle) {
        let moveInterval = setInterval(function () {
            let positionObs = obstacle.getBoundingClientRect();
            let newPosition = positionObs.top + TEN;
            obstacle.style.top = newPosition + "px";
            if (checkCollision(document.querySelector(".plane"), obstacle)) {
                clearInterval(moveInterval);
                obstacle.remove();
                clearInterval(addObstacleInterval);
                gameOver();
                return; 
            }
            if (parseInt(obstacle.style.top) >= fiveHUNDRED) {        
                ++avoidedObstacle;
                obstacle.remove();
                clearInterval(moveInterval); 
            }
        }, fiveHUNDRED);
    }
}

function startAddingObstacles() {
    addObstacleInterval = setInterval(function () {
        let obstacle = generateObstacole();
        moveObstacle(obstacle);
    }, twoThousand);     
}

function createBullet() {
    let bullet = document.createElement("div");
    bullet.classList.add('bullet');
    bullet.style.left = (planeLeft + bulletWidth / 2) + "px";
    bullet.style.top = (planeTop - TEN) + "px";
    document.getElementById("board").appendChild(bullet);
} 

let distroyedObs = 0;
function moveBullet() {
    let obstacle = document.querySelector(".obs");
    let bullet = document.querySelector(".bullet");
    if(bullet && obstacle) {
        let bulletTop = parseInt(bullet.style.top);
        bulletTop -= TEN;
        bullet.style.top = bulletTop + "px";
        if(checkCollision(obstacle, bullet)){
            ++distroyedObs;
            obstacle.remove(); 
            bullet.remove();           
        }
        if(bulletTop < 0){
            bullet.remove();
        }
    }    
}

function checkCollisionBullet(obstacle, bullet) {
    if (!plane || !obstacle) {
        return false; 
    }
    let positionBullet = bullet.getBoundingClientRect();
    let positionObs = obstacle.getBoundingClientRect();
    if (positionObs.left < positionBullet.right && 
        positionObs.right > positionBullet.left && 
        positionObs.bottom > positionBullet.top &&
        positionObs.top < positionBullet.bottom ) {
        return true;
    }
    return false;
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
    document.getElementById("game-over").innerHTML = "Avoided Obstacle: " + avoidedObstacle + " " + "Destroyed Obstacle: " + distroyedObs;  
}

function resetGame() {  
    location.reload();
}