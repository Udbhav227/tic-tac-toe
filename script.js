const Gameboard = (() => {
  let board = ["","","","","","","","",""];

  const getBoard = () => board;

  const placeMarker = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true; // move success
    }
    return false; // move failed
  };

  const resetBoard = () => {
    board = ["","","","","","","","",""];
  };

  return {
    getBoard,
    placeMarker,
    resetBoard
  };
})();

const Player = (name, marker) => {
  return {
    name,
    marker,
  };
};

const GameController = (() => {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  let currentPlayer = player1;

  const switchTurn = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
  };

  const checkWinCondition = () => {
    const board = Gameboard.getBoard();
    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let pattern of winningConditions) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return currentPlayer.name;
      };
    };

    return board.includes("") ? null : "Tie";
  };

  const playTurn = (index) => {
    if (Gameboard.placeMarker(index, currentPlayer.marker)) {
      const result = checkWinCondition();
      if (result) return result;
      switchTurn();
    };

    return null;
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
  };

  return {
    playTurn,
    resetGame,
    currentPlayer
  };
})();