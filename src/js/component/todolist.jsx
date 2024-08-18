import React, { useState, useEffect } from "react";


const titleStyles = {
    fontFamily: 'Montserrat, sans-serif',
}

const ToDoList = () => {

    const [todos, setTodos] = useState([]);
    const [newItem, setNewItem] = useState('');


    function handleKeyPress(e) {
        if (e.keyCode === 13 && newItem.trim() !== '') {
            setTodos([...todos, { text: newItem, checked: false }]);
            setNewItem('');
        }
    };

    function send(e) {
        e.preventDefault();
        console.log("Reminder ‘not to do’ added correctly");

    }


    function getTodos() {
        console.log("esta es la funcion getTodos")
        fetch('https://playground.4geeks.com/todo/users/daviniapd')

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
        console.log("Items List Change")
        getTodos()
    }, []);



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
                            value={newItem}
                            id="inputToDo"
                            onChange={(e) => setNewItem(e.target.value)}
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

                            {todos.map((todoTask) => (

                                <label className="list-group-item d-flex gap-2 rounded-0" key={todoTask.id} id="rowItemToDo">
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