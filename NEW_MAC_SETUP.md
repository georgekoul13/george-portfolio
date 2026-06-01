# New Mac Setup — Portfolio Dev Environment

Follow these steps in order on your new Mac to get the project running locally.

---

## Step 1 — Install Homebrew

Homebrew is the package manager for Mac. Open Terminal and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. At the end it may ask you to run 2 extra commands to add it to your PATH — do that.

Verify it worked:
```bash
brew --version
```

---

## Step 2 — Install Node.js

```bash
brew install node
```

Verify:
```bash
node --version   # should show v18 or higher
npm --version
```

---

## Step 3 — Install Git

Git is usually pre-installed on Mac, but to get the latest version:

```bash
brew install git
```

Set your identity (use your real name and GitHub email):
```bash
git config --global user.name "George Koulouris"
git config --global user.email "your-github-email@example.com"
```

---

## Step 4 — Clone the Project from GitHub

```bash
cd ~
mkdir "Cluade Ai"
cd "Cluade Ai"
git clone https://github.com/georgekoul13/george-portfolio.git
```

You'll be asked for your GitHub username and a password — use a **Personal Access Token** (not your GitHub password):

1. Go to github.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → give it `repo` scope → copy it
3. Paste it as the password when git asks

---

## Step 5 — Install Dependencies

```bash
cd "/Users/YOUR_USERNAME/Cluade Ai/george-portfolio"
npm install
```

Replace `YOUR_USERNAME` with your actual Mac username (e.g. `george_koulouris`).

---

## Step 6 — Run the Dev Server

```bash
cd "/Users/YOUR_USERNAME/Cluade Ai/george-portfolio"
npm run dev
```

Open your browser at `http://localhost:3000` — the site should appear.

To stop the server: press `Ctrl + C` in Terminal.

---

## Step 7 — Install Claude Code (AI assistant)

```bash
npm install -g @anthropic-ai/claude-code
```

Then run it from the project folder:
```bash
cd "/Users/YOUR_USERNAME/Cluade Ai/george-portfolio"
claude
```

Sign in with your Anthropic account when prompted.

---

## Daily Workflow

**Start working:**
```bash
cd "/Users/YOUR_USERNAME/Cluade Ai/george-portfolio"
npm run dev
```
Site runs at `http://localhost:3000`.

**Push a change to the live site:**
```bash
cd "/Users/YOUR_USERNAME/Cluade Ai/george-portfolio" && git add -A && git commit -m "what you changed" && git push
```

Vercel detects the push and rebuilds automatically. Live in ~2 minutes.

---

## If the Dev Server Acts Weird

Clear the Next.js cache and restart:
```bash
cd "/Users/YOUR_USERNAME/Cluade Ai/george-portfolio"
rm -rf .next && npm run dev
```

---

## Project Folder Structure Reminder

The project lives at:
```
~/Cluade Ai/george-portfolio/
```

Note: "Cluade" is a typo in the folder name — keep it as-is to match the git remote config.

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start local dev server at localhost:3000 |
| `npm run build` | Build for production (checks for errors) |
| `git status` | See what files have changed |
| `git log --oneline -10` | See last 10 commits |
| `git add -A && git commit -m "msg" && git push` | Save and deploy changes |
