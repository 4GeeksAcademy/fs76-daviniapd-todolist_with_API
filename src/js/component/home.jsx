import React, { useState }  from "react";
import ToDoList from "./todolist";
import NotToDoList from "./nottodolist";
import ButtonChangeDesign from "./buttonChangeDesign";


const Home = () => {
	const [showNotToDoList, setShowNotToDoList] = useState(false);
	const toggleDesigns = () => {
		setShowNotToDoList(!showNotToDoList);
	}
	return (
		<>
			{/* < ButtonChangeDesign
				showNotToDoList={showNotToDoList}
				toggleDesigns={toggleDesigns}
			/>

			{!showNotToDoList && ( */}
					<ToDoList />
			{/* )}

			{showNotToDoList && (
					<NotToDoList />
			)} */}

		</>

	);
};

export default Home;
