import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";

const primaryColor = () => (props: any) => props.primaryColor;
const secondaryColor = () => (props: any) => props.secondaryColor;
const hoverColor = () => (props: any) => props.hoverColor || props.primaryColor;
const centerAngle = (isFullCircle, itemCount) => (isFullCircle ? 360 : 180) / itemCount;
const getPositionAngle = (p) => (p === "right" ? -90 : p === "left" ? 90 : p === "top" ? -180 : 0);

const useStyles = makeStyles({
	root: {
		position: "absolute",
		width: "100vw",
		height: "100vh",
		top: 0,
		left: 0
	},
	button: {
		border: "none",
		background: "none",
		color: "white",
		textAlign: "center",
		fontSize: "1.5em",
		height: "5em",
		width: "5em",
		backgroundColor: primaryColor(),
		position: "fixed",
		borderRadius: "50%",
		cursor: "pointer",
		zIndex: 11,
		outline: "none"
	},
	buttonBottom: {
		left: "50%",
		paddingBottom: "1em",
		bottom: "-2.5em",
		marginLeft: "-2.5em"
	},
	buttonLeft: {
		top: "50%",
		paddingLeft: "1em",
		marginTop: "-2.5em",
		marginLeft: "-2.5em"
	},
	buttonRight: {
		top: "50%",
		paddingRight: "1em",
		marginTop: "-2.5em",
		right: "-2.5em"
	},
	buttonTop: {
		left: "50%",
		paddingTop: "1em",
		marginLeft: "-2.5em",
		top: "-2.5em"
	},
	buttonCenter: {
		left: "50%",
		top: "50%",
		marginLeft: "-2.5em",
		marginTop: "-2.5em"
	},
	li: {
		position: "absolute",
		width: "10em",
		height: "10em",
		transformOrigin: "100% 100%",
		overflow: "hidden",
		transition: "border .3s ease, background-color .3s ease",
		display: "block",
		backgroundColor: secondaryColor(),
		"&:hover": {
			backgroundColor: hoverColor()
		}
	},
	wrapper: {
		position: "fixed",
		fontSize: "1.5em",
		width: "20em",
		height: "20em",
		overflow: "hidden",
		transition: "all .3s ease",
		borderRadius: "50%",
		transform: "scale(0)",
		zIndex: 10,
		pointerEvents: "auto",
		cursor: "pointer"
	},
	wVertCenter: { top: "50%", marginTop: "-10em" },
	wHoriCenter: { left: "50%", marginLeft: "-10em" },
	wLeft: { left: "-10em" },
	wRight: { right: "-10em" },
	wBottom: { bottom: "-10em" },
	wTop: { top: "-10em" },
	anchor: {
		transformOrigin: "100% 100%",
		position: "absolute",
		width: "10em",
		height: "10em",
		borderRadius: "50%",
		color: "white",
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	span: {
		position: "absolute"
	},
	spanFlipHorizontal: {
		transform: "rotateX(180deg) rotateY(180deg) rotateZ(90deg)"
	},
	spanFlipVertical: {
		transform: "rotateX(180deg) rotateY(180deg)"
	}
});

type MenuItem = {
	id?: string;
	label?: string;
	icon?: any;
	onClick?: (() => void) | undefined;
	color?: string;
	backColor?: string;
	activeColor?: string;
};

export type MenuPosition = "left" | "right" | "top" | "bottom" | "center";

type NavigationProps = {
	menuItems?: Array<MenuItem | string>;
	buttonColor?: string;
	menuColor?: string;
	menuPosition?: MenuPosition;
	flipLableVertical?: boolean;
	flipLableHorizontal?: boolean;
	clickOpenClose?: boolean;
};

const StyledMenuItem = ({
	item,
	defaultColor,
	menuColor,
	rotationAngle,
	skewAngle,
	liStyle,
	spanStyle,
	itemRotationAngle,
	flipLableVertical,
	flipLableHorizontal
}) => {
	const isString = typeof item === "string";
	const activeColor = isString
		? defaultColor
		: (item.activeColor && item.activeColor) || defaultColor;
	const menuBackColor = isString ? menuColor : (item.color && item.color) || menuColor;
	const classes = useStyles({ secondaryColor: menuBackColor, primaryColor: activeColor });
	return (
		<li
			className={classes.li}
			style={...{
				transform: `rotate(${rotationAngle}deg) skew(${skewAngle}deg)`,
				...liStyle
			}}
		>
			<div
				className={classes.anchor}
				style={...{
					transform: `skew(${-skewAngle}deg) rotate(${itemRotationAngle}deg) translate(10%, 50%)`,
					...spanStyle
				}}
				onClick={!isString && item.onClick ? item.onClick : null}
			>
				<span
					className={clsx(classes.span, {
						[classes.spanFlipVertical]: flipLableVertical,
						[classes.spanFlipHorizontal]: flipLableHorizontal
					})}
				>
					{!isString ? (item.icon ? item.icon : item.label) : item}
				</span>
			</div>
		</li>
	);
};

const Navigation = ({
	menuItems = ["Menu Item 1", "Menu Item 2", "Menu Item 3"],
	buttonColor = "navy",
	menuColor = "orange",
	menuPosition = "bottom",
	flipLableVertical = false,
	flipLableHorizontal = false,
	clickOpenClose = true
}: NavigationProps) => {
	const classes = useStyles({ primaryColor: buttonColor });

	const [open, setOpen] = useState(false);

	const onClick = () => setOpen(!open);
	const onClickAway = () => !clickOpenClose && setOpen(false);

	return (
		<div
			id="navigation-menu"
			onMouseEnter={!clickOpenClose ? onClick : undefined}
			onMouseLeave={!clickOpenClose ? onClickAway : undefined}
		>
			<div>
				<button
					className={clsx(classes.button, {
						[classes.buttonTop]: menuPosition === "top",
						[classes.buttonBottom]: menuPosition === "bottom",
						[classes.buttonRight]: menuPosition === "right",
						[classes.buttonLeft]: menuPosition === "left",
						[classes.buttonCenter]: menuPosition === "center"
					})}
					id="cn-button"
					onClick={onClick}
				>
					+
				</button>
				<div
					className={clsx(classes.wrapper, {
						[classes.wVertCenter]:
							menuPosition === "center" ||
							menuPosition === "right" ||
							menuPosition === "left",
						[classes.wHoriCenter]:
							menuPosition === "center" ||
							menuPosition === "top" ||
							menuPosition === "bottom",
						[classes.wRight]: menuPosition === "right",
						[classes.wLeft]: menuPosition === "left",
						[classes.wTop]: menuPosition === "top",
						[classes.wBottom]: menuPosition === "bottom"
					})}
					id="cn-wrapper"
					style={{
						transform: open
							? `scale(1) rotate(${
									menuItems.length === 3 && menuPosition === "center" ? -30 : 0
							  }deg)`
							: "scale(0)"
					}}
				>
					<ul style={{ margin: 0, padding: 0 }}>
						{menuItems.map((item, index) => {
							const cAngle = centerAngle(menuPosition === "center", menuItems.length);
							let rotationAngle = index * cAngle + getPositionAngle(menuPosition);
							let skewAngle = 90 - cAngle;
							let itemRotationAngle = cAngle / 2;
							return (
								<StyledMenuItem
									key={`li-item-${index}`}
									liStyle={
										menuItems.length === 2
											? {
													transform: `rotate(${rotationAngle}deg)`,
													transformOrigin: "50% 100%",
													width: "20em"
											  }
											: menuItems.length === 3 && {
													width: "15em",
													transform: `translate(-33%) rotate(${rotationAngle}deg) skew(${skewAngle}deg)`
											  }
									}
									spanStyle={menuItems.length === 3 && { width: "15em" }}
									defaultColor={buttonColor}
									menuColor={menuColor}
									{...{
										item,
										rotationAngle,
										skewAngle: menuItems.length === 2 ? 0 : skewAngle,
										itemRotationAngle,
										flipLableVertical,
										flipLableHorizontal
									}}
								/>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
