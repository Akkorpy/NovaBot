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
/novabot-poll [question] - Create a poll
/novabot-reminder [time] [message] - Set a reminder
/novabot-translate [target_language] [text] - Translate text to a target language
/novabot-exchangerate [from_currency] [to_currency] [amount] - Get exchange rate between two currencies
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

app.command("/novabot-poll", async ({ command, ack, respond, client }) => {
  await ack();

  if (!question) {
    await respond({ text: "Please provide a question for the poll." });
    return;
  }

  try {
    const result = await client.chat.postMessage({
      channel: command.channel_id,
      text: `Poll: ${question}`,
    });

    await client.reactions.add({
      name: "thumbsup",
      channel: result.channel,
      timestamp: result.ts,
    });

    await client.reactions.add({
      name: "thumbsdown",
      channel: result.channel,
      timestamp: result.ts,
    });

    await respond({ text: "Poll created successfully!" });
  } catch (err) {
    await respond({ text: "Failed to create poll." });
  }
});

app.command("/novabot-reminder", async ({ command, ack, respond }) => {
  await ack();

  const parts = command.text.split(" ");
  const time = parts[0];
  const message = parts.slice(1).join(" ");

  if (!time || !message) {
    await respond({ text: "Please provide a time and a message for the reminder." });
    return;
  }

  const unit = time.slice(-1).toLowerCase();
  const value = parseInt(time.slice(0, -1), 10);

  if (isNaN(value) || value <= 0 || !["s", "m", "h"].includes(unit)) {
    await respond({ text: "Please provide a valid time format (e.g., 10s, 5m, 1h)." });
    return;
  }

  const ms = unit === "s" ? value * 1000 : value * 60000;

  await respond({ text: `Reminder set for ${time}. I will remind you: "${message}"` });

  setTimeout(async () => {
    responce_type = "in_channel";
    await respond({
      text: `Reminder: ${message}`
    });
  }, ms);
});

app.command("/novabot-translate", async ({ command, ack, respond }) => {
  await ack();

  try {
    const parts = command.text.split(" ");
    const targetLang = parts[0];
    const textToTranslate = parts.slice(1).join(" ");

    if (!targetLang || !textToTranslate) {
      await respond({ text: "Please provide a target language and text to translate." });
      return;
    }

    const response = await axios.post(
      `https://translate.argosopentech.com/translate`,
      {
        q: textToTranslate,
        source: "auto",
        target: targetLang
      }
    );

    await respond({ text: `Translated Text:\n${response.data.translatedText}` });
  } catch (err) {
    await respond({ text: "Failed to translate the text." });
  }
});

app.command("/novabot-exchangerate", async ({ command, ack, respond }) => {
  await ack();

  try {
    const text = command.text.trim();
    const parts = text.split(/\s+/);

    if (!text || parts.length < 2 || !parts[0] || !parts[1]) {
      await respond({ text: "Please provide both source and target currencies." });
      return;
    }

    const fromCurrency = parts[0].toUpperCase();
    const toCurrency = parts[1].toUpperCase();
    const amount = parseFloat(parts[2]) || 1; // Default to 1 if no amount is provided

    const response = await axios.get(`https://open.er-api.com/v6/latest/USD`);
    const rates = response.data.rates;

    if (!rates[fromCurrency] || !rates[toCurrency]) {
      await respond({ text: "Invalid currency codes provided." });
      return;
    }

    const result = (amount / rates[fromCurrency]) * rates[toCurrency];

    await respond({ text: `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}` });
  } catch (err) {
    await respond({ text: "Failed to fetch exchange rates." });
  }
});