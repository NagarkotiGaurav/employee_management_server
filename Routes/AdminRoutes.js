import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  console.log(req.body);
  const sql = "SELECT * from admin where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      return res.json({ loginStatus: false, Error: "query error here" });
    }
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email ,id:result[0].id},
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({
        loginStatus: false,
        Error: "wrong email and password",
      });
    }
  });
});

router.get("/category", (req, res) => {
  const sql = "SELECT * from category";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_category", (req, res) => {
  const sql = "INSERT INTO  category (`name`) VALUES  (?)";
  con.query(sql, [req.body.category], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true });
  });
});

//image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post("/add_employee", upload.single("image"), (req, res) => {
  const sql = ` INSERT INTO employee (name, email, password, salary, address, image, category_id)  VALUES (?)`;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) return res.json({ Status: false, Error: "query error crypt" });
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id,
    ];
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Status: false, Error: err });
      return res.json({ Status: true });
    });
  });
});

router.get("/employee", (req, res) => {
  const sql = "SELECT * from employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql =
    "UPDATE employee set name = ?,email=?,salary=?,address=?,category_id=? Where id = ?";
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id,
  ];
  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_employee/:id',(req,res)=>{
    const id = req.params.id
    const sql = 'DELETE From employee Where id =?'
    con.query(sql,[id],(err,result)=>{
        if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
    }) 
})

router.get("/admin_count", (req, res) => {
    const sql = "SELECT count(id) as admin from admin";
    con.query(sql, (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });
      return res.json({ Status: true, Result: result });
    });
  });
router.get("/employee_count", (req, res) => {
    const sql = "SELECT count(id) as employee from employee";
    con.query(sql, (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });
      return res.json({ Status: true, Result: result });
    });
  });
router.get("/salary_count", (req, res) => {
    const sql = "SELECT sum(salary) as salary  from employee";
    con.query(sql, (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });
      return res.json({ Status: true, Result: result });
    });
  });
router.get("/admin_records", (req, res) => {
    const sql = "SELECT * from admin";
    con.query(sql, (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error" });
      return res.json({ Status: true, Result: result });
    });
  });

  router.get("/logout", (req, res) => {
    res.clearCookie('token')
    return res.json({Status:true})
  });
export { router as adminRoute };
