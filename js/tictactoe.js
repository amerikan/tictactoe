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
				that.setMark(getBestPosition());
			}
		}
	};

	/* Determines if the current player has won */
	this.isWinner = function () {
		for (var i = 0, len = winningSets.length; i < len; i++) {
			var set = winningSets[i];

			if (board[set[0]] === currentPlayerTurn && board[set[1]] === currentPlayerTurn && board[set[2]] === currentPlayerTurn) {
				that.winningSet = set;
				return true;
			}
		}

		return false;
	};

	/* Determines if a position is filled */
	this.positionFilled = function (position) {
		return (board[position] !== null);
	};

	/* Gets the positions value */
	this.getPositionValue = function (position) {
		return board[position];
	};

	/* Returns the board array */
	this.getBoard = function () {
		return board;
	};
	
	/* Determine best position move for computer */
	function getBestPosition () {
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
		for (i = 0, len = winningSets.length; i < len; i++) {
			var lineValues = winningSets[i].map(that.getPositionValue);

			// Line has 2 user symbols and one open for the win
			if (_countOccurances(lineValues, 0) === 2 && _countOccurances(lineValues, null) === 1) {
				var emptySpot = lineValues.indexOf(null);

				return winningSets[i][emptySpot]; // losing spot
			}
		}

		// if center is blank, mark it
		if (board[4] === null) {
			return 4;
		}

		// Check where user can win in two sets
		var openSpots = [];
		for (i = 0, len = winningSets.length; i < len; i++) {
			var lineValues = winningSets[i].map(that.getPositionValue);

			if (_countOccurances(lineValues, 0) === 1 && _countOccurances(lineValues, null) === 2) {

				if (lineValues[0] === null) {
					openSpots.push(winningSets[i][0]);
				}

				if (lineValues[1] === null) {
					openSpots.push(winningSets[i][1]);
				}

				if (lineValues[2] === null) {
					openSpots.push(winningSets[i][2]);
				}
			}
		}

		// Check to see two possible winning lines for user and block it
		var last = null;
		for (i = 0, len = openSpots.length; i < len; i++) {
			if (last === openSpots[i]) {
				return openSpots[i];
			} else {
				last = openSpots[i];
			}
		}

		// When user has marked opposing corners, mark an open edge
		if ((board[0] === 0 && board[8] === 0) || (board[2] === 0 && board[6] === 0)) {
			if (board[1] === null) {
				return 1;
			} else if (board[3] === null) {
				return 3;
			} else if (board[5] === null) {
				return 5;
			} else if (board[7] === null) {
				return 7;
			}
		}

		// When user has marked adjacent edges, mark shared corner
		if (board[1] === 0 && board[5] === 0 && board[2] === null) {
			return 2;
		} else if (board[5] === 0 && board[7] === 0 && board[8] === null) {
			return 8;
		} else if (board[7] === 0 && board[3] === 0 && board[6] === null) {
			return 6;
		} else if (board[3] === 0 && board[1] === 0 && board[0] === null) {
			return 0;
		}

		// Check any line where computer has at least one marking and there are two open spots
		openSpots = [];
		for (i = 0, len = winningSets.length; i < len; i++) {
			var lineValues = winningSets[i].map(that.getPositionValue);

			if (_countOccurances(lineValues, 1) === 1 && _countOccurances(lineValues, null) === 2) {

				if (lineValues[0] === null) {
					openSpots.push(winningSets[i][0]);
				}

				if (lineValues[1] === null) {
					openSpots.push(winningSets[i][1]);
				}

				if (lineValues[2] === null) {
					openSpots.push(winningSets[i][2]);
				}
			}
		}

		last = null;
		for (i = 0, len = openSpots.length; i < len; i++) {
			if (last === openSpots[i]) {
				return openSpots[i];
			} else {
				last = openSpots[i];
			}
		}

		// Position doesn't matter at this point, return any open position
		return position;
	}

	function _countOccurances (array, element) {
		var o = array.filter(function (e) {
			return (e === element);
		});

		return o.length;
	}

	function init() {
		// Computer is going first
		if (currentPlayerTurn === 1) {
			var cornerSpot = [0, 2, 6, 8];
			var position = cornerSpot[Math.floor(Math.random() * cornerSpot.length)]; // Randomly choose a corner spot

			that.setMark(position);
		}
	}

	// Initialization
	init();
}