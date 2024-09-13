const app = document.querySelector(".weather-app"),
    temp = document.querySelector(".temp"),
    dateOutput = document.querySelector(".date"),
    timeOutput = document.querySelector(".time"),
    timeZoneOutput = document.querySelector(".time-zone"),
    conditionOutput = document.querySelector(".condition"),
    nameOutput = document.querySelector(".name"),
    icon = document.querySelector(".icon"),
    cloudOutput = document.querySelector(".cloud"),
    humidityOutput = document.querySelector(".humidity"),
    windOutput = document.querySelector(".wind"),
    from = document.getElementById("locationInput"),
    search = document.querySelector(".search"),
    btn = document.querySelector(".submit"),
    cities = document.querySelectorAll(".cities"),
    foreCast = document.querySelector(".forecast");

const weatherApiKey = `f1583eed28b5439da9e65338240608`,
    locationApiKey = `pk.46b362c44da55917ec67cf29ee1801e3`,
    weatherApiUrl = `https://api.weatherapi.com/v1/current.json/forecast.json?key=${weatherApiKey}&aqi=yes&days=6`,
    locationApiUrl = `https://us1.locationiq.com/v1/reverse?key=${locationApiKey}&format=json`;

cities.forEach((city) => {
    city.addEventListener("click", (e) => {
        fetchWeatherData(e.target.innerHTML);
        app.style.opacity = "0";
    });
});

from.addEventListener("submit", (e) => {
    if (search.value.length == 0) {
        alert("Please type in a city name...");
    } else {
        fetchWeatherData(search.value);
        search.value = "";
        app.style.opacity = "0";
    }
    e.preventDefault();
});

function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    return weekday[new Date(`${year}/${month}/${day}`).getDay()];
}

function setLocalTime(data) {
    const date = data.location.localtime;
    const y = parseInt(date.substr(0, 4));
    const m = parseInt(date.substr(5, 2));
    const d = parseInt(date.substr(8, 2));
    const time = date.substr(11);

    dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
    timeOutput.innerHTML = time;
}

function setOtherDetail(data) {
    temp.innerHTML = data.current.temp_c + "&#176;C";
    conditionOutput.innerHTML = data.current.condition.text;
    timeZoneOutput.innerHTML = data.location.tz_id;
    nameOutput.innerHTML = data.location.name;
    cloudOutput.innerHTML = data.current.cloud + "%";
    humidityOutput.innerHTML = data.current.humidity + "%";
    windOutput.innerHTML = data.current.wind_kph + "km/h";
}

function getCity(lat, lng) {
    fetch(locationApiUrl + `&lat=${lat}&lon=${lng}`)
        .then((response) => response.json())
        .then((data) => {
            fetchWeatherData(data.address.city);
        })
        .catch((e) => {
            console.warn(e);
        });
}

function getCoordintes() {
    let options = {
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 0,
    };

    function success(pos) {
        let crd = pos.coords;
        let lat = crd.latitude;
        let lng = crd.longitude;
        getCity(lat, lng);
        return;
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        fetchWeatherData();
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

function setIconAndBtn(data) {
    let timeOfDay = "day";

    if (!data.current.is_day) {
        timeOfDay = "night";
    }

    const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64/day/".length
    );
    if (timeOfDay == "night") {
        icon.src = `//cdn.weatherapi.com/weather/64x64/${timeOfDay}/${iconId}`;
        btn.style.background = "black";
    } else {
        icon.src = `//cdn.weatherapi.com/weather/64x64/${timeOfDay}/${iconId}`;
        btn.style.background = "red";
    }
}

function setForeCastData(data) {
    console.log(data);

    foreCast.innerHTML = ``;
    data.forEach((data, index) => {
        if (index === 0) {
            foreCast.innerHTML = ``;
        } else {
            const date = data.time;
            const time = date.substr(11);
            const iconId = data.condition.icon.substr(
                "//cdn.weatherapi.com/weather/64x64/day/".length
            );
            let li = document.createElement("li");
            li.innerHTML = `<span>${time}</span>
                            <img src="${
                                "//cdn.weatherapi.com/weather/64x64/day/" +
                                iconId
                            }"
                            alt="icon"
                            width="50"
                            height="50"
                            />
                            <span>${data.temp_c + "&#176;C"}</span>
                            <span>${data.humidity}%</span>
                            <span>${data.wind_kph}km/h</span>
                            `;
            foreCast.appendChild(li);
        }
    });
}

function fetchWeatherData(cityInput = "delhi") {
    fetch(weatherApiUrl + `&q=${cityInput}`)
        .then((res) => res.json())
        .then((data) => {
            setForeCastData(data.forecast.forecastday[0].hour);
            setOtherDetail(data);
            setLocalTime(data);
            const code = data.current.condition.code;

            if (code == 1000) {
                app.style.backgroundImage = `url(Image/Sunny.jpg)`;
                setIconAndBtn(data);
            } else if (code == 1003 || code == 1006) {
                app.style.backgroundImage = `url(Image/Cloudy.jpg)`;
                setIconAndBtn(data);
            } else if (code == 1009 || code == 1130) {
                app.style.backgroundImage = `url(Image/Overcast.jpg)`;
                setIconAndBtn(data);
            } else if (
                code == 1063 ||
                code == 1180 ||
                code == 1183 ||
                code == 1186 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1198
            ) {
                app.style.backgroundImage = `url(Image/Rainy.jpg)`;
                setIconAndBtn(data);
            } else if (code == 1135 || code == 1136) {
                app.style.backgroundImage = `url(Image/Foggy.jpg)`;
                setIconAndBtn(data);
            } else if (
                code == 1260 ||
                code == 1243 ||
                code == 1246 ||
                code == 1255
            ) {
                app.style.backgroundImage = `url(Image/Showers.jpg)`;
                setIconAndBtn(data);
            } else if (
                code == 1069 ||
                code == 1204 ||
                code == 1207 ||
                code == 1252
            ) {
                app.style.backgroundImage = `url(Image/Sleet.jpg)`;
                setIconAndBtn(data);
            } else if (
                code == 1066 ||
                code == 1269 ||
                code == 1114 ||
                code == 1213 ||
                code == 1216 ||
                code == 1219 ||
                code == 1222 ||
                code == 1210 ||
                code == 1225
            ) {
                app.style.backgroundImage = `url(Image/Snowy & Cold.jpg)`;
                setIconAndBtn(data);
            } else {
                app.style.backgroundImage = `url(Image/PartlyCloudy.jpg)`;
                setIconAndBtn(data);
            }
            app.style.opacity = "1";
        })
        .catch((e) => {
            console.warn(e);

            if (e == "TypeError: Failed to fetch") {
                alert(
                    "Internet is not available, pls Connect your device on internet"
                );
            } else {
                alert("City is not found, pls try again...");
            }
            app.style.opacity = "1";
        });
}

getCoordintes();
