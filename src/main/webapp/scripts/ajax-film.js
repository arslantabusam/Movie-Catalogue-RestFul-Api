//global variable to set headers for HTTPS requets through axios 
globalHeaders = { 
	headers: {'Content_Type': 'application/' + $("#dataFormat").val()}
};

/*
setting axios default Content-type headers to empty as i'm having issues 
using this header, for my HTTPS requests i'm using a variation of it "Content_Type"
*/
axios.defaults.headers.post['Content-Type'] = '';
axios.defaults.headers.put['Content-Type'] = '';
axios.defaults.headers.delete['Content-Type'] = '';

//global variable for api url
const url = "http://localhost:8081/FilmRestfulApi/filmapi";

//global variable for data handling 
var data;

//XML Table creation
function xmlFilmDetails(request, resultRegion, pageIndex) {
		if(request.status == 200) {
		
		//gets the data from get request and parses the xml document
		var xmlDocument = request.data;
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(xmlDocument, "application/xml");
		data = xmlDoc.getElementsByTagName("film");
		
		var table = tableHeader(data.length); //creates headers of the table
		var body = "";
		let n = data.length - pageIndex; //number of rows that will be generated in one page
		
		//sets the max rows per page to 10
		if(n>10)
			n=10;
		
		for(var i=0;i<n; i++){
			var film = data[i+pageIndex]; //decides which ten rows od the data will be created
			
			//creates data tables for each value and the edit and delete buttons at the end of each row
			body += filmTableBody(xml(film, "id"), xml(film, "title"), xml(film, "year"), xml(film, "director"), xml(film, "stars"), xml(film, "review"));
		}
		table += body + "</table></div>";
		htmlInsert(resultRegion, table); //inserts the table in resultRegion tag defined in index.jsp
	}
}


//JSON Table creation
function jsonFilmDetails(request, resultRegion, pageIndex) {
		if(request.status == 200) {
			
		var rawData = request.data; //gets the data from get request
		data = eval(rawData); //evalutes it with the function eval()
		
		var table = tableHeader(data.length); //creates headers of the table
		var body = "";
		let n = data.length - pageIndex; //number of rows that will be generated in one page
		
		//sets the max rows per page to 10
		if(n>10)
			n=10;
		
		for(var i=0;i<n; i++){
			var film = data[i+pageIndex]; //decides which ten rows od the data will be created
			
			//creates data tables for each value and the edit and delete buttons at the end of each row
			body += filmTableBody(film.id, film.title, film.year, film.director, film.stars, film.review);
		}
		table += body + "</table></div>";
		htmlInsert(resultRegion, table); //inserts the table in resultRegion tag defined in index.jsp
	}
}

//Text Table creation
function stringFilmDetails(request,resultRegion, pageIndex) {
	if(request.status == 200) {
		var rawData = request.data; //gets the data from get request
		data = rawData.split("%%"); //parses the data
	
		var table = tableHeader(data.length-1); //creates header of the table
		var body = "";
		let n = data.length - pageIndex; //number of rows that will be generated in one page
		
		//sets the max rows per page to 10
		if(n>10)
			n=10;
		
		for (var i = 1; i <n; i++) {
			var film = data[i+pageIndex].split("#");//decides which ten rows od the data will be created
			
			//creates data tables containing each value of the film and the edit and delete buttons at the end of each row
			body += filmTableBody(film[0], film[1], film[2], film[3], film[4], film[5]);	
		}
		table += body + "</table>";
		htmlInsert(resultRegion, table); //inserts the table in resultRegion tag defined in index.jsp
	}
}

/*								 GET 

function to make a get request to filmapi to get the data using axios get
if the request is successful an appropriate response handler is selected to parse and display the data
if not successfull it pritns the error
*/

function getTable(url, globalHeaders, pageIndex=0){
	axios.get(url, globalHeaders)
	.then(function(request){
		var responseHandler = formatSelector($("#dataFormat").val());
		responseHandler(request, "filmRegion", pageIndex);
	})
	.catch(function(error){
		console.log(error);
	});
}

//function to select the appropriate response handler to manage the response 

function formatSelector(format) {
	if (format == "xml") {
		return (xmlFilmDetails);
	} else if (format == "text") {
		return (stringFilmDetails);
	} else {
		return (jsonFilmDetails);
	}
}

/*								 POST 
						
When submit button is clicked on update modal, an object is created with the data inserted by user 
in an appropiate format selected by the user and a put request is sent to the film api
*/
$(document).on("click", "#insertSubmit", function() {
	
	//gets the values from insert modal fields
	var insertTitle = $("#insertTitle").val();
	var insertYear = $("#insertYear").val();
	var insertDirector = $("#insertDirector").val();
	var insertStars = $("#insertStars").val();
	var insertReview = $("#insertReview").val();
    
	var insertObject="";
	
	//if any of the fields is missing an alert is showed
	if(insertTitle == "" | insertYear == "" | insertDirector=="" | insertStars=="" | insertReview==""){
		alert("Fileds Missing");
	}
	else {
		//creates an xml object 
		if ($("#dataFormat").val() == "xml") {
			insertObject = "<film>" + "<title>" + insertTitle + "</title>" + "<year>" + insertYear + "</year>" +"<director>" + insertDirector + 
			"</director>" + "<stars>" + insertStars + "</stars>" + "<review>" + insertReview + "</review> </film>";
		}
		//creates a cvs object
		else if($("#dataFormat").val() == "text"){
			insertObject = "%%" + insertTitle + "#" + insertYear + "#" + insertDirector + "#" +insertStars + "#" + insertReview;
		}
		//defaults to create a json object
		else {
			insertObject = "{ \"title\": " + "\"" + insertTitle + "\"" + ",\"year\": " + "\"" + insertYear + "\"" + ",\"director\": " + 
			"\"" +insertDirector + "\"" + ",\"stars\": " + "\"" + insertStars + "\"" + ",\"review\": " + "\"" + insertReview + "\"" + "}";
		}
		
		//makes a POST request and if successful, empties modal fields for insert after a set timer 
		//and performs a GET request, otherwise prints the error
		
		axios.post(url, insertObject, globalHeaders)
		.then(function(){
			setTimeout(() =>{
				$("#insertTitle").val("");
				$("#insertYear").val("");
				$("#insertDirector").val("");
				$("#insertStars").val("");
				$("#insertReview").val("");
			}, 2000)
			var orderby = getOrderBy();
			refreshPagination();
			getTable(url+orderby, globalHeaders);
		})
		.catch(function(){
			console.log("Error");
		});
		
	}
});

/*								 PUT 

When update press is clicked, the already existing data in the fields 
is displayed in a modal ready to be updated
*/
$(document).on("click", ".updateModal", function() {
	//get the values of already existing row/film 
	//to be able to upadte it
	$("#updateId").val($(this).data('id'));
	$("#updateTitle").val($(this).data('title'));
	$("#updateYear").val($(this).data('year'));
	$("#updateDirector").val($(this).data('director'));
	$("#updateStars").val($(this).data('stars'));
	$("#updateReview").val($(this).data('review'));
});

//When submit button is clicked on update modal, an object is created with the data inserted by user 
//in an appropiate format selected by the user and a PUT request is sent to the film api

$(document).on("click", "#updateSubmit", function() {
	var updateId = $("#updateId").val();
	var updateTitle = $("#updateTitle").val();
	var updateYear = $("#updateYear").val();
	var updateDirector = $("#updateDirector").val();
	var updateStars = $("#updateStars").val();
	var updateReview = $("#updateReview").val();

	var updateObject;
	
	//creates an xml object 
	if ($("#dataFormat").val() == "xml") {
		updateObject = "<film>" + "<id>" + updateId + "</id>" + "<title>" + updateTitle + "</title>" + "<year>" + updateYear + "</year>" +
		"<director>" + updateDirector + "</director>" + "<stars>" + updateStars + "</stars>" + "<review>" + updateReview + "</review> </film>";
	}
	//creates a cvs object
	else if($("#dataFormat").val() == "text"){
		updateObject = "%%"+ updateId + "#" + updateTitle + "#" + updateYear + "#" + updateDirector + "#" + updateStars + "#" + updateReview;
	}
	//default create a json object
	else { 
		updateObject = "{ \"id\": " + updateId + ",\"title\": " + "\"" + updateTitle + "\"" + ",\"year\": " + "\"" + updateYear + "\"" +
		",\"director\": " + "\"" + updateDirector + "\"" + ",\"stars\": " + "\"" + updateStars + "\"" + ",\"review\": " + "\"" + updateReview + "\"" + "}";
	}

	//makes a PUT request and if successful it performs a GET request
	axios.put(url, updateObject, globalHeaders)
	.then(function(){
		var orderby = getOrderBy();
		refreshPagination();
		getTable(url+orderby, globalHeaders);
	})
	.catch(function(){
		console.log("Error");
	});
});

/*								 DELETE

When delete press is clicked, the row id is taken and a delete request is perfomed 
if successful the row is removed, if not, the error is printed
*/
$(document).on("click", ".remove", function() {
	
	var filmDeleteId  = $(this).data('id');
	
	axios.delete(url, {
		headers: {'Content_Type': 'application/'+$("#dataFormat").val(),
				  'Content-Type': 'application/'+$("#dataFormat").val()},
		data: {"id": filmDeleteId}
	})
	.then(console.log("DELETE"))
	.catch(function(error){
		console.log(error);
	});
});

//gets the seleted order of the film list and calls the function to refresh the page selection list

function getOrderBy(){
	var sortOrder="";
	if($("#option2").is(":checked")){
		sortOrder = "?orderBy=desc";
	} else{
		sortOrder = "?orderBy=asc";
	}
	return sortOrder;
}

//creates the total film containter and the headers of the table

function tableHeader(dataLength){
	//Total film container 
	var table ="</div class='footer'>"+
					  "<div class='card'>"+
					   "<div class='card-body'>"+
					      "<h5 class='card-title'>Total Films</h5>"+
					      "<p class='card-text'><em>"+dataLength+"<em></p>"+
					      "<p class='card-text'><small class='text-muted'>CinemaSociety database <i class='bi bi-c-circle' width='10px'></i></small></p>"+
					  "</div> <br>"+
					"</div>";
		//headers
		table += "<table class='ajaxTable' id='mytable'> <tr class='headings'><td>ID</td><td>Title</td><td>Year</td><td>Director</td><td>Stars</td><td>Review</td></tr>";
	
	return table;
}

//this function hanles the creation of body of the table for all three formats

function filmTableBody(id, title, year, director, stars, review){
var body = 	
			//row content 
			"<tr>" +
				"<td>" + id + "</td> "+
				"<td>" + title + "</td> "+
				"<td>" + year + "</td> "+
				"<td>" + director + "</td> "+
				"<td>" + stars + "</td> "+
				"<td>" + review + "</td>"+
				
				//update button
				"<td class='col-xs-3 actionButtons'>"+
				"<div class='buttons'> "+
					"<button type='button' id='remove' name='updateBtn' data-toggle='modal'"+
						"data-id='" + id + 
						"'data-title='" + title + 
						"'data-year='" + year + 
						"'data-director='" + director + 
						"'data-stars='" + stars + 
						"'data-review='" + review + 
						"'class='updateModal btn btn-warning' data-bs-toggle='modal' data-bs-target='#updateModal'>"+
						"<i class='bi bi-pencil-fill' style='color: white;'></i>"+
					"</button> "+
				"</div> "+
				"</td> "+
				
				//delete button
				"<td class='col-xs-3 actionButtons'>"+
				"<div class='buttons'> " + 
					"<button type='button' name='deleteBtn' data-toggle='modal' data-id='" + id + 
					"'class='remove btn btn-danger'><i class='bi bi-trash3-fill'></i> </button> "+
				"</div>"+
				"</td>"+
			"</tr>\n";
	return body;
}
	
	
