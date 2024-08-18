import React, { useState, useEffect } from "react";

const titleStyles = {
    fontFamily: 'Montserrat, sans-serif',
}

const ToDoList = () => {

    const [todos, setTodos] = useState([]);

    let defaultTodos = [
        {
            "label": "Click on the top left button",
            "is_done": false,

        },
        {
            "label": "Coding",
            "is_done": false,

        },
        {
            "label": "Walk the dog",
            "is_done": false,

        }
    ]

function createUser() {
    console.log("CreateUser function running")
    fetch("https://playground.4geeks.com/todo/users", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            console.log(`There was an error ${response.status} in the request`);
        }
    })
    .then(data => {
        if (data && data.users) {
            const userExists = data.users.find(user => user.name === "davinia");
            if (!userExists) {
                // Usuario no encontrado, crear usuario
                return fetch('https://playground.4geeks.com/todo/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: 'davinia' })
                })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log("User created successfully");
                        // Añadir las tareas de inicio
                        return fetch('https://playground.4geeks.com/todo/todos', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(defaultTodos)
                        });
                    } else {
                        console.log(`There was an error ${response.status} in the request`);
                    }
                })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log("Default tasks added successfully");
                        return getTodos(); 
                    } else {
                        console.log(`There was an error ${response.status} in the request`);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            } else {
                console.log("User already exists");
                return getTodos(); 
            }
        }
    })
    .catch(error => {
        console.log(error);
    });
}

useEffect(() => {
    console.log("Verifying user existence and fetching to do's");
    createUser();
}, []);


    function getTodos() {
        console.log("GetTodos function running")
        fetch('https://playground.4geeks.com/todo/users/davinia')
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    console.log("The request worked successfully");
                    return response.json();
                } else {
                    console.log(`There was an error ${response.status} in the request`)
                }
            })
            .then(data => {
                console.log(data.todos)
                setTodos(data.todos);
            })
            .catch(error => {
                console.log(error);
            });
    }



    function addTask(newTask,id) {
        console.log("Adding task:", newTask); // Verificar los datos que se envían
        fetch('https://playground.4geeks.com/todo/users/davinia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    console.log("Task added successfully");
                    return response.json();
                } else {
                    console.log(`There was an error ${response.status} in the request`);
                }
            })
            .then(() => {
                setTodos(prevTodos => [...prevTodos, newTask]);
            })
            .catch(error => {
                console.log(error);
            });
    }


    function handleKeyPress(e) {
        if (e.keyCode === 13 && e.target.value.trim() !== '') {
            const newTask = {
                label: e.target.value,
                is_done: false,
                id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1
            };
            addTask(newTask);
            e.target.value = '';
        }
    }

    function send(e) {
        e.preventDefault();
        const input = e.target.querySelector('input');
        if (input.value.trim() !== '') {
            const newTask = {
                label: input.value,
                is_done: false,
                id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1
            };
            addTask(newTask);
            input.value = '';
        }
    }

    function deleteTask(taskId) {
        const previousTodos = [...todos];

        setTodos(prevTodos => prevTodos.filter(task => task.id !== taskId));

        return fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                console.log("Task deleted successfully");
            } else {
                console.log(`There was an error ${response.status} in the request`);
                setTodos(previousTodos);
                alert("Error deleting task. Please try again.");
            }
        })
        .catch(error => {
            console.log(error);
            setTodos(previousTodos);
            alert("Error deleting task. Please try again.");
        });
    }


    return (
        <>
            <div className="backgroundTodoList">
                <div className="card ms-4 pt-2" id="cardToDo">
                    <h1 className="text-center mt-5 mb-3" id="titleToDo" style={titleStyles}>To Do List</h1>
                    <form className="mx-auto w-75" onSubmit={send} id="formToDo">
                        <input
                            className="form-control form-control-lg w-100 mx-auto"
                            type="text"
                            placeholder="What would you regret doing?"
                            aria-label="To do item"
                            id="inputToDo"
                            onKeyDown={handleKeyPress}
                        />

                        <ul className="list-group w-100 mx-auto" id="groupToDo">
                            {todos.length === 0 && (
                                <div className="alert alert-danger d-flex align-items-center mt-3 w-75 mx-auto" role="alert">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <div className="ms-1">
                                        No hay tareas, añadir tareas
                                    </div>
                                </div>
                            )}

                            {todos.map((todoTask, index) => (
                                <label className="list-group-item d-flex gap-2 rounded-0" key={index} id="rowItemToDo">
                                    <span className={`item ${todoTask.checked ? 'checked' : ''}`} id="itemToDo">
                                        {todoTask.label}
                                    </span>
                                    <button
                                        type="button"
                                        className="fa-solid fa-xmark ms-auto btn bg-transparent border-0 p-2 lh-1"
                                        id="trashToDo"
                                        aria-hidden="true"
                                        onClick={() => {
                                            setTodos(todos.filter(item => item !== todoTask));
                                        }}
                                    />

                                    {/* <button
                                        type="button"
                                        className="fa-solid fa-xmark ms-auto btn bg-transparent border-0 p-2 lh-1"
                                        id="trashToDo"
                                        aria-hidden="true"
                                        onClick={() => deleteTask(todoTask.id)}
                                    /> */}
                                </label>
                            ))}
                        </ul>
                        <footer className=" d-flex flex-wrap border-top w-100 mx-auto" id="footerToDo">
                            <span className="mb-3 mb-md-0 text-body-secondary opacity-75">To do total: {todos.length} </span>
                        </footer>
                    </form>
                </div>
            </div>
        </>
    )
};

export default ToDoList;