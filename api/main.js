const fs = require("fs");

const tripadvisorScraper = require("./scraper-websites/tripadvisor");
const bookingScraper = require("./scraper-websites/booking");
const yelpScraper = require("./scraper-websites/yelp");
const tiqetsScraper = require("./scraper-websites/tiqets");
const eventbriteScraper = require("./scraper-websites/eventbrite");

async function data() {
  const tripadvisorData = await tripadvisorScraper.tripadvisor();
  const bookingData = await bookingScraper.booking();
  const yelpData = await yelpScraper.yelp();
  const tiqetsData = await tiqetsScraper.tiqets();
  const eventbriteData = await eventbriteScraper.eventbrite();

  const eventsData = {
    ...tripadvisorData,
    ...bookingData,
    ...yelpData,
    ...tiqetsData,
    ...eventbriteData,
  };

  const eventsContent = JSON.stringify(eventsData);
  console.log(eventsContent);

  fs.writeFile("events.json", eventsContent, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });

  return eventsData;
}

data();
