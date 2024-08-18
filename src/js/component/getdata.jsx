import React, { useState, useEffect } from "react";

//Componente para probar el funcionamiento del api antes de usarlo en la ToDoList

const GetData = () => {


    const [todos, setTodos] = useState([]);

    function getTodos() {
        console.log("esta es la funcion getTodos")
        fetch('https://playground.4geeks.com/todo/users/daviniapd')
        // fetch('https://playground.4geeks.com/todo/users/daviniapd', {
        //     method: "POST",
        //     body: JSON.stringify(),
        //     headers: {
        //       "Content-Type": "application/json"
        //     }
        //   })

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
            <h1>toDos</h1>
            {todos.map((todoTask) => <p key={todoTask.id}> {todoTask.label} </p>)}

        </>

    )
};


export default GetData;