let pieceList;
let selectedTile = -1;
let Draw = false;


function getImagesfromDom() {

	return {
		"white-king" : $("#white-king").get(0),
		"white-knight" : $("#white-knight").get(0),
		"white-rook" : $("#white-rook").get(0),
		"black-king" : $("#black-king").get(0),
		"black-knight" : $("#black-knight").get(0),
		"black-rook" : $("#black-rook").get(0),
	};
}


function drawBoard(pieceList, selectedTile) {

	if (Draw == false){
		let cnv = document.getElementById("grid");
		let ctx = cnv.getContext("2d");

		let pieces = getImagesfromDom();
		const id = 'black'
		const pieceScale = 100;
		const darkTileColor = "#b58863";
		const lightTileColor = "#f0d9b5 ";
		const highlightColor = "rgba(10, 255, 10, 0.15)";

		ctx.fillStyle = darkTileColor;
		ctx.fillRect(0, 0, 100, 100);
		ctx.fillRect(200, 0, 100, 100);
		ctx.fillRect(400, 0, 100, 100);
		ctx.fillRect(600, 0, 100, 100);
		
		ctx.fillStyle = lightTileColor;
		ctx.fillRect(100, 0, 100, 100);
		ctx.fillRect(300, 0, 100, 100);
		ctx.fillRect(500, 0, 100, 100);
		ctx.fillRect(700, 0, 100, 100);
		
		// draw: highlighted tile
		if (selectedTile != -1) {
			console.log(selectedTile)
			ctx.fillStyle = highlightColor;
			ctx.fillRect(selectedTile*100, 0, 100, 100);
		}

		// draw: pieces
		for (let i = 0; i < pieceList.length; i++) {
			if (pieceList[i] != "Empty") {			
				ctx.drawImage(pieces[pieceList[i]], i*100, 0, pieceScale, pieceScale);
			}
		}
	}
}

function reset() {
	console.log("RESET!");

	pieceList = [ 'white-king', 'white-knight', 'white-rook', 
				'Empty', 'Empty',
				'black-rook', 'black-knight', 'black-king'
			];
	drawBoard(pieceList);	
}


//from: https://stackoverflow.com/a/5417934
function getCursorPosition(e) {
	let x, y;

	canoffset = $("#grid").offset();
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

	return [x,y];
}


// Returns the index of the chess tile that was clicked from click event 'e'
function getTileFromClick(e) {
	return Math.floor(getCursorPosition(e)[0]/100);
}

 

function isLegalMove(tileClicked) {
	let lastSelectedPiece = pieceList[selectedTile];
	if (lastSelectedPiece == 'white-knight' || lastSelectedPiece == 'black-knight') {
		console.log('Knight')
		if (tileClicked == selectedTile - 2 || tileClicked == selectedTile + 2){
			return true;
		}
	}
	else if (lastSelectedPiece == 'white-king' || lastSelectedPiece == 'black-king') {
		console.log('King')
		if (Math.abs(tileClicked - selectedTile) == 1) {
			//tileClicked == selectedTile - 1 || tileClicked == selectedTile + 1){
			return true;
		}
	}

	else if (lastSelectedPiece == 'white-rook' || lastSelectedPiece == 'black-rook') {
		console.log('Rook');
		if (Math.abs(tileClicked - selectedTile) == 1) {
			return true;
		}
		let start = Math.min(tileClicked, selectedTile);
		let end = Math.max(tileClicked, selectedTile);
		for (let i=start+1; i<end; i++) {
			if (pieceList[i] != 'Empty') {
				return false;
			}
		}
		return true;
	}	

	return false;
}

window.onload = () => {
	pieceList = [ 'white-king', 'white-knight', 'white-rook', 
				'Empty', 'Empty',
				'black-rook', 'black-knight', 'black-king'
			];
	drawBoard(pieceList);
	$("#reset-button").click(reset);

	$("#grid").mousedown((e) => {
		let tileClicked = getTileFromClick(e);
		if (selectedTile == -1) {
			if (pieceList[tileClicked] != 'Empty') {
				selectedTile = tileClicked;
			}
		}
		else {
			if (tileClicked != selectedTile) {
				if (isLegalMove(tileClicked)) {
					// move the pieces
					let lastSelectedPiece = pieceList[selectedTile];
					pieceList[tileClicked] = lastSelectedPiece;
					pieceList[selectedTile] = 'Empty';
				}
			}
			selectedTile = -1;
		}
		drawBoard(pieceList, selectedTile);		
	});

};
