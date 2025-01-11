import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Empty,message, Card, Modal, Popconfirm, Spin     } from 'antd';
import {  DeleteFilled, EditFilled , CheckCircleOutlined } from '@ant-design/icons';

function Todo() {
    const { TextArea } = Input;
    const [todo, setTodo] = useState("")
    const [todolist, setTodolist] = useState([{name:"todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1 todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1 todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1 todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1",id:1},{name:"todo2",id:2}])
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [edittodo, setEdittodo] = useState({});
    const [isloading, setIsloading] = useState(false);
    const actions = (item)=> [
            <EditFilled key="edit" style={{ color: 'gray' ,fontSize:"20px" }} onClick={openEditModal(item)} />,
            <CheckCircleOutlined key="check" style={{ color: 'green' ,fontSize:"20px" }} onClick={handleComplete(item)}  />,
            <Popconfirm
                title="Delete Task"
                description="Are you sure to delete this Todo?"
                onConfirm={handleDelete(item)}
                onCancel={()=>{}}
                okText="Yes"
                cancelText="No"
            >
                <DeleteFilled key="delete" style={{ color: 'red' ,fontSize:"20px" }}  />
                {/* onClick={openDeleteConfirmPopup(item)} */}
            </Popconfirm>
    ]

    const addTodo = useCallback(() => {
        if (todo !== "" && todo.trim() !== "") {
            let newTodo = { name: todo, id: todolist.length + 1 }
            setTodolist((prev)=>[...prev, newTodo])
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

    const openEditModal = useCallback((item) => () => {
        setIsloading(true)
        setTimeout(() => {
            setEdittodo((prev) => item) 
            setIsModalVisible(true)
            setIsloading(false)
        }, 1000);
    })

    const handleComplete = useCallback((item) => () => {
        let completedtodo = item
    })

    const handleDelete =useCallback((item) => () => {
        let todos = todolist
        let index = todos.findIndex((todo) => todo.id === item.id)
        if(index == -1){
            messageApi.open({
                type: 'error',  
                content: 'Todo not found',
            })
        }else{
            todos.splice(index, 1)
            setTodolist((prev) => [...todos])
            messageApi.open({
                type: 'success',
                content: 'Todo Deleted successfully',
            }) 
        }
    })

    const handleEdit = useCallback(() => {
        let todos = todolist
        if (edittodo.name == "" || edittodo.name.trim() == "") {
            messageApi.open({
                type: 'error',
                content: 'Please enter a todo',
            });
            return 
        }
        let index = todos.findIndex((todo) => todo.id === edittodo.id)
        if(index == -1){
            messageApi.open({
                type: 'error',  
                content: 'Todo not found',
            })
        }else{
            todos.splice(index, 1, edittodo)
            setTodolist((prev) => todos)
            messageApi.open({
                type: 'success',
                content: 'Todo Edited successfully',
            })        
        }
        setIsModalVisible((prev) => false)
    })
    
  return (
    <div className='mx-4 sm:mx-20'>
        {contextHolder}
        <Spin spinning={isloading} tip="Loading..." fullscreen />
        <h1 className='text-center font-medium  text-2xl lg:text-3xl my-2'>
            To-Do List
        </h1>
        <div className='flex justify-center items-center my-2'>
            <TextArea autoSize placeholder="Enter todo" value={todo} onChange={(e) => setTodo(e.target.value)} />
            <Button className='ml-2' onClick={addTodo}>Add Todo</Button>
        </div>
        {todolist.length == 0 ? (
            <>
                <div className='my-2 flex justify-center items-center h-[80vh]'>
                    <Empty description="No to-dos found. Try adding a new one" className='font-normal text-xl ' />
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

        {/* edit modal */}
        <Modal title="Update Todo" open={isModalVisible} onOk={handleEdit} onCancel={() => setIsModalVisible((prev) => (false))}>
            <TextArea value={edittodo.name} onChange={(e) => setEdittodo((prev) => ({...prev, name: e.target.value}))} />
        </Modal>

        


    </div>
  )
}

export default Todo