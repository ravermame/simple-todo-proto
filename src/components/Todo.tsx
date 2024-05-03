"use client"
import React, { useState } from 'react';
import TodoList from '../components/TodoList';
import { Todo } from '@/types/Todo';
import TodoForm from './TodoForm';
import { toast } from "react-toastify";
import { todoData } from '../../data';

const Home: React.FC = () => {
    // state to store todo list
    const [todos, setTodos] = useState<Todo[]>(todoData);

    // flag to open input form
    const [openForm, setOpenForm] = useState<boolean>(false);

    // maintain id to use unique identifier for todo list
    const [nextId, setNextId] = useState<number>(todoData?.length + 1 || 1);

    // to store the todo being edit
    const [editTodo, setEditTodo] = useState<Todo | null>(null)

    // method to add add new todo
    const handleAddTodo = (text: string, datetime: Date, priority: string) => {
        // create todo object
        const newTodo: Todo = { id: nextId, text, datetime, checked: false, priority };
        // set todo in state
        setTodos([newTodo, ...todos,]);
        // increment the id for next todo
        setNextId(nextId + 1);
        // disable flag to open input form
        setOpenForm(false)
        // set the state to null after editing
        setEditTodo(null)
        // show toast message
        toast.success('Todo added successfully!')
    };

    const handleDeleteTodo = (id: number) => {
        // remove the todo from state
        setTodos(todos.filter(todo => todo.id !== id));
        // show toast message
        toast.success('Todo deleted successfully!')
    };
    const handleEditTodo = (todo: Todo) => {
        // set the input form flag to true
        setOpenForm(true)
        // set the todo to edit
        setEditTodo(todo)
    };

    const handleUpdateTodo = (updatedTodo: Todo) => {
        // set the input form flag to false
        setOpenForm(false)
        // set the edit todo state back to null
        setEditTodo(null)
        // update the todo in the state
        setTodos(todos.map(todo => (todo.id === updatedTodo.id ? { ...todo, text: updatedTodo.text, datetime: updatedTodo.datetime, checked: updatedTodo.checked, priority: updatedTodo.priority } : todo)));
        // show toast message
        toast.success('Todo updated successfully!')
    };

    return (
        <div className="mx-auto px-4 py-8">
            {/* call todo form component to add/edit todo */}
            <TodoForm handleAddTodo={handleAddTodo} handleUpdateTodo={handleUpdateTodo} editTodo={editTodo} openForm={openForm} setOpenForm={setOpenForm} />
            <div className='flex justify-between w-full mb-4'>
                <h1 className="text-3xl font-semibold mb-4">List</h1>
                {/* Add todo */}
                <button onClick={() => setOpenForm(true)} type="button" className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
                    Add Todo
                </button>
            </div>
            {/* Todo list */}
            {todos?.length > 0 ?
                <TodoList todos={todos} onDelete={handleDeleteTodo} onEdit={handleEditTodo} setTodos={setTodos} /> :
                <div className='w-full text-center text-xl'>No Records</div>}

        </div>
    );
};

export default Home;