import mysql from 'mysql'

const con = mysql.createConnection({
    host:'sql12.freemysqlhosting.net',
    user:'sql12744961',
    password:'wj3daIZSDP',
    database:'sql12744961'
})

con.connect(function(err){
    if(err){
        console.log("connection error")
    }
    else{
        console.log("connected")
    }
})

export default con;