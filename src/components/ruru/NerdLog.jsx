// Ports RuRuComms' hidden nerd-log tab (txtLog / AppendLog). Stays hidden until
// the "turtles" easter egg is triggered from the compose modal.
export default function NerdLog({ entries }) {
	return (
		<div className="ruru-nerd-log">
			<h3>nerd log</h3>
			<pre>
				{entries.length === 0
					? "(empty)"
					: entries.map((entry, i) => `${i}: ${entry}`).join("\n")}
			</pre>
		</div>
	);
}
