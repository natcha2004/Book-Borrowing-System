package group4.cs251.Model;

import java.util.Date;

public class returnBook {

    private String username;
    private String bid;
    private String bname;
    private Date borrow_date;
    private Date return_date;

    public returnBook(String username, String bid, String bname, Date borrow_date, Date return_date) {

        this.username = username;
        this.bid = bid;
        this.bname = bname;
        this.borrow_date = borrow_date;
        this.return_date = return_date;
    }

    public returnBook(){

    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBid() {
        return bid;
    }

    public void setBid(String bid) {
        this.bid = bid;
    }

    public String getBname() {
        return bname;
    }

    public void setBname(String bname) {
        this.bname = bname;
    }

    public Date getBorrow_date() {
        return borrow_date;
    }

    public void setBorrow_date(Date borrow_date) {
        this.borrow_date = borrow_date;
    }

    public Date getReturn_date() {
        return return_date;
    }

    public void setReturn_date(Date return_date) {
        this.return_date = return_date;
    }
}
