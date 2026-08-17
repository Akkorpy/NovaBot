## NovaBot
A Slack bot designed to deliver random cat facts, check latensy, and provide quick command help inside your workspace.

<img width="1036" height="462" alt="image" src="https://github.com/user-attachments/assets/34a79353-1550-4e59-8d39-050b2b5ee135" />

## Quick Start
```bash
git clone [https://github.com/Akkorpy/NovaBot.git](https://github.com/Akkorpy/NovaBot.git)
npm install
node index.js
```
## Features
* `/novabot-ping` - Checks the bot's response time.
* `/novabot-catfact` - Fetches a random fun fact about cats.
* `/novabot-joke` - Delivers a random joke directly to the channel.
* `/novabot-help` - Shows a list of all available commands and instructions.

## Local Development

### Requirements
* Node.js v18+ 
* npm

### Environment Setup
Create a `.env` file in the root directory with the following variables:
```text
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
```

## How It Works
NovaBot relies on Slack's Bolt for JavaScript framework to handle Slack Events API over Socket Mode. Using Socket Mode avoids the need for a public HTTP endpoint during local testing while maintaining reliable, real-time response times for slash commands.

External API requests (such as fetching random facts and jokes) are handled asynchronously via Axios to ensure non-blocking event loops and smooth command handling.

## Credits & Acknowledgements
* `Slack Bolt for JavaScript` — Framework for building Slack apps.
* `Cat Facts API` — Provider for random cat facts.
