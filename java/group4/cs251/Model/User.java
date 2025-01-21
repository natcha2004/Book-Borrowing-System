package group4.cs251.Model;

public class User {

    private String username;
    private String upassword;
    private String title;
    private String firstname;
    private String lastname;
    private String faculty;
    private String email;
    private String type;

    public User(){}

    public User(String username, String upassword, String title, String firstname, String lastname, String faculty, String email, String type) {
        this.username = username;
        this.upassword = upassword;
        this.title = title;
        this.firstname = firstname;
        this.lastname = lastname;
        this.faculty = faculty;
        this.email = email;
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUpassword() {
        return upassword;
    }

    public void setUpassword(String upassword) {
        this.upassword = upassword;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


}



