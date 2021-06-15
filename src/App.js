import logo from './logo.svg';
import './App.css';
import Header from './components/Header'
import React from 'react'
import Tasks from './components/Tasks'
import {useState,useEffect} from 'react'
import task from './components/Task'
import AddTask from './components/AddTask'

function App() {
  const [showAddTask,setShowAddTask] = useState(false)
  //Global level 
  const [tasks,setTasks] = useState([])

  useEffect(() => {
    const getTasks = async ()=> {
      const tasksFromServer = await fetchTasks() 
      setTasks(tasksFromServer)
    }
    getTasks();
  },[])

  //Fetch Tasks
  const fetchTasks = async() => {
    const res=await fetch('http://localhost:5000/tasks')
    const data=await res.json()

    return data
  }


  const fetchTask = async(id) => {
    const res=await fetch(`http://localhost:5000/tasks/$id`)
    const data=await res.json()

    return data
  }

//Toggle Reminder
const toggleReminder = async (id) =>{
  const taskToToggle = await fetchTask(id)
  const updTask={...taskToToggle,reminder: !taskToToggle.reminder}

  const res = await fetch(`http://localhost:5000/tasks/${id}`,{
    method:'PUT',
    header: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updTask)
  })
  const data = await res.JSON()

  setTasks(tasks.map((task) => task.id ===id  ? {...task,reminder: data.reminder} : task))
}

const addTask = async (task) => {
  const res = await fetch('http://localhost:5000/tasks',{
    method:'POST',
    header: {
      'Content-type':'application/json'
    },
    body: JSON.stringify(task)
  })

  const data = res.json()
  setTask([...tasks,data])
  
 
}

// const id = Math.floor(Math.random() * 10000) +1 
  // const newTask = {id,...task}
  // setTasks([...tasks], newTask)
}

const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/task/${id}`,{
    method: 'DELETE'
  }) 

  //console.log('delete', id)
  setTasks(tasks.filter((task) => task.id !== id ))
}
  
  return (
    <div className='App'>
      <Header onAdd={() => setShowAddTask(!showAddTask)} title = 'Task Tracker' showAdd={showAddTask}></Header>
      {showAddTask && <AddTask onAdd={addTask}></AddTask>}
      {tasks.length > 0 ? (<Tasks onToggle={toggleReminder} tasks={tasks} onDelete={deleteTask}></Tasks>) : (
        'No Tasks To Show'
      )}
      
    </div>
  );
}

export default App;
