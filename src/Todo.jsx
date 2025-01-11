import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Empty,message, Card } from 'antd';
import {  DeleteFilled, EditFilled } from '@ant-design/icons';

function Todo() {
    const [todo, setTodo] = useState("")
    const [todolist, setTodolist] = useState([{name:"todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1 todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1 todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1 todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1",id:1},{name:"todo2",id:2}])
    const [messageApi, contextHolder] = message.useMessage();
    const actions = (item)=> [
            <EditFilled key="edit" style={{ color: 'green' ,fontSize:"20px" }} onClick={() => console.log(item,"edit")} />,
            <DeleteFilled key={"delete"} style={{ color: 'red' ,fontSize:"20px" }} onClick={() => console.log(item,"delete")} />
    ]

    const addTodo = useCallback(() => {
        if (todo !== "" && todo.trim() !== "") {
            setTodolist((prev)=>[...prev, todo])
            setTodo("");
            messageApi.open({
                type: 'success',
                content: 'Todo added successfully',
            });
        }else{
            messageApi.open({
                type: 'error',
                content: 'Please enter a todo',
            });
        }
    })
  return (
    <>
        {contextHolder}
        <h1 className='text-center font-medium  sm:text-lg lg:text-3xl'>
            Todo
        </h1>
        <div className='flex justify-center items-center my-2'>
            <Input placeholder="Enter todo" value={todo} onChange={(e) => setTodo(e.target.value)} />
            <Button className='ml-2' onClick={addTodo}>Add Todo</Button>
        </div>
        {todolist.length == 0 ? (
            <>
                <div className='my-2 flex justify-center items-center h-[80vh]'>
                    <Empty description="No todos. Try adding a new todo" className='font-normal text-xl ' />
                </div>
            </>
        ):(
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 '>

                {todolist.map((item, index) => (
                    <Card 
                     key={index} 
                     className='pt-3 text-justify flex flex-col justify-between'
                     actions={actions(item)} >
                        <p>{item.name}</p>
    
                    </Card>
                ))}
            </div>
        )}


    </>
  )
}

export default Todo