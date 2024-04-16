Hello everyone this side team Unity Squad,
We have created a Web-Application (Hello college)
Description:User-Friendly Full-Stack-Website , acting as a interface to solve user's problem and it will also aims to create community for different domains ,Our website also provides important materials and resources for the student.
Tech stack used:
Backened:Express JS,Node JS,AJAX;
DataBase:MySql;
Frontened:JavaScript,JQuery,BootStrap,HTML,CSS;
Installation steps:
1)Clone the project from My-Repository
2)npm init
3)Install all the node modules as listed in the dictionary
4)In the server.js file change the database connection configuration.
5)In the MySql Workbench write a command : 

CREATE TABLE community(
id INT PRIMARY KEY AUTO_INCREMENT,
issue VARCHAR(1000) NOT NULL,
time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
date DATETIME DEFAULT CURRENT_TIMESTAMP,
upvote INT DEFAULT 0,
downvote INT DEFAULT 0);

6)Now in the terminal write node server.js
7)Now you can see our website at http://127.0.0.1:3000


Libraries and dependancies:
mysql,express,nodemailer,body-parser,cookie-parser,path


Link of the overview video:https://www.loom.com/share/f763872a339c407aa0e3ebcdfe606ab9?sid=9dba8129-af8d-499f-9d01-07ef5b0fe921



