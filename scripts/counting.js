onmessage = function (pEv) {

	// console.log(d);

	var d = pEv.data,
		y = 0,
		t = performance.now() | 0,
		n = [];

	// console.log(d[0]);

	while(y < d.length){

		if(t - d[y] > 5000){
			d[y] = 0;
			// console.log("OLD");
		} else{
			d[y] = 1;
		}

		y += 1;

	}

	postMessage(d);

};