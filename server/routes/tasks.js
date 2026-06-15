const express=require("express");
const router=express.Router(); // creates a router instance to make routes
const ctrl=require("../controller/task_controller"); // importing controller functions from taskcontroller.js

router.get("/",ctrl.get_all_tasks); // the route for GET /api/tasks
router.get("/:id",ctrl.get_task); // the route for GET /api/tasks/:id, where :id is the parameter used to id tasks
router.post("/",ctrl.create_task);
router.put("/:id",ctrl.update_task)
router.delete("/:id",ctrl.delete_task);

module.exports=router; // this makes the routes accessible to other files