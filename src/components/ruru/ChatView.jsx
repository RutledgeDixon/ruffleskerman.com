import { badgeColorForFeeling } from "./feelingColors";

function FeelingBadge({ feelingName, feelingsTree, onClick, ariaLabel }) {
	if (!feelingName) {
		return (
			<button type="button" className="ruru-feeling-badge ruru-feeling-badge-empty" onClick={onClick} aria-label={ariaLabel}>
				?
			</button>
		);
	}

	const color = badgeColorForFeeling(feelingsTree, feelingName);
	const label = feelingName.charAt(0).toUpperCase() + feelingName.slice(1);

	return (
		<button
			type="button"
			className="ruru-feeling-badge"
			style={{ backgroundColor: color }}
			onClick={onClick}
			aria-label={ariaLabel}
		>
			{label}
		</button>
	);
}

// Ports RuRuComms' "neat style" tab (Form1.cs displayMesg0/displayMesg1 +
// displayFeelingButton0/1): a two-column chat log, one column per person,
// each with a feeling badge above it.
export default function ChatView({
	receivedLines,
	sentLines,
	receivedFeeling,
	sentFeeling,
	feelingsTree,
	onAskAboutFeeling,
	onOpenWheel,
	unreadCount,
}) {
	return (
		<div className="ruru-chat-view">
			<div className="ruru-chat-column">
				<FeelingBadge
					feelingName={receivedFeeling}
					feelingsTree={feelingsTree}
					onClick={() => onAskAboutFeeling(receivedFeeling)}
					ariaLabel="Ask about their feeling"
				/>
				<div className="ruru-chat-box">
					{receivedLines.map((line, i) => (
						<div key={i}>{line}</div>
					))}
				</div>
			</div>
			<div className="ruru-chat-column">
				<FeelingBadge
					feelingName={sentFeeling}
					feelingsTree={feelingsTree}
					onClick={onOpenWheel}
					ariaLabel="Share how you're feeling"
				/>
				<div className="ruru-chat-box">
					{sentLines.map((line, i) => (
						<div key={i}>{line}</div>
					))}
				</div>
			</div>
			{unreadCount > 0 && <div className="ruru-unread-badge">{unreadCount} new</div>}
		</div>
	);
}
