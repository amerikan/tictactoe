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
				computerMove(position);
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
	function computerMove(userLastPosition) {

		var position = board.indexOf(null); // default move the the first empty position
		var winningMove = false;

		// Computer has second turn, place in center position
		if (that.moveCount === 1) {
			
			if (board[4] === null) {
				position = 4;
			} else {
				position = 0;
			}
		} 
		// computer has 4th turn
		else if (that.moveCount === 3) {

			// Diagonal corners are occupied by user, computer should block 
			if ((board[0] === 0 && board[8] === 0) || (board[2] === 0 && board[6] === 0)) {
				position = 1;
			} else {

				if (board[0] === null) {
					position = 0;
				} else if (board[2] === null) {
					position = 2;
				} else if (board[6] === null) {
					position = 6;
				} else if (board[8] === null) {
					position = 8;
				}
			}
		} 
		// after the 4th turn there's more things to check
		else if (that.moveCount >= 4) {

			for (var i = 0, line, empty; i < winningSets.length; i++) {

				// map the combinations with the actual markings
				line = winningSets[i].map(that.getPositionValue);

				// Set must have 2 computer markings and one empty to be a winning move
				if (_countOccurances(line, 1) === 2 && line.indexOf(null) !== -1) {

					empty = line.indexOf(null);
					position = winningSets[i][empty];
					winningMove = true;
					
					break;
				}
			}
		}

		// When there's no winning move, check if user can win on next move (threat)
		if (! winningMove) {

			// Find all sets where computer can lose
			var threats = winningSets.filter(function (set) {
				if (set.indexOf(userLastPosition) !== -1) {

					var positionValues = set.map(that.getPositionValue);

					// A threat when computer has no marking in set and user has two markings in set
					if (positionValues.indexOf(1) === -1 && _countOccurances(positionValues, 0) === 2) {
						return true;
					} 
				}

				return false;
			});

			// Computer must make a defensive move
			if (threats.length > 0) {
				for (var j = 0; j < threats[0].length; j++) {
					if(board[threats[0][j]] === null) {
						
						position = threats[0][j];
						
						break;
					}
				}		
			} 
			// Computer can make an offensive move
			else {

				// Place mark in a line that already has one computer mark
				for(var k = 0, line, empty; k < winningSets.length; k++) {

					line = winningSets[k].map(that.getPositionValue);

					if (_countOccurances(line, 1) === 1 && _countOccurances(line, null) === 1) {
						
						empty = line.indexOf(null);
						position = winningSets[k][empty];

						break;
					}
				}
			}
		}

		// Set the mark in best position
		that.setMark(position);
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

			var safePositions = [0, 2, 6, 8]; // corner positions, give better odds at winning

			// Randomly choose one of the corner positions to make it less repetative game sequence 
			var position = safePositions[Math.floor(Math.random() * safePositions.length)];

			that.setMark(position);
		}
	}

	// Initialization
	init();
}