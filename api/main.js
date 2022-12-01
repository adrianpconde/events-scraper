const fs = require("fs");

const tripadvisorScraper = require("./scraper-websites/tripadvisor");
const bookingScraper = require("./scraper-websites/booking");
const yelpScraper = require("./scraper-websites/yelp");
const tiqetsScraper = require("./scraper-websites/tiqets");
const eventbriteScraper = require("./scraper-websites/eventbrite");
const ticketswapScraper = require("./scraper-websites/ticketswap");
const musementScraper = require("./scraper-websites/musement");
const ceetizScraper = require("./scraper-websites/ceetiz");

async function data() {
  const bookingData = await bookingScraper.booking();
  const tripadvisorData = await tripadvisorScraper.tripadvisor();
  const yelpData = await yelpScraper.yelp();
  const tiqetsData = await tiqetsScraper.tiqets();
  const eventbriteData = await eventbriteScraper.eventbrite();
  const ticketswapData = await ticketswapScraper.ticketswap();
  const musementData = await musementScraper.musement();
  const ceetizData = await ceetizScraper.ceetiz();

  const eventsData = {
    ...bookingData,
    ...tripadvisorData,
    ...yelpData,
    ...tiqetsData,
    ...eventbriteData,
    ...ticketswapData,
    ...musementData,
    ...ceetizData,
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
