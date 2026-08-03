import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TURTLES_EASTER_EGG = "turtles";

// Ports RuRuComms' MessageWindowForm: a popup composer with two quick-preset
// buttons that send special coded messages, plus Enter-to-send/Escape-to-cancel.
//
// NOTE: The "miss you"/"love you" presets send "BxF00"/"BxF01" over the wire.
// In the original app these codes are NOT actually decoded on either the
// sending or receiving client (they fall into an "unhandled coded message"
// log-only branch) - that quirk is intentionally preserved here for protocol
// compatibility with the original desktop client.
export default function ComposeModal({ initialText = "", onSend, onCancel, onTurtlesTriggered }) {
	const [text, setText] = useState(initialText);

	useEffect(() => {
		setText(initialText);
	}, [initialText]);

	function submit(message) {
		const trimmed = message.trim();
		if (trimmed.length === 0) {
			return;
		}
		if (trimmed.toLowerCase() === TURTLES_EASTER_EGG) {
			onTurtlesTriggered?.();
			onCancel();
			return;
		}
		onSend(trimmed);
	}

	function handleSubmit(event) {
		event.preventDefault();
		submit(text);
	}

	function handleKeyDown(event) {
		if (event.key === "Escape") {
			onCancel();
		}
	}

	return (
		<div className="ruru-modal-backdrop" onClick={onCancel}>
			<div className="ruru-modal" onClick={(event) => event.stopPropagation()}>
				<form onSubmit={handleSubmit}>
					<Textarea
						value={text}
						onChange={(event) => setText(event.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Say something..."
						autoFocus
						rows={4}
					/>
					<div className="ruru-modal-presets">
						<Button type="button" variant="outline" className="text-foreground" onClick={() => submit("BxF00")}>
							Miss you
						</Button>
						<Button type="button" variant="outline" className="text-foreground" onClick={() => submit("BxF01")}>
							Love you
						</Button>
					</div>
					<div className="ruru-modal-actions">
						<Button type="button" variant="secondary" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit">Send</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
