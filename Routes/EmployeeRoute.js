import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/employee_login", (req, res) => {
  console.log(req.body);
  const sql = "SELECT * from employee where email = ? ";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      return res.json({ loginStatus: false, Error: "query error" });
    }

    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err) {
          return res.json({ loginStatus: false, Error: " wrong password" });
        }
        const email = result[0].email;
        const token = jwt.sign(
          { role: "employee", email: email,id:result[0].id },
          "jwt_secret_key",
          { expiresIn: "1d" }
        );
        console.log(token)
        res.cookie("token",token)
        return res.json({ loginStatus: true ,id:result[0].id});
      });
    } else {
      return res.json({
        loginStatus: false,
        Error: "wrong email and password",
      });
    }
  });
});


router.get('/detail/:id',(req,res)=>{
    const id = req.params.id
     const sql ='SELECT * FROM employee Where id = ?'
     con.query(sql,[id],(err,result)=>{
        if(err) return  res.json({Status :false})
            return res.json(result)
     })
})

router.get("/logout", (req, res) => {
    res.clearCookie('token')
    return res.json({Status:true})
  });

export { router as EmployeeRouter };
