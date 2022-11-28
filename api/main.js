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

  console.log(eventsData)

  return eventsData
}

data();
