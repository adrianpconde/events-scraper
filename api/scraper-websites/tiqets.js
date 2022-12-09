const puppeteer = require("puppeteer-core");

async function tiqets(cityName) {
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

  // Select the city of The Netherland on Tiqets:
  let city;

  switch (cityName) {
    case "amsterdam":
      city = "https://www.tiqets.com/en/amsterdam-attractions-c75061/";
      break;
    case "randstad":
      city = "https://www.tiqets.com/en/randstad-attractions-r661/";
      break;
    case "rotterdam":
      city = "https://www.tiqets.com/en/rotterdam-attractions-c74895/";
      break;
    case "groningen":
      city = "https://www.tiqets.com/en/groningen-attractions-r1519/";
      break;
    case "hague":
      city = "https://www.tiqets.com/en/the-hague-attractions-c74889/";
      break;
    case "kaatsheuvel":
      city = "https://www.tiqets.com/en/kaatsheuvel-attractions-c952/";
      break;
    case "lisse":
      city = "https://www.tiqets.com/en/lisse-attractions-c260931/";
      break;
    case "joure":
      city = "https://www.tiqets.com/en/joure-attractions-c111418/";
      break;
    case "leiden":
      city = "https://www.tiqets.com/en/leiden-attractions-c74942/";
      break;
    case "limburg":
      city = "https://www.tiqets.com/en/limburg-attractions-r1090/";
      break;
    case "sevenum":
      city = "https://www.tiqets.com/en/sevenum-attractions-c784/";
      break;
    case "brabant":
      city = "https://www.tiqets.com/en/brabant-attractions-r73/";
      break;
    case "friesland":
      city = "https://www.tiqets.com/en/friesland-attractions-r1091/";
      break;
    case "emmen":
      city = "https://www.tiqets.com/en/emmen-attractions-c74999/";
      break;
    case "laren ":
      city = "https://www.tiqets.com/en/laren-attractions-c111406/";
      break;
    case "otterlo":
      city = "https://www.tiqets.com/en/otterlo-attractions-c219719/";
      break;
    case "nijmegen":
      city = "https://www.tiqets.com/en/nijmegen-attractions-c74919/";
      break;
    case "zaandam":
      city = "https://www.tiqets.com/en/zaandam-attractions-c74827/";
      break;
    case "kornwerderzand":
      city = "https://www.tiqets.com/en/kornwerderzand-attractions-c264833/";
      break;
    default:
      console.log(`${cityName} is not available on Tiqets.`);
  }
  await page.goto(city);

  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  await page.waitForSelector(".text-heading-l");

  await delay(2000);

  // Taking URL of attractions in the city and each event page link:

  try {
    for (let i = 1; i <= 15; i++) {
      await page.click(".ShowMoreOfferingsApp__button");
      await delay(1500);
    }
  } catch (ex0) {
    try {
      for (let i = 1; i <= 10; i++) {
        await page.click(".ShowMoreOfferingsApp__button");
        await delay(1500);
      }
    } catch (ex1) {
      try {
        for (let i = 1; i <= 5; i++) {
          await page.click(".ShowMoreOfferingsApp__button");
          await delay(1500);
        }
      } catch (error) {
        await page.click(".ShowMoreOfferingsApp__button");
        await delay(1500);
      }
    }
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
      tmp.title = document
        .querySelector(
          "div.PageHeaderSection__content-inner-wrap.w100.text-white.relative.px16.my24 > h1"
        )
        .textContent.trim();
      try {
        tmp.price = document
          .querySelector(
            "#tickets > div:nth-child(4) > div > article > div > div > div.border-top-solid-1.border-grey500.py8.pl12.pr8.flex-box.flex-center-y.push-down > div > span"
          )
          .textContent.trim();
      } catch (error) {
        tmp.price = "N.A.";
      }
      try {
        tmp.description = document
          .querySelector(
            "#about > div > div:nth-child(1) > div > div > div.location-description.pb16.px16 > p:nth-child(1)"
          )
          .textContent.trim();
      } catch (error) {
        tmp.description = "N.A.";
      }
      try {
        tmp.rating = document
          .querySelector(
            "#tickets > div.Grid > div > div.ReviewSummary.mt16.mb16 > div.flex-box.text-ink500.mb8 > span"
          )
          .textContent.trim();
      } catch (error) {
        tmp.rating = "N.A.";
      }
      try {
        tmp.location = document
          .querySelector(
            "#about > div > div:nth-child(3) > div > div > div > div > div.location-block.flex-box.None > div > div > div:nth-child(2)"
          )
          .textContent.trim();
      } catch (error) {
        tmp.location = "N.A.";
      }
      try {
        tmp.time = document
          .querySelector(
            "#about > div > div:nth-child(2) > div > div > div > div > div > table > tbody > tr.pb8.pt8 > td.OpeningHours__column.text-secondary500.pl16.text-right > span"
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
  tiqets: tiqets,
};
