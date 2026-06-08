// to  send a fetch request to get tasks from the server
const res=await fetch("/api/tasks"); // this is to fetch HTTPS requests from the server
const tasks=await res.json(); // data sent by the server converted from json format to a javascript object.

// to send a post request to the server
const post_res=await fetch("/api/tasks",{
    method:"POST", // method used
    headers:{"Content-Type":"application/json"}, // shows type of data being sent to the server
    body:JSON.stringify({name,data}) // formatting of data which is sent from the frontend
});
const created_task=await post_res.json();

// to send put request to server to update a task
const update_res=await fetch("/api/tasks/${id}",{ // we need to add an additional parameter id to update a specific task
    method:"PUT",
    headers:{"Content-Type":"application/json"}, // shows type of data being sent to the server
    body:JSON.stringify({name,data}) // formatting of data which is sent from the frontend
});
const updated_task=await updated_res.json();

// to send delete request to server to delete task
const delete_res=await fetch("/api/tasks/${id}",{
    method:"DELETE"
});

if(delete_res.ok){ // to check if the task deleted successfully or not.
    console.log("deleted successfully");
}
