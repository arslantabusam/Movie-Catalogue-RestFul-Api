//XML Table creation
function xmlFilmDetails(request, resultRegion) {
	if ((request.readyState == 4) &&
		(request.status == 200)) {

		var xmlDocument = request.responseXML;
		var films = xmlDocument.getElementsByTagName("film");
		var table = "<table border='1' class='ajaxTable'> <tr><td>ID</td><td>Title</td><td>Year</td><td>Director</td><td>Stars</td><td>Review</td><td>Update</td><td>Delete</td></tr>";
		var body = "";
		for(var i =0;i<films.length; i++){
			var film = films[i];
			body += " <tr> <td>" + xml(film, "id") + "</td> <td>" + xml(film, "title") + "</td> <td>" + xml(film, "year") + "</td> <td>" + xml(film, "director") + "</td> <td>" + xml(film, "stars") + "</td> <td>" + xml(film, "review") + "</td>" ;
			body += "<td> <button type='button' id='remove' name='updateBtn' data-toggle='modal' data-id='" + xml(film, "id") + "' data-title='" + xml(film, "title") + "' data-year='" + xml(film, "year") + "' data-director='" + xml(film, "director") + "' data-stars='" + xml(film, "stars") + "' data-review='" + xml(film, "review") + "' class='updateModal btn btn-warning' data-bs-toggle='modal' data-bs-target='#updateModal'>   <img src='https://img.icons8.com/material-outlined/512/pencil.png' width='20' /> </button>  </td> " +" <td><button type='button' name='deleteBtn' data-toggle='modal' data-id='" + xml(film, "id") + "' class='remove btn btn-danger'>  <img src='https://img.icons8.com/material-sharp/512/delete-forever.png' width='20' /> </button>  </td> </tr>\n";
		}
		table += body + "</table>";
		htmlInsert(resultRegion, table);
	}
}

//JSON Table creation
function jsonFilmDetails(request, resultRegion) {
	if ((request.readyState == 4) &&
		(request.status == 200)) {
		var rawData = request.responseText;
		var data = eval("(" + rawData + ")");
		var table = "<table border='1' class='ajaxTable'> <tr><td>ID</td><td>Title</td><td>Year</td><td>Director</td><td>Stars</td><td>Review</td><td>Update</td><td>Delete</td></tr>";
		var body = "";
		for (var i = 0; i < data.length; i++) {
			var row = data[i];
			body += " <tr> <td>" + row.id + "</td>" + "<td>" + row.title + "</td>" + "<td>" + row.year + "</td>" + "<td>" + row.director + "</td>" + "<td>" + row.stars + "</td>" + "<td>" + row.review + "</td>";
			body += "<td> <button type='button' id='remove' name='updateBtn' data-toggle='modal' data-id='" + row.id + "' data-title='" + row.title + "' data-year='" + row.year + "' data-director='" + row.director + "' data-stars='" + row.stars + "' data-review='" + row.review + "' class='updateModal btn btn-warning' data-bs-toggle='modal' data-bs-target='#updateModal'>   <img src='https://img.icons8.com/material-outlined/512/pencil.png' width='20' /> </button>  </td> " +" <td><button type='button' name='deleteBtn' data-toggle='modal' data-id='" + row.id + "' class='remove btn btn-danger'>  <img src='https://img.icons8.com/material-sharp/512/delete-forever.png' width='20' /> </button>  </td> </tr>\n";
		}
		table += body + "</table>";
		htmlInsert(resultRegion, table);
	}
}

//Text Table creation
function stringFilmDetails(request, resultRegion) {
	if ((request.readyState == 4) &&
		(request.status == 200)) {
		var rawData = request.responseText;

		var rowStrings = rawData.split("%");
		rows = new Array(rowStrings.length - 1);
		
		var table = "<table border='1' class='ajaxTable'> <tr><td>ID</td><td>Title</td><td>Year</td><td>Director</td><td>Stars</td><td>Review</td><td>Update</td><td>Delete</td></tr>";
		var body = "";
		for (var i = 1; i < rowStrings.length; i++) {
			rows = rowStrings[i].split("#");
			body += "<tr> <td>" + rows[0] + "</td>" + "<td>" + rows[1] + "</td>" + "<td>" + rows[2] + "</td>" + "<td>" + rows[3] + "</td>" + "<td>" + rows[4] + "</td>" + "<td>" + rows[5] + "</td>";
			body += "<td> <button type='button' name='updateBtn' data-toggle='modal' data-id='" +  rows[0] + "' data-title='" +  rows[1] + "' data-year='" +  rows[2] + "' data-director='" +  rows[3] + "' data-stars='" +  rows[4] + "' data-review='" +  rows[5] + "' class='updateModal btn btn-warning' data-bs-toggle='modal' data-bs-target='#updateModal'>   <img src='https://img.icons8.com/material-outlined/512/pencil.png' width='20' /> </button>  </td> " +" <td><button type='button' name='deleteBtn' data-toggle='modal' data-id='" +  rows[0] + "' class='remove btn btn-danger'>  <img src='https://img.icons8.com/material-sharp/512/delete-forever.png' width='20' /> </button>  </td> </tr>\n";
		}
		table += body + "</table>";
		htmlInsert(resultRegion, table);
	}
}

function filmTable(formatField, filmRegion) {
	var address = "filmapi";
	var format = $("#" + formatField).val();
	var responseHandler = formatSelector(format);
	ajaxGet(address, format,
		function(request) {
			responseHandler(request, filmRegion);
		});
}


function filmTableInsert(formatField, filmRegion, data) {
	var address = "filmapi";
	var format = $("#" + formatField).val();
	var responseHandler = formatSelector(format);
	ajaxPost(address, data, format,
		function(request) {
			responseHandler(request, filmRegion);
		});
}

function filmTablePUT(formatField, filmRegion, data) {
	var address = "filmapi";
	var format = $("#" + formatField).val();
	var responseHandler = formatSelector(format);
	ajaxPut(address, data, format,
		function(request) {
			responseHandler(request, filmRegion);
		});
}

function filmTableDELETE(formatField, data) {
	var address = "filmapi";
	var format = $("#" + formatField).val();
	var responseHandler = formatSelector(format);
	ajaxDel(address, data, format,
		function(request) {
			responseHandler(request, filmRegion);
		});
}


function formatSelector(format) {
	if (format == "xml") {
		return (xmlFilmDetails);
	} else if (format == "text") {
		return (stringFilmDetails);
	} else {
		return (jsonFilmDetails);
	}
}


//When update press is clicked
$(document).on("click", ".updateModal", function() {
	$(".form-group #filmId").val($(this).data('id'));
	$(".form-group #filmTitle").val($(this).data('title'));
	$(".form-group #filmYear").val($(this).data('year'));
	$(".form-group #filmDirector").val($(this).data('director'));
	$(".form-group #filmStars").val($(this).data('stars'));
	$(".form-group #filmReview").val($(this).data('review'));
});

//When submit button is clicked
$(document).on("click", "#updateSubmit", function() {
	var filmUpdateId = $(".form-group #filmId").val();
	var filmUpdateTitle = $(".form-group #filmTitle").val();
	var filmUpdateYear = $(".form-group #filmYear").val();
	var filmUpdateDirector = $(".form-group #filmDirector").val();
	var filmUpdateStars = $(".form-group #filmStars").val();
	var filmUpdateReview = $(".form-group #filmReview").val();

	var updateObject = "";
	
	//creates an xml object 
	if ($("#dataFormat").val() == "xml") {
		updateObject = "<film>" + "<id>" + filmUpdateId + "</id>" + "<title>" + filmUpdateTitle + "</title>" + "<year>" + filmUpdateYear + "</year>" + "<director>" + filmUpdateDirector + "</director>" + "<stars>" + filmUpdateStars + "</stars>" + "<review>" + filmUpdateReview + "</review> </film>";
	}
	//creates a cvs object
	else if($("#dataFormat").val() == "text"){
		updateObject = "%"+ filmUpdateId + "#" + filmUpdateTitle + "#" + filmUpdateYear + "#" + filmUpdateDirector + "#" + filmUpdateStars + "#" + filmUpdateReview;
	}
	//creates a json object
	else {
		updateObject = "{ \"id\": " + filmUpdateId + ",\"title\": " + "\"" + filmUpdateTitle + "\"" + ",\"year\": " + "\"" + filmUpdateYear + "\"" + ",\"director\": " + "\"" + filmUpdateDirector + "\"" + ",\"stars\": " + "\"" + filmUpdateStars + "\"" + ",\"review\": " + "\"" + filmUpdateReview + "\"" + "}";
	}
	
	filmTablePUT("dataFormat", "filmRegion", updateObject);
	location.reload(true);
});

//When delete press is clicked
$(document).on("click", ".remove", function() {
	var filmDeleteId  = $(this).data('id')
	var deleteObject = "";
	
	if ($("#dataFormat").val() == "xml") {
		deleteObject = "<film>" + "<id>" + filmDeleteId + "</id> </film>";
	}
	else if($("#dataFormat").val() == "text"){
		deleteObject = "%"+ filmDeleteId;
	}else {
		deleteObject = "{ \"id\": " + filmDeleteId + "}";
	}
	
	filmTableDELETE("dataFormat", deleteObject);
});


//When submit button is clicked
$(document).on("click", "#insertSubmit", function() {
	var filmInsertId = $(".form-group #filmId").val();
	var filmInsertTitle = $(".form-group #filmTitle").val();
	var filmInsertYear = $(".form-group #filmYear").val();
	var filmInsertDirector = $(".form-group #filmDirector").val();
	var filmInsertStars = $(".form-group #filmStars").val();
	var filmInsertReview = $(".form-group #filmReview").val();

	var InsertObject = "";
	
	//creates an xml object 
	if ($("#dataFormat").val() == "xml") {
		InsertObject = "<film>" + "<id>" + filmInsertId + "</id>" + "<title>" + filmInsertTitle + "</title>" + "<year>" + filmInsertYear + "</year>" + "<director>" + filmInsertDirector + "</director>" + "<stars>" + filmInsertStars + "</stars>" + "<review>" + filmInsertReview + "</review> </film>";
	}
	//creates a cvs object
	else if($("#dataFormat").val() == "text"){
		InsertObject = "%"+ filmInsertId + "#" + filmInsertTitle + "#" + filmInsertYear + "#" + filmInsertDirector + "#" + filmInsertStars + "#" + filmInsertReview;
	}
	//creates a json object
	else {
		InsertObject = "{ \"id\": " + filmInsertId + ",\"title\": " + "\"" + filmInsertTitle + "\"" + ",\"year\": " + "\"" + filmInsertYear + "\"" + ",\"director\": " + "\"" + filmInsertDirector + "\"" + ",\"stars\": " + "\"" + filmInsertStars + "\"" + ",\"review\": " + "\"" + filmInsertReview + "\"" + "}";
	}
	
	filmTableInsert("dataFormat", "filmRegion", InsertObject);
	//location.reload(true);
});


$(window).on("load", function() {
	filmTable("dataFormat", "filmRegion");
});

$(document).on("click", ".remove", function(){
		$(this).parents("tr").fadeOut("slow");
}); 

$(document).on("change", "#dataFormat", function(){
	filmTable("dataFormat", "filmRegion");
});

function xml(film, element){
	return film.getElementsByTagName(element)[0].childNodes[0].nodeValue
}
