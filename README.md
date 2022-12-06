# events-scraper

JavaScript implementation of web scraping on various websites to scrape the most important attractions and monuments or events that will take place in a city.

## Description

There are eight web scrapers, one per each web site, located on:
  - **'booking.js'**    
  - **'eventbrite.js'**  
  - **'ticketswap.js'**  
  - **'tripadvisor.js'**
  - **'ceetiz.js'**      
  - **'musement.js'**    
  - **'tiqets.js'**      
  - **'yelp.js'**

All these web scrapers are imported to a **'main.js'** file (inside the **'api'** fold) where the script runs and gets all the data from the websites, ready to be exported to a JSON file. This file is updated everytime the web scraping process is finished.

## How to use

Clone the repository and install all the dependencies with `npm i`

Then you can choose the city what you want. There is a variable in every web scraper where you can type the name. In this case, the default city selected is Amsterdam. 

There is a single exception: in the case of the Yelp website, the city search process is done in a different way, with all the URL addresses of each city in the Netherlands associated to a variable with the same city name. All the scraping process is indicated with comment lines in each file.

## What I used

The programa was built on **JavaScript** with **Node.JS** and **Puppeteer/Puppeteer-Core**(19.2.2). 

With both libraries the web scraper can be built, but I have used the second one instead of the regular Puppeteer when working from a computer with Apple Silicon / M1.
