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
  const eventsData = [];

  try {
    const bookingData = await bookingScraper.booking();
    eventsData.push(bookingData);
  } catch (error) {
    console.log("An error occured while scraping Booking data");
    console.log(error);
  }
  try {
    const tripadvisorData = await tripadvisorScraper.tripadvisor();
    eventsData.push(tripadvisorData);
  } catch (error) {
    console.log("An error occured while scraping Tripadvisor data");
    console.log(error);
  }
  try {
    const yelpData = await yelpScraper.yelp();
    eventsData.push(yelpData);
  } catch (error) {
    console.log("An error occured while scraping Yelp data");
    console.log(error);
  }
  try {
    const tiqetsData = await tiqetsScraper.tiqets();
    eventsData.push(tiqetsData);
  } catch (error) {
    console.log("An error occured while scraping Tiqets data");
    console.log(error);
  }
  try {
    const eventbriteData = await eventbriteScraper.eventbrite();
    eventsData.push(eventbriteData);
  } catch (error) {
    console.log("An error occured while scraping Eventbrite data");
    console.log(error);
  }
  try {
    const ticketswapData = await ticketswapScraper.ticketswap();
    eventsData.push(ticketswapData);
  } catch (error) {
    console.log("An error occured while scraping Ticketswap data");
    console.log(error);
  }
  try {
    const musementData = await musementScraper.musement();
    eventsData.push(musementData);
  } catch (error) {
    console.log("An error occured while scraping Musement data");
    console.log(error);
  }
  try {
    const ceetizData = await ceetizScraper.ceetiz();
    eventsData.push(ceetizData);
  } catch (error) {
    console.log("An error occured while scraping Ceetiz data");
    console.log(error);
  }

  const allEvents = eventsData.flat();

  const allData = allEvents.reduce((acc, item) => {
    acc[item.title] = item;
    return acc;
  }, {});

  const eventKeys = Object.keys(allData).sort();

  const orderedData = {};
  eventKeys.forEach((el) => (orderedData[el] = allData[el]));

  const eventsContent = JSON.stringify(orderedData);
  console.log(eventsContent);

  fs.writeFile("events.json", eventsContent, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });

  return orderedData;
}

data();
