(function(window){

	// prepare an object and associate necessary methods to it
	var objectAjax = {};
	

	// get request object 
	function getRequestObject(){
		if(window.XMLHttpRequest){
			return (new XMLHttpRequest());
		}
		else if (window.ActiveXObject){
			return (new ActiveXObject("Microsoft.XMLHTTP"));
		}
		else{
			window.alert("Your browser does not support Ajax!");
			return (null);
		}
	};

	// main function
	// send requests and handle responses
	objectAjax.sendHttpRequest = function(requestUrl, responseHandler, isJson){
		var request = getRequestObject();
		if (request){
			request.open("GET", requestUrl, true);
			// provide a versatile function that allows differet ways to handle the reponse
			// whoever call this function can even pass a function to handle the events
			request.onreadystatechange = 
				function(){
					handleResponse(request, responseHandler, isJson);
			};
			request.send(null);
		}
		else{
			alter("Sorry, your browser doesn't support XMLHttpRequest");
		}
	};


	function handleResponse(request, responseHandler, isJson){
		if((request.readyState == 4) && (request.status == 200)){
			
			// set the parameter to "true" by default
			if (isJson == undefined){
				isJson = true;	
			}
			if (isJson){
				responseHandler(JSON.parse(request.responseText));
			}
			else{
				responseHandler(request.responseText);
			}	
		}
	};

	// expose the object to the global scope
	window.$objectAjax = objectAjax;

})(window);

	


