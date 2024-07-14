
let draggedElement;

const gameContainer = document.querySelector('.game-container');
const trashContainer = document.getElementById('trash-container');
const binContainer = document.getElementById('bin-container');
const scoreElement = document.getElementById('score');
const leftBin = document.getElementById('left-bin');
const rightBin = document.getElementById('right-bin');
const stopButton = document.getElementById('stop-button');


let currentTrashItem;
let currentBinItems;
let score = 0;
const bins =[]

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('upload-button').addEventListener('click', uploadTrashItem);
stopButton.addEventListener('click', stopGame);

function updateScore() {
    scoreElement.textContent = score;
}

function dragStart(event) {
    draggedElement = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

document.addEventListener('DOMContentLoaded', () =>{
    leftBin.addEventListener('dragover', dragOver);
    leftBin.addEventListener('drop', drop);
    rightBin.addEventListener('dragover', dragOver);
    rightBin.addEventListener('drop', drop);
}
);

function drop(event) {
    event.preventDefault();
    const target = event.target;
    const bin = target.closest('.bin');

    //check corrrect answer
    if (bin) {
        if (bin.dataset.type === currentTrashItem.binTypes) {
            score++;
            alert('Correct! Score:' + score);
        } else {
            alert('Incorrect bin. Keep trying!');
        }


    // if (target.classList.contains('bin')) {
    //     //check if the dropped item matches the correct bin 
    //     if (target.dataset.type === currentTrashItem.binTypes) {
    //         score++;
    //         alert('Correct! Score:' + score);
    //     } else {
    //         alert('Incorrect bin. Keep trying!');
    //     }
        updateScore();
        resetGame();
    }
}

async function fetchRandomTrashItem(){
    try{
        const response = await fetch('http://localhost:3000/random-trash-item');
        const data = await response.json();
        console.log("trash items are fetched:", data);


        const trashImg = document.createElement('img');
        trashImg.src = `/${data.trashItem.imageUrl}`;
        trashImg.alt = data.trashItem.name;
        trashImg.draggable = true;
        trashImg.addEventListener('dragstart', dragStart);


        trashContainer.innerHTML = '';
        trashContainer.appendChild(trashImg);
        return data;
    } catch(error){
        console.error('Error fetching random trash item:', error);
        return {
            trashItem: {name: 'Default trash item', imageUrl: 'default.png', binTypes: 'Default bin'}, 
            binItem: [{name: 'Default bin', imageUrl: 'default.png'}]
        };
    }
}

async function resetGame() {
    try{
    const {trashItem, binItem} = await fetchRandomTrashItem();
    currentTrashItem = trashItem;
    currentBinItems = binItem;

    if (!currentBinItems || currentBinItems.length < 2) {
        console.error('Invalid bin items data:', currentBinItems);
        return;
    }

    [leftBin, rightBin].forEach(bin => {
        bin.innerHTML ='';
        bin.classList.remove('correct', 'incorrect');
        bin.removeEventListener('dragover', dragOver);
        bin.removeEventListener('drop',drop);
    });

    if (!Array.isArray(currentBinItems) || currentBinItems.length < 2) {
        console.error('Invalid bin items data:', currentBinItems);
        return;
    }

    const correctBin = currentBinItems.find(bin => bin.name === currentTrashItem.binTypes);
    const otherBin = currentBinItems.find(bin => bin.name !== currentTrashItem.binTypes) || currentBinItems[0];
 
    const binsToDisplay = [correctBin, otherBin];

    //create bins based on the fetched bin items
    binsToDisplay.forEach((binData, index) => {
        if (!binData || !binData.imageUrl){
            console.error('Invalid bin data:', binData);
            return;
        }
        const binElement = index === 0 ? leftBin : rightBin;
        // const binElement = document.createElement('div');
        binElement.classList.add('bin');
        binElement.style.backgroundImage = `url(${binData.imageUrl})`;
        binElement.dataset.type = binData.name;

        binElement.addEventListener('dragover', dragOver);
        binElement.addEventListener('drop', drop);

    });

    // trashContainer.style.left = '50%';
    // trashContainer.style.transform = 'translateX(-50%)';

    gameContainer.classList.remove('hidden');
    trashContainer.classList.remove('hidden');
    binContainer.classList.remove('hidden');
    stopButton.classList.remove('hidden');
    }catch(error){
        console.error('Error resetting game:', error);
    }
}

function startGame() {
    document.getElementById('start-button').classList.add('hidden');
    document.getElementById('upload-button').classList.add('hidden');
    resetGame();
    updateScore();
}

function stopGame() {
    alert('Game Over! Your final score is: ' + score);
    score = 0;
    updateScore();
    document.getElementById('start-button').classList.remove('hidden');
    document.getElementById('upload-button').classList.remove('hidden');
    gameContainer.classList.add('hidden');
    stopButton.classList.add('hidden');
}

function uploadTrashItem() {
    // Implement logic to upload a new trash item
    console.log('Upload trash item');
}

