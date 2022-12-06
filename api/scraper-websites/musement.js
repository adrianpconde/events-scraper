const puppeteer = require("puppeteer-core");

const cityName = "amsterdam";

async function musement() {
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

  await page.goto(`https://www.musement.com/nl/search/?q=${cityName}`);

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  await delay(2000);

  // Taking URL of attractions in the city and each event page link:

  // for (let i = 1; i <= 10; i++) {
  //   await page.click(
  //     "[data-test='searchPage-loadMore-btn']"
  //   );
  //   await delay(1500);
  // }

  await page.waitForSelector(".src-content-3JLt");

  const events = await page.evaluate(() => {
    const attractions = document.querySelectorAll(
      "section.src-content-3JLt > div:nth-child(2) > p.src-title-3zAw > a"
    );

    const links = [];
    for (let attraction of attractions) {
      links.push(attraction.href);
    }
    return links;
  });

  await delay(2000);

  console.log("Musement: ", events.length);

  // Array created and loop on every event to take the data:

  const thingsToDo = [];
  for (let event of events) {
    await page.goto(event);
    await page.waitForSelector(
      ".src-shared_component-sections-ActivityHeader-title-1qzL"
    );

    await delay(1500);

    const attractionData = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document
        .querySelector(
          "#containerEventPage > div > section > div:nth-child(1) > h1"
        )
        .textContent.trim();
      try {
        tmp.price = document.querySelector(
          "#containerEventPage > div > aside > div > div > div.src-shared_component-sections-AsidePrice-body-AGKt.src-shared_component-sections-AsidePrice-asidePriceBody-35oh > div.src-shared_component-components-wrapper-3CIr > div > div.src-shared_component-components-price-2oSX"
        ).textContent;
      } catch (error) {
        tmp.price = "N.A.";
      }
      try {
        tmp.duration = document.querySelector(
          "#activity-component__block-quick-info > div:nth-child(4) > span:nth-child(3)"
        ).textContent;
      } catch (error) {
        tmp.duration = "N.A.";
      }
      try {
        tmp.rating = document.querySelector(
          "#containerEventPage > div > section > div:nth-child(1) > div.src-shared_component-sections-ActivityHeader-reviewPriceWrapper-2gZb > div.src-shared_component-sections-ActivityHeader-reviewsBox-iPhv > div > div.Widget__rating > div > span:nth-child(1)"
        ).textContent;
      } catch (error) {
        tmp.rating = "N.A.";
      }
      try {
        tmp.description = document.querySelector(
          "#activity-component__block_expect > div.src-shared_component-sections-ActivityWhatToExpect-blockBody-eHtU > div.src-shared_component-components-ReadMore-fullText-39ON > div"
        ).textContent;
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
  musement: musement,
};
