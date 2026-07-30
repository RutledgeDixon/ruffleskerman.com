import { useCallback, useEffect, useRef, useState } from "react";
import { createRuruWebClient, classifyFrame } from "@/lib/ruruWebClient";
import IdentitySetup from "./IdentitySetup";
import ChatView from "./ChatView";
import ComposeModal from "./ComposeModal";
import FeelingWheel from "./FeelingWheel";
import NerdLog from "./NerdLog";
import { Button } from "@/components/ui/button";
import "@/styles/ruru.css";

const CLIENT_ID_STORAGE_KEY = "ruru-client-id";
const WS_PATH = import.meta.env.PUBLIC_RURU_WS_PATH || "/ruru/";
const WS_HOST = import.meta.env.PUBLIC_RURU_WS_HOST;

function buildWebSocketUrl() {
	if (!WS_HOST) {
		return null;
	}
	const protocol = typeof window !== "undefined" && window.location.protocol === "http:" ? "ws" : "wss";
	return `${protocol}://${WS_HOST}${WS_PATH}`;
}

export default function RuruPage() {
	const [clientId, setClientId] = useState(null);
	const [connectionState, setConnectionState] = useState("idle"); // idle | connecting | connected | full | error | closed
	const [view, setView] = useState("chat"); // chat | wheel
	const [wheelPath, setWheelPath] = useState([]);
	const [feelingsTree, setFeelingsTree] = useState(null);

	const [receivedLines, setReceivedLines] = useState([]);
	const [sentLines, setSentLines] = useState([]);
	const [receivedFeeling, setReceivedFeeling] = useState(null);
	const [sentFeeling, setSentFeeling] = useState(null);
	const [unreadCount, setUnreadCount] = useState(0);

	const [composeOpen, setComposeOpen] = useState(false);
	const [composePrefill, setComposePrefill] = useState("");

	const [nerdVisible, setNerdVisible] = useState(false);
	const [nerdEntries, setNerdEntries] = useState([]);

	const clientRef = useRef(null);

	const log = useCallback((entry) => {
		setNerdEntries((prev) => [...prev, entry]);
	}, []);

	// Load persisted identity + feelings tree on mount.
	useEffect(() => {
		const stored = typeof window !== "undefined" ? window.localStorage.getItem(CLIENT_ID_STORAGE_KEY) : null;
		if (stored) {
			setClientId(stored);
		}

		fetch("/materials/feelings.json")
			.then((res) => res.json())
			.then(setFeelingsTree)
			.catch((err) => log(`Error loading feelings tree: ${err.message}`));
	}, [log]);

	function handleIdentitySubmit(name) {
		window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, name);
		setClientId(name);
	}

	// Connect once we have both an identity and a target host.
	useEffect(() => {
		if (!clientId) return;

		const url = buildWebSocketUrl();
		if (!url) {
			setConnectionState("error");
			log("Error: PUBLIC_RURU_WS_HOST is not configured");
			return;
		}

		const client = createRuruWebClient({ url, clientId });
		clientRef.current = client;
		setConnectionState("connecting");

		client.on("connect", () => {
			setConnectionState("connected");
			log(`Connected to ${url}`);
			log(`Sent client ID: ${clientId}`);
		});

		client.on("serverFull", () => {
			setConnectionState("full");
			log("Server full. Try again later.");
		});

		client.on("control", (control) => {
			if (control.type === "new-connection") {
				setReceivedLines((prev) => [...prev, `${control.clientId} just connected!`]);
				log(`New client connected: ${control.clientId}`);
			} else if (control.type === "client-disconnected") {
				setReceivedLines((prev) => [...prev, `${control.clientId} just disconnected :'(`]);
				log(`Client disconnected: ${control.clientId}`);
			} else {
				log(`Received server message: ${control.payload}`);
			}
		});

		client.on("feeling", ({ feeling }) => {
			setReceivedFeeling(feeling);
			log(`Received feeling '${feeling}'`);
		});

		client.on("coded", ({ raw }) => {
			log(`Coded message not handled yet: ${raw}`);
		});

		client.on("message", ({ payload }) => {
			setReceivedLines((prev) => [...prev, payload]);
			setUnreadCount((prev) => prev + 1);
			log(`Received: ${payload}`);
		});

		client.on("error", ({ message }) => {
			log(`Error: ${message}`);
		});

		client.on("close", () => {
			setConnectionState("closed");
			log("Disconnected from server.");
		});

		client.connect().catch((err) => {
			setConnectionState("error");
			log(`Error connecting to server: ${err.message}`);
		});

		return () => {
			client.disconnect();
			clientRef.current = null;
		};
	}, [clientId, log]);

	function markMessagesSeen() {
		setUnreadCount(0);
	}

	// Sends a raw protocol frame and records it locally exactly the way
	// RuRuComms' printPretty(message, 1) would for a sent message.
	function sendRaw(message) {
		const client = clientRef.current;
		if (!client || connectionState !== "connected") {
			log("Error sending message: not connected to server");
			return;
		}

		client.sendMessage(message);

		const frame = classifyFrame(message);
		if (frame.type === "feeling") {
			setSentFeeling(frame.feeling);
			log(`Sent feeling '${frame.feeling}'`);
		} else if (frame.type === "coded") {
			log(`Coded message not handled yet: ${message}`);
		} else if (frame.type === "message") {
			setSentLines((prev) => [...prev, frame.payload]);
			log(`Sent: ${message}`);
		}
	}

	function handleComposeSend(message) {
		sendRaw(message);
		setComposeOpen(false);
	}

	function openCompose(prefill = "") {
		setComposePrefill(prefill);
		setComposeOpen(true);
	}

	function handleAskAboutFeeling(feeling) {
		if (!feeling) {
			openCompose("");
			return;
		}
		openCompose(`Why are you feeling ${feeling.toLowerCase()}?`);
	}

	function handleFeelingSelected(feeling) {
		sendRaw(`BxF_FEEL_${feeling}`);
		setWheelPath([]);
		setView("chat");
	}

	if (!clientId) {
		return <IdentitySetup onSubmit={handleIdentitySubmit} />;
	}

	return (
		<div className="ruru-page" onClick={markMessagesSeen}>
			<div className="ruru-header">
				<h1>Hi, {clientId}!</h1>
				<div className="ruru-connection-status" data-state={connectionState}>
					{connectionState === "connecting" && "Connecting..."}
					{connectionState === "connected" && "Connected!"}
					{connectionState === "full" && "Server full. Try again later."}
					{connectionState === "closed" && "Disconnected."}
					{connectionState === "error" && "Connection error."}
				</div>
			</div>

			<div className="ruru-toolbar">
				<Button variant={view === "chat" ? "default" : "outline"} onClick={() => setView("chat")}>
					Messages
				</Button>
				<Button variant={view === "wheel" ? "default" : "outline"} onClick={() => setView("wheel")}>
					Feeling wheel
				</Button>
				<Button onClick={() => openCompose("")}>New message</Button>
				{nerdVisible && (
					<Button variant="ghost" onClick={() => setView("nerd")}>
						nerd log
					</Button>
				)}
			</div>

			{feelingsTree && view === "chat" && (
				<ChatView
					receivedLines={receivedLines}
					sentLines={sentLines}
					receivedFeeling={receivedFeeling}
					sentFeeling={sentFeeling}
					feelingsTree={feelingsTree}
					onAskAboutFeeling={handleAskAboutFeeling}
					onOpenWheel={() => setView("wheel")}
					unreadCount={unreadCount}
				/>
			)}

			{feelingsTree && view === "wheel" && (
				<FeelingWheel
					feelingsTree={feelingsTree}
					path={wheelPath}
					onNavigate={setWheelPath}
					onFeelingSelected={handleFeelingSelected}
				/>
			)}

			{view === "nerd" && <NerdLog entries={nerdEntries} />}

			{composeOpen && (
				<ComposeModal
					initialText={composePrefill}
					onSend={handleComposeSend}
					onCancel={() => setComposeOpen(false)}
					onTurtlesTriggered={() => {
						setNerdVisible(true);
						log("turtles easter egg triggered");
					}}
				/>
			)}
		</div>
	);
}
