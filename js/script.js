(function(window){

	var dc = {};

	var homeHtml = "snippet/home-snippet.html";
	var categoryTitleHtml = "snippet/menu-category-title.html";
	var categoryHtml = "snippet/category-tiles.html"
	var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
	

	document.addEventListener("DOMContentLoaded", 
		function(event){
			$objectAjax.sendHttpRequest(homeHtml, 
			function(responseText){
				document.querySelector("#main-content").innerHTML = responseText;
			},
			false);
		});

	function insertHtml(selector, content){
		document.querySelector(selector).innerHTML = content;
	}

	var insertProperty = function (string, propName, propValue) {
	  var propToReplace = "{{" + propName + "}}";
	  string = string
	    .replace(new RegExp(propToReplace, "g"), propValue);
	  return string;
	}

	// ******************Dynamic Load Menu Cateogry Page**************************

	// load contents on menu category page
	dc.loadCategory = function(){
		// make a GET request to ask category data from API
		$objectAjax.sendHttpRequest(allCategoriesUrl,
			showCategoryTiles,
			true);	
	}

	// once receive the response from the API, use this function to handle the response
	function showCategoryTiles(allCategories){
		// make an request to get the title and special instructions for the menu category page
		$objectAjax.sendHttpRequest(categoryTitleHtml,
			function(categoryTitleHtml){
				// once receive response (containing title and instruction)
				// make another request to get the html that constructs the menu category page
				$objectAjax.sendHttpRequest(categoryHtml,
					function(categoryHtml){
						// pass all responses (category data, title and instruction, category html page) into the following function
						var categoryTiles = buildCategoryTiles(allCategories, categoryTitleHtml, categoryHtml);
						insertHtml("#main-content", categoryTiles);
					},
					false);
			},
			false);		
	}

	// construct the category menu page
	function buildCategoryTiles(allCategories, categoryTitleHtml, categoryHtml){
		var finalHtml = categoryTitleHtml;
		finalHtml += '<section class="row">';
		for (var i = 0; i<allCategories.length; i++){
			var shortName = allCategories[i].short_name;
			var realName = allCategories[i].name;
			var categoryTile = insertProperty(categoryHtml, "shortname", shortName);
			categoryTile = insertProperty(categoryTile, "name", realName);
			finalHtml += categoryTile;
		};
		finalHtml += '</section>';
		return finalHtml;
	}

// ******************Complete Loading Menu Cateogry Page***********************

// ******************Dynamic Load Menu Item Page***********************

var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
var menuItemsTitleHtml = "snippet/menu-item-title.html";
var menuItemHtml = "snippet/single-menu-item.html";

dc.loadMenuItem = function(itemShortName){
	$objectAjax.sendHttpRequest(
		menuItemsUrl + itemShortName,
		showMenuItems,
		true);
}

function showMenuItems(menuItemData){
	$objectAjax.sendHttpRequest(menuItemsTitleHtml,
		function(menuItemsTitleHtml){
			$objectAjax.sendHttpRequest(menuItemHtml,
				function(menuItemHtml){
					var finalMenuItems = buildMenuItems(menuItemData, menuItemsTitleHtml, menuItemHtml);
					insertHtml("#main-content", finalMenuItems);
				},
				false);
		},
		false);
}

function buildMenuItems(menuItemData, menuItemsTitleHtml, menuItemHtml){
	finalHtml = '<div id="menu-items" class="row">'

	// dynamic insert the title and special instruction for the page
	var menuName = menuItemData.category.name;
	var instruction = menuItemData.category.special_instructions;
	var menuItemTitle = insertProperty(menuItemsTitleHtml, "name", menuName);
	menuItemTitle = insertProperty(menuItemTitle, "special_instruction", instruction);
	finalHtml += menuItemTitle;
	var categoryShort = menuItemData.category.short_name;

	// dynamic insert single item 
	for (var i = 0; i < menuItemData.menu_items.length; i++){

		var itemNumber = menuItemData.menu_items[i].short_name;
		var itemName = menuItemData.menu_items[i].name;
		var desc = menuItemData.menu_items[i].description;

		var singleItem = insertProperty(menuItemHtml, "shortname", categoryShort);
		singleItem = insertProperty(singleItem, "menuItemNumber", itemNumber);
		singleItem = insertProperty(singleItem, "itemName", itemName);
		singleItem = insertProperty(singleItem, "description", desc);

		// if (i % 2 != 0) {
  //     singleItem +=
  //       "<div class='clearfix visible-lg-block visible-md-block'></div>";
  //   }

		finalHtml += singleItem

	}

	finalHtml += '</div>'
	return finalHtml
}

// ******************Complete Loading Menu Item Page***********************

	window.dc = dc;			

})(window);





// (function(global){

// 	// create an object
// 	var ajaxUtils = {};

// 	function getHttpRequest(){
// 		if(global.XMLHttpRequest){
// 			return (new XMLHttpRequest());
// 		}
// 		else if (global.ActiveXObject){
// 			return (new ActiveXObject("Microsoft.XMLHTTP"));
// 		}
// 		else{
// 			global.alter("Your browser does not support Ajax!");
// 			return (null);
// 		}
// 	}

// 	// main function
// 	ajaxUtils.sendHttpRequest = function(requestUrl, responseHandler){
// 		var request = getHttpRequest();
// 		if (request){
// 			request.open("GET", requestUrl, true);
// 			// provide a versatile function that allows differet ways to handle the reponse
// 			// whoever call this function can even pass a function to handle the events
// 			request.onreadystatechange = function(){
// 				handleResponse(request, responseHandler);
// 			};
// 			request.send(null);
// 		}
// 		else{
// 			alter("Sorry, your browser doesn't support XMLHttpRequest");
// 		}
// 	}


// 	function handleResponse(request, responseHandler){
// 		// alert("handle response starts");
// 		if((request.readyState == 4) && (request.status == 200)){
// 			responseHandler(request.responseText);
// 		}
// 	}


// 	var homeHtml = "snippet/home-snippet.html";

// 	document.addEventListener("DOMContentLoaded", 
// 		function(event){
// 		ajaxUtils.sendHttpRequest(
// 			homeHtml, 
// 			function(responseText){
// 				document.querySelector("#main-content").innerHTML = responseText;
// 			});
// 	});
	
// 	// global.ajaxUtils = ajaxUtils;
// 	// console.log("ajaxUtil has been added to window object");
	
// })(window);