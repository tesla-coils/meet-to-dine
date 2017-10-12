var request = require('request');
var sortJsonArray = require('sort-json-array');

url='https://platform.otqa.com/sync/directory';

request({
            url: url,
            method: 'GET',
            headers: {
               'Authorization': 'bearer 93f3db26-0929-4a96-9d27-3661cbbfb370'
            }
        }, function (error, response, body) {
            if (error) throw error;
            var json = JSON.parse(response.body);  //jason var

            //dummy locations
            var location = [];
            var people = 5;

            location.push({latitude:37.7950860,longitude:-122.4228740,category:"American"});
            location.push({latitude:37.7950860,longitude:-122.4228740,category:"American"});
            location.push({latitude:37.7950860,longitude:-122.4228740,category:"American"});
            location.push({latitude:37.7950860,longitude:-122.4228740,category:"French"});
            location.push({latitude:37.7950860,longitude:-122.4228740,category:"Californian"});


            //find closest restaurants
            var restaurants = [];
            for (var i = 0; i < json.items.length; i++) {
                for(var j = 0; j < location.length; j++) {
                    var R = 6371;
                    var φ1 = json.items[i].latitude * (Math.PI/180);
                    var φ2 = location[j].latitude* (Math.PI/180);
                    var Δφ = (location[j].latitude-json.items[i].latitude) * (Math.PI/180);
                    var Δλ = (location[j].longitude-json.items[i].longitude)* (Math.PI/180);

                    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                            Math.cos(φ1) * Math.cos(φ2) *
                            Math.sin(Δλ/2) * Math.sin(Δλ/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                    var d = R * c;
                    var mileDis = d * 0.621371;
                    //console.log(mileDis);
                    if(mileDis < 10) {

                      restaurants.push(json.items[i]);
                    }
                }
                //var toPrint = json.items[i].rid;
                //console.log("rid for " + (i+1) +"=" +toPrint);
            }
          //  console.log(restaurants);

            //console.log(restaurants);
            var preferredRest = [];

            sortJsonArray(restaurants, 'aggregate_score');

            for (var i = 0; i < location.length; i++){
                for (var j = 0; j < restaurants.length; j++){
                    for(var k = 0; k < restaurants[i].category.length; k++){
                        if(location[i].category===restaurants[j].category[k]&&
                            restaurants[j].rid>0){
                            preferredRest.push(restaurants[j]);
                            restaurants[j].rid=restaurants[j].rid*-1;
                        }
                    }
                }
            }

            for(var i = 0; i < preferredRest.length; i++){
                preferredRest[i].rid = preferredRest[i].rid*-1;
            }



            //console.log(json);
            //console.log(restaurants);
            console.log(preferredRest);

        });