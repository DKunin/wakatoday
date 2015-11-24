'use strict';

var request  = require('superagent');
var prettyMs = require('pretty-ms');
var R        = require('ramda');

var todaysDate = function(){
  var d = new Date();
  return (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
};

var today = todaysDate();

var summDuration = function(item, itemb){
  return item.total_seconds + itemb.total_seconds;
};

var getFullDuration = R.compose(prettyMs, R.multiply(1000), R.reduce(summDuration, {total_seconds:0}), R.pluck('grand_total'),R.prop('data'));

function getHours(apiKey){
  return new Promise(function(resolve,reject){
    request
      .get('https://wakatime.com/api/v1/users/current/summaries')
      .query({start:today, end: today, api_key: apiKey})
      .end(function (error, body) {
        if(error) {
          reject(error);
          return;
        }
        resolve(getFullDuration(body.body));
    }); 
  });
}

module.exports = getHours;