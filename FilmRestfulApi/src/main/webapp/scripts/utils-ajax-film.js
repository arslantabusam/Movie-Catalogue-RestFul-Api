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

// Return escaped value of textfield that has given id.
// The builtin "escape" function url-encodes characters.

function getValue(id) {
  return(escape(document.getElementById(id).value));
}

// Generalized version of ajaxResultPost. In this
// version, you pass in a response handler function
// instead of just a result region.

function ajaxGet(address, format, responseHandler) {
  var request = getRequestObject();
  request.onreadystatechange = function() { 
	responseHandler(request); 
	};
  request.open("GET", address, true);
  request.setRequestHeader("Content-Type", "application/" + format);
  request.send();
}

function ajaxPost(address, data, format, responseHandler) {
  var request = getRequestObject();
  request.onreadystatechange = function() { 
	responseHandler(request); 
	};
  request.open("POST", address, true);
  request.setRequestHeader("Content-Type", "application/" + format);
  request.send(data);
}

function ajaxPut(address, data, format, responseHandler) {
  var request = getRequestObject();
  request.onreadystatechange = function() { 
	responseHandler(request); 
	};
  request.open("PUT", address, true);
  request.setRequestHeader("Content-Type", "application/" + format);
  request.send(data);
}

function ajaxDel(address, data, format, responseHandler) {
  var request = getRequestObject();
  request.onreadystatechange = function() { 
	responseHandler(request); 
	};
  request.open("DELETE", address, true);
  request.setRequestHeader("Content-Type", "application/" + format);
  console.log(data);
  request.send(data);
}
