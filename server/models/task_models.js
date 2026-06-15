const db=require("../data/data_base")

const task_func={
    get_all:()=>{
        return db.prepare("SELECT * FROM tasks ORDER BY time DESC").all(); // this runs the sql statement and show all tasks from lastest to oldest time of creation
    },
    delete:(id)=>{
        return db.prepare("DELETE FROM tasks WHERE id=?").run(id);
    },
    update:(id,{name,data,status})=>{
        return db.prepare("UPDATE tasks SET name=?,data=?,status=? WHERE id=? RETURNING *").get(name,data,status,id);
    },
    create:({name,data})=>{
        return db.prepare("INSERT INTO tasks (name,data) VALUES (?,?) RETURNING *").get(name,data)
    },
    get_by_id:(id)=>{
        return db.prepare("SELECT * FROM tasks WHERE id=?").get(id);
    }
}
module.exports = task_func;