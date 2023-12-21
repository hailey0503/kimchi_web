require("dotenv").config();
const ccxt = require('ccxt');
const { userClient } = require("./twitterClient.js");
const { sendMessage } = require("./telegram.js");
const { discordClient, sendDiscordMessage } = require("./discord.js");

// Initialize Upbit, Binance, and Bithumb exchange clients with your API keys
const upbit = new ccxt.upbit({ enableRateLimit: true });
const binance = new ccxt.binance({ enableRateLimit: true });
const bithumb = new ccxt.bithumb(); // Ensure you add enableRateLimit for Bithumb

let krwExchangeRate;


async function getExchangeRate() {
  const url = 'https://api.freecurrencyapi.com/v1/latest?apikey=' + process.env.EXCHANGEKIMP;
  try {
    const response = await fetch(url);
    const res_json = await response.json();
	//console.log("27",res_json)
    krwExchangeRate = res_json.data.KRW;

    console.log('Fetched exchange rate:', krwExchangeRate);
	return krwExchangeRate
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
  }
}

// Function to fetch the last price of BTC/USDT from an exchange
async function getPrice(exchange) {
	console.log('43', exchange.name)
	let ticker
	if (exchange.name == 'Upbit') {
		ticker = "BTC/KRW";
	} else if (exchange.name == 'Binance') {
		ticker =  "BTC/USDT"
	} else {
		ticker =  "USDT/KRW"
	}
	console.log('51',ticker)
	try {
		const tickerData = await exchange.fetchTicker(ticker);
		return tickerData.last;
	} catch (error) {
		console.error(`Error fetching data from exchange: ${error.message}`);
		return null;
	}
	
}

// Function to compare BTC prices and send the results to Telegram, Twitter, and Discord
async function comparePrices() {
  // Fetch the USD-KRW exchange rate
  try {
    const usdToKrwRate = await getExchangeRate(); // Use the cached exchange rate
    const upbitBTCPrice = await getPrice(upbit);
    const binanceBTCPrice = await getPrice(binance);
	const binanceBTCinKrw = binanceBTCPrice*usdToKrwRate
	const upbitUSDT = upbitBTCPrice / binanceBTCPrice;
    const bithumbUsdtPrice = await getPrice(bithumb);
	console.log('70',upbitBTCPrice, binanceBTCPrice, bithumbUsdtPrice)

    if (upbitBTCPrice && binanceBTCPrice && bithumbUsdtPrice) {
	  const upbitTether = ((upbitUSDT - usdToKrwRate) / usdToKrwRate) * 100;
      const upbitToBinanceDiff = ((upbitBTCPrice - binanceBTCinKrw) / binanceBTCinKrw) * 100;
      const bithumbUsdtDiff = ((bithumbUsdtPrice - usdToKrwRate) / usdToKrwRate) * 100;
	  const upbitTetherText = upbitTether  >= 0 ? `+${upbitTether .toFixed(1)}` : `-${upbitTether .toFixed(1)}`;
	  const upbitToBinanceDiffText = upbitToBinanceDiff >= 0 ? `+${upbitToBinanceDiff.toFixed(1)}` : `-${upbitToBinanceDiff.toFixed(1)}`;
	  const bithumbUsdtDiffText = bithumbUsdtDiff >= 0 ? `+${bithumbUsdtDiff.toFixed(1)}` : `-${bithumbUsdtDiff.toFixed(1)}`;

	  function addCommas(number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	  }
	  
	  const link = "https://kimchiwhale.io/#product-section";

	  console.log('80', upbitToBinanceDiff, bithumbUsdtDiff)
      const message = `
	  	🔥🔥 김프 업데이트 🔥🔥
		USD = ${addCommas(usdToKrwRate.toFixed(1))}원
		업비트 환산 USDT = ${addCommas(upbitUSDT.toFixed(1))}원 (${upbitTetherText}%) 
		빗썸 USDT = ${addCommas(bithumbUsdtPrice.toFixed(1))}원 (${bithumbUsdtDiffText}%)
		업비트 BTC = ${addCommas(upbitBTCPrice.toFixed(1))}원 (${upbitToBinanceDiffText}%) 
		바이낸스 BTC(원화환산) = ${addCommas(binanceBTCinKrw.toFixed(1))}원 
		바이낸스 BTC(USDT) = ${addCommas(binanceBTCPrice.toFixed(1))} USDT
		${link}
      `;

      console.log('89 msg', message);

	  
	  const tweetPromise = tweet(message);
	  const telegramPromise =  telegram(message)
	  const discordPromise = discord(message)
	  await Promise.all([tweetPromise, telegramPromise, discordPromise]);
    }
	
  } catch (error) {
    console.error(`107 Error fetching exchange rate: ${error.message}`);
  }
}

async function tweet(arg) {
	console.log("74 tweet in");
	try {
	  await userClient.v2.tweet(arg);
	} catch (e) {
	  console.error(e);
	}
  }
  async function telegram(arg) {
	console.log("121 telegram in");
	try {
	  await sendMessage(arg);
	  console.log("telegram sent");
	} catch (e) {
	  console.error(e);
	}
  }
  async function discord(arg) {
	console.log("130 discord");
	try {
	  await sendDiscordMessage(arg);
	} catch (e) {
	  console.error(e);
	}
  }
export default async (req, res) => {
	/*
	if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
		return res.status(401).end('Unauthorized');
	  }
	  */
	console.log('16')
	await getExchangeRate();
	console.log('18')
	await comparePrices();
	res.status(200).send("OK");
}
