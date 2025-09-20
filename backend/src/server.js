import express from "express"
import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors"
import path from "path"

dotenv.config();

//console.log(process.env.MONGO_URI);


const app=express();
const PORT=process.env.PORT || 5001
const __dirname=path.resolve()


//middleware
if(process.env.NODE_ENV !== "production"){
app.use(cors({
    origin: "http://localhost:5173",
}))
}
app.use(express.json());
app.use(rateLimiter)

//app.use((req,res,next)=>{
//   console.log(`Req method is ${req.method } & Req URL is ${req.url}`);
//  next();
//})
app.use("/api/notes",notesRoutes);

if(process.env.NODE_ENV === "production"){
app.use(express.static(path.join(__dirname,"../frontend/dist")))


app.get("*",(req,res) =>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
}); 
}


//app.get("/api/notes",(req,res)=>{
//  res.status(200).send("you got 20 notes")
//});

//app.post("/api/notes",(req,res)=>{
//  res.status(201).send("Note created successfully")
//});

//app.put("/api/notes/:id",(req,res)=>{
//  res.status(200).send("Note updated successfully")
//});

//app.delete("/api/notes/:id",(req,res)=>{
//  res.status(200).send("Note deleted successfully")
//});

connectDB().then (()=>{
    app.listen(PORT,() => {
    console.log("Server started on PORT:", PORT)
});
})

