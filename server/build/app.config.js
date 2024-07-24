"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = __importDefault(require("@colyseus/tools"));
const monitor_1 = require("@colyseus/monitor");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const Tactochess_1 = require("./rooms/Tactochess");
const key = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../certs/origin-key.pem'));
const cert = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../certs/origin-cert.pem'));
exports.default = (0, tools_1.default)({
    initializeGameServer: (gameServer) => {
        gameServer.define('tactochess', Tactochess_1.Tactochess);
    },
    initializeExpress: (app) => {
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        app.get("/helloworld", (req, res) => {
            res.send("YEP YEP IT WORKS!");
        });
        // Simple GET request handler for /token
        app.get('/token', (req, res) => {
            res.send("OAuth2 token endpoint is working. Use POST to exchange code for access token.");
        });
        // Handle POST request for the /token endpoint
        app.post("/token", async (req, res) => {
            const code = req.body.code;
            try {
                // Exchange the code for an access_token
                const response = await (0, node_fetch_1.default)(`https://discord.com/api/oauth2/token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        client_id: process.env.DISCORD_CLIENT_ID,
                        client_secret: process.env.DISCORD_CLIENT_SECRET,
                        grant_type: "authorization_code",
                        code: code,
                        redirect_uri: 'https://www.hexteriamc.net/token' // Ensure this matches the redirect URI
                    }),
                });
                // Retrieve the access_token from the response
                const data = await response.json();
                if (data.access_token) {
                    res.send({ access_token: data.access_token });
                }
                else {
                    res.status(400).send('Authentication failed!');
                }
            }
            catch (error) {
                console.error('Error exchanging code for access token:', error);
                res.status(500).send('Internal server error');
            }
        });
        // Use @colyseus/monitor
        app.use("/colyseus", (0, monitor_1.monitor)());
        // Create the HTTPS server
        const server = https_1.default.createServer({ key, cert }, app);
        // Listen on port 443
        server.listen(2567, 'www.hexteriamc.net', () => {
            console.log('Server is running on https://www.hexteriamc.net:2567');
        });
    },
    beforeListen: () => {
        // ...
    }
});
