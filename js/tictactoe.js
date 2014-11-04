function TicTacToe(firstPlayer) {

	this.winner = null; // The winner
	this.moveCount = 0; // Track total game moves
	this.winningSet = [];

	var that = this;
	var currentPlayerTurn = firstPlayer || 0; //0: user 1: computer

	// tic tac toe board
	var board = [
			null, null, null,
			null, null, null,
			null, null, null
		];

	var centerSpot = 4;
	var cornerSpot = [0, 2, 6, 8];
	var edgeSpot =   [1, 3, 5, 7];

	// All possible winning combinations
	var winningSets = [
			[0,1,2], [3,4,5], [6,7,8],	// horizontal
			[0,3,6], [1,4,7], [2,5,8],	// vertical
			[0,4,8], [2,4,6]			// diagonal
		];

	/* Sets the position of choice for player */
	this.setMark = function (position) {

		// Safety check to prevent overwriting position
		if (this.positionFilled(position)) {
			console.log('Error: Position ' + position + ' has a mark already. Mark a different position.');
			return;
		}

		this.moveCount++;

		// In winner was previously declared
		if (this.winner === 1 || this.winner === 0) {
			console.log('Error: Game is alreay over, ' + this.winner + ' won. Ignoring move...');
			return;
		} 
		// A draw was previously declared
		else if (this.winner === -1) {
			console.log('Error: Game is already over, it was a draw. Ignoring move...');
			return;
		}

		// Mark the specified position with the players symbol
		board[position] = currentPlayerTurn;

		// Update winning line sets
		for(var i = 0; i < winningSets.length; i++) {

			var line = winningSets[i].map(that.getPositionValue);

			// the line set becomes unwinnable if it contains both a marking from computer and user
			if (line.indexOf(0) !== -1 && line.indexOf(1) !== -1) {
				winningSets.splice(i, 1);
				break;
			}
		}

		// Check if player has won, can only have won if there has been more than 4 moves
		if (this.moveCount > 4 && this.isWinner()) {
			this.winner = (currentPlayerTurn) ? 1 : 0; //computer : user
		} 
		// if there has been 9 moves (max) and no winner then we know it's a tie
		else if (this.moveCount >= 9) {
			this.winner = -1;
		} else {

			// Toggle player turn
			currentPlayerTurn = 1 - currentPlayerTurn;

			// Computer make a move
			if (currentPlayerTurn === 1) {
				computerMove();
			}
		}
	};

	/* Determines if the current player has won */
	this.isWinner = function () {

		var set;

		for (var i = 0, len = winningSets.length; i < len; i++) {

			set = winningSets[i];

			if (board[set[0]] === currentPlayerTurn && board[set[1]] === currentPlayerTurn && board[set[2]] === currentPlayerTurn) {
				that.winningSet = set;
				return true;
			}
		}

		return false;
	};

	/* Determines if  a position is filled */
	this.positionFilled = function (position) {

		if (board[position] === null) {
			return false;
		}

		return true;
	};

	/* Gets the positions value */
	this.getPositionValue = function (position) {
		return board[position];
	};

	/* Returns the board array */
	this.getBoard = function () {
		return board;
	};
	
	/* Determine best position move for computer and mark it */
	function computerMove() {
		var position = bestPosition();
		that.setMark(position);
	}

	function bestPosition () {

		var position = board.indexOf(null);

		// Check for imminent win
		for (var i = 0, len = winningSets.length; i < len; i++) {

			var lineValues = winningSets[i].map(that.getPositionValue);

			// Line has 2 computer symbols and one open for the win
			if (_countOccurances(lineValues, 1) === 2 && _countOccurances(lineValues, null) === 1) {

				var emptySpot = lineValues.indexOf(null);
				return winningSets[i][emptySpot]; // Winning spot
			}
		}

		// Check for imminent loss
		for (var i = 0, len = winningSets.length; i < len; i++) {

			var lineValues = winningSets[i].map(that.getPositionValue);

			// Line has 2 user symbols and one open for the win
			if (_countOccurances(lineValues, 0) === 2 && _countOccurances(lineValues, null) === 1) {

				var emptySpot = lineValues.indexOf(null);
				return winningSets[i][emptySpot]; // losing spot
			}
		}

		// User was first player
		if (firstPlayer === 0) {

			// Computer first turn
			if (that.moveCount === 1) {
				// User placed it in center
				if (board[centerSpot] === 0) {
					return cornerSpot[Math.floor(Math.random() * cornerSpot.length)]; // place it on random corner
				} 

				// User placed it in corner
				else if (board[0] === 0 || board[2] === 0 || board[6] === 0 || board[8] === 0) {
					return centerSpot; // place it on center
				} 
				// User placed it in edge
				else {
					// Choose one of the opposite corners 
					if (board[1] === 0) {
						return 8;
					} else if (board[3] === 0) {
						return 8;
					} else if (board[5] === 0) {
						return 0;
					} else if (board[7] === 0) {
						return 0;
					}
				} 
			} 
		}
		// Computer was first player
		else {

			// Computer has 3rd turn
			if (that.moveCount === 2) {

				// User place their first mark in center
				if (board[centerSpot] === 0) {
					// Choose one of the opposite corners, where computer already has a marking
					if (board[0] === 1) {
						return 8;
					} else if (board[2] === 1) {
						return 6;
					} else if (board[6] === 1) {
						return 2;
					} else if (board[8] === 1) {
						return 0;
					}
				}

				// Computer placed mark on a corner on first move
				if (board[0] === 1 || board[8] === 1) {
					// Place next marking in same line, wherever it's open
					if (board[2] === null) {
						return 2;
					} else if (board[6] === null) {
						return 6;
					}
				} else if (board[2] === 1 || board[6] === 1) {
					// Place next marking in same line, wherever it's open
					if (board[0] === null) {
						return 0;
					} else if (board[8] === null) {
						return 8;
					}
				} 
			} 
			// Computer has 5th turn
			else if (that.moveCount === 4) {

				// One of the edges was set by user, choose one of the opposite corners for computer
				if (board[1] === 0 && board[8] === null) {
					return 8;
				} else if (board[1] === 0 && board[6] === null) {
					return 6;
				} else if (board[3] === 0 && board[2] === null) {
					return 2;
				} else if (board[3] === 0 && board[8] === null) {
					return 8;
				} else if (board[5] === 0 && board[0] === null) {
					return 0;
				} else if (board[5] === 0 && board[6] === null) {
					return 6;
				} else if (board[7] === 0 && board[0] === null) {
					return 0;
				} else if (board[7] === 0 && board[2] === null) {
					return 2;
				}
			}
		}

		return position;
	}

	function _countOccurances (array, element) {

		var o = array.filter(function (e) {

			if (e === element) {
				return true;
			} else {
				return false;
			}
		});

		return o.length;
	}

	function init() {
		// Computer is going first
		if (currentPlayerTurn === 1) {

			// Randomly choose one of the corner positions to make it less repetative game sequence 
			var position = cornerSpot[Math.floor(Math.random() * cornerSpot.length)];

			that.setMark(position);
		}
	}

	// Initialization
	init();
}