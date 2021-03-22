import React from "react";

import Navigation from "react-circular-nav";
import "react-circular-nav/dist/index.css";

const App = () => {
	return (
		<Navigation
			menuPosition="bottom"
			menuItems={[
				{
					id: "item1",
					label: "Item 1",
					onClick: () => alert("Menu Item 1 clicked"),
					activeColor: "red",
					color: "grey"
				},
				{
					id: "item2",
					label: "Item 2",
					onClick: () => alert("Menu Item 2 clicked")
				},
				{
					id: "item3",
					label: "Item 3",
					onClick: () => alert("Menu Item 3 clicked")
				}
			]}
			clickOpen={false}
		/>
	);
};

export default App;
