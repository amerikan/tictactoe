function TicTacToe(firstPlayer) {

	this.winner = null; // The winner
	this.moveCount = 0; // Track total game moves

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
			[0,1,2], [3,4,5], [6,7,8],	// left/right
			[0,3,6], [1,4,7], [2,5,8],	// up/down
			[0,4,8], [2,4,6]			// diagonal
		];

	/* Sets the position of choice for player */
	this.setMark = function (position) {

		this.moveCount++;

		// Already have a winner
		if (this.winner) {
			console.log(this.winner + ' has won already. Ignoring move...');
			return;
		}

		// Safety check to prevent overwriting position
		if (this.positionFilled(position)) {
			console.log('Position ' + position + ' has a mark already. Try different position.');
			return;
		}

		// Mark the specified position with the players code
		board[position] = currentPlayerTurn;

		// Game has exhausted possible moves, it's a draw
		if (this.moveCount >= 9) {
			this.winner = -1;
			return;
		}

		// Update winning sets
		for(var i = 0; i < winningSets.length; i++) {
			// the set becomes unwinnable if it contains both a marking from computer and user
			if (winningSets[i].indexOf(0) !== -1 && winningSets[i].indexOf(1) !== -1) {
				winningSets.splice(i, 1);
				break;
			}
		}

		// Check if player has won, can only have won if there has been more than 4 moves
		if (this.moveCount > 4 && this.isWinner()) {
			this.winner = (currentPlayerTurn) ? 1 : 0; //computer : user
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

		var winner = false;

		winningSets.forEach(function (set) {
			if (board[set[0]] === currentPlayerTurn && board[set[1]] === currentPlayerTurn && board[set[2]] === currentPlayerTurn) {
				winner = true;
			}
		});

		return winner;
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
		var positionValues;
		var emptyPosition;

		// computer is 2nd to move
		if (that.moveCount === 1) {

			// the center position is open or the user chose a corner, mark the center position
			 if (board[4] === null || board[0] === 0 || board[2] === 0 || board[6] === 0 || board[8] === 0) {
				position = 4;
			} 
			// the user chose the center position, mark the corner position
			else if (board[4] === 0) {
				position = 0;
			}

		} else { 

			// Can computer win it already?
			if (that.moveCount > 2) {
				for (var i = 0; i < winningSets.length; i++) {

					// map the combinations with the actual markings
					positionValues = winningSets[i].map(that.getPositionValue);

					// Set must have 2 computer markings and one empty to be a winning move
					if (_countOccurances(positionValues, 1) === 2 && positionValues.indexOf(null) !== -1) {

						emptyPosition = positionValues.indexOf(null);
						position = winningSets[i][emptyPosition];

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
			
					for(var k = 0; k < winningSets.length; k++) {

						positionValues = winningSets[k].map(that.getPositionValue);

						if (_countOccurances((winningSets[k].map(that.getPositionValue)), 1) === 1) {
							
							emptyPosition = positionValues.indexOf(null);
							position = winningSets[k][emptyPosition];
							
							break;
						}
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
		// Computer goes first
		if (currentPlayerTurn === 1) {
			// Mark the center position
			that.setMark(4);
		}
	}

	// Initialization
	init();
}