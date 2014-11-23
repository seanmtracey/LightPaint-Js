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

	window.audioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext);
	window.requestAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame);

	var pR = 255;
	var pG = 0;
	var pB = 0;

	var cR = 255;
	var cG = 0;
	var cB = 0;

	var nR = 0;
	var nG = 255;
	var nB = 255;

	var transition = 1;

	function draw(){

		vCtx.drawImage(video, 0, 0);

		var d = vCtx.getImageData(0,0,vidCnvs.width,vidCnvs.height),
			p = ctx.getImageData(0,0,vidCnvs.width,vidCnvs.height),
			data = d.data,
			h = 0,
			i = 0,
			j = 0,
			k = 0,
			aL = age.length,
			delta = performance.now() | 0;


		while(h < data.length){

			if(data[h] > 240 && data[h + 1] > 240 && data[h + 2] > 240){
				//It's white;
				p.data[h] = cR;
				p.data[h + 1] = cG;
				p.data[h + 2] = cB;

				age[i] = delta;

			} else {

				data[h] = data[h + 1] = data[h + 2] = 0;

			}

			h += 4;
			i += 1;

		}

		while(j < aL){

			//This if statement to determine the age if the pixels is the bottleneck;
			if(delta - age[j] > 5000){ 

				p.data[k] = 0;
				p.data[k + 1] = 0;
				p.data[k + 2] = 0;

			}
		
			j += 1;
			k += 4;

		}

		// console.log(delta, age[0], delta - age[0]);

		ctx.putImageData(p,0,0);

		cR = pR + (0 - ((pR - nR) / 100) * transition) | 0;
        cG = pG + (0 - ((pG - nG) / 100) * transition) | 0;
        cB = pB + (0 - ((pB - nB) / 100) * transition) | 0;

         transition += 0.5;
            
        if(transition > 100){
            transition = 1;
            pR = cR;
            pG = cG;
            pB = cB;
            
            nR = Math.random() * 255 | 0;
            nG = Math.random() * 255 | 0;
            nB = Math.random() * 255 | 0;
            
        }

		window.requestAnimationFrame(draw);

	}

	function init(){
		console.log("Initialised");

		navigator.getUserMedia (
	      {
	         video: true,
	         audio: false
	      },
	      function(localMediaStream) {
	         
	         video.src = window.URL.createObjectURL(localMediaStream);
	         video.play();

	         console.log(video);

	         setTimeout(function(){
				canvas.width = vidCnvs.width = video.offsetWidth;
				canvas.height = vidCnvs.height = video.offsetHeight;

				ctx.fillRect(0,0,vidCnvs.width, vidCnvs.height);

				//We use Uint16Array because it's waaayyyy faster than an ordinary array - which was the sole bottleneck in the original version
				age = new Uint16Array(vidCnvs.width * vidCnvs.height);

				video.style.display = "none";
				vidCnvs.style.display = "none";
				document.getElementById('info').style.opacity = 0;

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

		window.addEventListener('keypress', function(key){

			console.log(key.charCode);

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