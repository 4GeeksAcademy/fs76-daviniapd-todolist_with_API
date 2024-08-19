import React, { useState, useEffect } from "react";

const titleStyles = {
    fontFamily: 'Montserrat, sans-serif',
}

const ToDoList = () => {

    const [todos, setTodos] = useState([]);

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

    useEffect(() => {
        console.log("Verifying user existence and fetching to do's");
        getTodos();
    }, []);

    function addTask(newTask) {
        console.log("Adding task:", newTask);
        fetch('https://playground.4geeks.com/todo/todos/davinia', {
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
                                <div className="list-group-item d-flex justify-content-between gap-2 rounded-0" key={index} id="rowItemToDo">
                                    <span id="itemToDo">
                                        {todoTask.label}
                                    </span>
                                    <button
                                        type="button"
                                        className="fa-solid fa-xmark btn bg-transparent border-0 p-2 lh-1"
                                        id="trashToDo"
                                        aria-hidden="true"
                                        onClick={() => {
                                            deleteTask(todoTask.id)}
                                        }
                                    />
                                </div>
                            ))}
                        </ul>
                        <footer className=" d-flex flex-wrap border-top d-flex justify-content-between  w-100 mx-auto" id="footerToDo">
                            <span className="mb-3 mb-md-0 text-body-secondary opacity-75">To do total: {todos.length} </span>
                            <button type="button" className="btn btn-danger" onClick={clearAllTasks}>Clear all tasks</button>
                        </footer>
                    </form>
                </div>
            </div>
        </>
    )
};

export default ToDoList;