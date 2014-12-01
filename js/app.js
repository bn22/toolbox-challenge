// ap.js: our main javascript file for this app
"use strict";

//Initializes the global variables in the JavaScript
var tilesList = [];
var idx;
for (idx = 1; idx <= 32; idx++) {
    tilesList.push ({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false
    });
} //for each tile
var attempts = 0;
var matchedPairs = 0;
var remainingPairs = 8;
var elapsedSeconds = 0;
var timer;
var flippedTiles = [];
var flippedImg = [];
var clicks = 0;

//Creates Instruction button that informs the user about how to play the Memory Game
var exit = document.getElementById('help-button');
exit.addEventListener('click', function () {
    if (alert('Instructions for the Memory Game\n\n1. Click on the ' +
        'New Game button to be dealt 16 random images' + '\n2. Click on two images ' +
        'to see if they share the same image.\n3. If they are the same image, then ' +
        'it will remain flipped up and count as a matching pair.' +
        '\n4. If they do not match, then they are returned face down. The images will remain in the same position.' +
        '\n5. Continue until you have found 8 matching pairs!')) {
    }
});

$(document).ready(startGame());

//Whenever the "Start Button" is pressed, a new game state is created for the user. In addition,
//this adds function to the individual images whenever they're clicked by the user
function startGame() {
        //catch click event of start game button
    $('#start-game').click(function () {
        resetScoreboard();
        tilesList = _.shuffle(tilesList);
        var selectTiles = tilesList.slice(0, 8); //Select array values of 0 to 7 (8 values total)
        var tilePairs = [];
        _.forEach(selectTiles, function s(tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);
        createBoard(tilePairs);

            //get starting milliseconds
        var startTime = Date.now();
        timer = window.setInterval(function () {
            elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
            $('#matches-found').text(matchedPairs);
            $('#remaining-pair').text(remainingPairs);
            $('#attempts-made').text(attempts);
            if (remainingPairs == 0) {
                alert('Congratulation! You have beaten the Memory Game in ' + elapsedSeconds + ' seconds'
                + ' and ' + attempts + ' attempts.\n\nClick Ok to Play Again and beat your score!');
                resetScoreboard();
            }
        }, 1000);

        $('#game-board img').click(function () {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            if (tile.flipped == false) {
                flipTile(tile, clickedImg);
                createTurn(tile, clickedImg);
            } else {
                alert('Please click a face-down tile')
            }
        })
    });
}

//This method defines what happens whenever a user clicks upon an image. If the tile was turned over, then it
//returned to its original background image.
function flipTile(tile, img) {
    img.fadeOut(100, function () {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        }
        else {  //tile.flipped is false
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
    if (clicks == 0) {
        $('#actions').text('Please Click Another Tile')
    }
    else if (clicks == 1) {
        $('#actions').text('Please Wait One Second Before Clicking Another Tile')
    }
    clicks++;
}

//This method looks to see if a match was created during a 'turn', which was defined as
//two individual images being clicked. If they matched, then the two images will remain face-up
//for the duration of the game.

function createTurn(tile, img) {
    window.setTimeout(function () {
        $('#turn-report').empty();
        flippedTiles.push(tile);
        flippedImg.push(img);
        if (flippedTiles.length == 2) {
            if (flippedTiles[1].tileNum == flippedTiles[0].tileNum) {
                if (!flippedTiles[1].matched && !flippedTiles[0].matched) {
                    matchedPairs = matchedPairs + 1;
                    remainingPairs = remainingPairs - 1;
                    $('#turn-report').text('Matched!');
                    var idx1;
                    for (idx1 = 0; idx1 < flippedTiles.length; idx1++) {
                        flippedTiles[idx1].matched = true;
                        flippedImg[idx1].attr('src', flippedTiles[idx1].src)
                    }
                }
            }
            else { //flippedTiles don't match
                attempts = attempts + 1;
                $('#turn-report').text('Not a Match!');
                var idx2;
                for (idx2 = 0; idx2 < flippedTiles.length; idx2++) {
                    flippedTiles[idx2].flipped = false;
                    flippedImg[idx2].attr('src', 'img/tile-back.png');
                }
            }
            flippedTiles = [];
            flippedImg = [];
            clicks = 0;
            $('#actions').text('Please Click A Tile')
        }
    }, 1000);
}

//This function creates the game board for the memory game. In this case,
//it creates a 4x4 grid where the images will appear.
function createBoard(tilePairs) {
    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function(tile, elementIndex) {
        if (elementIndex > 0 && 0 == (elementIndex % 4)) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);
}

//This function resets every variable that is kept track of during the game.
//In addition, it empties each display counter so the user can play a fresh new game.
function resetScoreboard() {
    $('#game-board').empty();
    $('#elapsed-seconds').empty();
    $('#matches-found').empty();
    $('#remaining-pair').empty();
    $('#attempts-made').empty();
    $('#turn-report').empty();
    $('#actions').text('Please Click A Tile');
    window.clearInterval(timer);
    elapsedSeconds = 0;
    attempts = 0;
    remainingPairs = 8;
    matchedPairs = 0;
    clicks = 0;
    flippedTiles = [];
    flippedImg = [];
    tilesList = [];
    for (idx = 1; idx <= 32; idx++) {
        tilesList.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg',
            flipped: false,
            matched: false
        });
    }
}