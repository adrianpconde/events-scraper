const puppeteer = require("puppeteer-core");

async function booking() {
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

  // Cookies accepted:

  await page.waitForSelector("#onetrust-accept-btn-handler");
  await page.click("#onetrust-accept-btn-handler"); // cookies

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  await delay(1000);

  // Introducing city's name on the searchbar:

  await page.click(".css-uigm6z");

  let cityName = "amsterdam";

  await page.type(".css-uigm6z", cityName);

  await delay(1000);

  await page.click(".css-e4thx1");

  await page.click("button.css-14gytlh");

  await delay(3000);

  // Taking URL of each event:

  const events = await page.evaluate(() => {
    const attractions = document.querySelectorAll(".css-vzwf41");

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
    await page.waitForSelector(".css-1hp67ie");

    await delay(2000);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector(
        ".e1f827110f, .css-1uk1gs8"
      ).textContent;
      try {
        tmp.description_short =
          document.querySelector(".a0c113411d").textContent;
      } catch (error) {
        tmp.description_short = "N.A.";
      }
      try {
        tmp.description_long = document.querySelector(
          "#attr-product-page-main-content > div.css-1hp67ie > div.css-n9kgwt"
        ).textContent;
      } catch (error) {
        tmp.description_long = "N.A.";
      }
      try {
        tmp.price = document.querySelector(
          "div.css-2ygbp3 > div:nth-child(1) > div > div.ac78a73c96"
        ).textContent;
      } catch (error) {
        tmp.price = "N.A.";
      }
      try {
        tmp.rating = document.querySelector(
          "div.a0c113411d.css-1baulvz > strong"
        ).textContent;
      } catch (error) {
        tmp.rating = "N.A.";
      }
      try {
        tmp.bonus = document.querySelector(
          "div.css-1qm1lh > ul > li:nth-child(3) > div > div"
        ).textContent;
      } catch (error) {
        tmp.bonus = "N.A.";
      }

      return tmp;
    });

    thingsToDo.push(attractionData);
  }

  console.log(thingsToDo);

  await context.close();
}

module.exports = {
  booking: booking,
};
