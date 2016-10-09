'use strict';

const request = require('request');
const knex = require('./knex');
const { decamelizeKeys } = require('humps');
// bf764a2e-308a-43f5-9fdc-24a6e6447ae0

const getTimeDifference = function(lastUpdateTime,
                                  predictedArrivalTime, scheduledArrivalTime) {
  if (!predictedArrivalTime) {
    return (lastUpdateTime - scheduledArrivalTime) / (60 * 1000);
  } else {
    return (predictedArrivalTime - scheduledArrivalTime) / (60 * 1000);
  }
}

const getBusIndex = function(arrivalsAndDepartures, busNumber) {
  for (let i = 0; i < arrivalsAndDepartures.length; i++)
    if (arrivalsAndDepartures[i].routeShortName === busNumber) return i;
}

module.exports = {
  // start: function() {
  //   console.log('here');
  // }
  start: function() {

    const getJSON = function(url) {
      const promise = new Promise((resolve, reject) => {
        request.get(url, (err, res, body) => {
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
        const busNumber = '67';
        const arrivalsAndDepartures = body.data.entry.arrivalsAndDepartures;
        const busIndex = getBusIndex(arrivalsAndDepartures, busNumber);
        const busInfo = body.data.entry.arrivalsAndDepartures[busIndex];
        const predictedArrivalTime = busInfo.predictedArrivalTime;
        const scheduledArrivalTime = busInfo.scheduledArrivalTime;
        const lastUpdateTime = busInfo.lastUpdateTime;
        const timeDifference = getTimeDifference(lastUpdateTime,
                                    predictedArrivalTime, scheduledArrivalTime);
        const scheduledTime = new Date(scheduledArrivalTime);
        const actualTime = new Date(predictedArrivalTime);

        if (timeDifference > 0) {
          console.log(`${timeDifference} minutes late`);
        } else if (timeDifference < 0) {
          console.log(`${Math.abs(timeDifference)} minutes early`);
        } else {
          console.log('Miracle! Bus is on time!');
        }
        console.log(busIndex);

        const bus = {
          busNumber,
          stopNumber: '75403',
          scheduledTime,
          actualTime};

        knex('buses')
          .insert(decamelizeKeys(bus), '*')
          .then((bus) => console.log(bus))
          .catch((err) => next(err));
      })
      .catch((err) => {
        console.log('here');
        console.error(err);
        process.exit(1);
      });
  }
};
