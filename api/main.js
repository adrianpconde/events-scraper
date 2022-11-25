const tripadvisorScraper = require("./scraper-websites/tripadvisor");
const bookingScraper = require("./scraper-websites/booking");
const yelpScraper = require("./scraper-websites/yelp");
const tiqetsScraper = require("./scraper-websites/tiqets");
const eventbriteScraper = require("./scraper-websites/eventbrite");


tripadvisorScraper.tripadvisor()
bookingScraper.booking()
yelpScraper.yelp()
tiqetsScraper.tiqets()
eventbriteScraper.eventbrite()