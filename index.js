const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "global",
  database: "employee",
});
db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const saltRounds = 10;
app.post("/register", (req, res) => {
  
  const username = req.body.username;
  let password = req.body.password;
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {


    password = hash;

    db.query(
      "INSERT INTO auth (username,password) VALUES (?,?)",
      [username, password],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values Inserted");
        }
      }
    );
  })




});

let loginsuccess;
app.get("/login", (req, res) => {

  console.log("login server running");
  console.log(req.query.username + "" + req.query.password + req.url);
  db.query("SELECT * FROM auth where username= ?", [req.query.username], (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {

      console.log(JSON.stringify(foundUser));
      bcrypt.compare(req.query.password, foundUser[0].password, function (err, result) {


        if (err) {
          console.log(err + "password and cpassword not equal");
        } else {
          bcrypt.hash(req.query.password, saltRounds, function (err, hash) {
            // console.log("hash"+hash+foundUser[0].id);
          db.query(
            "UPDATE  auth  SET cpassword  = ? WHERE  id= ?",
            [hash, foundUser[0].id],
            (err1, result1) => {
              if (err1) {
                console.log(err1 + "not updated");
              } else {

                
                  





                res.send(foundUser);
              

            }
            }
          );


          })






        }
      }
      );



    }
  })
})
app.get("/secret", (req, res) => {
  
  db.query("SELECT * FROM auth where id= ?", [req.query.id], (err, foundUser) => {
   try{ if (err) {
      console.log(err);
    } else {
console.log("secret data"+foundUser);
      bcrypt.compare(foundUser[0].cpassword, foundUser[0].password, function (err, result) {


        if (err) {
          console.log(err);
        } else {
          
          db.query("SELECT * FROM product where id= ?", [req.query.id], (err, foundProduct) => {
            if (err) {
              console.log("err" + err);
            } else {
              console.log("foundProduct" + JSON.stringify(foundProduct));
          
              res.send(foundProduct);
            
            }
          })
          db.commit();
        }

      }
      );


    }}catch{
      
    }
  })
})
//////
app.get("/delete", (req, res) => { console.log("deleted method entered");
db.query(
  "UPDATE  auth  SET cpassword  = ? WHERE  id= ?",
  ["", req.query.id],
  (err1, result1) => {
    if (err1) {
      console.log(err1 + "not updated");
    } else {

      
      console.log("deleted cpassord for "+req.query.id);





      res.send("deleted cpassord for "+req.query.id);
    

  }
  }
);

})

/////


app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
