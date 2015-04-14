//game.js
window.requestAnimFrame = 	window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.mozRequestAnimationFrame    ||
							function(callback) { window.setTimeout(callback, 1000 / 60); };

//fancy code from stack overflow
function resetCanvas(variables){
	// Store the current transformation matrix
	variables.ctx.save();

	// Use the identity matrix while clearing the canvas
	variables.ctx.setTransform(1, 0, 0, 1, 0, 0);
	variables.ctx.clearRect(0, 0, variables.canvas.width, variables.canvas.height);

	// Restore the transform
	variables.ctx.restore();
}

//menu functions
function onEnterMenu(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText("Click to Start", variables.canvas.width / 2, variables.canvas.height * 3 / 4);
}

function onClickMenu(x, y, fsm, variables){
	fsm.change("TSelect");
}

//team select functions
function onEnterTSelect(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText("Select your team", variables.canvas.width / 2, 100);
	variables.optionBox = new OptionBox(teamList, {x: 200, y: 125, align: "left"});
	variables.optionBox.display(variables.ctx);
}

function onClickTSelect(x, y, fsm, variables){
	var clickedOn = variables.optionBox.getFromClick(x, y);
	if (clickedOn != -1){
		variables.team = teamList[clickedOn];
		var opp = Math.floor(teamList.length*Math.random());
		variables.opponent = teamList[opp];
		fsm.change("BeginGame");
	}
}

function onMoveTSelect(x, y, fsm, variables){
	variables.optionBox.highlight(x, y, variables.ctx);
}

//begin game functions
function onEnterBeginGame(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText(variables.team + " vs. " + variables.opponent, variables.canvas.width / 2, 100);
	variables.period = 1;  //1 is first half, 2 second half, 3 is universe
	variables.gScore = 0;
	variables.bScore = 0;
}

function onClickBeginGame(x, y, fsm, variables){
	fsm.change("Period");
}

//period functions
function onEnterPeriod(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText(variables.team + " vs. " + variables.opponent, variables.canvas.width / 2, 100);
	if (variables.period == 1){
		variables.ctx.fillText("First Half", variables.canvas.width / 2, 125);
	}
	else if (variables.period == 2){
		variables.ctx.fillText("Second Half", variables.canvas.width / 2, 125);
	}
	else {
		variables.ctx.fillText("Universe Point", variables.canvas.width / 2, 125);
	}
	variables.ctx.fillText(variables.gScore + " to " + variables.bScore, variables.canvas.width / 2, 150);
	
	variables.yards = 15;
	variables.player = "Steve";  //current player with the disc
}

function onClickPeriod(x, y, fsm, variables){
	fsm.change("Ready");
}

//ready functions
function onEnterReady(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText(variables.player + " has the disc.", variables.canvas.width / 2, 100);
	variables.optionBox = new OptionBox(actionList, {x: 100, y: 400, align: "left"});
	variables.optionBox.display(variables.ctx);
}

function onClickReady(x, y, fsm, variables){
	var clickedOn = variables.optionBox.getFromClick(x, y);
	if (clickedOn != -1){
		variables.action = clickedOn;
		fsm.change("Action");
	}
}

function onMoveReady(x, y, fsm, variables){
	variables.optionBox.highlight(x, y, variables.ctx);
}

//action functions
function onEnterAction(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText(variables.player + " uses " + actionList[variables.action], variables.canvas.width / 2, 100);
	if (Math.random() > 0.4){
		variables.ctx.fillText("Its super effective", variables.canvas.width / 2, 500);
		variables.yards += 50;
		variables.success = true;
	}
	else {
		variables.ctx.fillText("Its not very effective", variables.canvas.width / 2, 500);
		variables.success = false;
	}
}

function onClickAction(x, y, fsm, variables){
	if (variables.success && variables.yards > 100){
		fsm.change("Score");
	}
	else if (variables.success){
		fsm.change("Ready");
	}
	else {
		fsm.change("Turn");
	}
}

//score functions
function onEnterScore(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText(variables.team + " scores!!!", variables.canvas.width / 2, 100);
	variables.gScore++;
	variables.ctx.fillText(variables.gScore + " to " + variables.bScore, variables.canvas.width / 2, 125);
}

function onClickScore(x, y, fsm, variables){
	if (variables.gScore < 2){
		variables.period++;
		fsm.change("Period");
	}
	else {
		fsm.change("EndGame");
	}
}

//turn functions
function onEnterTurn(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText(variables.opponent + " gets the disc.", variables.canvas.width / 2, 100);
}

function onClickTurn(x, y, fsm, variables){
	fsm.change("TurnAct");
}

//turn act functions
function onEnterTurnAct(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText("They huck it deep downfield...", variables.canvas.width / 2, 100);
}

function onClickTurnAct(x, y, fsm, variables){
	fsm.change("TurnScore");
}


//turn score functions
function onEnterTurnScore(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.textAlign = "center";
	variables.ctx.fillText("They huck it deep downfield...", variables.canvas.width / 2, 100);
	variables.ctx.fillText("... and score!!!", variables.canvas.width / 2, 500);
	variables.bScore++;
}

function onClickTurnScore(x, y, fsm, variables){
	if (variables.bScore < 2){
		variables.period++;
		fsm.change("Period");
	}
	else {
		fsm.change("EndGame");
	}
}


//end game functions
function onEnterEndGame(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	if (variables.gScore > variables.bScore){
		variables.ctx.fillText(variables.team + " wins", variables.canvas.width / 2, 100);
	}
	else {
		variables.ctx.fillText(variables.opponent + " wins", variables.canvas.width / 2, 100);
	}
	variables.ctx.fillText("Click to play again...", variables.canvas.width / 2, 500);
}

function onClickEndGame(x, y, fsm, variables){
	fsm.change("TSelect");
}

function Start() {
	var config = {
		initial: 'Menu',
		callbacks: {
			onenterMenu: function(from, variables) {onEnterMenu(from, variables)},
			onclickMenu: function(x, y, fsm, variables) {onClickMenu(x, y, fsm, variables); },
			
			onenterTSelect: function(from, variables) {onEnterTSelect(from, variables) },
			onclickTSelect: function(x, y, fsm, variables) {onClickTSelect(x, y, fsm, variables); },
			onmoveTSelect: function(x, y, fsm, variables) {onMoveTSelect(x, y, fsm, variables); },
			
			onenterBeginGame: function(from, variables) { onEnterBeginGame(from, variables) },
			onclickBeginGame: function(x, y, fsm, variables) { onClickBeginGame(x, y, fsm, variables) },
			
			onenterPeriod: function(from, variables) { onEnterPeriod(from, variables) },
			onclickPeriod: function(x, y, fsm, variables) { onClickPeriod(x, y, fsm, variables) },
			
			onenterReady: function(from, variables) {onEnterReady(from, variables) },
			onclickReady: function(x, y, fsm, variables) {onClickReady(x, y, fsm, variables); },
			onmoveReady: function(x, y, fsm, variables) {onMoveReady(x, y, fsm, variables); },
			
			onenterAction: function(from, variables) { onEnterAction(from, variables) },
			onclickAction: function(x, y, fsm, variables) { onClickAction(x, y, fsm, variables) },
			
			onenterScore: function(from, variables) { onEnterScore(from, variables) },
			onclickScore: function(x, y, fsm, variables) { onClickScore(x, y, fsm, variables) },
			
			onenterTurn: function(from, variables) { onEnterTurn(from, variables) },
			onclickTurn: function(x, y, fsm, variables) { onClickTurn(x, y, fsm, variables) },
			
			onenterTurnAct: function(from, variables) { onEnterTurnAct(from, variables) },
			onclickTurnAct: function(x, y, fsm, variables) { onClickTurnAct(x, y, fsm, variables) },
			
			onenterTurnScore: function(from, variables) { onEnterTurnScore(from, variables) },
			onclickTurnScore: function(x, y, fsm, variables) { onClickTurnScore(x, y, fsm, variables) },
			
			onenterEndGame: function(from, variables) { onEnterEndGame(from, variables) },
			onclickEndGame: function(x, y, fsm, variables) { onClickEndGame(x, y, fsm, variables) }
		},
		variables: {
			canvas: document.getElementById("myCanvas"),
			ctx: document.getElementById("myCanvas").getContext("2d")
			
		}
	}
	var fsm = new StateMachine(config);
	
	function onClick(event){
		fsm.onClick(event.clientX, event.clientY);
	}

	function onMove(event){
		fsm.onMove(event.clientX, event.clientY);
	}
	
	document.getElementById("myCanvas").addEventListener("mousedown", onClick, false);
	window.addEventListener("mousemove", onMove, false);
}