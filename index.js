import express from 'express'
import cors from 'cors'
import { adminRoute } from './Routes/AdminRoutes.js'
import { EmployeeRouter } from './Routes/EmployeeRoute.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    methods:['POST','GET','PUT','DELETE'],
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/auth',adminRoute)
app.use('/employee',EmployeeRouter)
app.use(express.static('public'))

const verifyUser =(req,res,next)=>{
    const token = req.cookies.token
    if(token){
            jwt.verify(token,"jwt_secret_key",(err,decoded)=>{
                if(err){ return res.json({Status : false ,Error :"wrong token"})}
                    req.id = decoded.id
                    req.role = decoded.role
                    next()
            })
    }
    else{
        return res.json({Status:false , Error :"Not authenticated"})
    }
}
app.use('/verify',verifyUser,(req,res,)=>{
    return res.json({Status:true,role: req.role , id : req.id})
})
app.listen(3306,()=>{
    console.log("server is running")
})