const mongoose = require('mongoose');
const { InnerResponse } = require('../response/response_function.js');
require('dotenv').config();

try{
    mongoose.connect(`mongodb+srv://capstone:${process.env.MONGO_PASSWORD}@cluster0.9lkorgn.mongodb.net/?retryWrites=true&w=majority`,
    );
}catch(err){
    console.error("Can't connect to DB");
}

//Open the connection
const db = mongoose.connection;
db.once("open", () => {
    console.log("Todo DB Connection is on");
});

const TodoDataSchema = new mongoose.Schema(
    {
        projectName: String,
        todoCreator: String,
        todoAssignee: String,
        todoTeam: String,
        todoUpdatedBy: String,
        todoName: String,
        todoStatus: Boolean
    }
);

const todoSchema = mongoose.model('todos', TodoDataSchema);


/**
 * On creation of project, this todo object will also get created
 * @param {string} projectName 
 * @param {string} userEmail 
 * @param {string} userTodoName 
 * @param {string} userTodoTeam 
 * @returns {object} new todo object
 */
const createTodo = async(projectName, userEmail, userTodoName, userTodoTeam) => {
    try{
        let updateData = {
            "projectName" : projectName,
            "todoCreator" : userEmail,
            "todoAssignee" : null,
            "todoTeam": userTodoTeam,
            "todoUpdatedBy" : userEmail,
            "todoName" : userTodoName,
            "todoStatus": false
        };

        let newTodo = new todoSchema(updateData);
        newTodo.save();
        return newTodo;
    }catch(err){
        console.error(`Error at createTodo: ${err}`);
    }
}



module.exports = { createTodo, todoSchema };
