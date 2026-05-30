import { createConnection } from "node:net";

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

export function createRuRuClient(options) {
	return new RuRuClient(options);
}

export class RuRuClient {
	constructor({
		host,
		clientId,
		port = RURU_DEFAULT_PORT,
		authTimeoutMs = 5000,
		autoParseByLine = true,
	}) {
		if (!host || typeof host !== "string") {
			throw new Error("host must be a non-empty string");
		}
		if (!clientId || typeof clientId !== "string") {
			throw new Error("clientId must be a non-empty string");
		}

		this.host = host;
		this.port = port;
		this.clientId = clientId;
		this.authTimeoutMs = authTimeoutMs;
		this.autoParseByLine = autoParseByLine;

		this.socket = null;
		this.connected = false;
		this.authSent = false;
		this.disposed = false;
		this._lineBuffer = "";

		this.handlers = {
			connect: [],
			close: [],
			error: [],
			data: [],
			relay: [],
			control: [],
			serverFull: [],
			authSent: [],
			write: [],
		};
	}

	on(eventName, handler) {
		if (!this.handlers[eventName]) {
			throw new Error(`Unknown event: ${eventName}`);
		}

		this.handlers[eventName].push(handler);
		return () => this.off(eventName, handler);
	}

	off(eventName, handler) {
		if (!this.handlers[eventName]) {
			return;
		}

		this.handlers[eventName] = this.handlers[eventName].filter((h) => h !== handler);
	}

	emit(eventName, payload) {
		const eventHandlers = this.handlers[eventName] || [];
		for (const handler of eventHandlers) {
			handler(payload);
		}
	}

	async connect() {
		if (this.disposed) {
			throw new Error("Cannot connect: client is disposed");
		}
		if (this.connected) {
			return this;
		}

		await new Promise((resolve, reject) => {
			const socket = createConnection({ host: this.host, port: this.port });
			this.socket = socket;

			const onErrorBeforeConnect = (error) => {
				socket.removeListener("connect", onConnect);
				reject(error);
			};

			const onConnect = () => {
				socket.removeListener("error", onErrorBeforeConnect);
				this.connected = true;
				this._wireSocketEvents(socket);
				resolve();
			};

			socket.once("error", onErrorBeforeConnect);
			socket.once("connect", onConnect);
		});

		this.emit("connect", { host: this.host, port: this.port });
		return this;
	}

	async connectAndAuthenticate() {
		await this.connect();
		await this.sendID();
		return this;
	}

	sendID() {
		const frame = buildIdentityFrame(this.clientId);
		this._write(frame);
		this.authSent = true;
		this.emit("authSent", { frame, clientId: this.clientId });
		return frame;
	}

	sendMessage(message) {
		if (typeof message !== "string" || message.length === 0) {
			throw new Error("message must be a non-empty string");
		}

		this._write(message);
		return message;
	}

	disconnect() {
		if (!this.socket) {
			return;
		}

		this.socket.end();
	}

	async reconnect({ delayMs = 0 } = {}) {
		if (delayMs > 0) {
			await new Promise((resolve) => setTimeout(resolve, delayMs));
		}

		this.destroySocket();
		this.connected = false;
		this.authSent = false;
		this._lineBuffer = "";

		return this.connectAndAuthenticate();
	}

	dispose() {
		this.disposed = true;
		this.destroySocket();
		this.connected = false;
		this.authSent = false;
		this._lineBuffer = "";

		for (const eventName of Object.keys(this.handlers)) {
			this.handlers[eventName] = [];
		}
	}

	destroySocket() {
		if (!this.socket) {
			return;
		}

		this.socket.removeAllListeners();
		this.socket.destroy();
		this.socket = null;
	}

	_write(payload) {
		if (!this.socket || !this.connected) {
			throw new Error("Socket is not connected");
		}

		this.socket.write(payload);
		this.emit("write", { payload });
	}

	_wireSocketEvents(socket) {
		socket.on("data", (chunk) => {
			const raw = chunk.toString("utf8");
			this.emit("data", { raw, chunk });

			if (raw.includes(RURU_SERVER_FULL_MESSAGE)) {
				this.emit("serverFull", { raw });
			}

			if (this.autoParseByLine) {
				this._parseDataByLine(raw);
			}
		});

		socket.on("close", (hadError) => {
			this.connected = false;
			this.authSent = false;
			this._lineBuffer = "";
			this.emit("close", { hadError });
		});

		socket.on("error", (error) => {
			this.emit("error", { error });
		});

		socket.setTimeout(this.authTimeoutMs, () => {
			if (!this.authSent) {
				socket.destroy(new Error("Authentication frame not sent within timeout"));
			}
		});
	}

	_parseDataByLine(raw) {
		// Relay/control frames are newline-terminated by server, so parse buffered lines.
		const combined = this._lineBuffer + raw;
		const lines = combined.split(/\r?\n/);

		this._lineBuffer = lines.pop() || "";

		for (const line of lines) {
			if (!line) {
				continue;
			}

			const control = parseServerControlFrame(line);
			if (control) {
				this.emit("control", control);
				continue;
			}

			this.emit("relay", {
				payload: line,
				raw: line,
				replay: parseBufferedReplayFrame(line),
			});
		}
	}
}

export async function connect({ host, clientId, port = RURU_DEFAULT_PORT, authTimeoutMs = 5000 }) {
	const client = createRuRuClient({ host, clientId, port, authTimeoutMs });
	await client.connect();
	return client;
}

export function sendMessage(client, message) {
	if (!client || typeof client.sendMessage !== "function") {
		throw new Error("sendMessage expects a RuRuClient instance");
	}

	return client.sendMessage(message);
}

export function sendID(client) {
	if (!client || typeof client.sendID !== "function") {
		throw new Error("sendID expects a RuRuClient instance");
	}

	return client.sendID();
}
