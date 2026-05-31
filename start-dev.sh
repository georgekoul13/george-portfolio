#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd "/Users/george_koulouris/Cluade Ai/george-portfolio"
exec npm run dev
