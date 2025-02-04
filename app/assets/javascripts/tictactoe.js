// Code your JavaScript / jQuery solution here
// var WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0; // Keeps a record of who's turn it is
var currentGame = 0;

const WINNING_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
]


//A page can't be manipulated safely until the document is "ready.
$(document).ready(function(){
  attachListeners();
});

//player() is defined

function player () {
  if (turn % 2 === 0) {
    return 'X';
  } else {
    return 'O';
  }
}

//updateState()
function updateState(square) {
  var token = player();
  $(square).text(token);
}

//setMessage

function setMessage(message) {
  $('#message').text(message);
}

//checkWinner

function checkWinner() {
  var board = [];
  var winner = false;

  $('td').text(function(index,square) { board[index] = square });
  WINNING_COMBOS.forEach(function(combo) {
    if (board[combo[0]] != "" && board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]]) {
      setMessage("Player " + board[combo[0]] + " Won!");
      return winner = true;
    }
  });
     return winner;
}

//doTurn

function doTurn(square){
    updateState(square);
    turn++;
    if (checkWinner()) {
        saveGame();
        resetBoard();
    } else if (turn === 9) {
        setMessage("Tie game.");
        saveGame();
        resetBoard();
    }
}

//reset game (clear current game)

function resetBoard(){
  $('td').empty();
  turn = 0;
  currentGame = 0;
}

//save game

function saveGame() {
    var state=[]

    $('td').text(function(index, square) {
        state.push(square); // push the text of each square
    });

    if(currentGame) {
        $.ajax({
            type: "PATCH",
            url: '/games/' + currentGame,
            data: { state: state } // send the state
        });
    } else {
        $.post("/games", {state: state}, function(game){
            currentGame = game.data.id
            $('#games').append("<button id='gameid-" + game.id + "'>" + game.id + "</button><br>");
            $("#gameid-" + game.id).on('click', function(){ reloadGame(game.id) });
        });
    }
}

  // show previous games

  function showPreviousGame() {
    $('#games').empty();
    $.get('/games', function(savedGames) {
        if (savedGames.data.length) {
            savedGames.data.forEach(function(game) {
                $('#games').append("<button id='gameid-" + game.id + "'>" + game.id + "</button><br>");
                $("#gameid-" + game.id).on('click', function(){ reloadGame(game.id) });
            });
        }
    });
}

//attachListeners

function attachListeners(){
    $('td').on('click', function() {
        if (!$(this).text() && !checkWinner()) {
            doTurn(this);
        }
    });

    $('#save').on( 'click', function(){ saveGame()});
    $('#previous').on( 'click', function(){ showPreviousGame()});
    $('#clear').on( 'click', function(){ resetBoard()});
}

//reload game

function reloadGame(gameID) {
    message;
    $.get('/games/' + gameID, function(data) {
        var index = 0, state = data.data.attributes.state;
        for (var y = 0; y < 3; y++){
            for (var x = 0; x < 3; x++) {
                $("[data-x='" + x + "'][data-y='" + y + "']").html(state[index]);
                index++;
            }
        }

        turn = state.join("").length; //count the X and Y positions in the state
        currentGame = data.data.id;

        if(!checkWinner() && turn == 9){
            message('Tie game.');
        }
    })
}






































// const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
//                         [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
// var turn = 0;
// var currentGame = 0;

// $(document).ready(function() {
//   attachListeners();
// });

// var player = () => turn % 2 ? 'O' : 'X';

// function doTurn(square) {
//   updateState(square);
//   turn++;
//   if (checkWinner()) {
//     saveGame();
//     resetBoard();
//   } else if (turn === 9) {
//     setMessage("Tie game.");
//     saveGame();
//     resetBoard();
//   }
// }

// function resetBoard() {
//   $('td').empty();
//   turn = 0;
//   currentGame = 0;
// }

// function attachListeners() {
//   $('td').on('click', function() {
//     if (!$.text(this) && !checkWinner()) {
//       doTurn(this);
//     }
//   });

//   $('#save').on('click', () => saveGame());
//   $('#previous').on('click', () => showPreviousGames());
//   $('#clear').on('click', () => resetBoard());
// }

// function checkWinner() {
//   var board = {};
//   var winner = false;

//   $('td').text((index, square) => board[index] = square);

//   WINNING_COMBOS.some(function(combo) {
//     if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
//       setMessage(`Player ${board[combo[0]]} Won!`);
//       return winner = true;
//     }
//   });

//   return winner;
// }

// function updateState(square) {
//   var token = player();
//   $(square).text(token);
// }

// function setMessage(string) {
//   $('#message').text(string);
// }

// function saveGame() {
//   var state = [];
//   var gameData;

//   $('td').text((index, square) => {
//     state.push(square);
//   });

//   gameData = { state: state };

//   if (currentGame) {
//     $.ajax({
//       type: 'PATCH',
//       url: `/games/${currentGame}`,
//       data: gameData
//     });
//   } else {
//     $.post('/games', gameData, function(game) {
//       currentGame = game.data.id;
//       $('#games').append(`<button id="gameid-${game.data.id}">${game.data.id}</button><br>`);
//       $("#gameid-" + game.data.id).on('click', () => reloadGame(game.data.id));
//     });
//   }
// }

// function showPreviousGames() {
//   $('#games').empty();
//   $.get('/games', (savedGames) => {
//     if (savedGames.data.length) {
//       savedGames.data.forEach(buttonizePreviousGame);
//     }
//   });
// }

// function buttonizePreviousGame(game) {
//   $('#games').append(`<button id="gameid-${game.id}">${game.id}</button><br>`);
//   $(`#gameid-${game.id}`).on('click', () => reloadGame(game.id));
// }

// function reloadGame(gameID) {
//   document.getElementById('message').innerHTML = '';

//   const xhr = new XMLHttpRequest;
//   xhr.overrideMimeType('application/json');
//   xhr.open('GET', `/games/${gameID}`, true);
//   xhr.onload = () => {
//     const data = JSON.parse(xhr.responseText).data;
//     const id = data.id;
//     const state = data.attributes.state;

//     let index = 0;
//     for (let y = 0; y < 3; y++) {
//       for (let x = 0; x < 3; x++) {
//         document.querySelector(`[data-x="${x}"][data-y="${y}"]`).innerHTML = state[index];
//         index++;
//       }
//     }

//     turn = state.join('').length;
//     currentGame = id;

//     if (!checkWinner() && turn === 9) {
//       setMessage('Tie game.');
//     }
//   };

//   xhr.send(null);
// }