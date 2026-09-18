/**
 * A TLS front door for the dev server, so a phone can reach it over https.
 *
 * iOS and Android both refuse the orientation and motion sensors on an
 * insecure origin, and a LAN IP on plain http is not a secure context — so
 * the avatar's gyroscope cannot be tested over http://192.168.x.x at all,
 * whatever the code does.
 *
 * A proxy rather than `next dev --experimental-https`, because that serves
 * the WHOLE dev server over a self-signed cert and the in-app browser pane
 * refuses to click through one — which costs the ability to verify anything.
 * This way the dev server stays on http for tooling and the phone gets https
 * on another port, both pointing at the same running app.
 *
 *   node scripts/tls-proxy.mjs [httpsPort] [targetPort]
 *
 * The cert must cover the LAN IP; see start-dev.sh for the mkcert line.
 */
import { createServer } from 'node:https';
import { request } from 'node:http';
import { readFileSync } from 'node:fs';
import { connect } from 'node:net';

const HTTPS_PORT = Number(process.argv[2] ?? 3443);
const TARGET = Number(process.argv[3] ?? 3000);

const server = createServer(
  {
    key: readFileSync(new URL('../certificates/lan-key.pem', import.meta.url)),
    cert: readFileSync(new URL('../certificates/lan.pem', import.meta.url)),
  },
  (req, res) => {
    const upstream = request(
      { host: '127.0.0.1', port: TARGET, path: req.url, method: req.method, headers: req.headers },
      (up) => {
        res.writeHead(up.statusCode ?? 502, up.headers);
        up.pipe(res);
      },
    );
    upstream.on('error', () => {
      res.writeHead(502);
      res.end('dev server not reachable');
    });
    req.pipe(upstream);
  },
);

/* Next's hot reload is a websocket, and without this it never connects —
   the page loads and then never updates, which looks exactly like a broken
   build rather than a missing upgrade handler. */
server.on('upgrade', (req, socket, head) => {
  const up = connect(TARGET, '127.0.0.1', () => {
    up.write(
      `${req.method} ${req.url} HTTP/1.1\r\n` +
        Object.entries(req.headers)
          .map(([k, v]) => `${k}: ${v}\r\n`)
          .join('') +
        '\r\n',
    );
    if (head?.length) up.write(head);
    up.pipe(socket);
    socket.pipe(up);
  });
  up.on('error', () => socket.destroy());
  socket.on('error', () => up.destroy());
});

server.listen(HTTPS_PORT, '0.0.0.0', () => {
  console.log(`tls proxy: https://0.0.0.0:${HTTPS_PORT} -> http://127.0.0.1:${TARGET}`);
});
