import React, { useState, useEffect } from "react";

const titleStyles = {
    fontFamily: 'Montserrat, sans-serif',
}

const ToDoList = () => {
    const [todos, setTodos] = useState([]);
    const [userName, setUserName] = useState("");
    const [error, setError] = useState(null);

    const urlUserName = `https://playground.4geeks.com/todo/users/${userName}`;
    const urlTodos = `https://playground.4geeks.com/todo/todos/${userName}`;

    const handleCreateUser = () => {
        if (userName) {
            fetch(urlUserName)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else if (response.status === 404) {
                        return fetch(urlUserName, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: userName,
                                todos: []
                            }),
                        }).then(response => {
                            if (!response.ok) {
                                throw new Error('Error en la creación del usuario');
                            }
                            return response.json();
                        });
                    } else {
                        throw new Error('Error al verificar el usuario');
                    }
                })
                .then(data => {
                    setUserName(data.name);
                    console.log("User created successfully:", data.name);
                    return fetch('https://playground.4geeks.com/todo/users');
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error bringing up the user list');
                    }
                    return response.json();
                })
                .then(() => {
                    getTodos();
                  })
                .catch(error => {
                    setError(error.message);
                    console.error("Error:", error.message);
                });
            }}


        useEffect(() => {
            console.log("Verifying user existence and fetching to do's");
            // handleCreateUser();
        }, []);

        function getTodos() {
            console.log("GetTodos function running")
            fetch(urlTodos)
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


        function addTask(newTask) {
            console.log("Adding task:", newTask);
            fetch(urlTodos, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            })
                .then(response => response.json())
                .then((data) => {
                    setTodos(prevTodos => [...prevTodos, data]);
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

        function handleCheckboxChange(index) {
            const newTodos = todos.slice();
            newTodos[index].is_done = !newTodos[index].is_done;
            setTodos(newTodos);

            // Actualiza la tarea en la API
            fetch(`https://playground.4geeks.com/todo/todos/${newTodos[index].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodos[index])
            })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(`Tarea ${newTodos[index].id} actualizada con éxito`);
                    } else {
                        console.log(`Error actualizando tarea ${newTodos[index].id}`);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }


        function deleteTask(taskId) {
            return fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log("Task deleted successfully");
                        setTodos(prevTodos => prevTodos.filter(task => task.id !== taskId));
                    } else {
                        alert("Error deleting task. Please try again.");
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert("Error deleting task. Please try again.");
                });
        }

        function clearAllTasks() {

            setTodos([]);

            todos.forEach((task) => {
                fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.status >= 200 && response.status < 300) {
                            console.log(`Task ${task.id} deleted successfully`);
                        } else {
                            console.log(`Error deleting task ${task.id}`);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
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
                                    <div className="list-group-item d-flex gap-2 rounded-0" key={index} id="rowItemToDo">
                                        <input
                                            className="form-check-input flex-shrink-0"
                                            type="checkbox"
                                            checked={todoTask.is_done}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                        <span className={`item ${todoTask.is_done ? 'is-done' : ''}`} id="itemToDo">
                                            {todoTask.label}
                                        </span>
                                        <button
                                            type="button"
                                            className="fa-solid fa-xmark btn bg-transparent border-0 my-auto"
                                            id="trashToDo"
                                            aria-hidden="true"
                                            onClick={() => {
                                                deleteTask(todoTask.id)
                                            }
                                            }
                                        />
                                    </div>
                                ))}
                            </ul>
                            <footer className=" d-flex flex-wrap border-top d-flex justify-content-between align-items-center w-100 mx-auto" id="footerToDo">
                                <span className="mb-3 mb-md-0 text-body-secondary opacity-75">To do total: {todos.length} </span>
                                <button type="button" className="btn btn-danger opacity-75" onClick={clearAllTasks}>Delete All</button>
                            </footer>
                        </form>
                        <input
                            className="form-control form-control-lg w-100 mx-auto mt-5"
                            type="text"
                            placeholder="Your User Name"
                            aria-label="User Name Item"
                            id="inputUserName"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleCreateUser();
                                }
                              }}
                        />
                        <button type="button" className="btn btn-success opacity-75" onClick={() => handleCreateUser()}>Go User</button>

                    </div>
                </div>
            </>
        )
    };

    export default ToDoList;