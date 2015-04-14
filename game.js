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
	fsm.change("tselect");
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
		fsm.change("begingame");
	}
}

function onMoveTSelect(x, y, fsm, variables){
	variables.optionBox.highlight(x, y, variables.ctx);
}

//begin game functions
function onEnterBeginGame(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.fillText(variables.team + " vs. " + variables.opponent, 100, 100);
	variables.period = 1;  //1 is first half, 2 second half, 3 is universe
	variables.gScore = 0;
	variables.bScore = 0;
}

function onClickBeginGame(x, y, fsm, variables){
	fsm.change("endgame");
}

//end game functions
function onEnterEndGame(from, variables){
	resetCanvas(variables);
	variables.ctx.fillStyle = "#0f0f0f";
	variables.ctx.fillText(variables.team + " wins", 100, 100);
}

function onClickEndGame(x, y, fsm, variables){
	fsm.change("menu");
}

function Start() {
	var config = {
		initial: 'menu',
		callbacks: {
			onentermenu: function(from, variables) {onEnterMenu(from, variables)},
			onexitmenu: function(to, variables) { },
			onclickmenu: function(x, y, fsm, variables) {onClickMenu(x, y, fsm, variables); },
			
			onentertselect: function(from, variables) {onEnterTSelect(from, variables) },
			onexittselect: function(to, variables) { },
			onclicktselect: function(x, y, fsm, variables) {onClickTSelect(x, y, fsm, variables); },
			onmovetselect: function(x, y, fsm, variables) {onMoveTSelect(x, y, fsm, variables); },
			
			onenterbegingame: function(from, variables) { onEnterBeginGame(from, variables) },
			onexittbegingame: function(to, variables) { },
			onclickbegingame: function(x, y, fsm, variables) { onClickBeginGame(x, y, fsm, variables) },
			
			onenterendgame: function(from, variables) { onEnterEndGame(from, variables) },
			onexitendgame: function(to, variables) { },
			onclickendgame: function(x, y, fsm, variables) { onClickEndGame(x, y, fsm, variables) }
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