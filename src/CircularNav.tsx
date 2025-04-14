import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { arc } from "d3-shape";

const _createArcPath = (
	innerRadius: number,
	outerRadius: number,
	startAngle: number,
	endAngle: number
) => {
	const arcGenerator = arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius)
		.startAngle(startAngle)
		.endAngle(endAngle);

	return (
		arcGenerator({
			innerRadius,
			outerRadius,
			startAngle,
			endAngle
		}) || ""
	);
};

const BASE_INNER_RADIUS = 140;
const BASE_OUTER_RADIUS = 175;
const OUTER_RADIUS_INCREMENT = 20;

const navData = [
	{
		id: "item1",
		label: "Item 1",
		initCount: 20,
		duration: Math.random() * 100,
		color: "#3dabf5",
		onClick: () => alert("Menu Item 1 clicked")
	},
	{
		id: "item2",
		label: "Item 2",
		initCount: 20,
		duration: Math.random() * 100,
		color: "#3e1bf5",
		onClick: () => alert("Menu Item 2 clicked")
	},
	{
		id: "item3",
		label: "Item 3",
		initCount: 20,
		duration: Math.random() * 100,
		color: "#1debf5",
		onClick: () => alert("Menu Item 3 clicked")
	}
];

type NavData = {
	id: string;
	label: string;
	duration: number;
	color: string;
	onClick: () => void;
};

type NavProps = {
	data: NavData[];
	sameSegmentSize: boolean;
	innerRadius?: number;
	outerRadius?: number;
};

export const CircularNav = ({
	innerRadius = BASE_INNER_RADIUS,
	outerRadius = BASE_OUTER_RADIUS,
	data = navData,
	sameSegmentSize = false
}: NavProps) => {
	const [activeSegment, setActiveSegment] = useState<number | null>(1);
	const [isDragging, setIsDragging] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const rotationRef = useRef(0);
	const wheelTimeoutRef = useRef<number | undefined>(undefined);
	const centerX = 450;
	const centerY = 450;

	const handleWheel = useCallback((e: WheelEvent) => {
		e.preventDefault();
		if (!containerRef.current) return;

		// Clear any existing animation
		gsap.killTweensOf(containerRef.current);

		// Calculate rotation increment (delta)
		const delta = e.deltaY * 0.5; // Adjust sensitivity here

		// Update rotation
		rotationRef.current += delta;

		// Animate to new rotation
		gsap.to(containerRef.current, {
			duration: 0.3,
			rotation: rotationRef.current,
			ease: "power2.out"
		});

		// Clear previous timeout
		if (wheelTimeoutRef.current) {
			window.clearTimeout(wheelTimeoutRef.current);
		}

		// Set new timeout for inertia
		wheelTimeoutRef.current = window.setTimeout(() => {
			gsap.to(containerRef.current, {
				duration: 0.6,
				rotation: rotationRef.current + delta * 2,
				ease: "power2.out"
			});
		}, 100);
	}, []);

	useEffect(() => {
		// Register the Draggable plugin
		gsap.registerPlugin(Draggable);

		if (containerRef.current) {
			// Add wheel event listener
			containerRef?.current?.addEventListener("wheel", handleWheel, { passive: false });
			// Initialize draggable
			Draggable.create(containerRef.current, {
				type: "rotation",
				inertia: true,
				resistance: 0.5,
				vars: {
					rotationOrigin: "50% 50%"
				},
				onDragStart: function (e) {
					setIsDragging(true);
					// Calculate rotation based on pointer position relative to center
					const rect = (e.target as SVGElement).getBoundingClientRect();
					const x = e.x - (rect.left + rect.width / 2);
					const y = e.y - (rect.top + rect.height / 2);
					this.rotation = (Math.atan2(y, x) * 180) / Math.PI;
				},
				onDrag: function () {
					rotationRef.current = this.rotation;
				},
				onDragEnd: function () {
					setIsDragging(false);
				}
			});
		}

		return () => {
			// Cleanup
			if (containerRef?.current) {
				Draggable.get(containerRef.current)?.kill();
				containerRef?.current?.removeEventListener("wheel", handleWheel);
				if (wheelTimeoutRef.current) {
					window.clearTimeout(wheelTimeoutRef.current);
				}
			}
		};
	}, []);

	const renderPaths = () => {
		const paths: any = [];
		// Get total duration of all items
		const totalDuration = data.reduce((acc: number, item: any) => acc + item.duration, 0);

		// Calculate the starting angle (90 degrees is top)
		let currentAngle = 90;

		for (let i = 0; i < data.length; i++) {
			// Calculate angle size based on item's duration proportion of total
			const angleSize = sameSegmentSize
				? 360 / data.length
				: (data[i].duration / totalDuration) * 360;
			const startAngleRad = currentAngle;
			const endAngleRad = startAngleRad + angleSize;

			// Update currentAngle for next segment
			currentAngle += angleSize;
			const isActive = activeSegment === i;
			paths.push(
				<path
					key={i}
					d={_createArcPath(
						innerRadius,
						isActive ? outerRadius + OUTER_RADIUS_INCREMENT : outerRadius,
						startAngleRad * (Math.PI / 180),
						endAngleRad * (Math.PI / 180)
					)}
					fill={data[i].color}
					stroke="none"
					style={{ opacity: 1, cursor: "pointer", transition: "all 0.3s ease" }}
					onClick={() => setActiveSegment(i)}
				/>
			);
		}
		return paths;
	};

	return (
		<div style={{ width: centerX, height: centerY }} ref={containerRef}>
			<svg
				height={centerY}
				width={centerX}
				style={{ overflow: "hidden", position: "relative" }}
			>
				<g
					transform={`translate(${centerX / 2}, ${centerY / 2})`}
					style={{
						cursor: "pointer",
						transformOrigin: "50% 50%",
						touchAction: "none"
					}}
				>
					{renderPaths()}
					<path
						d={_createArcPath(innerRadius - 5, innerRadius - 22, 0, 360)}
						fill="#5B5B66a0"
						stroke="none"
						style={{ opacity: 1, cursor: "pointer", transition: "all 0.3s ease" }}
					/>
					<path
						d={_createArcPath(innerRadius - 6, innerRadius - 21, 0, 2)}
						fill="#ffffff"
						stroke="none"
						style={{ opacity: 1, cursor: "pointer", transition: "all 0.3s ease" }}
					/>
				</g>
			</svg>
		</div>
	);
};
