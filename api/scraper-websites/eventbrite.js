const puppeteer = require("puppeteer-core");

async function eventbrite(cityName) {
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

  // Going to Eventbrite website (just events on Amsterdam):

  await page.goto(
    `https://www.eventbrite.com/d/netherlands--${cityName}/all-events/`
  );

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  await delay(1000);

  // Cookies accepted:

  await page.waitForSelector(".evidon-banner-acceptbutton");
  await page.click(".evidon-banner-acceptbutton");

  await delay(2000);

  // Taking URL of attractions in the city and each event page link:

  const eventsPages = [];

  const currentPage = await page.evaluate(() => {
    return window.location.href;
  });
  eventsPages.push(currentPage);

  for (let i = 0; i <= 5; i++) {
    await page.waitForSelector("[data-spec='page-next']");
    await page.click("[data-spec='page-next']");

    await delay(2500);

    let nextPage = await page.evaluate(() => {
      return window.location.href;
    });
    eventsPages.push(nextPage);
  }
  const events = [];

  for (let eventPage of eventsPages) {
    await page.goto(eventPage);
    await delay(1000);

    const eventbriteEvents = await page.evaluate(() => {
      const attractions = document.querySelectorAll(
        ".eds-event-card-content--standard > div.eds-event-card-content__content-container.eds-l-pad-right-4 > div > div > div.eds-event-card-content__primary-content > a"
      );
      const links = [];
      for (let attraction of attractions) {
        links.push(attraction.href);
      }
      return links;
    });

    await delay(2000);

    events.push(eventbriteEvents);
  }

  const allEvents = events.flat();

  console.log("Eventbite: ", allEvents.length);

  // Array created and loop on every event to take the data:

  const thingsToDo = [];
  for (let event of allEvents) {
    await page.goto(event);

    await delay(3000);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector(
        "#root > div > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > div > div.event-details > div.event-details__wrapper > div.event-details__main > div:nth-child(1) > h1"
      ).textContent.trim();
      try {
        tmp.price = document.querySelector(
          "div.event-details > div.event-details__wrapper > div.event-details__aside > div > div.conversion-bar__body > div"
        ).textContent.trim();
      } catch (error) {
        tmp.price = "N.A.";
      }
      try {
        tmp.description = document.querySelector(
          "div.event-details__main > div:nth-child(1) > p > strong"
        ).textContent.trim();
      } catch (error) {
        tmp.description = "N.A.";
      }
      tmp.rating = "N.A.";
      try {
        tmp.location = document.querySelector(
          "#root > div > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > div > div.event-details > div.event-details__wrapper > div.event-details__main > section > div.event-details__main-inner > div.detail-list > section:nth-child(2) > div.detail__content > p"
        ).textContent.trim();
      } catch (error) {
        tmp.location = "N.A.";
      }
      try {
        tmp.time = document.querySelector(
          "#root > div > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > div > div.event-details > div.event-details__wrapper > div.event-details__main > section > div.event-details__main-inner > div.detail-list > section:nth-child(1) > div.detail__content > p > time"
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
  eventbrite: eventbrite,
};
