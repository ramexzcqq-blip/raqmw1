// netlify/functions/server-status.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const host = 'tcp.cloudpub.ru';
    const port = 27271;

    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${host}:${port}`);
        
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();

        if (data.online) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    online: true,
                    host: host,
                    port: port,
                    players: data.players ? data.players.online : 0,
                    maxPlayers: data.players ? data.players.max : 20,
                    version: data.version || '1.21.5',
                    message: "Сервер онлайн",
                    motd: data.motd ? data.motd.clean : null,
                    software: data.software || null
                })
            };
        } else {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    online: false,
                    host: host,
                    port: port,
                    players: 0,
                    maxPlayers: 20,
                    message: "Сервер оффлайн",
                    version: "1.21.5"
                })
            };
        }
    } catch (error) {
        console.error('Error checking server status:', error);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                online: false,
                host: host,
                port: port,
                players: 0,
                maxPlayers: 20,
                message: `Ошибка подключения: ${error.message}`,
                version: "1.21.5"
            })
        };
    }
};
