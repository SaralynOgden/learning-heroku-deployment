'use strict';

const request = require('request');
const knex = require('./knex');
const { decamelizeKeys } = require('humps');
const boom = require('boom');
// bf764a2e-308a-43f5-9fdc-24a6e6447ae0

const getBusIndices = function(arrivalsAndDepartures, busNumber) {
  const busesWithNumber = [];

  for (let i = 0; i < arrivalsAndDepartures.length; i++) {
    if (arrivalsAndDepartures[i].routeShortName === busNumber) {
      busesWithNumber.push(i);
    }
  }
  return busesWithNumber;
}

module.exports = {
  start: function() {

    const getJSON = function(url) {
      const promise = new Promise((resolve, reject) => {
        request.get(url, (err, res, body, next) => {
          if (err) {
            return reject(err);
          }

          resolve(JSON.parse(body));
        });
      });

      return promise;
    };

    getJSON('http://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/1_75403.json?key=TEST')
      .then((body) => {
        const busNumber = '372E';
        const arrivalsAndDepartures = body.data.entry.arrivalsAndDepartures;
        const busIndices = getBusIndices(arrivalsAndDepartures, busNumber);

        for (let i = 0; i < busIndices.length; i++) {
          const busInfo = body.data.entry.arrivalsAndDepartures[busIndices[i]];
          const bus = {
            busNumber,
            stopNumber: '75403',
            scheduledTime: new Date(busInfo.scheduledArrivalTime),
            actualTime: new Date(busInfo.predictedArrivalTime),
            lastUpdateTime: new Date(busInfo.lastUpdateTime),
            distance: parseInt(busInfo.distanceFromStop)};

          knex('buses')
            .insert(decamelizeKeys(bus), '*')
            .then((bus) => console.log(bus))
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => {
        console.log('here');
        console.error(err);
        process.exit(1);
      });
  }
};
