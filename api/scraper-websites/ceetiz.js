const puppeteer = require("puppeteer-core");

const cityName = "amsterdam";

async function ceetiz() {
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

  // Going to Booking website:

  await page.goto(`https://www.ceetiz.com/${cityName}`);

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  await delay(2000);

  // Taking URL of attractions in the city and each event page link:

  await page.waitForSelector(".home--dest__intro__title");

  const events = await page.evaluate(() => {
    const attractions = document.querySelectorAll(
      "#featured-list > ul > li > article > a"
    );

    const links = [];
    for (let attraction of attractions) {
      links.push(attraction.href);
    }
    return links;
  });

  await delay(2000);

  console.log("Ceetiz: ", events.length);

  // Array created and loop on every event to take the data:

  const thingsToDo = [];
  for (let event of events) {
    await page.goto(event);
    await page.waitForSelector(
      "div.flex-grow.flex.flex-col.justify-between.gap-y-4 > div > h1"
    );

    await delay(1500);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document
        .querySelector(
          "div.flex-grow.flex.flex-col.justify-between.gap-y-4 > div > h1"
        )
        .textContent.trim();
      try {
        tmp.price = document
          .querySelector(
            "#reservation-wrapper > div > div.flex.flex-col.items-center.mt-4 > div > div.font-extrabold.text-xl.md\\:text-3xl.text-primary"
          )
          .textContent.trim();
      } catch (error) {
        tmp.price = "N.A.";
      }
      try {
        tmp.duration = document
          .querySelector(
            "#informations > section > div.flex.flex-row.flex-wrap.items-center.sm\\:pr-5.sm\\:odd\\:border-l.odd\\:border-grey-300.mb-7 > h3.flex.w-full.sm\\:w-1\\/2.p-2.items-start.sm\\:pr-5.mt-2 > div.ml-auto.font-bold.text-right > span"
          )
          .textContent.trim();
      } catch (error) {
        tmp.duration = "N.A.";
      }
      try {
        tmp.time = document
          .querySelector(
            "#informations > section > div.flex.flex-row.flex-wrap.items-center.sm\\:pr-5.sm\\:odd\\:border-l.odd\\:border-grey-300.mb-7 > h3.flex.w-full.sm\\:w-1\\/2.p-2.items-start.pr-5.mt-3 > div.ml-auto.font-bold.text-right"
          )
          .textContent.trim();
      } catch (error) {
        tmp.time = "N.A.";
      }
      try {
        tmp.rating = document
          .querySelector(
            "#reviews > div > section > div > div.flex.flex-col.items-center.md\\:flex-row.md\\:items-start > div.mr-2 > div"
          )
          .textContent.trim();
      } catch (error) {
        tmp.rating = "N.A.";
      }
      try {
        tmp.description = document
          .querySelector("#informations > div:nth-child(2) > div:nth-child(2)")
          .textContent.trim();
      } catch (error) {
        tmp.description = "N.A.";
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
  ceetiz: ceetiz,
};
