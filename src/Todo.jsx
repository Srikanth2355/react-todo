import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Empty,message, Card, Modal, Popconfirm, Spin ,Divider     } from 'antd';
import {  DeleteFilled, EditFilled , CheckCircleOutlined } from '@ant-design/icons';
import moment from "moment";
import  useLocalStorage  from './localStoragehook';
import { v4 as uuidv4 } from 'uuid';
import Confetti from 'react-confetti';
import DOMPurify from 'dompurify';

function Todo() {
    const { TextArea } = Input;
    const [todo, setTodo] = useState("")
    const [todolist, setTodolist] = useLocalStorage("tododata", [])
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [edittodo, setEdittodo] = useState({});
    const [isloading, setIsloading] = useState(false);
    const [showcelebration, setShowcelebration] = useState(false);
    const [confettipieces, setConfettipieces] = useState(500);
    
    const emojiRegex = /[\p{Emoji_Presentation}\u200D\u2640-\u2642\u2694-\u26A1\u2600-\u26FF\u2700-\u27BF\u2300-\u23FF]/gu;
    const addTodo = useCallback(() => {
        if (emojiRegex.test(todo)) {
            messageApi.open({
                type: 'error',
                content: 'Emojis/Icons are not allowed',
            });
            return;
        }
        const sanitizedTodo = DOMPurify.sanitize(todo,{ USE_PROFILES: { html: true } });
        
        if(sanitizedTodo !== todo){
            messageApi.open({
                type: 'error',
                content: 'Malicious content detected! Please enter safe text.',
            });
            setTodo((prev) => "");
            return 
        }

        if (todo !== "" && todo.trim() !== "" ) {
            let newTodo = { 
                todo: todo, 
                id: uuidv4(), 
                createdAt: new Date(), 
                completed: false, 
                completedAt: '' 
            }
            setTodolist((prev)=>[newTodo,...prev])
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
        setTodo("");
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
        let todos = [...todolist]
        let index = todos.findIndex((todo) => todo.id === item.id)
        if(index == -1 ){
            messageApi.open({
                type: 'error',  
                content: 'Todo not found',
            })
        }else if(todos[index].completed){
            messageApi.open({
                type: 'error',  
                content: 'Todo already completed',
            })
        }else{
            todos[index].completed = true
            todos[index].completedAt = todos[index].completed ? new Date() : ''
            setTodolist((prev) => [...todos])
            messageApi.open({
                type: 'success',
                content: 'Great job! Another step closer to your goals!',
            })
            setShowcelebration((prev) => true)
            setConfettipieces((prev)=> 500)
            
            const interval = setInterval(() => {
                setConfettipieces((prev) => {
                  if (prev > 0) {
                    return prev - 50; // Decrease particles gradually
                  } else {
                    clearInterval(interval); // Stop reducing when it reaches 0
                    setShowcelebration((prev) => false); // Hide confetti completely
                    return 0;
                  }
                });
              }, 500);
        }
    })

    const handleDelete =useCallback((item) => () => {
        let todos = [...todolist]
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
        let todos = [...todolist]
        if (emojiRegex.test(edittodo.todo)) {
            messageApi.open({
                type: 'error',
                content: 'Emojis/Icons are not allowed',
            });
            return;
        }
        const sanitizedTodo = DOMPurify.sanitize(edittodo.todo,{ USE_PROFILES: { html: true } });
        
        if(sanitizedTodo !== edittodo.todo){
            messageApi.open({
                type: 'error',
                content: 'Malicious content detected! Please enter safe text.',
            });
            setEdittodo((prev) => ({}))
            setIsModalVisible((prev) => false)
            return 
        }
        if (edittodo.todo == "" || edittodo.todo.trim() == "") {
            messageApi.open({
                type: 'error',
                content: 'Please enter a todo',
            });
            setEdittodo((prev) => ({...prev,todo:""}))
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

    const DeleteCompletedTodos = useCallback(() => {
        const entireTodosinfo = todolist.reduce((acc,item)=>{
            if(item.completed){
                acc.found = true
            }else{
                acc.filtered.push({...item})
            }
            return acc

        },{found:false,filtered:[]})

        if(!entireTodosinfo.found){
            messageApi.open({
                type: 'error',  
                content: 'No completed todos found',
            })
        }else{
            setTodolist((prev) => [...entireTodosinfo.filtered])
            messageApi.open({
                type: 'success',  
                content: 'All Completed todos deleted',
            })
        }
            
    })
    
  return (
    <div className='mx-4 sm:mx-20'>
        {contextHolder}
        {showcelebration ? <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            tweenDuration={3000}
            gravity={0.3}
            numberOfPieces={confettipieces}
        /> : null }
        <Spin spinning={isloading} tip="Loading..." fullscreen />
        <h1 className='text-center font-medium  text-2xl lg:text-3xl my-2'>
            To-Do List
        </h1>
        <div className='flex justify-center items-center my-2 flex-col md:flex-row'>
            {/* md:w-[45%] */}
            <TextArea 
                allowClear autoSize = {{maxRows: 10}} placeholder="Enter todo" className='w-full lg:w-[60%] clearicon relative' style={{paddingRight:'30px'}} value={todo} onChange={(e) => setTodo(e.target.value)} />
            <div className='mt-3 md:mt-0   lg:w-[40%] flex justify-end'>
                {/* md:w-[55%] */}
                <Button className='md:ml-2' onClick={addTodo}>Add Todo</Button>
                <Button danger className='ml-2' onClick={ DeleteCompletedTodos}>
                    Delete Completed Todos
                </Button>
            </div>
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
                     className='pt-3  cutomcard relative'
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
                                    <EditFilled key="edit" style={{ color: 'gray' ,fontSize:"20px" }} onClick={item.completed?()=>{}:openEditModal(item)} />
                                    <Divider type="vertical" style={{ height: "30px" }} />
                                    <CheckCircleOutlined key="check" style={{ color: 'green' ,fontSize:"20px" }} onClick={item.completed?()=>{}:handleComplete(item)}  />
                                    <Divider type="vertical" style={{ height: "30px" }} />
                                    
                                    {
                                        !item.completed?(
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
                                        ):(
                                            <DeleteFilled key="delete"  style={{ color: 'red' ,fontSize:"20px" }}  />
                                        )
                                    } 
                                </div>
                            </div>
                        </div>
                        {item.completed?(
                            <div className='absolute right-0 bottom-0 top-0 left-0 bg-[#F7F7F7] opacity-50 w-full h-full flex justify-center items-center text-green-700 font-semibold text-3xl '>
                               <p className='transform -rotate-45'>Completed</p> 
                            </div>
                        ):(null)}
                    </Card>
                ))}
            </div>
        )}

        {/* edit modal */}
        <Modal maskClosable={false} centered={true} title="Update Todo" open={isModalVisible} onOk={handleEdit} onCancel={() => setIsModalVisible((prev) => (false))}>
            <TextArea allowClear autoSize = {{maxRows: 10}} value={edittodo.todo} className='clearicon relative ' style={{paddingRight:'30px'}} onChange={(e) => setEdittodo((prev) => ({...prev, todo: e.target.value}))} />
        </Modal>

        


    </div>
  )
}

export default Todo