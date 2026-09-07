const axios = require("axios");
require("dotenv").config();
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/novabot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
      `Available Commands:
/novabot-ping - Check bot latency
/novabot-catfact - Get a cat fact
/novabot-joke - Get a random joke
/novabot-timer [duration] - Start a timer (default 25 minutes)
/novabot-weather [city] - Get weather information for a city
/novabot-quote - Get a random quote`
  });
});

app.command("/novabot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/novabot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/novabot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
        `${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/novabot-quote", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://dummyjson.com/quotes/random");
    await respond({
      text:
        `Quote:\n"${response.data.quote}" - ${response.data.author}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a quote." });
  }
});

app.command("/novabot-timer", async ({ command, ack, respond }) => {
  await ack();

  const duration = parseInt(command.text) || 25; // Default to 25 minutes if no duration is provided

  if (isNaN(duration) || duration <= 0) {
    await respond({ text: "Please provide a valid duration in minutes." });
    return;
  }

  const endTime = new Date(Date.now() + duration * 60000);

  await respond({
    text: `Pomodoro timer started for ${duration} minutes. It will end at ${endTime.toLocaleTimeString()}.`
  });

  setTimeout(async () => {
    await respond({
      text: `Pomodoro timer ended! Time to take a break.`
    });
  }, duration * 60000);
});

app.command("/novabot-weather", async ({ command, ack, respond }) => {
  await ack();

  const city = command.text.trim();
  if (!city) {
    await respond({ text: "Please provide a city name." });
    return;
  }

  try {
    const response = await axios.get(
      `https://wttr.in/${encodeURIComponent(city)}?format=3&m`
    );

    await respond({ text: `Weather in ${city}:\n${response.data.trim()}` });
  }

  catch (err) {
    console.error(err);
    await respond({ text: "Failed to fetch weather information." });
  }
});