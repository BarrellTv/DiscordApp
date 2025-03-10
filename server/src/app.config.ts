import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { Tactochess } from "./rooms/Tactochess";

const key = fs.readFileSync(path.resolve(__dirname, '../../certs/origin-key.pem'));
const cert = fs.readFileSync(path.resolve(__dirname, '../../certs/origin-cert.pem'));

export default config({
    initializeGameServer: (gameServer) => {
        gameServer.define('tactochess', Tactochess);
    },
    initializeExpress: (app) => {
        app.use(express.json());
        app.use(cors());

        app.get("/helloworld", (req, res) => {
            res.send("YEP YEP IT WORKS!");
        });

        // Simple GET request handler for /token
        app.get('/token', (req, res) => {
            res.send("OAuth2 token endpoint is working. Use POST to exchange code for access token.");
        });

        // Handle POST request for the /token endpoint
        app.post("/token", async (req, res) => {
            const code = req.body.code as string;

            try {
                // Exchange the code for an access_token
                const response = await fetch(`https://discord.com/api/oauth2/token`, {
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
                const data = await response.json() as { access_token: string };

                if (data.access_token) {
                    res.send({ access_token: data.access_token });
                } else {
                    res.status(400).send('Authentication failed!');
                }
            } catch (error) {
                console.error('Error exchanging code for access token:', error);
                res.status(500).send('Internal server error');
            }
        });

        // Use @colyseus/monitor
        app.use("/colyseus", monitor());

        // Create the HTTPS server
        const server = https.createServer({ key, cert }, app);

        // Listen on port 443
        server.listen(2567, 'www.hexteriamc.net', () => {
            console.log('Server is running on https://www.hexteriamc.net:2567');
        });
    },
    beforeListen: () => {
        // ...
    }
});
