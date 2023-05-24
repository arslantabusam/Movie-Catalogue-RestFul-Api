package controllers;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringReader;
import java.io.StringWriter;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

import database.FilmDAO;
import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBException;
import jakarta.xml.bind.Marshaller;
import model.Film;

@WebServlet("/filmapi")
public class filmapi extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//set header to avoid storing cache
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		
		PrintWriter out = response.getWriter();
		FilmDAO filmdao = FilmDAO.getFilmDao(); //singleton
		
		//getting the parameters 
		String searchStr = request.getParameter("searchStr");
		String searchType = request.getParameter("searchType");
		String contentType= request.getHeader("Content_Type");
		
		String orderBy ="";
		
		orderBy= request.getParameter("orderBy");
		ArrayList<Film> allFilms= null;
		
		//checks if there are any searching parameters
		//if not then all the films are selected from the database
		if(searchStr != "" && searchStr != null) {
			allFilms = filmdao.searchFilms(searchStr, searchType);
		}
		else {
			//if there is no sorting order it defaults to ascending
			if(orderBy != "" && orderBy != null) {
				allFilms = filmdao.getAllFilms(orderBy);
			}else {
				orderBy ="ASC";
				allFilms = filmdao.getAllFilms(orderBy);
			}
		}
		
		FilmList fl = new FilmList(allFilms);
		StringWriter sw = new StringWriter();
		
		JAXBContext context;
		
		//decides in which format the response will be 
		//based on the request format
		if("application/xml".equals(contentType)) {
		try {
			context = JAXBContext.newInstance(FilmList.class);
			
			//converts java objects to xml objects
			Marshaller m = context.createMarshaller();
			m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
			
			m.marshal(fl, sw);
			out.print(sw);
			
			} catch (JAXBException e) 
			
		{
			e.printStackTrace();
		}
		}else if("application/text".equals(contentType)) {
			String data="";
			// generate the text format data for each film
			for(Film f: allFilms) {
				data += "%%"+f.getId()+"#"+f.getTitle()+"#"+f.getYear()+"#"+
						f.getDirector()+"#"+f.getStars()+"#"+f.getReview();
			}
			
			out.print(data);
			
			
		} else {
			Gson gson = new GsonBuilder().setPrettyPrinting().create();
			
			//converts java objects to json objects
			String json = gson.toJson(allFilms);
			
			out.print(json);
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//set header to avoid storing cache
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		
		//getting parameter
		String format = request.getHeader("Content_Type");
		PrintWriter out = response.getWriter();
		
		//getting the data
		String data = request.getReader().lines().reduce("",(accumulator, actual) -> accumulator + actual);
		
		FilmDAO filmdao = FilmDAO.getFilmDao();
		
		//decides in which format the response will be 
		//based on the request format
		if("application/xml".equals(format)) {
			JAXBContext jaxbContext;
			try {
				//converts xml object to java object
				jaxbContext = JAXBContext.newInstance(Film.class);
				jakarta.xml.bind.Unmarshaller jaxbUnmarshaller =  jaxbContext.createUnmarshaller();
				Film f = (Film) jaxbUnmarshaller.unmarshal(new StringReader(data));
				
				filmdao.insertFilm(f);
				
				out.print("Film Inserted");
			} catch (JAXBException | SQLException e) {
				e.printStackTrace();
				out.print("Header and data format not matching");
			} 
		}
		else if("application/json".equals(format)) {
			try {
				Gson gson = new Gson();
				//converts json object to java object
				Film f = gson.fromJson(data, Film.class);
				
				filmdao.insertFilm(f);
				out.print("Film Inserted");
				
			} catch (SQLException| JsonSyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			}
		}
		else if("application/text".equals(format)) {
			try {
				//parses the cvs data 
				String[] filmRows = data.split("%%");
				String[] oneFilm = filmRows[1].split("#");
				
				//checks if the fields received are exactly 5
				if(oneFilm.length<5) {
					out.print("Some fields are missing!");
				}else if (oneFilm.length>5) {
					out.print("More than 5 fields received!");
				}
				else {
					Film f = new Film(oneFilm[0], Integer.valueOf(oneFilm[1]), oneFilm[2], oneFilm[3], oneFilm[4]);
					filmdao.insertFilm(f);
					out.print("Film Inserted");
				}
				
			} catch (JsonSyntaxException | SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			}
		}
		
		else {
			out.print("No header received");
		}
	}
	
	@Override
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//set header to avoid storing cache
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		
		//parameter
		String format = request.getHeader("Content_Type");
		PrintWriter out = response.getWriter();
		
		//gets the data 
		String data = request.getReader().lines().reduce("",(accumulator, actual) -> accumulator + actual);
		
		FilmDAO filmdao = FilmDAO.getFilmDao();
		
		//decides in which format the response will be 
		//based on the request format
		if("application/xml".equals(format)) {
			JAXBContext jaxbContext;
			try {
				//converts xml objects to java objects
				jaxbContext = JAXBContext.newInstance(Film.class);
				jakarta.xml.bind.Unmarshaller jaxbUnmarshaller =  jaxbContext.createUnmarshaller();
				Film f = (Film) jaxbUnmarshaller.unmarshal(new StringReader(data));
				
				filmdao.updateFilm(f);
				
				out.print("Film Updated");
			} catch (JAXBException | SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			} 
		}
		else if("application/json".equals(format)) {
			try {
				Gson gson = new Gson();
				//converts the json objects to java objects
				Film f = gson.fromJson(data, Film.class);
				
				filmdao.updateFilm(f);
				out.print("Film Updated");
				
			} catch (SQLException| JsonSyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			}
		}
		else if("application/text".equals(format)) {
			try {
				//parses csv format data
				String[] filmRows = data.split("%%");
				String[] oneFilm = filmRows[1].split("#");
				
				//checks if the fields received are exactly 5
				if(oneFilm.length<5) {
					out.print("Some fields are missing!");
				}
				else if (oneFilm.length>6) {
					out.print("More than 6 fields received!");
				}
				else {
					Film f = new Film(Integer.valueOf(oneFilm[0]), oneFilm[1], Integer.valueOf(oneFilm[2]), oneFilm[3], oneFilm[4], oneFilm[5]);
					filmdao.updateFilm(f);
					out.print("Film Updated");
				}
				
			} catch (SQLException| JsonSyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				//in case the format specified and the data received 
				//are not 
				out.print("Header and data format not matching");
			}
		}
		else {
			out.print("No header received");
		}
	}
	
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		
		String format = request.getHeader("Content_Type");

		PrintWriter out = response.getWriter();
		String data = request.getReader().lines().reduce("",(accumulator, actual) -> accumulator + actual);
		//String data =  request.getHeader("source");
		
		FilmDAO filmdao = FilmDAO.getFilmDao();
		
		//decides in which format the response will be 
		//based on the request format
		if("application/xml".equals(format)) {
			JAXBContext jaxbContext;
			try {
				if(!data.toString().contains("<film>")){
					//extracts the id from the string and creates an xml object
					data = data.replace(data, "<film><id>" + data.substring(6, 11) + "</id></film>");
				}
				System.out.println(data);
				
				//converts the xml object to java object
				jaxbContext = JAXBContext.newInstance(Film.class);
				jakarta.xml.bind.Unmarshaller jaxbUnmarshaller =  jaxbContext.createUnmarshaller();
				Film f = (Film) jaxbUnmarshaller.unmarshal(new StringReader(data));
				
				filmdao.deleteFilm(f);
				
				out.print("Film Deleted");
			} catch (JAXBException | SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			} 
		}
		else if("application/text".equals(format)) {
			try {
				String id;
				
				//checks whether the request is sent from my JS client-side
				//extracts the id from the string
				if(data.contains("%%")) {
					id = data.substring(2, 7);
				} else {
					id = data.substring(6, 11);
				}
				
				//checks whether id is empty
				if(id == "" | id == null ) {
					out.print("ID field is missing!");
				}
				else {
					Film f = new Film(Integer.valueOf(id), "null", 0, "null", "null", "null");
					filmdao.deleteFilm(f);
					out.print("Film Deleted");
				}
			} catch (JsonSyntaxException | SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			}
		}
		else if("application/json".equals(format)){
			try {
				Gson gson = new Gson();
				//converts json object to java object
				Film f = gson.fromJson(data, Film.class);
				
				filmdao.deleteFilm(f);
				out.print("Film Deleted");
				
			} catch (SQLException| JsonSyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			}
		}
	}
}
