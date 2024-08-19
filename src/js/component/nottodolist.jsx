import React, { useState } from "react";
import "/src/styles/index.css";

const titleStyles = {
    fontFamily: 'Montserrat, sans-serif',
}


const NotToDoList = () => {

    const [listItems, setListItems] = useState([
        { text: "Eating cheetos before coding", completed: false },
        { text: "Text while walking", completed: false },
        { text: "Mix up salt and", completed: false }]);

    const [newItem, setNewItem] = useState('');

    function handleKeyPress(e) {
        if (e.keyCode === 13 && newItem.trim() !== '') {
            setListItems([...listItems, { text: newItem, checked: false }]);
            setNewItem('');
        }
    };

    function handleCheckboxChange(index) {
        const newListItems = listItems.slice();
        newListItems[index].checked = !newListItems[index].checked;
        setListItems(newListItems);
    };

    function send(e) {
        e.preventDefault();
        console.log("Reminder ‘not to do’ added correctly");

    }

    return (
        <>
            <div className="backgroundNotToDo">
                <div className="card ms-4 pt-2" id="cardNotToDo">
                    <h1 className="text-center mt-5 mb-3 fs-2" style={titleStyles}>Not To Do List</h1>
                    <form onSubmit={send}>
                        <input
                            className="form-control form-control-lg w-75 mx-auto"
                            type="text"
                            placeholder="What would you regret doing?"
                            aria-label="Not to do item"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <div className="mx-auto my-3 bg-opacity-50 px-3 pt-3 pb-1" id="posItNotToDo">
                            <ul className="list-group" id="listNotToDo">
                                {listItems.length === 0 && (
                                    <div className="alert alert-danger d-flex align-items-center text-center mt-3" role="alert">
                                    <i className="fa-solid fa-triangle-exclamation fs-2"></i>
                                    <div className="ms-1">
                                    Your list is empty, I can't believe you have no regrets.
                                    </div>
                                </div>
                                )}

                                {listItems.map((listItem, index) => (

                                    <div className="list-group-item d-flex gap-2" key={index}>
                                        <input
                                            className="form-check-input flex-shrink-0"
                                            type="checkbox"
                                            checked={listItem.checked}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                        <span className={`item ${listItem.checked ? 'checked' : ''}`}>
                                            {listItem.text}
                                        </span>
                                        <button
                                            type="button"
                                            className="fa-solid fa-trash-can ms-auto btn text-secondary p-2 lh-1"
                                            aria-hidden="true"
                                            onClick={() => {
                                                setListItems(listItems.filter(item => item !== listItem));
                                            }}
                                        />
                                    </div>
                                ))}
                            </ul>

                            <footer className=" d-flex flex-wrap justify-content-center pb-1 border-top" id="footerNotToDo">
                                <span className="mb-3 mb-md-0 text-body-secondary opacity-75">Don't do it total: {listItems.length} </span>
                            </footer>

                        </div>
                    </form>
                </div>
            </div>
        </>
    )
};

export default NotToDoList;