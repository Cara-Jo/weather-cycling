$(document).ready(function(){
    var searchURL = "https://api.wunderground.com/api/a4e9f436358c9497/geolookup/q/"
    $("#morning-commuter-data .pop-warning").hide()
    
    $('#wtw').click(function(){
        $('#commuter-data').show()
        var zipcode = $('#zip').val()
        var morning = $('#morning-commute').val()
        var evening = $('#evening-commute').val()
        searchURL = searchURL + zipcode + ".json"
        //console.log(zipcode)
        $.get(searchURL)
        .then(function(data){
            var cityLoc = data.location.city
            var stateLoc = data.location.state
                cityLoc = cityLoc.replace(" ", "_")
            var morningTime = ''
            var eveningTime = ''
            prettySearchURL = "https://api.wunderground.com/api/a4e9f436358c9497/hourly/q/"+stateLoc+"/"+cityLoc+".json"
            
            $.get(prettySearchURL)
            .then(function(hourlydata){
                for (i = hourlydata.hourly_forecast.length - 1; i >= 0; i--) {
                    // Time Variables
                    var timeObject = hourlydata.hourly_forecast[i].FCTTIME
                    var paddedHour = timeObject.hour_padded
                    var civilTime = timeObject.civil
                    var weekday = timeObject.weekday_name
                    var month = timeObject.month_name
                    var date = timeObject.mday
                    var year = timeObject.year 
                        today = weekday + " " + month + " " + date + ", " + year
                    
                    // Forecast variables
                    var forecastObject = hourlydata.hourly_forecast[i]
                    var feelslike = forecastObject.feelslike.english
                    var weatherIcon = forecastObject.icon_url
                    var morningCondition = forecastObject.condition
                    var popChance = forecastObject.pop

                    // Check Morning Time
                    if (paddedHour === morning) {
                        var morningWeather = forecastObject
                            today = weekday + " " + month + " " + date + ", " + year
                            morningTime = today + " at " + civilTime
                            morningWeatherIcon = weatherIcon

                        //console.log(hourlydata.hourly_forecast[i])
                        console.log("Precip Chance: " + popChance)
                        // Feels Like Temp Ranges
                        if (feelslike >= "40" && feelslike <= "50") {
                            console.log("temp range is 40-50")
                        } 
                        if (feelslike >= "30" && feelslike <= "40") {
                            console.log("temp range at " + morningTime +" is 30-40")
                        } 
                        // Pop Chance
                        if (popChance >= "10" && popChance <= "29") {
                            $("#morning-commuter-data .pop-warning").addClass("secondary").show()
                            $("#morning-commuter-data .pop-warning .pop-chance").text(popChance + "%")
                        }
                        if (popChance >= "30" && popChance <= "49") {
                            $("#morning-commuter-data .pop-warning").addClass("primary").show()
                            $("#morning-commuter-data .pop-warning .pop-chance").text(popChance + "%")
                        }
                        if (popChance >= "50" && popChance <= "79") {
                            $("#morning-commuter-data .pop-warning").addClass("warning").show()
                            $("#morning-commuter-data .pop-warning .pop-chance").text(popChance + "%")
                        }
                        if (popChance >= "80" && popChance <= "100") {
                            $("#morning-commuter-data .pop-warning").addClass("alert").show()
                            $("#morning-commuter-data .pop-warning .pop-chance").text(popChance + "%")
                        }

                    }
                    if (paddedHour === evening) {
                        var eveningWeather = forecastObject
                            today = weekday + " " + month + " " + date + ", " + year
                            eveningTime = today + " at " + civilTime
                            eveningWeatherIcon = weatherIcon
                    }
                    
                }
                var morningWeatherimg = $('#morning-icon') //Equivalent: $(document.createElement('img'))
                    morningWeatherimg.attr('src', morningWeatherIcon)
                
                $('#morning-commuter-data .date').append(morningTime)
                $('#morning-forecast h1').append(feelslike)
                $('#morning-forecast p').append(morningCondition)
                
                $('#evening-commuter-data .date').append(eveningTime)
                var eveningWeatherimg = $('#evening-icon') //Equivalent: $(document.createElement('img'))
                    eveningWeatherimg.attr('src', eveningWeatherIcon)

            })
            //var $cityName = $("<h1>")
            // replace space in city name with _ using .replace() <- look that up.
        })
        // .get gets a url - in this case it's the search URL
        //.then gets whatever was returned in the previous function - get's passed into this function as data

    })
})