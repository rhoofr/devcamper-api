# DevCamper API

> Backend API for DevCamper application, which is a bootcamp directory website

## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own.
This API uses the following services: mapquest, mailtrap, cloudinary and Mongo DB Atlas. These can be tweeked.

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

## Docs

Extensive documentation with examples [here](https://hoofsoft-devcamper-api.herokuapp.com/)

- Version: 1.0.0
- License: MIT
- Author: Richard Hoofring
