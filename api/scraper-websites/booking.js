const puppeteer = require("puppeteer-core");

async function booking(cityName) {
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

  await page.goto("https://www.booking.com/attractions/");

  // Cookies accepted (Not necessary with headless: true on puppeteer.launch):

  await page.waitForSelector("#onetrust-accept-btn-handler");
  await page.click("#onetrust-accept-btn-handler");

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  await delay(1000);

  // Introducing city's name on searchbar:

  await page.click(".css-uigm6z");

  await page.type(".css-uigm6z", cityName);

  await delay(2000);

  await page.waitForSelector(".css-e4thx1");

  await page.click(".css-e4thx1");

  await page.click("button.css-14gytlh");

  await delay(3000);

  // Taking URL of attractions in the city and each event page link:

  const eventsPages = [];

  const currentPage = await page.evaluate(() => {
    return window.location.href;
  });
  eventsPages.push(currentPage);

  const lastPageNumber = document.querySelector(
    "body > div:nth-child(2) > div > div > div > div.css-ngwlx1 > div > div.css-1uptleh > div.css-uuk9q1 > div:nth-child(2) > div > nav > div > div.eef2c3ca89 > ol > li:nth-child(6) > button"
  ).textContent;

  for (let i = 0; i <= lastPageNumber - 1; i++) {
    await page.waitForSelector("div.f32a99c8d1.f78c3700d2 > button");
    await page.click("div.f32a99c8d1.f78c3700d2 > button");

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

    const bookingEvents = await page.evaluate(() => {
      const attractions = document.querySelectorAll("a[rel=noreferrer]");
      const links = [];
      for (let attraction of attractions) {
        links.push(attraction.href);
      }
      return links;
    });

    await delay(1500);

    events.push(bookingEvents);
  }

  const allEvents = events.flat();

  console.log("Booking: ", allEvents.length);

  // Array created and loop on every event to take the data:

  const thingsToDo = [];
  for (let event of allEvents) {
    await page.goto(event);
    await page.waitForSelector(".css-1hp67ie");

    await delay(1500);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document
        .querySelector(".e1f827110f, .css-1uk1gs8")
        .textContent.trim();
      try {
        tmp.price = document
          .querySelector(
            "div.css-2ygbp3 > div:nth-child(1) > div > div.ac78a73c96"
          )
          .textContent.trim();
      } catch (ex0) {
        try {
          tmp.price = document
            .querySelector(
              "div.css-6psj0n > div:nth-child(1) > div > div.b72a27c85f > span"
            )
            .textContent.trim();
        } catch (ex1) {
          tmp.price = "N.A.";
        }
      }
      try {
        tmp.description = document
          .querySelector(".a0c113411d")
          .textContent.trim();
      } catch (error) {
        tmp.description = "N.A.";
      }
      try {
        tmp.rating = document
          .querySelector("div.a0c113411d.css-1baulvz > strong")
          .textContent.trim();
      } catch (error) {
        tmp.rating = "N.A.";
      }
      try {
        tmp.location = document
          .querySelector(
            "#attr-product-page-main-content > div.css-1hp67ie > div.css-1mp2v6w > div.a0c113411d.f660aace8b > div > div.f660aace8b.f81ab4937d > div:nth-child(2)"
          )
          .textContent.trim();
      } catch (error) {
        tmp.location = "N.A.";
      }
      try {
        tmp.time = document
          .querySelector(
            "body > div:nth-child(2) > div > div > div > div.css-ngwlx1 > div > div.css-sp37w6 > div > div > div > div > form > div:nth-child(3) > div > div"
          )
          .textContent.trim();
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
  booking: booking,
};
