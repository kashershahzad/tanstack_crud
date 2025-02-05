'use client'
import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'

const getTodos = () => {
  if (typeof window !== 'undefined') {
    const storedTodos = localStorage.getItem('todos')
    try {
      return storedTodos ? JSON.parse(storedTodos) : []
    } catch (error) {
      console.error('Error parsing localStorage:', error)
      return []
    }
  }
  return []
}

const Page = () => {




  const [value, setValue] = useState('')
  const [editId, setEditId] = useState(null)




  const { data: todos, refetch, status } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    initialData: [],
  })




  const { mutate } = useMutation({
    mutationFn: (updatedTodos) => {
      localStorage.setItem('todos', JSON.stringify(updatedTodos))
      return updatedTodos
    },
    onSuccess: () => refetch(),
  })






  const handleSubmit = () => {
    if (value.trim() === '') return

    let updatedTodos
    if (editId !== null) {
      updatedTodos = todos.map((todo) =>
        todo.id === editId ? { ...todo, value } : todo
      )
      setEditId(null)



    } else {
      updatedTodos = [...todos, { id: Date.now(), value }]
    }



    mutate(updatedTodos)
    setValue('')
  }







  const handleDelete = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id)
    mutate(updatedTodos)
  }




  const handleEdit = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id)
    setValue(todoToEdit.value)
    setEditId(id)
  }


  

  return (
    <div className="flex flex-col items-center mt-10 min-h-screen px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">Todo App</h1>
        <p className="text-sm text-center text-gray-500 mb-4">Status: {status}</p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            className="w-full sm:w-2/3 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a task..."
          />
          <button
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition"
            onClick={handleSubmit}
          >
            {editId !== null ? 'Update' : 'Add'}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <div key={todo.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-md">
                <span className="text-gray-700">{todo.value}</span>
                <div className="space-x-2">
                  <button className="text-green-600 hover:underline" onClick={() => handleEdit(todo.id)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(todo.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No todos available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
