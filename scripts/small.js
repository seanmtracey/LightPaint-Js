(function(){

	var ctx = paint.getContext('2d'),
		vCtx = vidD.getContext('2d'),
		age = undefined;

	var whiteThreshold = 240;

	// Assuming unprefixed can remove 
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

	function draw(){

		vCtx.drawImage(source, 0, 0);

		var d = vCtx.getImageData(0,0,vidD.width,vidD.height), // Canvas for drawing the video frame onto
			p = ctx.getImageData(0,0,vidD.width,vidD.height), // The canvas we're painting to.
			h = 0,
			i = 0,
			j = 0,
			k = 0,
			aL = age.length,
			dL = d.data.length,
			delta = performance.now() | 0; // The | 0 is a bitwise operation that rounds off the number

		while(h < dL){

			if(d.data[h] > whiteThreshold && d.data[h + 1] > whiteThreshold && d.data[h + 2] > whiteThreshold){
				//It's white, so we'll switch these pixels out with the new color and give them an age
				p.data[h] = 90;
				p.data[h + 1] = 180;
				p.data[h + 2] = 230;

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

		window.requestAnimationFrame(draw);	

	}

	(function init(){

		navigator.getUserMedia (
	      {
	         video: true
	      },
	      function(localMediaStream) {
	         
	         source.src = window.URL.createObjectURL(localMediaStream);
	         source.play();

	         setTimeout(function(){

				paint.width = vidD.width = source.offsetWidth;
				paint.height = vidD.height = source.offsetHeight;

				ctx.fillRect(0,0,vidD.width, vidD.height);

				age = new Uint32Array(vidD.width * vidD.height);

				source.style.display = "none";
				vidD.style.display = "none";
				document.getElementById('info').style.opacity = 0;

				draw();

	         }, 1000);

	      },
	      function() {
	      }
	   );

	})();

})();