import { useState } from "react";
import { Button } from "@/components/ui/button";

// Ports RuRuComms' Form2 (the client-id prompt shown on first run).
export default function IdentitySetup({ onSubmit }) {
	const [name, setName] = useState("");

	function handleSubmit(event) {
		event.preventDefault();
		const trimmed = name.trim();
		if (trimmed.length === 0) {
			return;
		}
		onSubmit(trimmed);
	}

	return (
		<div className="ruru-identity-setup">
			<form onSubmit={handleSubmit}>
				<h2>What should we call you?</h2>
				<input
					type="text"
					value={name}
					onChange={(event) => setName(event.target.value)}
					placeholder="Your name"
					autoFocus
				/>
				<Button type="submit">Continue</Button>
			</form>
		</div>
	);
}
