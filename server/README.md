# Welcome

Trader Insights API. This connects to Rapid API's - ([Real-Time Finance Data
](https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-finance-data/), [Exchange Rates - Real Time and Historical Data](https://rapidapi.com/finestoreuk/api/exchange-rates-real-time-and-historical-data/)) - to allow a user to get the latest market trends and also be able to see historical values of certain currency pairs.

The root folder contains a postman collection of all the possible API endpoints.

# Instalation

## System Requirements:

- RapidApi account https://rapidapi.com/hub
- Make sure to have nodejs v16.0.0+, redis, text editor setup and installed. Links:
  - nodejs https://nodejs.org/en/
  - Redis https://redis.io/docs/install/install-redis/
  - git bash for command line https://git-scm.com/ (Optional)
  - VS Code https://code.visualstudio.com/ (Or any text editor of your choice) 
  - Ideally also install nodemon globally (however its included as dev dependency)

## Install dependencies:

```
npm i --save
```

## Run App

Before you can run the application, make sure to create a .env file and use example.env as a template of the required variables. Use your Rapid API key.

Make sure Redis is running in the background on the default port (can be changed) otherwise the application will continue to use Rapid API for the same calls.

```
# Run in dev mode
npm run dev

# Run in prod mode
npm build && npm start
```

