<%@page import="database.FilmDAO"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>

<!DOCTYPE html>
<html>
<head>
<link rel="shortcut icon" href="#">
<meta charset="ISO-8859-1">
<title>ArslanDatabase</title>
<link rel="stylesheet" href="./css/custom.css"type="text/css"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css">
<!-- CSS only -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>
<body> 
	 <!-- Contains all header elements -->
	<div class="header_container">
	
		 <!-- Inner container, contains everything, 90% width of all-->
		<div class="h_inner bg-brown bg-lighten-md">
		
			 <!-- Logo container-->
				<div class="logo_container"> 
					<div style="text-align:center;">
						 <img src='https://img.icons8.com/color/512/film-reel.png' width='30' />
						 <h1 id="titleHead"> Cinema<span>Society</span></h1>
					</div>
				 <!-- Content on left-->
				      
				<div class="header_content">
				 <!-- Insert button-->
				
				 <button type='button' id="insertBtn" name='insertBtn' data-toggle='modal' class='insertBtn' data-bs-toggle='modal' data-bs-target='#insertModal'> <i class="bi bi-window-plus"></i> </button> 
				  
				 <!-- Dropdown-->
				  <fieldset>
					<div class="header_form">
					  <form action="#">
						     <select title="Format" id="dataFormat" >
							    <option value="xml" selected>Xml</option>
							     <option value="json" >Json</option>
							     <option value="text">Text</option>
						    </select>
					  </form>
					</div>
				  </fieldset>
				 
			</div>
				</div>
	    </div>
		
		<div class="input-group">
			 
				 <select id="searchType" name="searchType">
				 	 <option value="id">ID</option>
				     <option value="title">Title</option>
				     <option value="year">Year</option>
				     <option value="director">Director</option>
				     <option value="stars">Stars</option>
				     <option value="generalSearch">General Search</option>
				     <option value="allFilms">All films</option>
			    </select>			    
				
				<input type="text" class="form-control" id="searchBar" placeholder="Search this database">
			   
			    <div class="input-group-append">
			      <button class="btn btn-secondary" id="searchButton" type="button" ><img src='https://img.icons8.com/ios-glyphs/512/search.png' width='20' /></button>
			    </div>
	   </div>
	   	<div class="orderButtons">
	   		<!-- <label style="color:white">Order By: </label>   -->
		  <input type='radio' class='btn-check insertModal btn' name='options' id='option1' value="asc" autocomplete='off' checked>
		  <label class='btn btn-secondary radiolbl' for='option1'>ASC</label>
	      <input type='radio' class='btn-check insertModal btn' name='options' id='option2' value="desc" autocomplete='off'>
	      <label class='btn btn-secondary radiolbl' for='option2'>DESC</label>
		</div>
	 </div>

	 <div id="filmRegion"></div>
		 <!-- Modal Insert-->
		<div class="modal fade" id="insertModal" tabindex="-1" aria-hidden="true">
		  <div class="modal-dialog">
		    <div class="modal-content">
		      <div class="modal-header">
		        <h1 class="modal-title fs-5">Insert Film</h1>
		        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		      </div>
		      <div class="modal-body">

		        <form role="form" method="POST" action="./filmapi">
                    
                    <div class="form-group">
						  <label class="control-label input-label" id="lblTitle">Title</label>
                          <input type="text" class="form-control input input-lg" id="insertTitle" name="title" required>
                    </div>
                    <div class="form-group">
			              <label class="control-label input-label">Year</label>
                          <input type="number" class="form-control input-lg" id="insertYear" name="year" required>
                    </div>
                    <div class="form-group">
						   <label class="control-label input-label">Director</label>
                           <input type="text" class="form-control input input-lg" id="insertDirector" name="director" required>
                    </div>
                    <div class="form-group">
					       <label class="control-label input-label">Stars</label>
                           <input type="text" class="form-control input input-lg" id="insertStars" name="stars" required>
                    </div>
                    <div class="form-group">
                    	   <label class="control-label input-label">Review</label>
                           <input type="text" class="form-control input input-lg" id="insertReview" name="review" required>
                    </div>
                    
               </form>
		      </div>
		      <div class="modal-footer buttons">
		        <button type="button" class="btn btn-secondary" id="closeInsert" data-bs-dismiss="modal"><i class="bi bi-x"></i></button>
		        <button type="button" class="btn btn-primary" id="insertSubmit"><i class="bi bi-plus-circle"></i></button>
		        
		      </div>
		    </div>
		  </div>
		</div> 
		
		<!-- Modal Update-->
		<div class="modal fade" id="updateModal" tabindex="-1" aria-hidden="true">
		  <div class="modal-dialog">
		    <div class="modal-content">
		      <div class="modal-header">
		        <h1 class="modal-title fs-5">Update Film</h1>
		        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		      </div>
		      <div class="modal-body">

		        <form role="form" method="POST" action="./filmapi">
	
                    <div class="form-group">
                        <label class="control-label">Id</label>
                        <input type="text" class="form-control input-lg" id="updateId" name="id" disabled>
                    </div>
                    <div class="form-group">
                         <label class="control-label">Title</label>
                         <input type="text" class="form-control input-lg" id="updateTitle" name="title" required>
                    </div>
                    <div class="form-group">
						 <label class="control-label">Year</label>
                         <input type="number" class="form-control input-lg" id="updateYear" name="year" required>
                    </div>
                    <div class="form-group">
                     	 <label class="control-label">Director</label>
                         <input type="text" class="form-control input-lg" id="updateDirector" name="director" required>
                    </div>
                    <div class="form-group">
                         <label class="control-label">Stars</label>
                         <input type="text" class="form-control input-lg" id="updateStars" name="stars" required>
                    </div>
                    <div class="form-group">
                         <label class="control-label">Review</label>
                         <input type="text" class="form-control input-lg" id="updateReview" name="review" required>
                    </div>
                    
                </form>
                
                
		      </div>
		      <div class="modal-footer buttons">
		        <button type="button" class="btn btn-secondary" id="closeUpdate" data-bs-dismiss="modal"><i class="bi bi-x"></i></button>
		        <button type="button" class="btn btn-warning" id="updateSubmit"><i class="bi bi-plus-circle"></i></button>
		      </div>
		    </div>
		  </div>
		</div> 
		
	     <div id="paginationRegion"> <form action='#'><input id='paginationValue' type='hidden'></input><input id='paginationInput' type='submit' class='btn btn-primary'></input></form></div>
  
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"></script>
	<script src="./scripts/ajax-film.js"> </script>
	<script src="./scripts/utils-ajax-film.js"> </script>
	
	</body>
</html>