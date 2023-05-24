# Restful_api_film_database

Cinema Society 

Main purpose: Developing, deploying and consuming web services. 

A film database system implemented using: 

* MVC (Model-View-Controller) Architecture, using JSP and Servlets to implement 
* RestFul API

*********************************************************************
Some general guidance on how to invoke the programs and find the web service and web application
*********************************************************************

Note: - The HTTP interface and RestFul API works with Tomcat 9.0. 
It is assumed the Port for Tomcat is set to 8081. 
For cloud computing part we have used JDK 8

*********************************************************************
		  	Web Service (called "filmapi.java")
*********************************************************************

This file is place inside the whole web application project called
"FilmRestfulApi", in this project we can also find the JavaScript Client
implementation. 

"filmapi.java" is placed inside "controllers" package following 
this path ----> "src/main/java".

TO RUN the ResftFul Api simply run the file "filmapi.java". 

		  	Web application (called "FilmRestfulApi")
        
In the same project as the Web Service, this project contains JS Client
composed of two files "ajax-films.js", and "utils-ajax-films.js" under 
this folders path ---->"src/main/webapp/scripts", there is another
subfolder under webapp folder called "custom", it contains a CSS file.

Under the webapp folder we can the fidn the main web page for our Web
Application which is called "index.jsp"

TO RUN the web application simply run the "index.jsp" file and thi will 
bring up all the films from the database and show them in a table.



