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
		
		PrintWriter out = response.getWriter();
		FilmDAO filmdao = new FilmDAO();
		String searchStr = request.getParameter("searchStr");
		String searchType = request.getParameter("searchType");
		String contentType= request.getHeader("Content-type");
		ArrayList<Film> allFilms;
		
		if(searchStr != "" && searchStr != null) {
			allFilms = filmdao.searchFilms(searchStr, searchType);
		}
		else {
			allFilms = filmdao.getAllFilms();
		}

		FilmList fl = new FilmList(allFilms);
		StringWriter sw = new StringWriter();
		
		JAXBContext context;
	
		if("application/xml".equals(contentType)) {
		try {
			context = JAXBContext.newInstance(FilmList.class);
		
			Marshaller m = context.createMarshaller();
			m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
			
			m.marshal(fl, sw);
			out.print(sw);
			
			} catch (JAXBException e) 
			
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		}else if("application/text".equals(contentType)) {
			
			// generate the text format data
			
			String data="";
			
			for(Film f: allFilms) {
				data += "%"+f.getId()+"#"+f.getTitle()+"#"+f.getYear()+"#"+f.getDirector()+"#"+f.getStars()+"#"+f.getReview();
			}
			
			out.print(data);
			
			
		} else {
			Gson gson = new GsonBuilder().setPrettyPrinting().create();
			
			String json = gson.toJson(allFilms);
			
			out.print(json);
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String dataFormat = request.getHeader("Content-Type");
		PrintWriter out = response.getWriter();
		String data = request.getReader().lines().reduce("",(accumulator, actual) -> accumulator + actual);
		
		FilmDAO filmdao = new FilmDAO();
		
		if("application/xml".equals(dataFormat)) {
			JAXBContext jaxbContext;
			try {
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
		else if("application/json".equals(dataFormat)) {
			try {
				Gson gson = new Gson();
				Film f = gson.fromJson(data, Film.class);
				
				filmdao.insertFilm(f);
				out.print("Film Inserted");
				
			} catch (SQLException| JsonSyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			}
		}
		else if("application/text".equals(dataFormat)) {
			try {
				String[] filmRows = data.split("%");
				String[] oneFilm = filmRows[1].split("#");
				
				
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
		
		String dataFormat = request.getHeader("Content-Type");
		PrintWriter out = response.getWriter();
		String data = request.getReader().lines().reduce("",(accumulator, actual) -> accumulator + actual);
		
		FilmDAO filmdao = new FilmDAO();
		
		if("application/xml".equals(dataFormat)) {
			JAXBContext jaxbContext;
			try {
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
		else if("application/json".equals(dataFormat)) {
			try {
				Gson gson = new Gson();
				Film f = gson.fromJson(data, Film.class);
				
				filmdao.updateFilm(f);
				out.print("Film Updated");
				
			} catch (SQLException| JsonSyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			}
		}
		else if("application/text".equals(dataFormat)) {
			try {
				String[] filmRows = data.split("%");
				String[] oneFilm = filmRows[1].split("#");
				
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
				out.print("Header and data format not matching");
			}
		}
		else {
			out.print("No header received");
		}
	}
	
	@Override
	protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String dataFormat = request.getHeader("Content-Type");
		PrintWriter out = response.getWriter();
		String data = request.getReader().lines().reduce("",(accumulator, actual) -> accumulator + actual);
		
		FilmDAO filmdao = new FilmDAO();
		
		if("application/xml".equals(dataFormat)) {
			JAXBContext jaxbContext;
			try {
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
		else if("application/json".equals(dataFormat)) {
			try {
				Gson gson = new Gson();
				Film f = gson.fromJson(data, Film.class);
				
				filmdao.deleteFilm(f);
				out.print("Film Deleted");
				
			} catch (SQLException| JsonSyntaxException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				out.print("Header and data format not matching");
			}
		}
		else if("application/text".equals(dataFormat)) {
			try {
				String[] filmRows = data.split("%");
				String[] oneFilm = filmRows[1].split("#");
				
				if(oneFilm.length<1) {
					out.print("ID field is missing!");
				}
				else {
				Film f = new Film(Integer.valueOf(oneFilm[0]), "null", 0, "null", "null", "null");
				filmdao.deleteFilm(f);
				out.print("Film Deleted");
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
}
