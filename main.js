const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = 1000;
const height = 1000;

// setInterval( function(){

// }, 2000)

function drawPixel(pixelsArray){
    // la boucle i correspond au nombre de ligne cela correspond à la verticalité
    for(i = 0; i < height; i++){
        // La boucle j correspond au nombre de colonne, cela correspond à l'horizontalité
        for(j = 0; j < width; j++){
            if(pixelsArray[i * j]){
                ctx.fillRect(j, i, 1, 1)
            }
        }
    }
}

function makeArray(width, height){
    array = [];
    for (i = 0; i < width * height; i++){
        array.push(getRandomBoolean())
    }
    return array;
}

// Math.random génère tjr un chiffre entre 0 et 1, donc ici si le chiffre est < 0.5 
// ça fait true et donc à partir de 0.5 ça nous donne false.
function getRandomBoolean(){
    return Math.random() < 0.5;
}

const density = document.getElementById('density');

const mkArray = makeArray(width, height);

drawPixel(mkArray);