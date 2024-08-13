import React, { useState } from "react";

const NotToDoList = () => {

    const [listItems, setListItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && newItem.trim() !== '') {
          setListItems(listItems.concat([{ text: newItem, checked: false }]));
          setNewItem('');
        }
    };

    const handleCheckboxChange = (index) => {
        const newListItems = listItems.slice();
        newListItems[index].checked = !newListItems[index].checked;
        setListItems(newListItems);
    };

    return (
        <>

            <h1 className="text-center m-5">Not To Do List</h1>
            <input
                className="form-control form-control-lg w-50 mx-auto"
                type="text"
                placeholder="What would you regret doing?"
                aria-label="Not to do item"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyUp={handleKeyPress}
            />
            <ul className="w-50 mx-auto my-5 bg-warning bg-opacity-50 p-5">
                <div className="list-group">
                    {listItems.length === 0 && (
                        <h4 className="text-center text-danger">Your list is empty, I can't believe you have no regrets.</h4>
                    )}
                    {listItems.map((listItem, index) => (

                        <label className="list-group-item d-flex gap-2" key={index}>
                            <input
                                className="form-check-input flex-shrink-0"
                                type="checkbox"
                                checked={listItem.checked}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <span>{listItem.text}</span>
                        </label>


                    ))}
                </div>
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <div className="col-md-4 d-flex align-items-center">
                        <a href="/" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                            <svg className="bi" width="30" height="24"></svg>
                        </a>
                        <span className="mb-3 mb-md-0 text-body-secondary opacity-75">{listItems.length} don't do it</span>
                    </div>
                </footer>
            </ul>



        </>
    )
};

export default NotToDoList;