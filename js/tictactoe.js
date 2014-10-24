function TicTacToe(userName) {

	this.userName = userName;
	this.winner = null;
	this.moveCount = 0;

	var that = this;
	var currentPlayerTurn = 0; //0: user 1: computer
	var board = [
		[null, 2], [null, 7], [null, 6],
		[null, 9], [null, 5], [null, 1],
		[null, 4], [null, 3], [null, 8]
	];

	/* Sets the position of choice for player */
	this.setChoice = function (position) {

		console.log(((currentPlayerTurn) ? 'Computer' : this.userName) + ': ' + position)

		if (this.winner) {
			console.log('A player has won already. Ignoring...');
			return;
		}

		if (this.moveCount >= 9) {
			this.winner = "Draw";
			return;
		}

		if (this.positionFilled(position)) {
			console.log('Position ' + position + ' has a mark already. Try different position');
			return;
		}

		this.moveCount++;

		board[position - 1][0] = currentPlayerTurn;


		console.log('=====================')
		console.log(board[0][0] + '|' + board[1][0] + '|' + board[2][0])
		console.log('-------------')
		console.log(board[3][0] + '|' + board[4][0] + '|' + board[5][0])
		console.log('-------------')
		console.log(board[6][0] + '|' + board[7][0] + '|' + board[8][0])


		// Check if player has won
		if (this.isWinner() && this.moveCount > 4) {
			this.winner = (currentPlayerTurn) ? 'Computer' : this.userName;
		} else {

			// Toggle player turn
			currentPlayerTurn = 1 - currentPlayerTurn

			// Make computer make a move
			if (currentPlayerTurn === 1) {
				computerMove(position);
			}
		}
	};

	/* Determines if the current player has won */
	this.isWinner = function () {

		var currentPlayer = currentPlayerTurn;
		var value = 0;

		board.forEach(function (position) {

			if(position[0] === currentPlayer) {

				value = value + position[1];

				if (value === 15) {
					return;
				}
			}
		});

		return (value === 15);
	};

	this.positionFilled = function (position) {

		if (board[position - 1][0] === null) {
			return false
		}

		return true;
	};

	this.getMark = function (position) {

		return board[position - 1][0];
	};
	
	function computerMove(userLastPosition) {

		var move = 5;//null;
		var winningCombinations = [
			[1,2,3], [4,5,6], [7,8,9], // up/down
			[1,4,7], [2,5,8], [3,6,9], // left/right
			[1,5,9], [3,5,7] // diagonal
		];

		var possibilities = [];

		// Check with what position can user win
		// set move value to it if such position exists
		winningCombinations.forEach(function(combination, index) {
			if (combination.indexOf(userLastPosition) !== -1) {
				possibilities.push(index);
			}
		});

		console.log(possibilities);

		possibilities.forEach(function (set, index) {
			//console.log(winningCombinations[set])
			
			winningCombinations[set].forEach(function (position) {

				//console.log(position)

				if (position !== userLastPosition) {
					//console.log(position)

					if (that.positionFilled(position) && that.getMark(position) === 0) {
						//console.log('not safe')

						move = position + 1;

						if (that.positionFilled(move)) {


							board.forEach(function (item, index) {

								if (item[0] === null) {

									move = index + 1;
								}
							});	 
						}
					} else {

						//console.log('safe, no threat');

						//TODO: instad of filling any empty position
						// fill one that may  win

						board.forEach(function (item, index) {

							if (item[0] === null) {

								move = index + 1;

								return false;
							}
						});
					}
				}
			});
		});

		that.setChoice(move);
	}
}

var game = new TicTacToe('Erik');

/*  wins
    -----
	123, 456, 789
	147, 258, 369
	159, 357
*/
game.setChoice(8);
game.setChoice(4);
game.setChoice(6);
game.setChoice(2);
game.setChoice(1);

console.log('*****************');
console.log('Total moves: ' + game.moveCount);

console.log('Winner: ' + game.winner);
