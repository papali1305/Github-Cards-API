const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const {
  generateCard,
  CARD_AGE,
  generateHTMLCard,
  Languages,
} = require("../card-generator");
const { parseOptions } = require("../options-parser");

const DATA_FILE_PATH = "./src/data/top_tweets.json";
const DEFAULT_THEME = "dark_2";
const SUPPORTED_THEMES = ["light", "dark", "dark_2", "custom"];
const SUPPORTED_LANGUAGES = [Languages.ENGLISH];

const handleTheme = (req, res, next) => {
  req.theme = req.query.theme || DEFAULT_THEME;
  if (!SUPPORTED_THEMES.includes(req.theme)) {
    throw new Error(`Unsupported theme: ${req.theme}`);
  }
  next();
};

const handleOptions = (req, res, next) => {
  if (req.theme === "custom") {
    req.options = parseOptions(req.query);
  }
  next();
};

const getTweetContent = (tweet) => {
  return `${tweet.tweet}\n\n- ${tweet.author}`;
};

router.get("/", handleTheme, handleOptions, async (req, res) => {
  try {
    const tweets = JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf8"));
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)];

    const tweetContent = getTweetContent(randomTweet);
    const language = Languages.ENGLISH; // Default language

    let tweetCard;
    if (req.theme === "custom") {
      const htmlContent = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #1e1e1e; color: #ffffff; border: 2px solid #3a3a3a; padding: 25px; width: 420px; text-align: center; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">
          <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
            <span style="font-size: 16px; font-weight: bold; color: #ffffff; background: linear-gradient(90deg, #00ff9d, #00e4ff);padding:10px;">"${tweetContent}"</span>
          </div>
        </div>
      `;
      tweetCard = await generateHTMLCard(htmlContent, language);
    } else {
      tweetCard = await generateCard(
        tweetContent,
        req.theme,
        req.options,
        language
      );
    }

    res.writeHead(200, {
      "Content-Type": "image/svg+xml",
      "Cache-Control": `public, max-age=${CARD_AGE}`,
    });
    res.end(tweetCard);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add more functionality: support for multiple languages
router.get("/lang/:lang", handleTheme, handleOptions, async (req, res) => {
  try {
    const lang = req.params.lang;
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      throw new Error(`Unsupported language: ${lang}`);
    }

    const tweets = JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf8"));
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)];

    const tweetContent = getTweetContent(randomTweet);
    const language = lang;

    let tweetCard;
    if (req.theme === "custom") {
      const htmlContent = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #1e1e1e; color: #ffffff; border: 2px solid #3a3a3a; padding: 25px; width: 420px; text-align: center; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">
          <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
            <span style="font-size: 16px; font-weight: bold; color: #ffffff; background: linear-gradient(90deg, #00ff9d, #00e4ff);padding:10px;">"${tweetContent}"</span>
          </div>
        </div>
      `;
      tweetCard = await generateHTMLCard(htmlContent, language);
    } else {
      tweetCard = await generateCard(
        tweetContent,
        req.theme,
        req.options,
        language
      );
    }

    res.writeHead(200, {
      "Content-Type": "image/svg+xml",
      "Cache-Control": `public, max-age=${CARD_AGE}`,
    });
    res.end(tweetCard);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add more functionality: support for custom font sizes
router.get("/font-size/:size", handleTheme, handleOptions, async (req, res) => {
  try {
    const size = req.params.size;
    if (!/^\d+$/.test(size)) {
      throw new Error(`Invalid font size: ${size}`);
    }

    const tweets = JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf8"));
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)];

    const tweetContent = getTweetContent(randomTweet);
    const language = Languages.ENGLISH; // Default language

    let tweetCard;
    if (req.theme === "custom") {
      const htmlContent = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #1e1e1e; color: #ffffff; border: 2px solid #3a3a3a; padding: 25px; width: 420px; text-align: center; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">
          <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
            <span style="font-size: ${size}px; font-weight: bold; color: #ffffff; background: linear-gradient(90deg, #00ff9d, #00e4ff);padding:10px;">"${tweetContent}"</span>
          </div>
        </div>
      `;
      tweetCard = await generateHTMLCard(htmlContent, language);
    } else {
      tweetCard = await generateCard(
        tweetContent,
        req.theme,
        req.options,
        language
      );
    }

    res.writeHead(200, {
      "Content-Type": "image/svg+xml",
      "Cache-Control": `public, max-age=${CARD_AGE}`,
    });
    res.end(tweetCard);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add more functionality: support for custom colors
router.get("/color/:color", handleTheme, handleOptions, async (req, res) => {
  try {
    const color = req.params.color;
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      throw new Error(`Invalid color: ${color}`);
    }

    const tweets = JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf8"));
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)];

    const tweetContent = getTweetContent(randomTweet);
    const language = Languages.ENGLISH; // Default language

    let tweetCard;
    if (req.theme === "custom") {
      const htmlContent = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #1e1e1e; color: #ffffff; border: 2px solid #3a3a3a; padding: 25px; width: 420px; text-align: center; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">
          <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
            <span style="font-size: 16px; font-weight: bold; color: ${color}; background: linear-gradient(90deg, #00ff9d, #00e4ff);padding:10px;">"${tweetContent}"</span>
          </div>
        </div>
      `;
      tweetCard = await generateHTMLCard(htmlContent, language);
    } else {
      tweetCard = await generateCard(
        tweetContent,
        req.theme,
        req.options,
        language
      );
    }

    res.writeHead(200, {
      "Content-Type": "image/svg+xml",
      "Cache-Control": `public, max-age=${CARD_AGE}`,
    });
    res.end(tweetCard);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Add more functionality: support for custom backgrounds
router.get("/background/:background", handleTheme, handleOptions, async (req, res) => {
  try {
    const background = req.params.background;
    if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(background)) {
      throw new Error(`Invalid background: ${background}`);
    }

    const tweets = JSON.parse(await fs.readFile(DATA_FILE_PATH, "utf8"));
    const randomTweet = tweets[Math.floor(Math.random() * tweets.length)];

    const tweetContent = getTweetContent(randomTweet);
    const language = Languages.ENGLISH; // Default language

    let tweetCard;
    if (req.theme === "custom") {
      const htmlContent = `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-image: url(${background}); background-size: cover; background-position: center; color: #ffffff; border: 2px solid #3a3a3a; padding: 25px; width: 420px; text-align: center; border-radius: 12px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3); font-family: 'Roboto', sans-serif;">
          <div style="display: flex; justify-content: center; flex-direction: column; align-items: center;">
            <span style="font-size: 16px; font-weight: bold; color: #ffffff; background: linear-gradient(90deg, #00ff9d, #00e4ff);padding:10px;">"${tweetContent}"</span>
          </div>
        </div>
      `;
      tweetCard = await generateHTMLCard(htmlContent, language);
    } else {
      tweetCard = await generateCard(
        tweetContent,
        req.theme,
        req.options,
        language
      );
    }

    res.writeHead(200, {
      "Content-Type": "image/svg+xml",
      "Cache-Control": `public, max-age=${CARD_AGE}`,
    });
    res.end(tweetCard);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
