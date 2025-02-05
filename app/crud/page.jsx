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
    const [value, setvalue] = useState('')
    const [editId, seteditId] = useState('')

    const { data: todos, refetch } = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos,
        initialData: []
    })

    const handleSubmit = () => {
        if (value.trim() === '') return
        let updatedTodos
        if (editId !== null) {
            updatedTodos = todos.map((todos) => todos.id === editId ? { ...todos, value } : todos)
            seteditId(null)
        } else {
            updatedTodos = [...todos, { id: Date.now(), value }]
        }
        setvalue('')
        mutate(updatedTodos)
    }

    const { mutate } = useMutation({
        mutationFn: (updatedTodos) => {
            localStorage.setItem('todos', JSON.stringify(updatedTodos))
        },
        onSuccess: () => refetch(),
    })

    const handleDelete = (id) => {

        const updatedTodos = todos.filter((todos) => todos.id !== id)
        mutate(updatedTodos)

    }

    const handleEdit = (id) => {
        const EditTodos = todos.find((todos) => todos.id === id)
        setvalue(EditTodos.value)
        seteditId(id)
    }


    return (
        <>
            <div className='flex gap-10 mt-20'>
                <input type="text" className="w-full sm:w-2/3 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none " onChange={(e) => setvalue(e.target.value)} value={value} />
                <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition" onClick={handleSubmit}> Submit</button>
            </div>
            <div>
                {
                    todos.map((todo) => (
                        <div key={todo.id} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-md">
                            <span className="text-gray-700">{todo.value}</span>
                            <div className="space-x-2">
                                <button className="text-green-600 hover:underline" onClick={() => handleEdit(todo.id)}>Edit</button>
                                <button className="text-red-600 hover:underline" onClick={() => handleDelete(todo.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Page