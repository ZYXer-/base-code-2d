function Fonts() {

	this.fonts = {};

	this.create = function(name, file, minCharSpacingInFile, printCharSpacing, printSpaceWidth, glyphDetectionThresholds, manualSpacing) {

		var fileWidth = file.naturalWidth;
		var fileHeight = file.naturalHeight;

		var fontCanvas = document.createElement("canvas");
		fontCanvas.width = fileWidth;
		fontCanvas.height = fileHeight;

		var fontContext = fontCanvas.getContext("2d");
		fontContext.fillStyle = "rgb(" + Fonts.EMPTY_R + ", " + Fonts.EMPTY_G + ", " + Fonts.EMPTY_B + ")";
		fontContext.fillRect(0, 0, fileWidth, fileHeight);

		fontContext.drawImage(file, 0, 0);
		var fontContextData = fontContext.getImageData(0, 0, fileWidth, fileHeight);
		var data = fontContextData.data;

		this.fonts[name] = {
			name : name,
			file : file,
			charSpacing : printCharSpacing,
			charOffsets : [0],
			charWidths : [printSpaceWidth],
			charHeight : fileHeight,
		};

		var x = 0;

		for(var i = 1; i < 94; i++) {

			while(x < fileWidth && this.columnIsEmpty(x, data, fileWidth, fileHeight)) {
				x++;
			}
			if(x == fileWidth) {
				var char = String.fromCharCode(i + 32);
				console.log("Couldn't find the glyph '" + char + "' for font '" + name + "'.");
			}
			var thisCharOffset = x;

			var emptyColumns = 0;
			while(emptyColumns < minCharSpacingInFile && x < fileWidth) {
				if(this.columnIsEmpty(x, data, fileWidth, fileHeight)) {
					emptyColumns++;
				} else {
					emptyColumns = 0;
				}
				x++;
			}

			var thisCharWidth = x - minCharSpacingInFile - thisCharOffset;

			if(thisCharWidth < 0) {
				var char = String.fromCharCode(i + 32);
				console.log("The glyph for '" + char + "' in font '" + name + "' has a width of 0.");
			}

			this.fonts[name].charOffsets.push(thisCharOffset);
			this.fonts[name].charWidths.push(thisCharWidth);
		}

		var totalFillValue = 0;
		var filledColumns = 0;
		for(var i = 0; i < 100; i++) {
			var fillValue = this.columnFillValue(i, data, fileWidth, fileHeight);
			if(fillValue > 0) {
				totalFillValue += fillValue;
				filledColumns++;
			}
		}
		var averageFillValue = totalFillValue / filledColumns;

		for(var i = 1; i < 94; i++) {
			var firstColumn = this.fonts[name].charOffsets[i];
			var firstColumnFill = this.columnFillValue(firstColumn, data, fileWidth, fileHeight);
			var lastColumn = this.fonts[name].charOffsets[i] + this.fonts[name].charWidths[i] - 1;
			var lastColumnFill = this.columnFillValue(lastColumn, data, fileWidth, fileHeight);

			if(firstColumnFill < averageFillValue * glyphDetectionThresholds[0]) {
				this.fonts[name].charOffsets[i]++;
				this.fonts[name].charWidths[i]--;
			}
			if(firstColumnFill > averageFillValue * glyphDetectionThresholds[1]) {
				this.fonts[name].charOffsets[i]--;
				this.fonts[name].charWidths[i]++;
			}

			if(lastColumnFill < averageFillValue * glyphDetectionThresholds[0]) {
				this.fonts[name].charWidths[i]--;
			}
			if(lastColumnFill > averageFillValue * glyphDetectionThresholds[1]) {
				this.fonts[name].charWidths[i]++;
			}
		}

		for(var i = 0; i < manualSpacing.length; i++) {
			var c = manualSpacing[i].char.charCodeAt(0) - 32;
			if(manualSpacing[i].hasOwnProperty("left")) {
				this.fonts[name].charOffsets[c] -= manualSpacing[i]["left"];
				this.fonts[name].charWidths[c] += manualSpacing[i]["left"];
			}
			if(manualSpacing[i].hasOwnProperty("right")) {
				this.fonts[name].charWidths[c] += manualSpacing[i]["right"];
			}
		}

	};


	this.columnIsEmpty = function(column, data, fileWidth, fileHeight) {
		for(var i = 0; i < fileHeight; i++) {
			if(data[(4 * ((fileWidth * i) + column))] != Fonts.EMPTY_R ||
					data[(4 * ((fileWidth * i) + column)) + 1] != Fonts.EMPTY_G ||
					data[(4 * ((fileWidth * i) + column)) + 2] != Fonts.EMPTY_B) {
				return false;
			}
		}
		return true;
	};


	this.columnFillValue = function(column, data, fileWidth, fileHeight) {
		var fill = 0;
		for(var i = 0; i < fileHeight; i++) {
			var r = data[(4 * ((fileWidth * i) + column))];
			var g = data[(4 * ((fileWidth * i) + column)) + 1];
			var b = data[(4 * ((fileWidth * i) + column)) + 2];
			var fillR = Math.abs((r - Fonts.EMPTY_R) / 255);
			var fillG = Math.abs((g - Fonts.EMPTY_G) / 255);
			var fillB = Math.abs((b - Fonts.EMPTY_B) / 255);
			fill += fillR + fillG + fillB;
		}
		return (fill / (fileHeight * 3));
	};


	this.get = function(name) {
		return this.fonts[name];
	};

}


Fonts.EMPTY_R = 0;
Fonts.EMPTY_G = 255;
Fonts.EMPTY_B = 0;