import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [filter, setFilter] = useState("all") // all, completed, notCompleted

  // ✅ Load todos from localStorage on first render
  useEffect(() => {
    const todoString = localStorage.getItem("todos")
    if (todoString) {
      setTodos(JSON.parse(todoString))
    }
  }, [])

  // ✅ Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleAdd = () => {
    if (todo.trim() === "") return
    if (editIndex !== null) {
      const updatedTodos = [...todos]
      updatedTodos[editIndex].todo = todo
      setTodos(updatedTodos)
      setEditIndex(null)
    } else {
      setTodos([...todos, { todo, isCompleted: false }])
    }
    setTodo("")
  }

  const handleEdit = (index) => {
    setTodo(todos[index].todo)
    setEditIndex(index)
  }

  const handleDelete = (index) => {
    const filteredTodos = todos.filter((_, i) => i !== index)
    setTodos(filteredTodos)
    if (editIndex === index) {
      setEditIndex(null)
      setTodo("")
    }
  }

  const toggleComplete = (index) => {
    const updatedTodos = [...todos]
    updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted
    setTodos(updatedTodos)
  }
  

  const filteredTodos = todos.filter(item => {
    if (filter === "completed") return item.isCompleted
    if (filter === "notCompleted") return !item.isCompleted
    return true
  })

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="addtodo">
          
          <input onChange={handleChange} value={todo} type="text" placeholder="Enter a task..." />
          <button onClick={handleAdd} className="d">{editIndex !== null ? "Update" : "Add"}</button>
        </div>

        <div style={{ margin: '15px 0', display: 'flex', gap: '10px' }}>
          <button className="b" onClick={() => setFilter("all")}>All</button>
          <button className="b" onClick={() => setFilter("completed")}>Completed</button>
          <button className="b" onClick={() => setFilter("notCompleted")}>Not Completed</button>
        </div>

        <h2>Your Tasks</h2>
        <div className="todos">
          {filteredTodos.length === 0 && <p style={{ color: 'white' }}>No tasks to show.</p>}
          {filteredTodos.map((item, index) => (
            <div className="todo" key={index}>
              <div className="text">
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => toggleComplete(index)}
                  style={{ marginRight: "10px" }}
                />
                <span style={{
                  textDecoration: item.isCompleted ? 'line-through' : 'none',
                  color: item.isCompleted ? '#aaa' : 'white'
                }}>
                  {item.todo}
                </span>
              </div>
              <div className="buttons">
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button className="del" onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
