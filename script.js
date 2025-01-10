const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".Weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initially variables
let currentTab = userTab;
const API_KEY = "608a044690821d4c5b9491d755fd2de7";
currentTab.classList.add("current-tab");
// one more thing pending
getFromSessionStorage();

function switchTab(clickedTab) {
  if (currentTab == clickedTab) {
    return;
  } else {
    currentTab.classList.remove("current-tab");

    currentTab = clickedTab;

    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});
searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

// check if coordinates are already present in session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    // localCoordinates not found
    grantAccessContainer.classList.add("active");
  } else {
    // localCoordinates found
    // converting data received into json format
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates /* object */) {
  // const { lat, lon } = coordinates;

  const lat = coordinates.lat;
  const lon = coordinates.lon;

  grantAccessContainer.classList.remove("active");

  // make loader visible
  loadingScreen.classList.add("active");

  // api call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");

    renderWeatherInfo(data);
  } catch (err) {
    // HW
  }
}

function renderWeatherInfo(weatherInfo) {
  // firstly fetch the elements

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  // fetch values from weather info object and put it in UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // H/W show an alert for no geolocation support available
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (searchInput.value === "") {
    return;
  }
  fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {}
}
