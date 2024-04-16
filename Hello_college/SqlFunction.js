var mysql=require('mysql');
var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'@Aashish1',
    database:'prototypeproject'
});
var nodemailer=require('nodemailer');
var transporter=nodemailer.createTransport({
    service:'Gmail',
    host:'smtp.gmail.com',
    port:5000,
    secure:'true',
    auth:{
        user:'hellocollege143@gmail.com',
        pass:'qgpx acjz lztl dgyj',
    },
});
module.exports = {
    Insertion: Insertion,
    sendemail: sendemail
};
connection.connect(function(error){
    if(error) throw error;
});
function sendemail(username, name, email) {
    return new Promise((resolve, reject) => {
        const myArray = new Uint32Array(1);
        function generateOTP() {
    const myArray = new Uint32Array(2); 
    crypto.getRandomValues(myArray);
    let otp = (myArray[0] % 1000000).toString().padStart(6, '0');
    return otp;
}
const x = generateOTP();
        const mailOptions = {
            from: "hellocollege143@gmail.com",
            to: `${email}`,
            subject: `User Verification`,
            text: `This message was supposed for the user having username as ${username} and name as ${name}, If this was not you then please ignore this message. The OTP is ${x}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                // console.log("Email sent!");
                resolve(x); 
            }
        });
    });
}
function Insertion(username,fullname,email,password){
var query;
                query=`INSERT INTO userinfo(userName,name,eMail,password) VALUES ('${username}','${fullname}','${email}','${password}')`;
                // console.log(query);
                connection.query(query,function(error,result){
                    if(error) throw error;
                  console.log("data inserted successfully!");
                });
                query = `CREATE TABLE ?? (
                    id INT AUTO_INCREMENT,
                    issue VARCHAR(10000) NOT NULL,
                    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    upvote INT DEFAULT 0,
                    downvote INT DEFAULT 0,
                    PRIMARY KEY (id)
                )`;
                connection.query(query, [username], function(error, result) {
                    if (error) {
                        console.error("Error creating table:", error);
                    } else {
                        console.log("Table created successfully.");
                    }
                });
            }
       