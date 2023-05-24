package database;


import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

import model.Film;

import java.sql.*;


public class FilmDAO {
	
	private static FilmDAO filmdao;
	
	Film oneFilm = null;
	Connection conn = null;
    Statement stmt = null;
	String user = "tabusama";
    String password = "joshderF8";
    //String user = "root";
    //String password = "Portorosso1!";
    // Note none default port used, 6306 not 3306
    String url = "jdbc:mysql://mudfoot.doc.stu.mmu.ac.uk:6306/"+user;
    //String url = "jdbc:mysql://awsdb.c3vrmr1ah1s8.us-east-1.rds.amazonaws.com/filmdatabase?characterEncoding=utf8";
    //String url = "jdbc:mysql://databasetest.c3vrmr1ah1s8.us-east-1.rds.amazonaws.com/new_schema?characterEncoding=utf8";

    private FilmDAO() {}

    public static synchronized FilmDAO getFilmDao() { 
    	if (filmdao == null) { 
    		filmdao = new FilmDAO(); 
    		} 
    	return filmdao; 
    } 
    
    //prevents the class from being cloned
    @Override
    protected Object clone() throws CloneNotSupportedException {
    	throw new CloneNotSupportedException();
    }
    
	//opens a connection with the database
	private void openConnection(){
		// loading jdbc driver for mysql
		try{
		    Class.forName("com.mysql.jdbc.Driver").newInstance();
		} catch(Exception e) { System.out.println(e); }

		// connecting to database
		try{
			// connection string for demos database, username demos, password demos
 			conn = DriverManager.getConnection(url, user, password);
		    stmt = conn.createStatement();
		} catch(SQLException se) { System.out.println(se); }	   
    }
	
	//close the connection
	private void closeConnection(){
		try {
			conn.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private Film getNextFilm(ResultSet rs){
    	Film thisFilm=null;
		try {
			thisFilm = new Film(
					rs.getInt("id"),
					rs.getString("title"),
					rs.getInt("year"),
					rs.getString("director"),
					rs.getString("stars"),
					rs.getString("review"));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	return thisFilm;		
	}
	
	
   //gets all the films in the database and stores them in a arraylist
   public ArrayList<Film> getAllFilms(String orderBy){
	   
		ArrayList<Film> allFilms = new ArrayList<Film>();
		openConnection();
		
	    // Create select statement and execute it
		try{
		    String selectSQL = "select * from films ORDER BY id " + orderBy; //order by command inserted by me
		    ResultSet rs1 = stmt.executeQuery(selectSQL);
	    // Retrieve the results
		    while(rs1.next()){
		    	oneFilm = getNextFilm(rs1);
		    	allFilms.add(oneFilm);
		   }

		    stmt.close();
		    closeConnection();
		} catch(SQLException se) { System.out.println(se); }

	   return allFilms;
   }
   
   //gets the film by searching the id
   public Film getFilmByID(int id){
	   
		openConnection();
		oneFilm=null;
	    // Create select statement and execute it
		try{
		    String selectSQL = "select * from films where id="+id;
		    ResultSet rs1 = stmt.executeQuery(selectSQL);
	    // Retrieve the results
		    while(rs1.next()){
		    	oneFilm = getNextFilm(rs1);
		    }

		    stmt.close();
		    closeConnection();
		} catch(SQLException se) { System.out.println(se); }

	   return oneFilm;
   }
   
   //inserts a new film in the database
   public void insertFilm(Film film) throws SQLException{
	   
		openConnection();
	    // Create insert statement and execute it
		try{
		    String selectSQL = "insert into films (title, year, director, stars, review) values ('" + film.getTitle() + "','" + film.getYear() + "','" + film.getDirector() + "','" + film.getStars() + "','" + film.getReview() + "');";
		    stmt.execute(selectSQL);
		    
		    System.out.println("Film Added");
		    stmt.close();
		    closeConnection();
		} catch(SQLException se) { 
			throw new SQLException("Film Not Added");
		}
			
  }
   
   //updates the details of a film existing in the database
   public void updateFilm(Film film) throws SQLException{
	   
		openConnection();
	    // Create insert statement and execute it
		try{
		    String selectSQL = "update films set title = '" + film.getTitle() + "', year = '" + film.getYear() +"', director = '" + film.getDirector() +"', stars = '" + film.getStars() +"', review = '" + film.getReview() +"' WHERE " + film.getId() + " = id;";
		    stmt.execute(selectSQL);
		    
		    System.out.println("Film Updated");
		    stmt.close();
		    closeConnection();
		} catch(SQLException se) { 
			throw new SQLException("Film Not Updated");
		}

 }
   
   //deletes a film record from the database
   public void deleteFilm(Film film) throws SQLException{
	   
		openConnection();
	    // Create insert statement and execute it
		try{
		    String selectSQL = "delete from films WHERE id = " + film.getId() + ";";
		    stmt.execute(selectSQL);
		    
		    System.out.println("Film Deleted");
		    stmt.close();
		    closeConnection();
		} catch(SQLException se) { 
			throw new SQLException("Film Not Deleted");
		}
}
   //gets all the films selected through a search in the database
   //takes in two parameters, the search string and the type of the search (category)
   public ArrayList<Film> searchFilms(String searchStr, String searchType){
	   
		ArrayList<Film> searchedFilms = new ArrayList<Film>();
		openConnection();
		String selectSQL;
		
	    // Create select statement and execute it
		try{
			//makes the appropriate selection based on search type
			switch(searchType) {
			case "generalSearch":
				selectSQL = "select * from films where title LIKE '" + '%' + searchStr + '%' + "' or year LIKE '" + '%' + searchStr + '%' +"' or director LIKE'" + '%' + searchStr + '%' + "' or stars LIKE '" + '%' + searchStr + '%' + "';";
				break;
			case "id":
				selectSQL = "select * from films where "+ searchType + " LIKE '" + searchStr + "';";
				break;
			default:
				selectSQL = "select * from films where "+ searchType + " LIKE '" + '%' + searchStr + '%' + "';";
				break;
			}
			
		    ResultSet rs1 = stmt.executeQuery(selectSQL);
	    // Retrieve the results
		    while(rs1.next()){
		    	oneFilm = getNextFilm(rs1);
		    	searchedFilms.add(oneFilm);
		   }

		    stmt.close();
		    closeConnection();
		} catch(SQLException se) { System.out.println(se); }

	   return searchedFilms;
  }
   
   
 
}
