$(document).ready(function(){
    var searchURL = "https://api.wunderground.com/api/a4e9f436358c9497/geolookup/q/"
    $("#morning-commuter-data .pop-warning").hide()
    $("#evening-commuter-data .pop-warning").hide()
    $("#commuter-data").hide()
    $('#wtw').click(function(){
        var zipcode = $('#zip').val()
        var morninghr = $('#morning-commute').val()
        var eveninghr = $('#evening-commute').val()
        searchURL = searchURL + zipcode + ".json"
        
        $.get(searchURL)
        .then(function(data){
            
            var cityLoc = data.location.city
                stateLoc = data.location.state
                cityLocurl = cityLoc.replace(" ", "_")
                morningTime = ''
                eveningTime = ''

                prettySearchURL = "https://api.wunderground.com/api/a4e9f436358c9497/hourly/q/"+stateLoc+"/"+cityLocurl+".json"


            $('#form-fields').fadeOut("fast", function(){
               var div = $("<div id='form-fields'><h1 class='text-center'>"+cityLoc+", "+stateLoc+"</h2><img src='images/icons/"+stateLoc+".svg'/></div>").hide();
               $(this).replaceWith(div);
               $('#form-fields').fadeIn("fast");
            });

            $.get(prettySearchURL)
            .then(function(hourlydata){
                $('#commuter-data').show()
                var morningWeather
                var eveningWeather
                for (i = hourlydata.hourly_forecast.length - 1; i >= 0; i--) {
                    // Time 
                    var timeObject = hourlydata.hourly_forecast[i].FCTTIME
                    var globalData = {
                        paddedHour: timeObject.hour_padded,
                        civilTime: timeObject.civil,
                        weekday: timeObject.weekday_name,
                        month: timeObject.month_name,
                        date: timeObject.mday,
                        year: timeObject.year,
                    }
                    var today = globalData.weekday + " " + globalData.month + " " + globalData.date + ", " + globalData.year

                    
                    // Forecast
                    var forecastObject = hourlydata.hourly_forecast[i]
                    var globalForecast = {
                        feelslike: forecastObject.feelslike.english,
                        weatherIcon: forecastObject.icon_url,
                        popChance: forecastObject.pop,
                        wind: forecastObject.wspd.english,
                    }
                     
                       

                    // Things you need while biking
                    var commuteNeeds = $("#commute-needs")
                    var checkbox = "<input type='checkbox'></input> "
                    var commuteItems = {
                        lightJacket: "Light Jacket",
                        mediumJacket: "A medium weight jacket",
                        windJacket: "Wind breaker",
                        rainJacket: "Rain jacket",
                        heavyJacket: "Heavy jacket",
                        parkaJacket: "A Parka - for real.",
                        
                        lightGloves: "Light gloves",
                        heavyGloves: "Heavy gloves",
                        
                        headBand: "Light headband or Buff",
                        
                        warmSocks: "Warm socks",
                        warmShoes: "Warm shoes or boots",
                        closedShoes: "Regular shoes",
                        sandalShoes: "Flippy flops",
                        
                        lightShirt: "A light shirt or cardigan",
                        teeShirt: "A stylish T-shirt",
                        tankTop: "A tank top!",
                        sunsOut: "Sun's out, guns out.",
                        
                        warmPants: "Warm pants",
                        jeanPants: "Just jeans",
                    }
                        
                    // Check Morning Time
                    if (globalData.paddedHour === morninghr && !morningWeather) {
                       //console.log(globalData.globalForecast)
                       var morning = {
                            today: today,
                            time: today + " at " + globalData.civilTime,
                            weatherIcon: globalForecast.weatherIcon,
                            temp: globalForecast.feelslike,
                            condition: forecastObject.condition,
                            pop: $("#morning-commuter-data .pop-warning"),
                            popChance: globalForecast.popChance,
                            wind: globalForecast.wind,
                        }
                            commuteNeeds = $("#morning-commuter-data #commute-needs")
                            console.log(forecastObject)
                            console.log(morning.wind)
                        // Feels Like Temp Ranges
                        if (morning.temp === "98") {
                            console.log("It's going to be boyband hot out there.")
                        }
                        if (morning.temp >= "81") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.tankTop+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.sandalShoes+"</label></li>")
                        } 
                        if (morning.temp >= "71" && morning.temp <= "80") {
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.sandalShoes+"</label></li>")
                        } 
                        if (morning.temp >= "61" && morning.temp <= "70") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightshirt+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.sandalShoes+" or "+commuteItems.closedShoes+"</label></li>")
                        } 
                        if (morning.temp >= "51" && morning.temp <= "60") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightJacket+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.closedShoes+"</label></li>")
                        } 
                        if (morning.temp >= "41" && morning.temp <= "50") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightJacket+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.jeanPants+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightGloves+"</label></li>")
                        } 
                        if (morning.temp >= "31" && morning.temp <= "40") {
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.mediumJacket+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightGloves+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.headBand+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.jeanPants+"</label></li>")
                        } 
                        if (morning.wind >= "12" ) {
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.windJacket+"</label></li>")
                        }
                        if (morning.temp < "30") {
                            $("#alert-warning").show()
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.parkaJacket+"</label></li>")
                        }
                        // Pop Chance
                        if (morning.popChance >= "0" && morning.popChance <= "9") {
                            $("#morning-commuter-data .pop-warning").addClass("no-pop").hide()
                        }
                        if (morning.popChance >= "10" && morning.popChance <= "29") {
                            morning.pop.addClass("secondary").show()
                            $("#morning-commuter-data .pop-warning .pop-chance").text(morning.popChance + "%")
                        }
                        if (morning.popChance >= "30" && morning.popChance <= "49") {
                            morning.pop.addClass("primary").show()
                            $("#morning-commuter-data .pop-warning .pop-warning .pop-chance").text(morning.popChance + "%")
                            $('#commute-needs').append("<li><label>"+checkbox+commuteItems.rainJacket+"</label></li>")
                        }
                        if (morning.popChance >= "50" && morning.popChance <= "79") {
                            morning.pop.addClass("warning").show()
                            $("#alert-warning").show()
                            $("#morning-commuter-data .pop-warning .pop-warning .pop-chance").text(morning.popChance + "%")
                            $('#commute-needs').append("<li><label>"+checkbox+commuteItems.rainJacket+"</label></li>")
                        }
                        if (morning.popChance >= "80" ) {
                            morning.pop.addClass("alert").show()
                            $("#alert-warning").show()
                            $("#morning-commuter-data .pop-warning .pop-chance").text(morning.popChance + "%")
                            $('#commute-needs').append("<li><label>"+checkbox+commuteItems.rainJacket+"</label></li>")
                        }
                    }
                    if (globalData.paddedHour === eveninghr && !eveningWeather) {

                        var evening = {
                            today: today,
                            time: today + " at " + globalData.civilTime,
                            weatherIcon: globalForecast.weatherIcon,
                            temp: globalForecast.feelslike,
                            condition: forecastObject.condition,
                            pop: $("#evening-commuter-data .pop-warning"),
                            popChance: globalForecast.popChance,
                            container: $("#evening-commuter-data"),
                            wind: globalForecast.wind,
                        }
                         console.log(today)
                            commuteNeeds = $("#evening-commuter-data #commute-needs")

                        if (evening.temp === "98") {
                            console.log("It's going to be boyband hot out there.")
                        }
                        if (evening.temp >= "81") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.tankTop+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.sandalShoes+"</label></li>")
                        } 
                        if (evening.temp >= "71" && evening.temp <= "80") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightshirt+"</label></li>")
                            console.log("71")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.sandalShoes+"</label></li>")
                        } 
                        if (evening.temp >= "61" && evening.temp <= "70") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightshirt+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.sandalShoes+" or "+commuteItems.closedShoes+"</label></li>")
                        } 
                        if (evening.temp >= "51" && evening.temp <= "60") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightJacket+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.closedShoes+"</label></li>")
                        } 
                        if (evening.temp >= "41" && evening.temp <= "50") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightJacket+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.jeanPants+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightGloves+"</label></li>")
                        } 
                        if (evening.temp >= "31" && evening.temp <= "40") {
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.mediumJacket+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.lightGloves+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.headBand+"</label></li>")
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.jeanPants+"</label></li>")


                        } 
                        if (evening.temp < "30") {
                            $("#alert-warning").show()
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.parkaJacket+"</label></li>")
                        }
                        if (evening.wind >= "12" ) {
                            commuteNeeds.append("<li><label>"+checkbox+commuteItems.windJacket+"</label></li>")
                        }
                        // Pop Chance
                        if (evening.popChance >= "0" && evening.popChance <= "9") {
                            $("#evening-commuter-data .pop-warning").addClass("no-pop").hide()
                        }
                        if (evening.popChance >= "10" && evening.popChance <= "29") {
                            evening.pop.addClass("secondary").show()
                            $("#evening-commuter-data .pop-warning .pop-chance").text(evening.popChance + "%")
                        }
                        if (evening.popChance >= "30" && evening.popChance <= "49") {
                            evening.pop.addClass("primary").show()
                            $("#evening-commuter-data .pop-warning .pop-warning .pop-chance").text(evening.popChance + "%")
                            $(evening.container+"#commute-needs").append("<li><label>"+checkbox+commuteItems.rainJacket+"</label></li>")
                        }
                        if (evening.popChance >= "50" && evening.popChance <= "79") {
                            evening.pop.addClass("warning").show()
                            $("#alert-warning").show()
                            $("#evening-commuter-data .pop-warning .pop-warning .pop-chance").text(evening.popChance + "%")
                            $(evening.container+"#commute-needs").append("<li><label>"+checkbox+commuteItems.rainJacket+"</label></li>")
                        }
                        if (evening.popChance >= "80" ) {
                            evening.pop.addClass("alert").show()
                            $("#alert-warning").show()
                            $("#evening-commuter-data .pop-warning .pop-chance").text(evening.popChance + "%")
                            $('#commute-needs').append("<li><label>"+checkbox+commuteItems.rainJacket+"</label></li>")
                        }
                    }   
                                    
                }
                var morningWeatherimg = $('#morning-icon') //Equivalent: $(document.createElement('img'))
                    morningWeatherimg.attr('src', morning.weatherIcon)
                var eveningWeatherimg = $('#evening-icon') 
                    eveningWeatherimg.attr('src', evening.weatherIcon)

                $('#form-fields #city-loc').text(cityLoc+", "+stateLoc)

                $('#morning-commuter-data .date').append(morning.time)
                $('#morning-forecast h1').append(morning.temp+"&deg;<span>f</span>")
                $('#morning-condition p').append(morning.condition)
                
                $('#evening-commuter-data .date').append(evening.time)
                $('#evening-forecast h1').append(evening.temp+"&deg;<span>f</span>")
                $('#evening-condition p').append(evening.condition)
                

            })
            //var $cityName = $("<h1>")
            // replace space in city name with _ using .replace() <- look that up.
        })
        // .get gets a url - in this case it's the search URL
        //.then gets whatever was returned in the previous function - get's passed into this function as data

    })
})