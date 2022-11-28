const puppeteer = require("puppeteer-core");

async function yelp() {
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--incognito"],
  });

  const context = await browser.createIncognitoBrowserContext();

  const page = await context.newPage();

  await page.setExtraHTTPHeaders({
    "Accept-Language": "en",
  });

  // Going to Yelp website:

  await page.goto("https://www.yelp.nl/amsterdam");

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

  // Taking URL of each event:

  const events = await page.evaluate(() => {
    const attractions = document.querySelectorAll(".css-8dlaw4");

    const links = [];
    for (let attraction of attractions) {
      links.push(attraction.href);
    }
    return links;
  });

  // Array created and loop on every event to take the data:

  const thingsToDo = [];
  for (let event of events) {
    await page.goto(event);
    await page.waitForSelector(".css-1se8maq");

    await delay(2000);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector(".css-1se8maq").textContent;
      return tmp;
    });

    thingsToDo.push(attractionData);
  }

  const yelpData = thingsToDo.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {});

  await context.close();

  return yelpData;
}

module.exports = {
  yelp: yelp,
};
