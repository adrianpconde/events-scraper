const puppeteer = require("puppeteer-core");

async function tripadvisor(cityName) {
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

  // Going to Tripadvisor website:

  await page.goto("https://www.tripadvisor.com/Attractions");

  // Introducing city's name on searchbar:
  await page.click(
    "#component_2 > div > div > form > input.qjfqs._G.B-.z._J.Cj.R0"
  );
  await page.type(
    "#component_2 > div > div > form > input.qjfqs._G.B-.z._J.Cj.R0",
    cityName
  );

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

  const attractionsPage = await page.evaluate(() => {
    return window.location.href.split("Activities-").join("oa0-");
  });

  await page.goto(attractionsPage);

  await delay(2000);

  // Taking URL of attractions in the city and each event page link:

  const eventsPages = [];

  const currentPage = await page.evaluate(() => {
    return window.location.href;
  });
  eventsPages.push(currentPage);

  for (let i = 0; i <= 15; i++) {
    await page.click("[aria-label='Next page']");

    await delay(2000);

    let nextPage = await page.evaluate(() => {
      return window.location.href;
    });
    eventsPages.push(nextPage);
  }

  const events = [];

  for (let eventPage of eventsPages) {
    await page.goto(eventPage);
    await delay(1000);

    const tripadvisorEvents = await page.evaluate(() => {
      const attractions = document.querySelectorAll(".BUupS");
      const links = [];
      for (let attraction of attractions) {
        links.push(attraction.href);
      }
      return links;
    });

    await delay(1500);

    events.push(tripadvisorEvents);
  }

  const allEvents = events.flat();

  console.log("Tripadvisor:", allEvents.length);

  // // Array created and loop on every event to take the data:

  const thingsToDo = [];
  for (let event of allEvents) {
    await page.goto(event);
    await page.waitForSelector(".eIegw");

    await delay(1500);

    const attraction = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector(".nrbon").textContent.trim();
      try {
        tmp.price = document
          .querySelector(
            "div.MQPqk > div > div > div.f.k.O.ncFvv > div.biGQs._P.fiohW.uuBRH"
          )
          .textContent.trim();
      } catch (error) {
        tmp.price = "N.A.";
      }
      try {
        tmp.description = document
          .querySelector(
            "#lithium-root > main > div:nth-child(1) > div.bkycL.z > div:nth-child(2) > div.nhJOT.z > div > div.C > section:nth-child(3) > div > div > div > div.WRRwX.Gg.A > div.IxAZL > div > div._d.MJ > div > div.fIrGe._T.bgMZj > div"
          )
          .textContent.trim();
      } catch (error) {
        tmp.description = "N.A.";
      }
      try {
        tmp.rating = document
          .querySelector(
            "#tab-data-qa-reviews-0 > div > div.bdeBj.e > div.C > div > div.f.u.j > div.biGQs._P.fiohW.hzzSG.uuBRH"
          )
          .textContent.trim();
      } catch (error) {
        tmp.rating = "N.A.";
      }
      try {
        tmp.location = document
          .querySelector(
            "#tab-data-WebPresentation_PoiLocationSectionGroup > div > div > div.AcNPX.A > div.ZhNYD > div > div > div > div.MJ > button > span"
          )
          .textContent.trim();
      } catch (error) {
        tmp.location = "N.A.";
      }
      try {
        tmp.time = document
          .querySelector("div.IxAZL > div > div:nth-child(3) > div._c")
          .textContent.trim();
      } catch (error) {
        tmp.time = "N.A.";
      }
      tmp.url = window.location.href;

      return tmp;
    });

    thingsToDo.push(attraction);
  }

  await context.close();

  return thingsToDo;
}

module.exports = {
  tripadvisor: tripadvisor,
};
