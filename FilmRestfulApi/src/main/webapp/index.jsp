<%@page import="database.FilmDAO"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Film Database</title>
<link rel="stylesheet" href="./css/custom.css"type="text/css"/>
<!-- CSS only -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>
<body >
	  <h1>Films</h1>
		<button type='button' name='insertBtn' data-toggle='modal' class='insertModal btn btn-outline-success btn-lg' data-bs-toggle='modal' data-bs-target='#insertModal'>  <img src='https://img.icons8.com/ios/512/add-property.png' width='20' /> </button> 
	  <fieldset>
		  <form action="#">
			   <label for="dataFormat">Format:</label>
			   <select class="selectpicker" title="Format" id="dataFormat" >
			     <option value="xml" selected>Xml</option>
			     <option value="json" >Json</option>
			     <option value="text" >Text</option>
			    </select>
			   <br/>
		  </form>
		  <div id="filmRegion"></div>
	 </fieldset>
	 
	 
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
                        <label class="control-label">Title</label>
                        <div>
                            <input type="text" class="form-control input-lg" id="filmTitle" name="title">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="control-label">Year</label>
                        <div>
                            <input type="number" class="form-control input-lg" id="filmYear" name="year">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="control-label">Director</label>
                        <div>
                            <input type="text" class="form-control input-lg" id="filmDirector" name="director">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="control-label">Stars</label>
                        <div>
                            <input type="text" class="form-control input-lg" id="filmStars" name="stars">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Review</label>
                        <div>
                            <input type="text" class="form-control input-lg" id="filmReview" name="review">
                        </div>
                    </div>
                    
                </form>
                
                
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
		        <button type="button" class="btn btn-primary" id="insertSubmit" data-bs-dismiss="modal">Submit</button>
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
		        
                    <input type="hidden" name="_token" value="">
                    <div class="form-group">
                        <label class="control-label">Id</label>
                        <div>
                            <input type="text" class="form-control input-lg" id="filmId" name="id" value="">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="control-label">Title</label>
                        <div>
                            <input type="text" class="form-control input-lg" id="filmTitle" name="title">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="control-label">Year</label>
                        <div>
                            <input type="number" class="form-control input-lg" id="filmYear" name="year">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="control-label">Director</label>
                        <div>
                            <input type="text" class="form-control input-lg" id="filmDirector" name="director">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="control-label">Stars</label>
                        <div>
                            <input type="text" class="form-control input-lg" id="filmStars" name="stars">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Review</label>
                        <div>
                            <input type="text" class="form-control input-lg" id="filmReview" name="review">
                        </div>
                    </div>
                    
                </form>
                
                
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
		        <button type="button" class="btn btn-primary" id="updateSubmit" data-bs-dismiss="modal">Submit</button>
		      </div>
		    </div>
		  </div>
		</div> 
	  
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
	<script src="./scripts/ajax-film.js"> </script>
	<script src="./scripts/utils-ajax-film.js"> </script>
	
	</body>
</html>