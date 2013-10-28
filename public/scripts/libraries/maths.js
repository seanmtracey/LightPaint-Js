var maths = (function(){

	function distance(p0, p1){

		return Math.sqrt( ( p0.x - p1.x ) * ( p0.x - p1.x ) + ( p0.y - p1.y ) * ( p0.y - p1.y ) );

	}
	
	return{
		distance : distance
	}

})();