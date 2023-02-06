import express, { Express, Request, response, Response } from 'express'
import { Schema,Document } from 'mongoose';
const date = require(__dirname+'/date.js');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

dotenv.config()

const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URL); 
interface ITodo extends Document{
    task: String,
    isDone: Boolean,
    taskTitle:String,
    date: Date
}
const todoSchema = new Schema({
    task: String,
    isDone: Boolean,
    taskTitle:String,
    date: {type: Date, default: Date.now }
})
const Todo = mongoose.model('Todo', todoSchema)

const app = express()
const port = process.env.PORT
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine','ejs')

const toDay = date.getDateTODat();
const todoHome = new Set()
const todoSchool = new Set()


app.get('/', (req: Request, response: Response) => {
    Todo.find({taskTitle:'HOME'},(err: string, todoHome: ITodo[])=>{
        if(err)
            response.send(err)
        else
            response.render('index',{today : toDay, tasks: todoHome, taskTitle: "HOME"})
    })
})
app.get('/School', (req: Request, response: Response) => {
    Todo.find({taskTitle:'SCHOOL'},(err: string, todoHome: ITodo[])=>{
        if(err)
            response.send(err)
        else
            response.render('index',{today : toDay, tasks: todoHome, taskTitle: "SCHOOL"})
    })
 })

app.post('/', (req: Request, response: Response)=>{
    let path = "/"
    const newTask = req.body.newTask
    const taskType = req.body.type
    if(req.body.type === 'SCHOOL')
    { 
        path = "School"
    } 
    if(req.body.isDone !== '' && newTask === '' && req.body.delete === undefined)
    { 
        const update_id = req.body.isDone
        console.log('update_id = '+ update_id)
        Todo.findOneAndUpdate({_id: update_id }, [{ $set: { isDone: { $not: "$isDone" } } }], (err:string,doc:ITodo) =>{
            if(err)
            response.send(err)
            else
            response.redirect(path)
        })
    }
    else if(newTask !== ''){
        const task = new Todo({
            task: newTask,
            isDone:false,
            taskTitle:taskType
        })
        task.save()
        response.redirect(path)
    }
    else if(req.body.delete !== undefined){
        const delete_id = req.body.delete
       Todo.findByIdAndDelete(delete_id,(err:string)=>{
        if(err){
            response.send(err)
        }else{
            response.redirect(path)
        }
       })
    }
    
})

app.listen(port, () => {
    console.log(`⚡️[SERVER]: Server is running at https://localhost:${port}`)
})