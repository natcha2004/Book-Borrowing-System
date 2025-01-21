package group4.cs251.Repository;

import group4.cs251.Model.Book;
import group4.cs251.Model.User;
import group4.cs251.Model.requestBook;
import group4.cs251.Model.returnBook;

import java.util.List;

public interface LibRepository {
    User findUserByUsername(String username, String upassword);

    List<Book> findBook(String search);

    int insertbook(Book book);

    int deletebook(String book);

    int updateStatus(String bookId);

    List<Book> bestBook();

    List<Book> allBook();

    Book infobook(String book);

    int save(requestBook requestBooks);

    List<requestBook> getrequestBook();

    void updateBorrow(String bid);
    void updateReturn(String bid);

    int countRequestBooksByUsername(String username);

    List<returnBook> getMyhistory(String username);
    List<requestBook> getMyNowBorrow(String username);
    void updateStatusToNotAvailable(String bid);

    void updateStatusToAvailable(String bid);
}
