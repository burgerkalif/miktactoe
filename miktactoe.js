
var cnv, ctx, gameRunning = true;
const CANVAS_SIZE = 400;
const SPACING = CANVAS_SIZE / 3;
const PADDING = 20;

var board = [0,1,2,3,4,5,6,7,8];
var player = 'X', ai = 'O';

window.onload = function() {
	cnv = document.getElementById("cnv");
	cnv.width = CANVAS_SIZE;
	cnv.height = CANVAS_SIZE;

	ctx = cnv.getContext("2d");
	ctx.lineWidth = 4;
	ctx.strokeStyle = '#fff';

	drawGrid();

	cnv.addEventListener("click", takeTurns);
}

function drawGrid() {
	ctx.beginPath();

	for (let i=1; i<3; i++) {
		ctx.moveTo(i*SPACING, 4);
		ctx.lineTo(i*SPACING, CANVAS_SIZE-4);
		ctx.moveTo(4, i*SPACING);
		ctx.lineTo(CANVAS_SIZE-4, i*SPACING);
	}

	ctx.stroke();
}

function takeTurns(evt) {
	if (gameRunning) {
		var rect = cnv.getBoundingClientRect();
		var x = Math.floor((evt.clientX - rect.left) / SPACING);
		var y = Math.floor((evt.clientY - rect.top) / SPACING);
		var spot = y*3 + x;
	
		if (board[spot] === player || board[spot] === ai) return false;
	
		board[spot] = player;
	
		drawX(x,y);
		var bestMove = minimax(board, 0, true);
		// if (!bestMove.score) alert("draw");
		board[bestMove.index] = ai;
	
		y = Math.floor(bestMove.index / 3);
		x = bestMove.index % 3;
		drawO(x,y);
	
		// you lose. this can only happen if score = max score = 10 - 1 recursive level = 9
		if (bestMove.score == 9) {
			gameOver("You lose!");
		}
	}
}

function drawX(x, y) {
	ctx.beginPath();
	ctx.moveTo(x * SPACING + PADDING, y * SPACING + PADDING);
	ctx.lineTo((x+1) * SPACING - PADDING, (y+1) * SPACING - PADDING);
	ctx.moveTo(x * SPACING + PADDING, (y+1) * SPACING - PADDING);
	ctx.lineTo((x+1) * SPACING - PADDING, y * SPACING + PADDING);
	ctx.stroke();
}

function drawO(x, y) {
	ctx.beginPath();
	ctx.arc((x + 0.5) * SPACING, (y + 0.5) * SPACING, SPACING / 2-PADDING, 0, 2*Math.PI);
	ctx.stroke();
}

function gameOver(msg) {
	gameRunning = false;
	// draw splash
	ctx.fillStyle = 'rgba(153,153,255,0.9)';
	ctx.fillRect(CANVAS_SIZE/2-100, CANVAS_SIZE/2-25, 200,50);
	ctx.fillStyle = '#22a';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = 'bold 20px Georgia';
	ctx.fillText(msg, CANVAS_SIZE/2, CANVAS_SIZE/2);
}

function getAvailSpots(board) {
	return board.filter(spot => spot !== ai && spot !== player);
}

function minimax(board, depth, aiTurn) {
	if (checkIfWin(ai)) return { score: 10 - depth };
	else if (checkIfWin(player)) {
		if (!depth) gameOver("You win!");
		return { score: depth -10 };
	}

	var availSpots = getAvailSpots(board);
	if (!availSpots.length) {
		if (!depth) gameOver("It's a draw!");
		return  { score: 0 };
	}

	var bestScore = (aiTurn) ? -Infinity : Infinity;
	var bestMove;

	availSpots.forEach(spot => {
		// make move on board
		board[spot] = (aiTurn) ? ai : player;

		// call minimax recursively, flip player
		var result = minimax(board, depth+1, !aiTurn);

		// check if this score is better than the one stored
		// in case ai is playing, higher is better, if human is playing, lower is better
		if (aiTurn && result.score > bestScore || !aiTurn && result.score < bestScore)  {
			bestScore = result.score;
			bestMove = { index: spot, score: bestScore };
		}

		board[spot] = spot;
	});

	return bestMove;
}

function checkIfWin(p) {
	if (
		(board[0] == p && board[1] == p && board[2] == p) ||
		(board[3] == p && board[4] == p && board[5] == p) ||
		(board[6] == p && board[7] == p && board[8] == p) ||
		(board[0] == p && board[3] == p && board[6] == p) ||
		(board[1] == p && board[4] == p && board[7] == p) ||
		(board[2] == p && board[5] == p && board[8] == p) ||
		(board[0] == p && board[4] == p && board[8] == p) ||
		(board[2] == p && board[4] == p && board[6] == p)
	) return true;

	return false;
}