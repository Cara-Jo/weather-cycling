$(document).ready(function(){
    var searchURL = "https://api.wunderground.com/api/a4e9f436358c9497/geolookup/q/"
    $("#morning-commuter-data .pop-warning").hide()
    $("#evening-commuter-data .pop-warning").hide()
    $("#alert-warning").hide()
    $("#commuter-data").hide()
    $('#wtw').click(function(){
        
        //$('#morning-forecast h1').empty()
        var zipcode = $('#zip').val()
        var morning = $('#morning-commute').val()
        var evening = $('#evening-commute').val()
        searchURL = searchURL + zipcode + ".json"
        console.log(searchURL)
        
        //console.log(zipcode)
        $.get(searchURL)
        .then(function(data){
            
            var cityLoc = data.location.city
                stateLoc = data.location.state
                cityLocurl = cityLoc.replace(" ", "_")
                morningTime = ''
                eveningTime = ''

                prettySearchURL = "https://api.wunderground.com/api/a4e9f436358c9497/hourly/q/"+stateLoc+"/"+cityLocurl+".json"
                //astroURL = "https://api.wunderground.com/api/a4e9f436358c9497/astronomy/q/"+stateLoc+"/"+cityLocurl+".json"
               //console.log(data)
            $('#form-fields').fadeOut("fast", function(){
               var div = $("<div id='form-fields'><h1 class='text-center'>"+cityLoc+", "+stateLoc+"</h2></div>").hide();
               $(this).replaceWith(div);
               $('#form-fields').fadeIn("fast");
            });

            $.get(prettySearchURL)
            .then(function(hourlydata){
                //console.log(hourlydata)
                $('#commuter-data').show()
                //for (i = 0; i <= hourlydata.hourly_forecast.length; i++) {
                 for (i = hourlydata.hourly_forecast.length - 1; i >= 0; i--) {
                    // Time Variables
                    var timeObject = hourlydata.hourly_forecast[i].FCTTIME
                        paddedHour = timeObject.hour_padded
                        civilTime = timeObject.civil
                        weekday = timeObject.weekday_name
                        month = timeObject.month_name
                        date = timeObject.mday
                        year = timeObject.year 
                        today = weekday + " " + month + " " + date + ", " + year
                    
                    // Forecast variables
                    var forecastObject = hourlydata.hourly_forecast[i]
                        feelslike = forecastObject.feelslike.english
                        weatherIcon = forecastObject.icon_url
                        popChance = forecastObject.pop

                    // Things you need while biking
                    var commuteNeeds = $("#commute-needs")
                        lightJacket = "Light Jacket"
                        windJacket = "Wind Breaker"
                        rainJacket = "Rain Jacket"
                        heavyJacket = "Heavy Jacket"
                        checkbox = "<input type='checkbox'></input> "
                    // Check Morning Time
                    if (paddedHour === morning) {
                        var morningWeather = forecastObject
                            today = weekday + " " + month + " " + date + ", " + year
                            morningTime = today + " at " + civilTime
                            morningWeatherIcon = weatherIcon
                            morningTemp = feelslike
                            morningCondition = forecastObject.condition

                            morningPOP = $("#morning-commuter-data .pop-warning") 


                        // console.log("Items for morning:")
                        // console.log(feelslike)
                        // console.log(hourlydata.hourly_forecast[i])
                        // console.log("Precip Chance: " + popChance)
                        // Feels Like Temp Ranges
                        if (feelslike >= "40" && feelslike <= "50") {
                            //console.log("temp range is 40-50")
                            commuteNeeds.append("<li>"+checkbox+lightJacket+"</li>")

                        } 
                        if (feelslike >= "30" && feelslike <= "40") {
                            //console.log("temp range at " + morningTime +" is 30-40")
                            $('#commute-needs').html("<li>"+checkbox+lightJacket+"</li>")
                        } 

                        // Pop Chance
                        if (popChance >= "0" && popChance <= "9") {
                            $("#morning-commuter-data .pop-warning").addClass("no-pop").hide()
                        }
                        if (popChance >= "10" && popChance <= "29") {
                            morningPOP.addClass("secondary").show()
                            $("#morning-commuter-data .pop-warning .pop-chance").text(popChance + "%")
                        }
                        if (popChance >= "30" && popChance <= "49") {
                            morningPOP.addClass("primary").show()
                            $("#morning-commuter-data .pop-warning .pop-warning .pop-chance").text(popChance + "%")
                            $('#commute-needs').append("<li>"+checkbox+rainJacket+"</li>")
                        }
                        if (popChance >= "50" && popChance <= "79") {
                            morningPOP.addClass("warning").show()
                            $("#morning-commuter-data .pop-warning .pop-warning .pop-chance").text(popChance + "%")
                            $('#commute-needs').append("<li>"+checkbox+rainJacket+"</li>")
                        }
                        if (popChance >= "80" && popChance <= "100") {
                            morningPOP.addClass("alert").show()
                            $("#morning-commuter-data .pop-warning .pop-chance").text(popChance + "%")
                            $('#commute-needs').append("<li>"+checkbox+rainJacket+"</li>")
                        }
                        
                    }
                    if (paddedHour === evening) {
                        var eveningWeather = forecastObject
                            today = weekday + " " + month + " " + date + ", " + year
                            eveningTime = today + " at " + civilTime
                            eveningWeatherIcon = weatherIcon
                            eveningTemp = feelslike
                            eveningCondition = forecastObject.condition
                    }
                                    
                }
                var morningWeatherimg = $('#morning-icon') //Equivalent: $(document.createElement('img'))
                    morningWeatherimg.attr('src', morningWeatherIcon)
                
                $('#form-fields #city-loc').text(cityLoc+", "+stateLoc)
                $('#morning-commuter-data .date').append(morningTime)
                $('#morning-forecast h1').append(morningTemp+"&deg;<span>f</span>")
                $('#morning-forecast p').append(morningCondition)
                
                $('#evening-commuter-data .date').append(eveningTime)
                $('#evening-forecast h1').append(eveningTemp+"&deg;<span>f</span>")
                $('#evening-forecast p').append(eveningCondition)
                var eveningWeatherimg = $('#evening-icon') 
                    eveningWeatherimg.attr('src', eveningWeatherIcon)

            })
            //var $cityName = $("<h1>")
            // replace space in city name with _ using .replace() <- look that up.
        })
        // .get gets a url - in this case it's the search URL
        //.then gets whatever was returned in the previous function - get's passed into this function as data

    })
})