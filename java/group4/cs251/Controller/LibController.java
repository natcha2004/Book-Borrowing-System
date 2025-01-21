package group4.cs251.Controller;

import group4.cs251.Model.Book;
import group4.cs251.Model.User;
import group4.cs251.Model.requestBook;
import group4.cs251.Model.returnBook;
import group4.cs251.Repository.LibRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api")
public class LibController {

    @Autowired
    LibRepository libRepository;

    @GetMapping(value = "/user/{username}/{upassword}")
    public ResponseEntity<User> getUserByUsername(@PathVariable("username") String username,
                                                  @PathVariable("upassword") String upassword) {
        User user = libRepository.findUserByUsername(username, upassword);

        if (user != null && user.getUpassword().equals(upassword)) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else if (user != null) {
            // User found, but password is incorrect
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        } else {
            // User not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping(value = "/book/{search}")
    public ResponseEntity<List<Book>> getBookBySearch (@PathVariable("search")String search){
        try{
            List<Book> books = libRepository.findBook(search);
            if(books != null){
                return new ResponseEntity<>(books,HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping(value = "/addbook")
    public ResponseEntity<Object> addBook(@RequestBody Book book){
        try{
            libRepository.insertbook(new Book(book.getBid(),book.getBname(),book.getAuthor(),book.getCategory(),book.getStatus()
                    ,book.getDescription(),book.getOverall_rating(),book.getPic()));
            return new ResponseEntity<>("{\"message\": \"success\"}", HttpStatus.CREATED);
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/book/delete/{book}")
    public ResponseEntity<String> deletebook(@PathVariable("book") String book) {
        try {
            int result = libRepository.deletebook(book);
            if (result == 0) {
                return new ResponseEntity<>("Cannot find Book with bid=" + book, HttpStatus.OK);
            }
            return new ResponseEntity<>("Book was deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Cannot delete Book.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/book/updatestatus/{bookId}")
    public ResponseEntity<String> updateStatus(@PathVariable String bookId, @RequestBody Book book) {
        try {
            if (bookId == null || bookId.isEmpty()) {
                return ResponseEntity.badRequest().body("Book ID cannot be empty.");
            }

            int rowsAffected = libRepository.updateStatus(bookId);
            if (rowsAffected == 1) {
                return ResponseEntity.ok("Status updated successfully.");
            } else if (rowsAffected == 0) {
                // Check if the book status is already 'available'
                if (book.getStatus().equalsIgnoreCase("available")) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body("Book is already available.");
                } else {
                    return ResponseEntity.notFound().build();
                }
            } else {
                // Handle unexpected case where rowsAffected is greater than 1
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update status.");
        }
    }



    @GetMapping(value = "/bestbook")
    public ResponseEntity<List<Book>> getbestbook (@RequestParam(required = false)String bestbook){
        try{
            List<Book> books = libRepository.bestBook();
            if(books != null){
                return new ResponseEntity<>(books,HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/allbook")
    public ResponseEntity<List<Book>> getallbook (@RequestParam(required = false)String allbook){
        try{
            List<Book> books = libRepository.allBook();
            if(books != null){
                return new ResponseEntity<>(books,HttpStatus.OK);
            }
            else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        catch(Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/book-detail/{bid}")
    public ResponseEntity<?> getBookDetailsById(@PathVariable("bid") String bid) {
        Book book = libRepository.infobook(bid);
        if (book != null) {
            return new ResponseEntity<>(book, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Book not found", HttpStatus.NOT_FOUND);
        }
    }

    ///////////////////////
    @PostMapping("/requestBook")
    public ResponseEntity<String> saveRequestBook(@RequestBody List<requestBook> requestBooks) {
        try {
            // Check if the same username is sending more than 5 books
            Map<String, Integer> bookCountByUsername = new HashMap<>();
            for (requestBook book : requestBooks) {
                String username = book.getUsername();
                int count = bookCountByUsername.getOrDefault(username, 0) + 1;
                bookCountByUsername.put(username, count);
            }

            // Check if there are already 5 entries for the same username in the requestBook table
            for (String username : bookCountByUsername.keySet()) {
                int existingCount = libRepository.countRequestBooksByUsername(username);
                int totalCount = existingCount + bookCountByUsername.get(username);
                if (totalCount > 5) {
                    return new ResponseEntity<>("User " + username + " have already borrowed 5 books.", HttpStatus.BAD_REQUEST);
                }
            }

            // Save the request books
            for (requestBook book : requestBooks) {
                libRepository.save(new requestBook(
                        book.getUsername(),
                        book.getBid(),
                        book.getBname()
                ));
            }
            return new ResponseEntity<>("Save success", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /////////////////////////

    @GetMapping("/getrequestBook")
    public ResponseEntity<List<requestBook>> getRequestBooks() {
        try {
            List<requestBook> books = libRepository.getrequestBook();
            if (!books.isEmpty()) {
                return new ResponseEntity<>(books, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/toggleBorrowCheck/{bid}")
    public ResponseEntity<Object> toggleBorrowCheck(@PathVariable String bid) {
        try {
            libRepository.updateBorrow(bid);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Book borrow status updated successfully.");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/toggleReturnCheck/{bid}")
    public ResponseEntity<Object> toggleReturnCheck(@PathVariable String bid) {
        try {
            libRepository.updateReturn(bid);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Book return status updated successfully.");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/myhistory/{username}")
    public ResponseEntity<List<returnBook>> getMyHistory(@PathVariable("username") String username) {
        try {
            List<returnBook> history = libRepository.getMyhistory(username);
            if (!history.isEmpty()) {
                return new ResponseEntity<>(history, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/myNowBorrow/{username}")
    public ResponseEntity<List<requestBook>> getMyNowBorrow(@PathVariable("username") String username) {
        try {
            List<requestBook> NowBorrow = libRepository.getMyNowBorrow(username);
            if (!NowBorrow.isEmpty()) {
                return new ResponseEntity<>(NowBorrow, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/book/{bid}/make-not-available")
    public void makeBookNotAvailable(@PathVariable String bid) {
        libRepository.updateStatusToNotAvailable(bid);
    }

    @PutMapping("/book/{bid}/make-available")
    public ResponseEntity<String> makeBookAvailable(@PathVariable String bid) {
        libRepository.updateStatusToAvailable(bid);
        return new ResponseEntity<>("Update to available successfully.", HttpStatus.OK);
    }






}
