const task_func=require("../models/task_models") // imports the task functions from task_models

exports.get_all_tasks=(req,res)=>{
    const all_tasks=task_func.get_all(); // gets the task function from model
    res.json(all_tasks); // sends them back in JSON format for database, the status code is automaticaaly dealt with by express
}

exports.get_task=(req,res)=>{
    const id=parseInt(req.params.id); // parseInt converts a string "1234" into int 1234, and id is part of parameters of req 
    const task_to_get=task_func.get_by_id(id);
    if(!task_to_get){ // failsafe if the task is not there in the task list saved
        return res.status(404).json({message: "Your task may not exist or has not been saved"});
    }
    res.json(task_to_get)
}

exports.delete_task=(req,res)=>{
    const id=parseInt(req.params.id);
    const del=task_func.delete(id)
    if(del.changes===0){ // failsafe if the task is not saved or found
        return res.status(404).json({message: "Your task cannot be deleted as it not saved or does not exist"});
    }
    return res.status(204).send();
}

exports.create_task=(req,res)=>{
    const {name,data}=req.body;
    const new_task=task_func.create({name,data});
    res.status(201).json(new_task); // status code 201 in http means sucessful post, to let express know you created something
}

exports.update_task=(req,res)=>{
    const id=parseInt(req.params.id);
    const up_task=task_func.get_by_id(id);
    if(!up_task){
        return res.status(404).json({message: "Your task cannot be updated since it was not saved or does not exist"})
    }
    const updated_task=task_func.update(req.params.id,req.body)
    res.json(updated_task)
}

