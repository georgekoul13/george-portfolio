#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd "/Users/george_koulouris/Cluade Ai/george-portfolio"
# -H 0.0.0.0 binds every interface, not just loopback, so the site is
# reachable from a phone on the same wifi at http://<mac-lan-ip>:3000.
# Drop the flag to go back to localhost-only.
exec npm run dev -- -H 0.0.0.0
