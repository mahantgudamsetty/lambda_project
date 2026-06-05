const express=require("express"); // importing express
const cors=require("cors"); // importing CORS used for 
const task_routes=require("./routes/tasks"); // imports routes from tasks.js in the "routes" folder

const app=express(); // express application instance created

app.use(cors()); // allow browser requests
app.use(express.json()); // parse JSON request bodies
app.use(express.static("public")); // makes everything in the "public" folder visible to the browser for frontend

app.use("/api/tasks", task_routes); //all routes in the taskroutes are prefixed with /api/tasks

app.use((req,res)=>{
    res.status(404).json({error:"route not found"}); // route handler
})

app.use((err,req,res,next)=>{ // error handling
    console.error(err.stack); // this shows the error stack in terminal
    res.status(500).json({  // http error code 500 means internal server error 
        error:err.message // prints the message in the failsafe written in other files
    });
});

app.listen(3000,()=>{
    console.log("Server running on http://localhost:3000"); // used to listen inputs from http://localhost:3000
});