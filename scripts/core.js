var __lightPaint = (function(){

	'use strict';

	var canvas = document.getElementById('paint'),
		ctx = canvas.getContext('2d'),
		vidCnvs = document.getElementById('vidD'),
		vCtx = vidCnvs.getContext('2d'),
		video = document.getElementById('source'),
		age = undefined;

	var whiteThreshold = 240,
		dR = 255,
		dG = 0,
		dB = 0;

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var pR = 255, // Previous RGB values of the paint color
		pG = 0,
		pB = 0,
		cR = 255, // Current RGB values of the paint color
		cG = 0,
		cB = 0,
		nR = 0, // The RGB color of paint we are transitioning to
		nG = 255,
		nB = 255;

	var transition = 1; // Value we use for linear interpolation between the current and next RGB colors for the paint

	function draw(){

		vCtx.drawImage(video, 0, 0);

		var d = vCtx.getImageData(0,0,vidCnvs.width,vidCnvs.height), // Canvas for drawing the video frame onto
			p = ctx.getImageData(0,0,vidCnvs.width,vidCnvs.height), // The canvas we're painting to.
			h = 0,
			i = 0,
			j = 0,
			k = 0,
			aL = age.length,
			dL = d.data.length,
			tr = transition,
			delta = performance.now() | 0; // The | 0 is a bitwise operation that rounds off the number

		while(h < dL){

			if(d.data[h] > whiteThreshold && d.data[h + 1] > whiteThreshold && d.data[h + 2] > whiteThreshold){
				//It's white, so we'll switch these pixels out with the new color and give them an age
				p.data[h] = cR;
				p.data[h + 1] = cG;
				p.data[h + 2] = cB;

				age[i] = delta;

			} else {
				//Otherwise, like a red door, we want to... paint it black
				d.data[h] = d.data[h + 1] = d.data[h + 2] = 0;

			}

			//Check the age of the pixel, if it hasn't been painted for more than 5 seconds, we'll make it black
			if(delta - age[i] > 5000){ 

				p.data[h] = p.data[h + 1] = p.data[h + 2] = 0;

			}

			h += 4; // Iterate by 4 so we go to the next set of RGBA values
			i += 1; // Iterate by 1 for the age array because it saves CPU time by not having to devide by 4 now or later

		}

		ctx.putImageData(p,0,0); // Draw the newly painted pixels to the canvas

		cR = pR + (0 - ((pR - nR) / 100) * tr) | 0; // Advance our RGB values part of the way to our next color
        cG = pG + (0 - ((pG - nG) / 100) * tr) | 0;
        cB = pB + (0 - ((pB - nB) / 100) * tr) | 0;

        transition += 0.5;
         
        // If we're 100% of the way through our transition it's time for a new color to work towards
        if(transition > 100){
            transition = 1;
            pR = cR;
            pG = cG;
            pB = cB;
            
            nR = Math.random() * 254 | 0;
            nG = Math.random() * 254 | 0;
            nB = Math.random() * 254 | 0;

        }

		window.requestAnimationFrame(draw);	

	}

	function init(){
		console.log("Initialised");

		document.getElementById('start').addEventListener('click', function(){

			navigator.getUserMedia (
				{
				 video: true,
				 audio: false
				},
				function(localMediaStream) {
				 
				 video.src = window.URL.createObjectURL(localMediaStream);
				 video.play();

				 console.log(video);

				 //It's in a setTimeout because FF has issues with getUserMedia events firing... :(
				 setTimeout(function(){

					canvas.width = vidCnvs.width = video.offsetWidth;
					canvas.height = vidCnvs.height = video.offsetHeight;

					ctx.fillRect(0,0,vidCnvs.width, vidCnvs.height);

					//We use Uint32Array because it's waaayyyy faster than an ordinary array - which was the sole bottleneck in the original version
					age = new Uint32Array(vidCnvs.width * vidCnvs.height);

					//Hide the video now, because if we try to access height/width values when display !== block, it returns 0
					video.style.display = "none";
					vidCnvs.style.display = "none";
					document.getElementById('info').style.opacity = 0;

					//Fill our age array with values to start off with
					for(var f = 0; f < vidCnvs.width * vidCnvs.height; f += 1){

						age[f] = 0;

					}

					draw();

				 }, 1000);

				},

				// errorCallback
				function(err) {
				 console.log("The following error occured: " + err);
				}
				);
			
		}, false);

		window.addEventListener('keypress', function(key){

			//If we hit 'f' and Full Screen API is available, go full screen!

			if(key.charCode === 102){

				if (document.body.requestFullscreen) {
	 				 document.body.requestFullscreen();
				} else if (document.body.msRequestFullscreen) {
					 document.body.msRequestFullscreen();
				} else if (document.body.mozRequestFullScreen) {
	  				document.body.mozRequestFullScreen();
				} else if (document.body.webkitRequestFullscreen) {
	  				document.body.webkitRequestFullscreen();
				}
			
			}

		}, false);

	}

	return{
		init : init
	};

})();

(function(){
	__lightPaint.init();
})();