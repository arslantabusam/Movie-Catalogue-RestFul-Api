package database;


import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

import model.Film;

import java.sql.*;


public class FilmDAO {
	
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

    public FilmDAO() {}

	
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
	
	
	
   public ArrayList<Film> getAllFilms(){
	   
		ArrayList<Film> allFilms = new ArrayList<Film>();
		openConnection();
		
	    // Create select statement and execute it
		try{
		    String selectSQL = "select * from films ORDER BY id DESC";
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
   
   public void insertFilm(Film film) throws SQLException{
	   
		openConnection();
	    // Create insert statement and execute it
		try{
		    String selectSQL = "insert into films (title, year, director, stars, review) values ('" + film.getTitle() + "','" + film.getYear() + "','" + film.getDirector() + "','" + film.getStars() + "','" + film.getReview() + "');";
		    stmt.execute(selectSQL);
		    
		    System.out.println("film added");
		    stmt.close();
		    closeConnection();
		} catch(SQLException se) { 
			throw new SQLException("Film Not Added");
		}
			
  }
   
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
   
   public ArrayList<Film> searchFilms(String searchStr, String searchType){
	   
		ArrayList<Film> searchedFilms = new ArrayList<Film>();
		openConnection();
		String selectSQL;
		
		
	    // Create select statement and execute it
		try{
			switch(searchType) {
			case "generalSearch":
				selectSQL = "select * from films where title LIKE '" + '%' + searchStr + '%' + "' or director LIKE'" + '%' + searchStr + '%' + "' or stars LIKE '" + '%' + searchStr + '%' + "';";
				break;
			case "stars":
				selectSQL = "select * from films where stars LIKE '" + '%' + searchStr + '%' + "';";
				break;
			case "director":
				selectSQL = "select * from films where director LIKE '" + '%' + searchStr + '%' + "';";
				break;
			case "year":
				selectSQL = "select * from films where year = '" + searchStr + "';";
				break;
			default:
				selectSQL = "select * from films where title LIKE '" + '%' + searchStr + '%' + "';";
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
