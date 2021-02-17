const express = require("express");
const app = express();
const port = 3000;
const config = {
  host: "db",
  user: "root",
  password: "root",
  database: "nodedb"
};

const mysql = require('mysql');


const runCommand = function(sql, fn){
  const conn = mysql.createConnection(config);
  conn.query(sql, function(err, rows, fields) {
    if (err) throw err;
    fn(err, rows, fields);
  });;
  conn.end();
}
const createTableIfNotExist = function(fn){
  runCommand(`CREATE TABLE IF NOT EXISTS people (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, user varchar(255) NOT NULL)`, fn);
}

const getUsers = function(fn){
  runCommand(`SELECT * FROM people`, fn);
}

const createUser = function (user, fn) {
  runCommand(`INSERT INTO people (user) VALUES ('${user}')`, fn);
}

app.get("/", (req, res) => {
  createTableIfNotExist(function(){
    const user = req.query.user;
    if (user) {
      createUser(user, function (){
        console.log("USER CREATED")
      });
    }
    getUsers(function(_err, rows, _fields){
      let values =  rows.map(p => `<li>${p.id} | ${p.user}</li>`);
      content = `<h1>Full Cycles Rocks!</h1><ul>${values.join("<br/>")}</ul>`;
      res.send(content);
    })
  });
});
app.listen(port, () =>{
  console.log("RUN ON PORT " + port);
})
