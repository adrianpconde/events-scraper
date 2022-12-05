const puppeteer = require("puppeteer-core");

const cityName = "amsterdam";

async function yelp() {
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

  // Going to Yelp website:

  await page.goto(`https://www.yelp.nl/${cityName}`);

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  await delay(1000);

  // Going to Activities page on Yelp:

  await page.click(
    "yelp-react-root > div:nth-child(1) > div:nth-child(4) > div > div > div.arrange__09f24__LDfbs.gutter-5__09f24__NN5cr.layout-wrap__09f24__GEBlv.layout-4-units__09f24__FvTbi.border-color--default__09f24__NPAKY > div:nth-child(4) > a"
  );

  await delay(1000);

  // Taking URL of attractions in the city and each event page link:

  const eventsPages = [];

  const currentPage = await page.evaluate(() => {
    return window.location.href;
  });
  eventsPages.push(currentPage);

  for (let i = 0; i <= 20; i++) {
    await page.waitForSelector(
      "#main-content > div > ul > li:nth-child(13) > div > div:nth-child(1) > div > div:nth-child(11) > span > a"
    );
    await page.click(
      "#main-content > div > ul > li:nth-child(13) > div > div:nth-child(1) > div > div:nth-child(11) > span > a"
    );

    await delay(2500);

    let nextPage = await page.evaluate(() => {
      return window.location.href;
    });
    eventsPages.push(nextPage);
  }

  const events = [];

  for (let eventPage of eventsPages) {
    await page.goto(eventPage);
    await delay(1500);

    const yelpEvents = await page.evaluate(() => {
      const attractions = document.querySelectorAll(".css-8dlaw4");

      const links = [];
      for (let attraction of attractions) {
        links.push(attraction.href);
      }
      return links;
    });

    await delay(1500);

    events.push(yelpEvents);
  }

  const allEvents = events.flat();

  console.log("Yelp: ", allEvents.length);

  // Array created and loop on every event to take the data:

  const thingsToDo = [];
  for (let event of allEvents) {
    await page.goto(event);
    await page.waitForSelector(".css-1se8maq");

    await delay(2000);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector(".css-1se8maq").textContent;
      tmp.url = window.location.href;

      return tmp;
    });

    thingsToDo.push(attractionData);
  }

  await context.close();

  return thingsToDo;
}

module.exports = {
  yelp: yelp,
};
