function getPrices(body) {
  var options = {
        'Origin' : 'https://poporing.life', // Use site as cache breaker, as per the API docs
        'User-Agent': 'eulb-pricetracker', // Mark myself in case of future use.
        'Method' : 'POST', // Use POST instead of GET
        'Payload' : JSON.stringify([].concat.apply([], body)) // Flatten body array
        },
      sea_result = UrlFetchApp.fetch('https://api.poporing.life/get_latest_prices', options),
      global_result = UrlFetchApp.fetch('https://api-global.poporing.life/get_latest_prices', options),
      sea_data = JSON.parse(sea_result.getContentText()), // Get the content from the body and then parse it as JSON.
      global_data = JSON.parse(global_result.getContentText()); // Ditto.
      result = [];
  for(var i=0;i < sea_data.data.length;i++){
  var seaTimestamp = (sea_data.data[i].data.volume > 0) ? sea_data.data[i].data.timestamp : sea_data.data[i].data.last_known_timestamp, //For SEA, If data volume is available, use latest timestamp. Last known timestamp otherwise.
      seaPrice = (sea_data.data[i].data.volume > 0) ? sea_data.data[i].data.price : sea_data.data[i].data.last_known_price, //For SEA, If data volume is available, use latest price. Last price timestamp otherwise.
      seaLastChecked = timeDifference(seaTimestamp * 1000),
      /* SEA Variables */
      globalTimestamp = (global_data.data[i].data.volume > 0) ? global_data.data[i].data.timestamp : global_data.data[i].data.last_known_timestamp, //For Global, If data volume is available, use latest timestamp. Last known timestamp otherwise.
      globalPrice = (global_data.data[i].data.volume > 0) ? global_data.data[i].data.price : global_data.data[i].data.last_known_price, //For Global, If data volume is available, use latest price. Last price timestamp otherwise.
      globalLastChecked = timeDifference(globalTimestamp * 1000),
      /* Global Variables */
      templist = [seaPrice, seaLastChecked, globalPrice, globalLastChecked];
  result.push(templist);
  }
  return result;
}