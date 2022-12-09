const fs = require("fs");

const cityName = "amsterdam";

const tripadvisorScraper = require("./scraper-websites/tripadvisor");
const bookingScraper = require("./scraper-websites/booking");
const tiqetsScraper = require("./scraper-websites/tiqets");
const eventbriteScraper = require("./scraper-websites/eventbrite");
const ticketswapScraper = require("./scraper-websites/ticketswap");
const musementScraper = require("./scraper-websites/musement");
const ceetizScraper = require("./scraper-websites/ceetiz");

async function data() {
  const eventsData = [];

  try {
    const bookingData = await bookingScraper.booking(cityName);
    eventsData.push(bookingData);
  } catch (error) {
    console.log("An error occured while scraping Booking data");
    console.log(error);
  }
  try {
    const tripadvisorData = await tripadvisorScraper.tripadvisor(cityName);
    eventsData.push(tripadvisorData);
  } catch (error) {
    console.log("An error occured while scraping Tripadvisor data");
    console.log(error);
  }
  try {
    const tiqetsData = await tiqetsScraper.tiqets(cityName);
    eventsData.push(tiqetsData);
  } catch (error) {
    console.log("An error occured while scraping Tiqets data");
    console.log(error);
  }
  try {
    const eventbriteData = await eventbriteScraper.eventbrite(cityName);
    eventsData.push(eventbriteData);
  } catch (error) {
    console.log("An error occured while scraping Eventbrite data");
    console.log(error);
  }
  try {
    const ticketswapData = await ticketswapScraper.ticketswap(cityName);
    eventsData.push(ticketswapData);
  } catch (error) {
    console.log("An error occured while scraping Ticketswap data");
    console.log(error);
  }
  try {
    const musementData = await musementScraper.musement(cityName);
    eventsData.push(musementData);
  } catch (error) {
    console.log("An error occured while scraping Musement data");
    console.log(error);
  }
  try {
    const ceetizData = await ceetizScraper.ceetiz(cityName);
    eventsData.push(ceetizData);
  } catch (error) {
    console.log("An error occured while scraping Ceetiz data");
    console.log(error);
  }

  const allEvents = eventsData.flat();

  const uniqueEvents = allEvents.filter(
    (value, item, event) =>
      event.findIndex((value2) =>
        ["location", "price"].every((key) => value2[key] === value[key])
      ) === item
  );

  uniqueEvents.sort(function (a, b) {
    if (a.title > b.title) {
      return 1;
    }
    if (a.title < b.title) {
      return -1;
    }
    return 0;
  });
  console.log("Events: ", uniqueEvents.length);

  const eventsContent = JSON.stringify(uniqueEvents);
  console.log(eventsContent);

  fs.writeFile("events.json", eventsContent, "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });

  return uniqueEvents;
}

data();
