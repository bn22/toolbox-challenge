// ap.js: our main javascript file for this app
"use strict";

var tilesList = [];
var idx;
for (idx = 1; idx <= 32; idx++) {
    tilesList.push ({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        matched: false,
    });
} //for each tile
var attempts = 0;
var matchedPairs = 0;
var remainingPairs = 8;
var elapsedSeconds = 0;
var timer;
var flippedTiles = [];
var flippedImg = [];

//Creates Instruction button that informs the user about how to play the Memory Game
var exit = document.getElementById('help-button');
exit.addEventListener('click', function () {
    if (window.confirm('Instructions for the Memory Game\n\n1. Click on the Start New Game button to be dealt 16 random images\n2. Click on two images to see if they have the same image.\n3. If they are the same image, then it will disappear\n4. Continue until you have found 8 matching pairs and cleared the board')) {
        window.location = "#";
    }
});

//when document is ready...
$(document).ready(function() {
    //catch click event of start game button
    $('#start-game').click(function() {
       resetScoreboard();
       tilesList = _.shuffle(tilesList);
       var selectTiles = tilesList.slice(0, 8); //Select array values of 0 to 7 (8 values total)
       var tilePairs = [];
        _.forEach(selectTiles, function(tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);
        createBoard(tilePairs)

        //get starting milliseconds
        var startTime = Date.now();
        timer = window.setInterval(function() {
            elapsedSeconds = (Date.now() - startTime) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds)
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
            $('#matches-found').text(matchedPairs);
            $('#remaining-pair').text(remainingPairs);
            $('#attempts-made').text(attempts);
            if (remainingPairs == 0) {
                resetScoreboard();
                $('#win-message').text('Congratulation, you have beaten the Memory Game!').fadeIn(100)
            }
        }, 1000);

        $('#game-board img').click(function () {
            //console.log(this.alt);
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            flipTile(tile, clickedImg);
            createTurn(tile, clickedImg);
        });
    }); //start game button click
}); //document ready function

function flipTile(tile, img) {
    if (tile.matched == false) {
        img.fadeOut(100, function() {
            if (tile.flipped) {
                img.attr('src', 'img/tile-back.png');
            }
            else {
                img.attr('src', tile.src);
            }
            tile.flipped = !tile.flipped;
            img.fadeIn(100);
        });
    }
}

function createTurn(tile, img) {
    flippedTiles.push(tile);
    flippedImg.push(img)
    window.setTimeout(function() {
        if (flippedTiles.length == 2) {
            if (flippedTiles[1].tileNum == flippedTiles[0].tileNum) {
                matchedPairs = matchedPairs + 1;
                remainingPairs = remainingPairs - 1;
                flippedTiles[0].matched = true;
                flippedTiles[1].matched = true;
                flippedTiles[0].flipped = true;
                flippedTiles[1].flipped = true;
                flippedImg[0].attr('src', flippedTiles[0].src);
                flippedImg[1].attr('src', flippedTiles[1].src);
            }
            else { //flippedTiles don't match
                attempts = attempts + 1;
                flippedTiles[0].matched = false;
                flippedTiles[1].matched = false;
                flippedTiles[0].flipped = false;
                flippedTiles[1].flipped = false;
                flippedImg[0].attr('src','img/tile-back.png');
                flippedImg[1].attr('src','img/tile-back.png');  
            }
            flippedTiles = [];
            flippedImg = [];
        } 
    }, 1000);
}

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
            alt: 'tile ' + tile.tileNum,
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);
}

function resetScoreboard() {
    $('#game-board').empty();
    $('#elapsed-seconds').empty();
    $('#matches-found').empty();
    $('#remaining-pair').empty();
    $('#attempts-made').empty();
    window.clearInterval(timer);
    elapsedSeconds = 0;
    attempts = 0;
    remainingPairs = 8;
    matchedPairs = 0;
}