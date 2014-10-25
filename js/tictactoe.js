function TicTacToe(userName) {

	this.userName = userName; // User's display name
	this.winner = null; // The winner
	this.moveCount = 0; // Track total game moves

	var that = this;
	var currentPlayerTurn = 0; //0: user 1: computer

	// tic tac toe board
	var board = [
			null, null, null,
			null, null, null,
			null, null, null
		];

	// All possible winning combinations
	var winningSets = [
			[0,1,2], [3,4,5], [6,7,8],  // left/right
			[0,3,6], [1,4,7], [2,5,8],  // up/down
			[0,4,8], [2,4,6] 			// diagonal
		];

	/* Sets the position of choice for player */
	this.setMark = function (position) {

		// Already have a winner
		if (this.winner) {
			console.log(this.winner + ' has won already. Ignoring move...');
			return;
		}

		// Game has exhausted possible moves, its a draw
		if (this.moveCount >= 9) {
			this.winner = "Draw";
			return;
		}

		// Safety check to prevent overwriting position
		if (this.positionFilled(position)) {
			console.log('Position ' + position + ' has a mark already. Try different position.');
			return;
		}

		this.moveCount++;

		// Mark the specified position with the players code
		board[position] = currentPlayerTurn;

		//debug ui
		function t(x) {
			if (x === null) {
				return ' ';
			} else if (x === 0) {
				return 'o';

			} else if (x === 1) {
				return 'x';
			}
		}
		console.log(((currentPlayerTurn) ? 'Computer(x)' : this.userName + '(o)') + ' marks ' + position);
		console.log(t(board[0]) + '|' + t(board[1]) + '|' + t(board[2]));
		console.log('-----');
		console.log(t(board[3]) + '|' + t(board[4]) + '|' + t(board[5]));
		console.log('-----');
		console.log(t(board[6]) + '|' + t(board[7]) + '|' + t(board[8]));
		console.log('=====================');

		// Check if player has won, can only have won if there has been more than 4 moves
		if (this.moveCount > 4 && this.isWinner()) {
			this.winner = (currentPlayerTurn) ? 'Computer' : this.userName;
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

			if(board[set[0]] === currentPlayerTurn && board[set[1]] === currentPlayerTurn && board[set[2]] === currentPlayerTurn) {
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
		return board[position][0];
	};
	
	/* */
	function computerMove(userLastPosition) {

		var move = board.indexOf(null); // default move the the first empty position

		// Determine if computer needs to defend

		for(var i = 0; i < winningSets.length; i++) {

			//console.log(winningSets[i], userLastPosition);

			if (winningSets[i].indexOf(userLastPosition) !== -1) {

				console.log('Combination: ' + winningSets[i]);
		

				for(var j = 0; j < winningSets[i].length; j++) {

					if (winningSets[i][j] === userLastPosition) {

						//console.log(winningSets[i][j]);

						console.log(board[winningSets[i][j]]);


					}

				}


				//console.log(board[winningSets[i][0]], board[winningSets[i][1]], board[winningSets[i][2]])
				
				
			}
		}

		// Otherwise attack
		

		that.setMark(move);
	}
}

var game = new TicTacToe('Erik');

/*  wins
    -----
	123, 456, 789
	147, 258, 369
	159, 357
*/
game.setMark(2);
game.setMark(1);
game.setMark(5);


console.log('*****************');
console.log('Total moves: ' + game.moveCount);
console.log('Winner: ' + game.winner);
console.log('*****************');
