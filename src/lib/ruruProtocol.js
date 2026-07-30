// Pure, environment-agnostic RuRu protocol helpers - no Node or browser APIs used
// here, so this file is safe to import from both server-side (RuRuServerAPI.js)
// and browser code (ruruWebClient.js).
export const RURU_DEFAULT_PORT = 50512;
export const RURU_MAX_CLIENTS = 2;
export const RURU_ID_PREFIX = "BxF_ID_";
export const RURU_SERVER_PREFIX = "BxF_SERVER_";
export const RURU_SERVER_FULL_MESSAGE = "Server full. Try again later.";
export const RURU_READ_CHUNK_BYTES = 1024;

export function buildIdentityFrame(clientId) {
	if (!clientId || typeof clientId !== "string") {
		throw new Error("clientId must be a non-empty string");
	}

	return `${RURU_ID_PREFIX}${clientId}`;
}

export function parseIdentityFrame(frame) {
	if (typeof frame !== "string" || !frame.startsWith(RURU_ID_PREFIX)) {
		return null;
	}

	const clientId = frame.slice(RURU_ID_PREFIX.length);
	return clientId.length > 0 ? clientId : null;
}

export function isServerControlFrame(frame) {
	return typeof frame === "string" && frame.startsWith(RURU_SERVER_PREFIX);
}

export function parseServerControlFrame(frame) {
	if (!isServerControlFrame(frame)) {
		return null;
	}

	const payload = frame.slice(RURU_SERVER_PREFIX.length);

	if (payload.startsWith("New connection: ")) {
		return {
			type: "new-connection",
			clientId: payload.slice("New connection: ".length),
			raw: frame,
		};
	}

	if (payload.startsWith("Client disconnected: ")) {
		return {
			type: "client-disconnected",
			clientId: payload.slice("Client disconnected: ".length),
			raw: frame,
		};
	}

	return {
		type: "unknown-control",
		payload,
		raw: frame,
	};
}

export function parseBufferedReplayFrame(frame) {
	if (typeof frame !== "string") {
		return null;
	}

	const delimiterIndex = frame.indexOf("::");
	if (delimiterIndex <= 0) {
		return null;
	}

	return {
		senderId: frame.slice(0, delimiterIndex),
		payload: frame.slice(delimiterIndex + 2),
		raw: frame,
	};
}
