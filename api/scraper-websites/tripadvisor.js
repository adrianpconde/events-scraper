const puppeteer = require("puppeteer-core");

async function tripadvisor() {
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

  // Going to Tripadvisor website:

  await page.goto("https://www.tripadvisor.com/Attractions");

  await page.click("#taplc_trip_search_home_attractions_component_0");

  // Introducing city's name on searchbar:

  let cityName = "amsterdam";
  await page.type("#taplc_trip_search_home_attractions_component_0", cityName); // introducing city's name

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  await delay(3000);

  // Cookies accepted:

  await page.click("#onetrust-accept-btn-handler");
  await delay(1000);

  // Introducing city's name on searchbar and selecting first acception on searchbar:

  await page.click("#taplc_trip_search_home_attractions_component_0");
  await page.click(".GzJDZ");

  // Access to "See All" attractions page on Tripadvisor:

  const attractionPage = await page.evaluate(() => {
    return window.location.href.split("Activities-").join("oa0-");
  });

  await page.goto(attractionPage);

  await delay(2000);

  // Taking URL of each event:

  const events = await page.evaluate(() => {
    const attractions = document.querySelectorAll(".BUupS");

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
    await page.waitForSelector(".eIegw");

    await delay(1500);

    const attraction = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector(".nrbon").textContent;
      try {
        tmp.time = document.querySelector(
          "div.IxAZL > div > div:nth-child(3) > div._c"
        ).textContent;
      } catch (error) {
        tmp.time = "N.A.";
      }
      try {
        tmp.price = document.querySelector(
          "div.MQPqk > div > div > div.f.k.O.ncFvv > div.biGQs._P.fiohW.uuBRH"
        ).textContent;
      } catch (error) {
        tmp.price = "N.A.";
      }
      try {
        tmp.category = document.querySelector(
          "div.C > section:nth-child(2) > div > div > div > div > div:nth-child(1) > div:nth-child(3) > div > div > div.fIrGe._T.bgMZj"
        ).textContent;
      } catch (error) {
        tmp.category = "N.A.";
      }
      tmp.url = window.location.href;

      return tmp;
    });

    thingsToDo.push(attraction);
  }

  const tripadvisorData = thingsToDo.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {});

  await context.close();

  return tripadvisorData;
}

module.exports = {
  tripadvisor: tripadvisor,
};
