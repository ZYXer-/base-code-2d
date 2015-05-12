function ImageProcessing() { }


ImageProcessing.applyColorPalette = function(colorSource, colorReference, imageSource, destination) {
	
	
	
};


ImageProcessing.readMatrixFromImage = function(image, width, height, defaultValue, colorAllocation) {
	  
	var readCanvas = createCanvas(width, height);
	var readContext = this.readCanvas.getContext("2d");
	readContext.drawImage(img.get(image), 0, 0);
	var readData = readContext.getImageData(0, 0, width, height);
	
	var matrix = createMatrix(width, height);
	for(var x = 0; x < width; x++) {
		for(var y = 0; y < width; y++) {
			// TODO
		}
	}
	
	
	
};