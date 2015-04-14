//classes.js

//game state machine
function StateMachine(config){
	this.currentState = config.initial;
	this.callbacks = config.callbacks;
	this.variables = config.variables;
	
	this.callbacks["onenter" + this.currentState]("nostate", this.variables);
}

StateMachine.prototype.change = function(nextState){
	if (this.callbacks["onexit" + this.currentState]){
		this.callbacks["onexit" + this.currentState](nextState, this.variables);
	}
	var prevState = this.currentState;
	this.currentState = nextState;
	if (this.callbacks["onenter" + this.currentState]) {
		this.callbacks["onenter" + this.currentState](prevState, this.variables);
	}
}

StateMachine.prototype.onClick = function(x, y){
	//console.log("Click at: " + x + ", " + y);
	if (this.callbacks["onclick" + this.currentState]){
		this.callbacks["onclick" + this.currentState](x, y, this, this.variables);
	}
}

StateMachine.prototype.onMove = function(x, y){
	if (this.callbacks["onmove" + this.currentState]){
		this.callbacks["onmove" + this.currentState](x, y, this, this.variables);
	}
}

//option box
function OptionBox(optionList, positionInfo){
	this.optionList = optionList;
	this.x = positionInfo.x || 50;
	this.y = positionInfo.y || 50;
	this.dy = positionInfo.dy || 25;
	this.textAlign = positionInfo.align || "end";
	this.fillStyle = positionInfo.fillStyle || "#0f0f0f";
	this.fillStyleHighlight = positionInfo.fillStyle || "#ff0f0f";
	this.highlighted = -1;
}

OptionBox.prototype.display = function(ctx){
	ctx.fillStyle = this.fillStyle;
	ctx.textAlign = this.textAlign;
	for (var i = 0; i < this.optionList.length; i++){
		ctx.fillText(this.optionList[i], this.x, this.y + i *this.dy);
	}
}

OptionBox.prototype.getFromClick = function(x, y){
	var offsetY = y - this.y - this.dy / 2;
	if (offsetY < 0){
		return -1;
	}
	offsetY = Math.floor((offsetY / this.dy));
	if (offsetY >= this.optionList.length){
		return -1;
	}
	return offsetY;
}

OptionBox.prototype.highlight = function(x, y, ctx){
	var newHL = this.getFromClick(x, y);
	if (newHL != this.highlighted){
		//dehighlight old text
		if (this.highlighted != -1){
			ctx.fillStyle = this.fillStyle;
			ctx.textAlign = this.textAlign;
			ctx.fillText(this.optionList[this.highlighted], this.x, this.y + this.highlighted *this.dy);
		}
		//redraw highlighted text
		if (newHL != -1){
			ctx.fillStyle = this.fillStyleHighlight;
			ctx.textAlign = this.textAlign;
			ctx.fillText(this.optionList[newHL], this.x, this.y + newHL *this.dy);
		}
		this.highlighted = newHL;
	}
}














