package group4.cs251.Repository;

import group4.cs251.Model.Book;
import group4.cs251.Model.User;
import group4.cs251.Model.requestBook;
import group4.cs251.Model.returnBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.IncorrectResultSetColumnCountException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public class JdbcLibRepository implements LibRepository{

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Override
    public User findUserByUsername(String username,String upassword) {
        try{
            User user = jdbcTemplate.queryForObject("SELECT * FROM User WHERE username=? AND upassword=?",
                    BeanPropertyRowMapper.newInstance(User.class), username, upassword);
            return user;
        }catch(IncorrectResultSetColumnCountException e){
            return null;
        }
    }


    @Override
    public List<Book> findBook(String search) {
        String q = "SELECT * from Book WHERE bname LIKE '%"+ search +"%' OR author LIKE '%" + search +"%'";
        return jdbcTemplate.query(q,BeanPropertyRowMapper.newInstance(Book.class));

    }

    @Override
    public int insertbook(Book book) {
        return jdbcTemplate.update("INSERT INTO Book (bid,bname,author,category,status,description,overall_rating,pic) " +
                "VALUES (?,?,?,?,?,?,?,?)",
                new Object[] {book.getBid(),book.getBname(),book.getAuthor(),book.getCategory(),book.getStatus()
                        ,book.getDescription(),book.getOverall_rating(),book.getPic()});
    }

    @Override
    public int deletebook(String book) {
        String q = "DELETE FROM Book WHERE bid=?";
        return jdbcTemplate.update(q, book);
    }

    @Override
    public int updateStatus(String bookId) {
        String query = "UPDATE Book SET status='available' WHERE bid=?";
        return jdbcTemplate.update(query, bookId);
    }



    @Override
    public List<Book> bestBook() {
        String q ="SELECT * FROM Book ORDER BY overall_rating DESC LIMIT 3";
        return jdbcTemplate.query(q,BeanPropertyRowMapper.newInstance(Book.class));
    }

    @Override
    public List<Book> allBook() {
        String q ="SELECT * FROM Book ";
        return jdbcTemplate.query(q,BeanPropertyRowMapper.newInstance(Book.class));
    }

    @Override
    public Book infobook(String bid) {
        try {
            Book book = jdbcTemplate.queryForObject("SELECT * FROM Book WHERE bid = ?",
                    BeanPropertyRowMapper.newInstance(Book.class), bid);
            return book;
        } catch (IncorrectResultSetColumnCountException e) {
            return null;
        }
    }

    public int save(requestBook requestbook) {
        int rowsAffected = jdbcTemplate.update(
                "INSERT INTO requestBook (date, username, bid, bname) VALUES (CURRENT_TIMESTAMP, ?, ?, ?) ",
                requestbook.getUsername(), requestbook.getBid(), requestbook.getBname());

        if (rowsAffected > 0) {
            updateStatusToNotAvailable(requestbook.getBid());
        }
        return rowsAffected;
    }

    public void updateStatusToNotAvailable(String bid) {
        jdbcTemplate.update("UPDATE Book SET status = 'not available' WHERE bid = ?", bid);
    }

    public void updateStatusToAvailable(String bid) {
        jdbcTemplate.update("UPDATE Book SET status = 'available' WHERE bid = ?", bid);
    }


    @Override
    public List<requestBook> getrequestBook() {
        String query = "SELECT * FROM requestBook ORDER BY date ASC";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(requestBook.class));
    }

    public void updateBorrow(String bid) {
        jdbcTemplate.update("UPDATE requestBook SET borrow_date = CURRENT_DATE WHERE bid = ?", bid);

        // Calculate return date (1 month later)
        jdbcTemplate.update("UPDATE requestBook SET return_date = DATE_ADD(CURRENT_DATE, INTERVAL 1 MONTH) WHERE bid = ?", bid);
    }

    public void updateReturn(String bid) {
        jdbcTemplate.update("INSERT INTO returnBook (username, bid, bname, borrow_date, return_date) \n" +
                "SELECT username, bid, bname, borrow_date, CURRENT_DATE FROM requestBook WHERE bid = ?",bid);

        // Remove information from requestBook table
        jdbcTemplate.update("DELETE FROM requestBook WHERE bid = ?", bid);
        // Move information to returnBook table

    }


    @Override
    public int countRequestBooksByUsername(String username) {
        String query = "SELECT COUNT(*) FROM requestBook WHERE username = ?";
        return jdbcTemplate.queryForObject(query, Integer.class, username);
    }

    @Override
    public List<returnBook> getMyhistory(String username) {
        String query = "SELECT * FROM returnBook WHERE username = ?";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(returnBook.class), username);
    }

    @Override
    public List<requestBook> getMyNowBorrow(String username) {
        String query = "SELECT * FROM requestBook WHERE username = ?";
        return jdbcTemplate.query(query, BeanPropertyRowMapper.newInstance(requestBook.class), username);
    }


}
