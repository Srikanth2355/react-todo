import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Empty,message, Card, Modal, Popconfirm, Spin ,Divider     } from 'antd';
import {  DeleteFilled, EditFilled , CheckCircleOutlined } from '@ant-design/icons';
import moment from "moment";

function Todo() {
    const { TextArea } = Input;
    const [todo, setTodo] = useState("")
    const [todolist, setTodolist] = useState([
        {
            id:1,
            todo:"todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1 todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1 todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1 todo1 todo1 todo1 todo1todo1 todo1 todo1 todo1",
            createdAt:new Date(),
            completed:false,
            completedAt:'',
        },
        {
            id:2,
            todo:"todo2",
            createdAt:new Date(),
            completed:true,
            completedAt:new Date(),
        }])
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [edittodo, setEdittodo] = useState({});
    const [isloading, setIsloading] = useState(false);
   

    const addTodo = useCallback(() => {
        if (todo !== "" && todo.trim() !== "") {
            let newTodo = { todo: todo, id: todolist.length + 1, createdAt: new Date(), comleted: false, completedAt: '' }
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
        }, 500);
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
        if (edittodo.todo == "" || edittodo.todo.trim() == "") {
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
                     className='pt-3  cutomcard'
                     hoverable={true}
                     >
                        <div className='flex flex-col justify-between h-full'>
                            <p className='text-justify px-6'>{item.todo}</p>
                            <div>
                                <div className='flex flex-col my-2 px-6'>
                                    <p className=' '> <span className='font-semibold'>CreatedAt : </span>{moment(item.createdAt).format("MMM D YYYY, h:mm A")}</p>
                                    {item.completed?(
                                        <p className=''><span className='font-semibold'>CompletedAt : </span>{moment(item.completedAt).format("MMM D YYYY, h:mm A")}</p>):('')
                                    }
                                </div>
                                <div className='flex justify-around py-2' style={{borderTopColor:"#0505050f",borderTopWidth:"1px"}}>
                                    <EditFilled key="edit" style={{ color: 'gray' ,fontSize:"20px" }} onClick={openEditModal(item)} />
                                    <Divider type="vertical" style={{ height: "30px" }} />
                                    <CheckCircleOutlined key="check" style={{ color: 'green' ,fontSize:"20px" }} onClick={handleComplete(item)}  />
                                    <Divider type="vertical" style={{ height: "30px" }} />
                                    
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

                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        )}

        {/* edit modal */}
        <Modal title="Update Todo" open={isModalVisible} onOk={handleEdit} onCancel={() => setIsModalVisible((prev) => (false))}>
            <TextArea value={edittodo.todo} onChange={(e) => setEdittodo((prev) => ({...prev, todo: e.target.value}))} />
        </Modal>

        


    </div>
  )
}

export default Todo