const puppeteer = require("puppeteer-core");

async function eventbrite() {
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

  // Going to Eventbrite website (just events on Amsterdam):

  await page.goto(
    "https://www.eventbrite.com/d/netherlands--amsterdam/events--today/"
  );

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  await delay(1000);

  // Cookies accepted:

  await page.waitForSelector(".evidon-banner-acceptbutton");
  await page.click(".evidon-banner-acceptbutton"); // cookies

  await delay(2000);

  // Taking URL of each event:

  const events = await page.evaluate(() => {
    const attractions = document.querySelectorAll(
      ".eds-event-card-content--standard > div.eds-event-card-content__content-container.eds-l-pad-right-4 > div > div > div.eds-event-card-content__primary-content > a"
    );

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
    await page.waitForSelector(".event-title");

    await delay(2000);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector(".event-title").textContent;
      try {
        tmp.description_short = document.querySelector(
          "div.event-details__main > div:nth-child(1) > p > strong"
        ).textContent;
      } catch (error) {
        tmp.description_short = "N.A.";
      }
      try {
        tmp.price = document.querySelector(
          "div.event-details > div.event-details__wrapper > div.event-details__aside > div > div.conversion-bar__body > div"
        ).textContent;
      } catch (error) {
        tmp.price = "N.A.";
      }
      try {
        tmp.author = document.querySelector(
          "div.organizer-info__name > a"
        ).textContent;
      } catch (error) {
        tmp.author = "N.A.";
      }
      tmp.url = window.location.href;

      return tmp;
    });

    thingsToDo.push(attractionData);
  }

  const eventbriteData = thingsToDo.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {});

  await context.close();

  return eventbriteData;
}

module.exports = {
  eventbrite: eventbrite,
};
