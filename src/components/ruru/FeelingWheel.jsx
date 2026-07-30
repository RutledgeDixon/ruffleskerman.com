import { useEffect, useMemo, useRef } from "react";
import { WHEEL_SEGMENT_COLORS } from "./feelingColors";

const SIZE = 320;
const CENTER = SIZE / 2;
const RADIUS = CENTER - 10;

function getNodeAtPath(tree, path) {
	return path.reduce((node, key) => (node && node[key]) || {}, tree);
}

function prettyLabel(name) {
	return name.charAt(0).toUpperCase() + name.slice(1);
}

// Ports RuRuComms' feeling wheel (Form1.cs FeelingWheelPanel_Paint /
// FeelingWheelPanel_MouseClick): click a segment to drill into its children;
// clicking a leaf (no children) selects that feeling and resets to the root.
export default function FeelingWheel({ feelingsTree, path, onNavigate, onFeelingSelected }) {
	const canvasRef = useRef(null);

	const currentMap = useMemo(() => getNodeAtPath(feelingsTree, path), [feelingsTree, path]);
	const currentChildren = useMemo(() => Object.keys(currentMap), [currentMap]);

	useEffect(() => {
		draw();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentChildren]);

	function draw() {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, SIZE, SIZE);

		const count = currentChildren.length;
		if (count === 0) return;
		const anglePerSegment = (2 * Math.PI) / count;

		ctx.save();
		ctx.translate(CENTER, CENTER);
		ctx.rotate(-Math.PI / 2);

		currentChildren.forEach((name, i) => {
			const startAngle = i * anglePerSegment;

			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(0, 0, RADIUS, startAngle, startAngle + anglePerSegment);
			ctx.closePath();
			ctx.fillStyle = WHEEL_SEGMENT_COLORS[i % WHEEL_SEGMENT_COLORS.length];
			ctx.fill();
			ctx.strokeStyle = "rgba(0,0,0,0.2)";
			ctx.stroke();

			const midAngle = startAngle + anglePerSegment / 2;
			const textRadius = RADIUS / 2;
			const tx = Math.cos(midAngle) * textRadius;
			const ty = Math.sin(midAngle) * textRadius;

			let midAngleDeg = (midAngle * 180) / Math.PI;
			let textRotation = midAngle;
			if (midAngleDeg >= 180 && midAngleDeg < 360) {
				textRotation += Math.PI;
			}

			ctx.save();
			ctx.translate(tx, ty);
			ctx.rotate(textRotation);
			ctx.fillStyle = "#111";
			ctx.font = "bold 12px Arial, sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(prettyLabel(name), 0, 0);
			ctx.restore();
		});

		ctx.restore();
	}

	function handleClick(event) {
		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left - CENTER;
		const y = event.clientY - rect.top - CENTER;
		const distance = Math.sqrt(x * x + y * y);
		if (distance > RADIUS) return;

		let angle = (Math.atan2(y, x) * 180) / Math.PI;
		if (angle < 0) angle += 360;
		angle = (angle + 90) % 360;

		const count = currentChildren.length;
		const anglePerSegment = 360 / count;
		const index = Math.floor(angle / anglePerSegment);
		if (index < 0 || index >= count) return;

		const name = currentChildren[index];
		const childPath = [...path, name];
		const childMap = getNodeAtPath(feelingsTree, childPath);

		if (Object.keys(childMap).length === 0) {
			onFeelingSelected(name);
		} else {
			onNavigate(childPath);
		}
	}

	return (
		<div className="feeling-wheel">
			<div className="feeling-wheel-breadcrumb">
				<span>{path.length > 0 ? prettyLabel(path[path.length - 1]) : "How are you feeling?"}</span>
				{path.length > 0 && (
					<button type="button" className="feeling-wheel-back" onClick={() => onNavigate(path.slice(0, -1))}>
						&larr; Back
					</button>
				)}
			</div>
			<canvas
				ref={canvasRef}
				width={SIZE}
				height={SIZE}
				onClick={handleClick}
				className="feeling-wheel-canvas"
				role="img"
				aria-label="Feeling wheel"
			/>
		</div>
	);
}
