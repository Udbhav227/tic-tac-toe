const Gameboard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const placeMarker = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true; // move success
    }
    return false; // move failed
  };

  const resetBoard = () => {
    board.fill("");
  };

  return { getBoard, placeMarker, resetBoard };
})();

const Player = (name, marker, score) => ({name, marker, score});

const GameController = (() => {
  let player1, player2;
  let currentPlayer = player1;
  let gameOver = false;

  const setPlayers = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X", 0);
    player2 = Player(name2 || "Player 2", "O", 0);
    currentPlayer = player1;
  };

  const switchTurn = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
  };

  const checkWinCondition = () => {
    const board = Gameboard.getBoard();
    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]             
    ];

    for (let pattern of winningConditions) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        gameOver = true;
        currentPlayer.score++;
        Display.updateScore(player1.score, player2.score);
        return currentPlayer.name + " wins!";
      };
    };

    if (!board.includes("")) {
      gameOver = true; 
      return "It's a tie!";
    }

    return null;
  };

  const playTurn = (index) => {
    if (!gameOver && Gameboard.placeMarker(index, currentPlayer.marker)) {
      const result = checkWinCondition();
      Display.updateBoard();
      if (result) {
          Display.showMessage(result);
      } else {
          switchTurn();
          Display.updateTurn(currentPlayer.name);
      }
    }
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    gameOver = false;
    Display.updateBoard();
    Display.updateTurn(currentPlayer.name);
    Display.updateFooter();
  };

  return { playTurn, resetGame, currentPlayer, setPlayers };
})();

const Display = (() =>{
  const cells = document.querySelectorAll(".cell");
  const status = document.querySelector(".game-status");
  const startBtn = document.querySelector(".strt-game");
  const restartBtn = document.querySelector(".restrt-game");
  const footer = document.querySelector(".footer-text");
  let name1 = document.querySelector("#player1-name");
  let name2 = document.querySelector("#player2-name");
  const score1 = document.querySelector("#player1-score");
  const score2 = document.querySelector("#player2-score");

  const footerQuotes = [
    'Game on! 🔥 <span style="color:#e33158">Stay sharp</span>, stay unbeatable!',
    'Victory is sweet, but <span style="color:#e33158">sportsmanship</span> is sweeter. ✨',
    'Press reset, but <span style="color:#e33158">never give up</span>! 💪',
    'Made with <span style="color:#e33158">passion</span>, played with strategy. 🎮',
    'Tic-Tac-Toe today, <span style="color:#e33158">world domination</span> tomorrow! 🚀',
    '<span style="color:#e33158">Legends</span> aren’t born, they’re made—one game at a time. 🏆',
    'Next round? <span style="color:#e33158">You know you want to</span>. 😉',
    'Think fast, <span style="color:#e33158">play smart</span>, win big! 🧠🔥',
    'Every move counts—make yours <span style="color:#e33158">legendary</span>. ✨',
    'Reset the board, <span style="color:#e33158">not your spirit</span>. 💯',
    'A true gamer <span style="color:#e33158">never backs down</span>! 🎯',
    '<span style="color:#e33158">Outplayed</span>? Outthink. Outthink? Outplay. 🔄',
    'Luck is for the unprepared—be a <span style="color:#e33158">strategist</span>. 🎲',
    'The real game is in the <span style="color:#e33158">mind</span>. 🕶️',
    'Tic-Tac-Toe today, <span style="color:#e33158">checkmate</span> tomorrow. ♟️',
    '<span style="color:#e33158">Winning</span> is a habit—better start now. 🏅',
    'Glitches happen, but <span style="color:#e33158">skill prevails</span>! 🖥️⚡'
  ];

  cells.forEach(cell => {
    cell.addEventListener("click", (e) => {
        GameController.playTurn(e.target.dataset.index);
    });
  });

  startBtn.addEventListener("click", () => {
    let name1Input = prompt("Player 1 name");
    let name2Input = prompt("Player 2 name");
    GameController.setPlayers(name1Input, name2Input);
    GameController.resetGame();
    name1.textContent = name1Input;
    name2.textContent = name2Input;
    updateScore(0, 0);
    startBtn.textContent = "Restart Game"
    restartBtn.removeAttribute("hidden");
});


  restartBtn.addEventListener("click", () => {
    GameController.resetGame();
  });

  const updateBoard = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
  };

  const updateTurn = (name) => {
    status.textContent = `${name}'s Turn`;
  };

  const updateFooter = () => {
    const randomQuote = footerQuotes[Math.floor(Math.random() * footerQuotes.length)];
    footer.innerHTML = randomQuote;
  }

  const updateScore = (player1Score, player2Score) => {
    score1.textContent = player1Score;
    score2.textContent = player2Score;
  }

  const showMessage = (message) => {
    status.textContent = message;
  };

  return { updateBoard, updateTurn, updateFooter, updateScore, showMessage };
})();