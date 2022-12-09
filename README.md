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

All these web scrapers are imported to a **'main.js'** file (inside the **'api'** folder) where the script runs and gets all the data from the websites, ready to be exported to a JSON file. This file is updated everytime the web scraping process is finished. Once the scraping is done, you can store all your data on **Firebase Google**.

## Read before you start:

- The script is made for educational purposes, you are solely responsible for the use you make of this tool.
- This project was developed in macOs Ventura 13.0.1 on a device with Apple M1 Pro processor.
- Access to the different pages requires short waiting periods between tasks so that access to the websites is not blocked.
- Make sure the installation was successful before using the API.

## How to use

1. Clone the repository and install all the dependencies with `npm i`

2. Then you can choose the city what you want on The Netherlands. There is a variable in **'main.js'** where you can change the city name. In this case, the default city selected is Amsterdam.

3. To run the script you just need to type `node main.js` in your terminal from the **api** folder.

4. All data will be scraped, filtered, and alphabetically sorted before being stored in the **'events.json'** file, a JSON array of objects. During the process, you will be able to check the number of events/attractions/places of interest that each scraper will extract from each website:

```
Booking:  440
Tripadvisor: 510
Tiqets:  65
Eventbite:  140
Ticketswap:  371
Musement:  20
Ceetiz:  33
Events:  894
```

5. All the events/attractions/places of interest have this strcuture:

```
{
    "title": "Stedelijk Museum Amsterdam",
    "price": "from $20.37",
    "description": "The Stedelijk Museum is an international institution in Amsterdam dedicated to modern and contemporary art and design. The Museum aims to provide a home for art, artists and a broad range of publics, where artistic production is actively fostered, presented, protected, reconsidered and renewed",
    "rating": "4.0",
    "location": "Museumplein 10, 1071 DJ Amsterdam The Netherlands",
    "time": "2-3 hours",
    "url": "https://www.tripadvisor.com/Attraction_Review-g188590-d190676-Reviews-Stedelijk_Museum_Amsterdam-Amsterdam_North_Holland_Province.html"
  }
```

6. The project is intended to store the collected information in a noSQL database hosted by **Firebase Google**. In order for all the information collected about the events and attractions in the city to be stored in the database, it is necessary to enter the data from the Firebase Admin SDK. From the Firebase console it is possible to download it as a JSON file, being necessary to replace it with the **key_service_account.json** file included in the project or directly entering the value in each section that is presented without content in this repository.

7. Once this information is filled in, the script will be able to store the event data in the database under the key name indicated in the collectionKey constant of the **upload_data.js** file.

8. To store the data you just need to type `node upload_data.js` is your terminal from the **api** folder.

## What I used

The programa was built on **JavaScript** with **Node.JS** and **Puppeteer/Puppeteer-Core**(19.2.2).

To store the information it is also necessary to install **firebase-admin** package.

**NOTE:** You can be built the scraper qith **Puppeteer** or **Puppeteer-Core**, but I have used the second one instead of the regular Puppeteer when working from a computer with Apple Silicon / M1.
