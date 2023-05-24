// Get the browser-specific request object, either for
// Firefox, Safari, Opera, Mozilla, Netscape, or IE 7 (top entry);
// or for Internet Explorer 5 and 6 (bottom entry). 

function getRequestObject() {
  if (window.XMLHttpRequest) {
    return(new XMLHttpRequest());
  } else if (window.ActiveXObject) { 
    return(new ActiveXObject("Microsoft.XMLHTTP"));
  } else {
    return(null); 
  }
}

// Insert the html data into the element 
// that has the specified id.

function htmlInsert(id, htmlData) {
  document.getElementById(id).innerHTML = htmlData;
}

//When the document (webpage) loads a get request request is performed in one of the formats selected by default

$(window).on("load", function() {
	getTable(url, globalHeaders);
});

//animates the removal of a row/film

$(document).on("click", ".remove", function(){
		$(this).parents("tr").fadeOut("slow");
}); 

//When a a selection is made on data format dropdown, a new GET request is sent
//returning the data in the specified format

$(document).on("change", "#dataFormat", function(){
	globalHeaders = {
	headers: {'Content_Type': 'application/' + $("#dataFormat").val()}
	};
	var orderby = getOrderBy();
			getTable(url+orderby, globalHeaders);
});


//When the search button is clicked, the search parameter is taken and
//it is attached at the end of the url and another GET request is made
//if the search parameter is empty a general all films GET request is made

$(document).on("click", "#searchButton", function(){
	searchDb();
});

//function to get value of each element of a film
//takes in two parameters, a film xml object and the element we want the value of

function xml(film, element){
	return film.getElementsByTagName(element)[0].childNodes[0].nodeValue
}

//all films selection makes a general get request to get all films
$('#searchType').change(function(){
	if($(this).val() == "allFilms"){
		var order = getOrderBy();
		getTable(url+order, globalHeaders);
	}
});

//handles the buttons' animation when the insert or the update modal is opened by clicking on the according button  

$('#insertSubmit,  #updateSubmit').click(function() {
	
   //changes icon of the submit button 
   $(this).find('i').toggleClass('bi bi-plus-circle').toggleClass('bi bi-check2-circle');
   $(this).toggleClass('btn btn-primary').toggleClass('btn btn-success');
   $(this).css({"transform":"scale(1.2)"});
   
   //hides the close button 
  $("#closeInsert, #closeUpdate").hide();
  
  //sets a timer after which submit icon is resetted and close button restored
  setTimeout(() =>{
	$(this).find('i').toggleClass('bi bi-check2-circle').toggleClass('bi bi-plus-circle');
	$(this).toggleClass('btn btn-success').toggleClass('btn btn-primary');
	$("#closeInsert, #closeUpdate").show();
	$(this).css({"transform":"scale(1)"});
	}, 2000)
});

//when the user clicks on the logo the page refreshes
$("#titleHead").on("click", function(){
	location.reload(true);
});

//a new get request is made when a ascending or descending buttons are clciked
$(document).on("change", ".btn-check", function() {
	var orderBy = getOrderBy();
	getTable(url+orderBy, globalHeaders);
});


/*****************************************************************************
 							Pagination Handling
*****************************************************************************/

//creates a the page selection list of numbers and arrows 
function appendPagination(){
	$("#paginationRegion").empty();
	var pages = "";
	var paginationHtml = "<ul class='list-group list-group-horizontal'>"+
	"<li class='list-group-item previous disabled'><a href='#'><i class='bi bi-arrow-left'></i></a></li>";
	
	//loops 10 times to create 10 pages 
	for(var i=1;i<11;i++){
		if(i==1){
		pages += "<li class='list-group-item first active'><a href='#'>"+i+"</a></li>";
		} 
		else if(i==10){
			pages += "<li class='list-group-item last'><a href='#'>"+i+"</a></li>";
		}
		else {
			pages += "<li class='list-group-item element" + i + "'><a href='#'>"+i+"</a></li>";
		}
	}

	paginationHtml += pages + "<li class='list-group-item next'><a href='#'><i class='bi bi-arrow-right'></i></a></li></ul>";
	
$("#paginationRegion").append(paginationHtml);
}

appendPagination();

//this function triggers when the user click on a number or arrow on page selection list 
//active number on the list is highlighted in blue

function pageSelectionClick(clickedLink){
	
	//when next button is clicked
	if(clickedLink.parentElement.classList.contains("next")){
		
		document.querySelector(".previous").classList.remove("disabled"); //previous page activated
		let firstElement = document.querySelector(".first"); //gets first page of the list 
		let lastElement = document.querySelector(".last"); //gets last page of the list 
		let page = parseInt(lastElement.innerText);
		
		//new row is set up
		firstElement.firstChild.innerText = (page + 1);
		for(var i=2; i<10; i++){
			document.querySelector(".element"+i).firstChild.innerText = (page + i);
		}
		lastElement.firstChild.innerText = (page + 10);
		
		firstElement.classList.add("active"); // new row's first element is active 
		
		//calculates the index at which a get request will be perfomed 
		//to display the films of the first page on the new list above created
		page = ((page+1) * 10) -10;
		
		//new data is loaded
		searchDb(page)
		
	//when previous button is clicked
	} else if(clickedLink.parentElement.classList.contains("previous")){
		
		let firstElement = document.querySelector(".first"); //gets first page of the list
		let lastElement = document.querySelector(".last"); //gets last page of the list
		let page = parseInt(firstElement.innerText);
		
		//new row is set up, to reflect the change
		firstElement.firstChild.innerText = (page -10);
		let counter = 9;
		for(var i=2; i<10; i++){
			console.log(counter);
			document.querySelector(".element"+i).firstChild.innerText = (page - counter);
			counter--;
		}
		lastElement.firstChild.innerText = (page -1);
		
		lastElement.classList.add("active"); // new row's last element is active
		
		//if the current page is the first page of the application 
		//then previous button is disabled
		if(document.querySelector(".first").innerText == 1){
			clickedLink.parentElement.classList.add("disabled");
		}
		
		//calculates the index at which a get request will be perfomed 
		//to display the films of the last page on the new list above created
		page = ((page-1) * 10) -10;
		
		//new data is loaded
		searchDb(page)
	}
	//when a number is cliecked
	else {
		clickedLink.parentElement.classList.add("active"); //the number selected gets active
		let clickedLinkPageNumber = parseInt(clickedLink.innerText); //gets number's value
		
		let page = ((clickedLinkPageNumber) * 10) -10;
		
		//new data is loaded
		searchDb(page);
	}
	
}
let pageLinks = document.querySelectorAll("a"); // selects every eleement of page selection list
let leftArrow;
let rightArrow;
let activeElement;


pageLinks.forEach((element) =>{
	element.addEventListener("click", function(){

	leftArrow = document.querySelector(".previous"); 
	rightArrow = document.querySelector(".next");
	activeElement = document.querySelector(".active");

	activeElement.classList.remove("active"); //removes current active element
	
	pageSelectionClick(this); 
	
	});
});

//gets the search and search type parameters and makes a get request
//to retreive the corresponding film records

function searchDb(page){
	var searchString = $("#searchBar").val(); //gets search string 
	var searchType = $("#searchType").val(); //gets type of the search 
	var order= getOrderBy();
	
	//makes a search request only if the relevant fiields are not missing
	if(searchString!= "" && searchString != null && searchType !="allFilms"){
		var searchUrl = url+order+"&searchStr="+searchString+"&searchType="+searchType;
		getTable(searchUrl, globalHeaders, page);
	}
	else{
		getTable(url+order, globalHeaders, page);
	}
}

//refreshes page selection list
function refreshPagination(){ 
	let firstElement = document.querySelector(".first"); 
	let lastElement = document.querySelector(".last");`` 
	
	activeElement = document.querySelector(".active");  //gets active element of the list
	activeElement.classList.remove("active"); //removes active status

	//new row is set up
	firstElement.firstChild.innerText = 1;
	for(var i=2; i<10; i++){
		document.querySelector(".element"+i).firstChild.innerText = i;
	}
	lastElement.firstChild.innerText = 10;
	
	firstElement.classList.add("active");
}
