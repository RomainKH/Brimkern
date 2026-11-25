#!/usr/bin/env python3
"""Suivi EN DIRECT de la boucle d'apprentissage (learn.py) : les parties se jouent sous vos yeux.

    python scripts/chess/live.py --work <dossier de learn.py>     # puis http://localhost:8765

Sert live.html (à côté de ce script) et <work>/live.json, que learn.py réécrit après chaque coup.
Écoute sur 127.0.0.1 seulement : rien n'est exposé au réseau.
"""
import argparse
import http.server
import os

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--work", required=True)
    ap.add_argument("--port", type=int, default=8765)
    a = ap.parse_args()
    work = os.path.abspath(a.work)

    class H(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            path = self.path.split("?", 1)[0]
            if path in ("/", "/index.html"):
                f, ctype = os.path.join(HERE, "live.html"), "text/html; charset=utf-8"
            elif path == "/live.json":
                f, ctype = os.path.join(work, "live.json"), "application/json"
            else:
                self.send_error(404)
                return
            try:
                with open(f, "rb") as fh:
                    body = fh.read()
            except FileNotFoundError:
                body, ctype = b"{}", "application/json"
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, *args):
            pass

    print(f"direct : http://localhost:{a.port}  (dossier {work})", flush=True)
    http.server.ThreadingHTTPServer(("127.0.0.1", a.port), H).serve_forever()


if __name__ == "__main__":
    main()
