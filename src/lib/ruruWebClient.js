// Browser WebSocket client for the RuRu relay protocol (see RURU_PROTOCOL.md).
//
// Only pure, environment-agnostic parsing helpers are imported here (from
// ruruProtocol.js, not RuRuServerAPI.js) - RuRuServerAPI.js's RuRuClient class
// imports node:net at module scope, which cannot be bundled for the browser.
import {
	buildIdentityFrame,
	isServerControlFrame,
	parseServerControlFrame,
	parseBufferedReplayFrame,
	RURU_SERVER_FULL_MESSAGE,
} from "./ruruProtocol.js";

const FEELING_PREFIX = "BxF_FEEL_";
const CODED_PREFIX = "BxF";

// Categorizes a single (already newline-split) protocol frame. Exported so the
// UI layer can apply the exact same classification to messages it composes
// locally (before they've round-tripped through the server), mirroring
// RuRuComms' printPretty() being called for both sent and received messages.
export function classifyFrame(line) {
	if (line.includes(RURU_SERVER_FULL_MESSAGE)) {
		return { type: "server-full", raw: line };
	}

	if (isServerControlFrame(line)) {
		return { type: "control", control: parseServerControlFrame(line), raw: line };
	}

	if (line.startsWith(FEELING_PREFIX)) {
		return { type: "feeling", feeling: line.slice(FEELING_PREFIX.length), raw: line };
	}

	if (line.startsWith(CODED_PREFIX)) {
		// Matches the original desktop client's behavior: any other BxF-prefixed
		// frame (e.g. the "BxF00"/"BxF01" quick-preset codes) falls through
		// unhandled and is only logged, never shown as a chat message.
		return { type: "coded", raw: line };
	}

	return {
		type: "message",
		payload: line,
		raw: line,
		replay: parseBufferedReplayFrame(line),
	};
}

export function createRuruWebClient({ url, clientId }) {
	if (!url || typeof url !== "string") {
		throw new Error("url must be a non-empty string");
	}
	if (!clientId || typeof clientId !== "string") {
		throw new Error("clientId must be a non-empty string");
	}

	let socket = null;
	let lineBuffer = "";

	const handlers = {
		connect: [],
		close: [],
		error: [],
		control: [],
		feeling: [],
		message: [],
		coded: [],
		serverFull: [],
	};

	function on(eventName, handler) {
		if (!handlers[eventName]) {
			throw new Error(`Unknown event: ${eventName}`);
		}
		handlers[eventName].push(handler);
		return () => off(eventName, handler);
	}

	function off(eventName, handler) {
		if (!handlers[eventName]) {
			return;
		}
		handlers[eventName] = handlers[eventName].filter((h) => h !== handler);
	}

	function emit(eventName, payload) {
		for (const handler of handlers[eventName] || []) {
			handler(payload);
		}
	}

	function handleLine(line) {
		if (!line) {
			return;
		}

		const frame = classifyFrame(line);

		switch (frame.type) {
			case "server-full":
				emit("serverFull", { raw: frame.raw });
				break;
			case "control":
				emit("control", frame.control);
				break;
			case "feeling":
				emit("feeling", { feeling: frame.feeling, raw: frame.raw });
				break;
			case "coded":
				emit("coded", { raw: frame.raw });
				break;
			default:
				emit("message", { payload: frame.payload, raw: frame.raw, replay: frame.replay });
		}
	}

	function parseIncoming(raw) {
		const combined = lineBuffer + raw;
		const lines = combined.split(/\r?\n/);
		lineBuffer = lines.pop() || "";

		for (const line of lines) {
			handleLine(line);
		}
	}

	function connect() {
		return new Promise((resolve, reject) => {
			lineBuffer = "";
			const ws = new WebSocket(url);
			socket = ws;

			const onErrorBeforeOpen = () => {
				reject(new Error("Failed to connect to RuRu server"));
			};

			const onOpen = () => {
				ws.removeEventListener("error", onErrorBeforeOpen);
				ws.send(buildIdentityFrame(clientId));
				emit("connect", { url });
				resolve();
			};

			ws.addEventListener("open", onOpen, { once: true });
			ws.addEventListener("error", onErrorBeforeOpen, { once: true });

			ws.addEventListener("message", (event) => {
				parseIncoming(String(event.data));
			});

			ws.addEventListener("close", (event) => {
				lineBuffer = "";
				emit("close", { code: event.code, reason: event.reason });
			});

			ws.addEventListener("error", () => {
				emit("error", { message: "WebSocket error" });
			});
		});
	}

	function sendMessage(message) {
		if (typeof message !== "string" || message.length === 0) {
			throw new Error("message must be a non-empty string");
		}
		if (!socket || socket.readyState !== WebSocket.OPEN) {
			throw new Error("Socket is not connected");
		}
		socket.send(message);
		return message;
	}

	function sendFeeling(feelingName) {
		return sendMessage(`${FEELING_PREFIX}${feelingName}`);
	}

	function disconnect() {
		if (socket) {
			socket.close();
			socket = null;
		}
	}

	return { connect, sendMessage, sendFeeling, disconnect, on, off };
}
