const puppeteer = require("puppeteer-core");

async function ticketswap(cityName) {
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
    args: ["--incognito"],
  });

  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en",
  });

  // Going to Tickeswap website:

  await page.goto("https://www.ticketswap.com/");

  // Cookies accepted (Not necessary with headless: true on puppeteer.launch):

  await page.waitForSelector("button.css-853sc5.e1dvqv261");
  await page.click("button.css-853sc5.e1dvqv261");

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  await delay(1000);

  // Introducing city's name on searchbar:

  await page.type("#site-search-input", cityName);

  await delay(2000);

  await page.click("#site-search-item-0");

  // Taking URL of attractions in the city and each event page link:

  await page.waitForSelector(".css-1sovwns");

  await delay(2000);

  for (let i = 1; i <= 30; i++) {
    await page.click(".e1mdulau0");
    await delay(500);
  }

  const events = await page.evaluate(() => {
    const attractions = document.querySelectorAll(
      "div.css-1sovwns.e1fp01lr0 > a"
    );

    const links = [];
    for (let attraction of attractions) {
      links.push(attraction.href);
    }
    return links;
  });

  console.log("Ticketswap: ", events.length);

  await delay(3000);

  // Array created and loop on every event to take the data:

  const thingsToDo = [];
  for (let event of events) {
    await page.goto(event);
    await page.waitForSelector(".css-1btrs3f");

    await delay(3000);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      try {
        tmp.title = document.querySelector(
          "#__next > header > div.css-voqkl8.ej1og8q2 > h1"
        ).textContent.trim();
      } catch (error) {
        tmp.title = "N.A.";
      }
      tmp.price = "Data not available on event page";
      tmp.description = "Data not available on event page"
      tmp.description = "Data not available on event page"
      try {
        tmp.location = document.querySelector(
          "#__next > header > p.css-hc41ee.ej1og8q3"
        ).textContent.trim();
      } catch (error) {
        tmp.location = "N.A";
      }
      try {
        tmp.time = document.querySelector(
          "#__next > header > p.css-mcvk2t.ej1og8q8"
        ).textContent.trim();
      } catch (error) {
        tmp.time = "N.A.";
      }
      tmp.url = window.location.href;

      return tmp;
    });

    thingsToDo.push(attractionData);
  }

  await context.close();

  return thingsToDo;
}

module.exports = {
  ticketswap: ticketswap,
};
