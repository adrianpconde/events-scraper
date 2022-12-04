const puppeteer = require("puppeteer-core");

// Selectors of each city of The Netherland on Tiqets:
const amsterdam =
  "div.DestinationsList.flex-box.smooth-touch-scrolling.pt4.DestinationsList--page-section.mb8 > div > a:nth-child(1)";
const rotterdam =
  "div.DestinationsList.flex-box.smooth-touch-scrolling.pt4.DestinationsList--page-section.mb8 > div > a:nth-child(2)";
const groningen =
  "div.DestinationsList.flex-box.smooth-touch-scrolling.pt4.DestinationsList--page-section.mb8 > div > a:nth-child(3)";
const theHague =
  "div.DestinationsList.flex-box.smooth-touch-scrolling.pt4.DestinationsList--page-section.mb8 > div > a:nth-child(4)";
const kaatsheuvel =
  "div.DestinationsList.flex-box.smooth-touch-scrolling.pt4.DestinationsList--page-section.mb8 > div > a:nth-child(5)";
const lisse =
  "div.DestinationsList.flex-box.smooth-touch-scrolling.pt4.DestinationsList--page-section.mb8 > div > a:nth-child(6)";
const joure =
  "div.DestinationsList.flex-box.smooth-touch-scrolling.pt4.DestinationsList--page-section.mb8 > div > a:nth-child(7)";
const leiden =
  "div.DestinationsList.flex-box.smooth-touch-scrolling.pt4.DestinationsList--page-section.mb8 > div > a:nth-child(8)";

// Select your city:

const cityName = amsterdam;

async function tiqets() {
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

  // Going to Tiqets website:

  await page.goto(
    "https://www.tiqets.com/en/the-netherlands-attractions-z50166/?partner=travel_and_destinations"
  );

  await page.click(cityName);

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  await page.waitForSelector(".text-heading-l");

  await delay(2000);

  // Taking URL of attractions in the city and each event page link:

  for (let i = 1; i <= 10; i++) {
    await page.click(
      "body > div:nth-child(8) > section:nth-child(6) > div > div > div:nth-child(3) > button"
    );
    await delay(1500);
  }

  const events = await page.evaluate(() => {
    const attractions = document.querySelectorAll(
      "div.CardInfoWrap.flex-box.flex-column.flex-1.w100 > div.flex-box > div.no-overflow.pr8 > h3 > a"
    );

    const links = [];
    for (let attraction of attractions) {
      links.push(attraction.href);
    }
    return links;
  });

  console.log("Tiqets: ", events.length);

  await delay(1000);

  // Array created and loop on every event to take the data:

  const thingsToDo = [];
  for (let event of events) {
    await page.goto(event);
    await page.waitForSelector(
      "div.PageHeaderSection__overlay.absolute.t0.b0.l0.r0"
    );

    await delay(2000);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector(
        "div.PageHeaderSection__content-inner-wrap.w100.text-white.relative.px16.my24 > h1"
      ).textContent;
      try {
        tmp.description = document.querySelector(
          "#about > div > div:nth-child(1) > div > div > div.location-description.pb16.px16 > p:nth-child(1)"
        ).textContent;
      } catch (error) {
        tmp.description = "N.A.";
      }
      try {
        tmp.price = document.querySelector(
          "#tickets > div:nth-child(4) > div > article > div > div > div.border-top-solid-1.border-grey500.py8.pl12.pr8.flex-box.flex-center-y.push-down > div > span"
        ).textContent;
      } catch (error) {
        tmp.price = "N.A.";
      }
      try {
        tmp.rating = document.querySelector(
          "#tickets > div.Grid > div > div.ReviewSummary.mt16.mb16 > div.flex-box.text-ink500.mb8 > span"
        ).textContent;
      } catch (error) {
        tmp.rating = "N.A.";
      }
      tmp.url = window.location.href;

      return tmp;
    });

    thingsToDo.push(attractionData);
  }

  const tiqetsData = thingsToDo.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {});

  await context.close();

  return tiqetsData;
}

module.exports = {
  tiqets: tiqets,
};
