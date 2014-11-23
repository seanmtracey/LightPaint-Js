var pipes = (function(){

	var DOM = {
		canvas : {
			element : undefined,
			ctx : undefined
		},
		button :{
			takePhoto : undefined
		}
	},
	touchStart,
	touchMove,
	touchEnd,
	touchDown = false,
	mainImage = {
		element : undefined,
		offset : {
			x : 0,
			y : 0
		},
		scale : 1
	},
	coordinates = {
		startX : undefined,
		startY : undefined,
		currentX : undefined,
		currentY : undefined,
		lastX : undefined,
		lastY : undefined
	};

	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; 
		window.requestAnimationFrame = requestAnimationFrame;

	function updateImage(options){

		if(mainImage === undefined){
			console.error("An image has not been loaded yet");
			return false;
		}

		if(mainImage.offset.x > 0){
			mainImage.offset.x = 0;
		}

		if(mainImage.offset.y > 0){
			mainImage.offset.y = 0;
		}

		if(mainImage.offset.x + mainImage.element.width < DOM.canvas.element.width){
			mainImage.offset.x = (DOM.canvas.element.width - mainImage.element.width) + 1;
		}

		if(mainImage.offset.y + mainImage.element.height < DOM.canvas.element.height){
			mainImage.offset.y = (DOM.canvas.element.height - mainImage.element.height) + 1;
		}

		// console.log(-DOM.canvas.element.width);

		// console.log(mainImage.offset.x + mainImage.element.width);	

		// console.log(-DOM.canvas.element.width);
		// console.log(mainImage.offset.y + mainImage.element.height);

		DOM.canvas.ctx.drawImage(mainImage.element, mainImage.offset.x, mainImage.offset.y);

	}

	function drawImage(image, x, y){

		if(image == undefined){
			console.error("No image passed");
			return false;
		}

		x = x || 0;
		y = y || 0;

		DOM.canvas.ctx.drawImage(image, x, y);

		mainImage.element = image;
		mainImage.offset.x = x;
		mainImage.offset.y = y;
		
		coordinates.startX = 0;
		coordinates.startY = 0;
		coordinates.currentX = 0;
		coordinates.currentY = 0;
		coordinates.lastX = 0;
		coordinates.lastY = 0;

		console.log("Got here");

	}

	function loadImage(e){

		var file = e.target.files[0];

		if (!file.type.match('image.*')) {
			console.error("Not an image file - Must be a PNG or JPG.");
			return false;
		}

		var reader = new FileReader();

		reader.onload = function(e){
			// console.log(e.target.result);
			console.log(e.target);
			var loadedImage = new Image();
				loadedImage.src = e.target.result;
				loadedImage.onload = (function(img){
					console.log("Loaded");

					setTimeout(function(){
						drawImage(img, 0, 0);
					}, 100);

				})(loadedImage);
				
		}

		reader.readAsDataURL(file);

	}

	function output(message){
		document.getElementById('output').innerHTML = message;
	}

	function addEvents(){

		document.addEventListener(touchMove, function(e){
			e.stopPropagation();
			e.preventDefault();
		}, false);

		DOM.canvas.element.addEventListener(touchStart, function(e){
			e.stopPropagation();
			e.preventDefault();

			touchDown = true;

			var X = "changedTouches" in e ? e.changedTouches[0].pageX : e.pageX,
				Y = "changedTouches" in e ? e.changedTouches[0].pageY : e.pageY;

			coordinates.startX = X - DOM.canvas.element.getBoundingClientRect().left;
			coordinates.startY = Y - DOM.canvas.element.getBoundingClientRect().top;

			if(coordinates.lastX === undefined){
				coordinates.lastX = coordinates.startX;
			}

			if(coordinates.lastY === undefined){
				coordinates.lastY = coordinates.startY;
			}

		}, true);

		DOM.canvas.element.addEventListener(touchMove, function(e){
			e.stopPropagation();
			e.preventDefault();

			/*var X = e.changedTouches[0].pageX || e.clientX || e.pageX,
				Y = e.changedTouches[0].pageY || e.clientY || e.pageY;*/

			var X = "changedTouches" in e ? e.changedTouches[0].pageX : e.pageX,
				Y = "changedTouches" in e ? e.changedTouches[0].pageY : e.pageY;

			if(touchDown){
				coordinates.currentX = (X - DOM.canvas.element.getBoundingClientRect().left);
				coordinates.currentY = (Y - DOM.canvas.element.getBoundingClientRect().top);

				mainImage.offset.x = coordinates.lastX - (coordinates.startX - coordinates.currentX);
				mainImage.offset.y = coordinates.lastY - (coordinates.startY - coordinates.currentY);

				if(mainImage.element !== undefined){
					requestAnimationFrame(updateImage);
				}

			}

		}, true);

		DOM.canvas.element.addEventListener(touchEnd, function(e){
			e.stopPropagation();
			e.preventDefault();

			touchDown = false;

			coordinates.lastX = mainImage.offset.x;
			coordinates.lastY = mainImage.offset.y;

		}, true);

		DOM.button.takePhoto.addEventListener('change', function(e){
			console.log("There's a disturbance in the force");
			console.log(e);

			loadImage(e);
		}, true);

	}

	function init(){
		console.log("Hello, World. Recognise.");
		
		DOM.canvas.element = document.getElementById('canvas');
		DOM.canvas.ctx = DOM.canvas.element.getContext('2d');
		DOM.button.takePhoto = document.getElementById('takePhoto');

		touchStart = "ontouchstart" in window ? "touchstart" : "mousedown";
		touchMove = "ontouchmove" in window ? "touchmove" : "mousemove";
		touchEnd = "ontouchend" in window ? "touchend" : "mouseup";

		mainImage.offset.x = 0;
		mainImage.offset.y = 0;
		
		coordinates.startX = 0;
		coordinates.startY = 0;
		coordinates.currentX = 0;
		coordinates.currentY = 0;

		addEvents();

	}

	return{
		init : init
	}

})();

(function(){

	pipes.init();

})();