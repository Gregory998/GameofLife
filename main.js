const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const density = document.getElementById('density');
const play = document.getElementById('play');
const reset = document.getElementById('reset');

const gridSize = 50;
// On ne change pas la taille du canvas
const canvasSize = 1000;

let cellsSize = canvasSize / gridSize;

let drawGrid = [];
let updateGrid = [];
let mainLoop = null;

isMouseDown = false;

function drawPixel(pixelsArray){
    // On refraichit le canvas 
    ctx.clearRect(0,0, canvasSize, canvasSize)
    // la boucle i correspond au nombre de ligne cela correspond à la verticalité
    for(i = 0; i < gridSize; i++){
        // La boucle j correspond au nombre de colonne, cela correspond à l'horizontalité
        for(j = 0; j < gridSize; j++){
            color = pixelsArray[i][j] ? "black" : "white";
            ctx.fillStyle = color;
            ctx.fillRect(i * cellsSize, j * cellsSize, cellsSize, cellsSize)
        }
    }
}

function initGrid(gridSize, density = 0.5){
    for (i = 0; i < gridSize; i++) {
        drawGrid[i] = [];
        updateGrid[i] = [];
        for(j = 0; j < gridSize; j++) {
            drawGrid[i][j] = getRandomBoolean(density);
            updateGrid[i][j] = null;
        }
    }
}

// Math.random génère tjr un chiffre entre 0 et 1, donc ici si le chiffre est < 0.5 
// ça fait true et donc à partir de 0.5 ça nous donne false.
function getRandomBoolean(density){
    return Math.random() < density;
}

// Ici on crée un reset pour afficher que des pixels blanc. Par contre on peut toujours dessiner et reclear par la suite.
reset.addEventListener('click', function(){
    initGrid(gridSize, 0)
    drawPixel(drawGrid);
})

density.value = 0.5;

density.addEventListener('input', function(){
    let val = this.value;
    initGrid(gridSize, val);
    drawPixel(drawGrid);
})

// Règle n°1 : Une cellule vivante meurt si elle a moins de deux cellules voisines vivantes
// Règle n°2 : Une cellule vivante survit si elle a deux ou trois cellules voisines vivantes
// Règle n°3 : Une cellule meurt si elle a plus de trois voisines vivantes
// Règle N°4 : Une cellule morte avec exactement trois voisines vivantes devient une cellule vivante
function main(){
    mainLoop = setInterval(function(){
        for(i = 0; i < gridSize; i++){
            for(j = 0; j < gridSize; j++){
                // On vérifie l'état de la cellule (vivant ou morte)
                let cellState = drawGrid[i][j];
                // Calculer le nombre de cellule vivante autour d'elle
                let neighboursNbrCellAlive = deadOrAliveNbr(i,j);
                // On va découvrir l'état de la cellule grace aux nombres de cellules autour d'elle
                let isAlive = checkIsAlive(cellState, neighboursNbrCellAlive);
                // console.log(`La cellule de position [${i}, ${j}] est dans un état ${isAlive}, avant elle était ${cellState} et elle avait ${neighboursNbrCellAlive} voisines vivantes`)
                // On ajoute l'état de la cellule dans le tableau de mise à jour
                updateGrid[i][j] = isAlive;
            }
        }
        // On change le tableau qui dessine, par le tableau de mise à jour
        exchangeGrid();
        // On dessine
        drawPixel(drawGrid)
    }, 20)
}

function deadOrAliveNbr(x, y){
    // Ici on note toutes les positions autour de notre cellule qui est en [0, 0]
    const nbCoordinate = [[-1, -1], [0, -1], [1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0]];
    let count = 0;
    //c correspond aux valeurs [-1, -1][0, -1]... 
    nbCoordinate.forEach(c => {
        // c[0] signifie la premiere valeur (x) et c[1] le y 
        count += getNbState(x + c[0], y + c[1]);
    })
    return count;
}

function getNbState(x, y){
    try {
        // si true on return 1 si false 0
        return drawGrid[x][y] ? 1 : 0;
    }catch {
        return 0;
    }
}

function checkIsAlive(cellState, neighboursNbrCellAlive){
    // Version NAÏVE ->
    // if(cellState && neighboursNbrCellAlive < 2) {
    //     return false;
    // }else if (cellState && (neighboursNbrCellAlive === 2 | neighboursNbrCellAlive === 3)){
    //     return true;
    // }else if (cellState && neighboursNbrCellAlive > 3){
    //     return false;
    // }else if (!cellState && neighboursNbrCellAlive === 3) {
    //     return true;
    // }  

    if (!cellState && neighboursNbrCellAlive === 3) {
        return true;
    }else if (cellState && neighboursNbrCellAlive > 1 && neighboursNbrCellAlive < 4){
        return true;
    }else {
        return false;
    }
}

function exchangeGrid() {
    for(i = 0; i < gridSize; i++){
        for(j = 0; j < gridSize; j++) {
            drawGrid[i][j] = updateGrid[i][j];
        }
    }
}

// Ici on fait toutes les fonctions pour qu'on puisse modifier avec des events notre game of life
canvas.addEventListener('click', function (e){
    let coordinate = getMouseCoordinates(e)
    drawGrid[coordinate[0]][coordinate[1]] = drawGrid[coordinate[0]][coordinate[1]] ? false : true;
    drawPixel(drawGrid);
})

canvas.addEventListener('mousemove', function (e){
    if (isMouseDown){
        let coordinate = getMouseCoordinates(e)
        drawGrid[coordinate[0]][coordinate[1]] = true;
        drawPixel(drawGrid);
    } 
})

// Quand on clique
canvas.addEventListener('mousedown', function(){
    isMouseDown = true
})
// Quand on relâche le click
canvas.addEventListener('mouseup', function(){
    isMouseDown = false
})
// Quand on quitte le champ d'action
canvas.addEventListener('mouseout', function(){
    isMouseDown = false
})

play.addEventListener('click', function(){
    if (mainLoop != null) {
        clearInterval(mainLoop);
        mainLoop = null;
    }else {
        main();
    }
})
// Fin des fonctions pour modifier ---------------------------------

function getMouseCoordinates(event) {
    let limit = canvas.getBoundingClientRect();
    let posX = event.clientX - limit.left;
    let posY = event.clientY - limit.top;
    //Math.floor veut dire qu'on arrondi au plus bas.
    let pX = Math.floor(posX / cellsSize);
    let pY = Math.floor(posY / cellsSize);
    return [pX, pY];
}

initGrid(gridSize);
drawPixel(drawGrid);
