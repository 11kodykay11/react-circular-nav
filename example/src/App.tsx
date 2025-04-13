import React, { Fragment, useCallback, useState } from "react";
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	Typography,
	Card,
	Switch,
	Box
} from "@mui/material";

// import {makeStyles} from "@mui/material/styles";

import Navigation from "react-circular-nav";
import { MenuPosition } from "../../dist/Navigation";
import { ChromePicker } from "react-color";

const useStyles = () => ({
	card: {
		display: "inline-block",
		flex: "1 1 auto",
		position: "absolute",
		top: "50%",
		left: "50%",
		transformOrigin: "center",
		transform: "translate(-50%, -50%)",
		padding: 2,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		overflow: "visible"
	},
	backgroundText: {
		position: "absolute",
		top: "10%",
		transform: "translate(calc(50vw - 50%), -50%)",
		transition: "all 0s",
		zIndex: -1,
		overflow: "hidden",
		fontSize: "8em",
		fontFamily: "Courier New",
		background: "-webkit-linear-gradient(360deg, #8b49ff, #ffca57)",
		"-webkit-background-clip": "text",
		"-webkit-text-fill-color": "transparent"
	}
});

const PositionRadio = ({ selected, onRadioSelect }: any) => {
	return (
		<FormControl component="div" style={{ margin: 10 }}>
			<FormLabel component="legend">Menu Position</FormLabel>
			<RadioGroup name="position" value={selected} onChange={onRadioSelect}>
				<FormControlLabel value="top" control={<Radio />} label="Top" />
				<FormControlLabel value="bottom" control={<Radio />} label="Bottom" />
				<FormControlLabel value="right" control={<Radio />} label="Right" />
				<FormControlLabel value="left" control={<Radio />} label="Left" />
				<FormControlLabel value="center" control={<Radio />} label="Center" />
			</RadioGroup>
		</FormControl>
	);
};

const ColorPicker = ({ label, color, onChange }: any) => {
	const [openCPicker, setOpenColorPicker] = useState(false);
	return (
		<div onClick={() => setOpenColorPicker((prev) => !prev)} style={{ margin: 5 }}>
			{label}
			<span
				style={{
					backgroundColor: color,
					width: "5.5em",
					height: "2em",
					display: "block"
				}}
			></span>
			{openCPicker && (
				<div style={{ position: "absolute" }}>
					<ChromePicker color={color} onChangeComplete={onChange} />
				</div>
			)}
		</div>
	);
};

const OnOffSwitch = ({ label, checked, onChange, disabled = false }: any) => {
	return (
		<Typography component="div" style={{ margin: 5 }}>
			{label}
			<Grid
				component="div"
				container
				alignItems="center"
				spacing={1}
				style={{ flexWrap: "nowrap" }}
			>
				<Grid>Off</Grid>
				<Grid>
					<Switch
						checked={checked}
						onChange={onChange}
						name="checked"
						color="primary"
						style={{ position: "absolute", padding: 9 }}
						disabled={disabled}
					/>
				</Grid>
				<Grid>On</Grid>
			</Grid>
		</Typography>
	);
};

let isColorSwitched = false;

const App = () => {
	const sx = useStyles();

	const [clickOpen, setClickOpen] = useState(false);
	const [flipHorizontal, setFlipHorizontal] = useState(false);
	const [flipVertical, setFlipVertical] = useState(false);
	const [position, setPosition] = useState<MenuPosition>("bottom");
	const [buttonColor, setButtonColor] = useState("#8b49ff");
	const [menuColor, setMenuColor] = useState("#ffca57");

	const onPositionSelected = useCallback(
		(position: any) => {
			setPosition(position);
			// Switch the color back to what they were
			if (isColorSwitched) {
				isColorSwitched = false;
				let t = menuColor;
				setMenuColor(buttonColor);
				setButtonColor(t);
				return;
			}
			// Switch the color if right position is selected so that menu button is visible
			if (position === "right") {
				isColorSwitched = true;
				let t = buttonColor;
				setButtonColor(menuColor);
				setMenuColor(t);
			}
		},
		[menuColor, buttonColor, position]
	);

	return (
		<Fragment>
			<Box sx={sx.backgroundText}>react-circular-nav</Box>
			<Card sx={sx.card} style={position === "center" ? { left: "11%" } : {}}>
				<Grid container direction="row">
					<Grid direction="column">
						<OnOffSwitch
							label="Click to Open/Close"
							checked={clickOpen}
							onChange={() => setClickOpen((prev) => !prev)}
						/>
						<OnOffSwitch
							label="Flip Label Horizontal"
							checked={flipHorizontal}
							onChange={() => setFlipHorizontal((prev) => !prev)}
							disabled={flipVertical}
						/>
						<OnOffSwitch
							label="Flip Label Vertical"
							checked={flipVertical}
							onChange={() => setFlipVertical((prev) => !prev)}
						/>
					</Grid>
					<Grid style={{ marginLeft: 25 }}>
						<PositionRadio
							selected={position}
							onRadioSelect={(e: any) => onPositionSelected(e.target.value)}
						/>
						<Grid direction="row">
							<ColorPicker
								label="Button Color"
								color={buttonColor}
								onChange={(color: any) => setButtonColor(color.hex)}
							/>
							<ColorPicker
								label="Menu Color"
								color={menuColor}
								onChange={(color: any) => setMenuColor(color.hex)}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Card>
			<Navigation
				menuPosition={position}
				clickOpenClose={clickOpen}
				buttonColor={buttonColor}
				menuColor={menuColor}
				flipLableVertical={flipVertical}
				flipLableHorizontal={flipHorizontal}
				menuItems={[
					{
						id: "item1",
						label: "Item 1",
						onClick: () => alert("Menu Item 1 clicked")
						// activeColor: "red",
						// color: "grey"
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
			/>
		</Fragment>
	);
};

export default App;
