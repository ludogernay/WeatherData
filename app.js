const container = document.querySelector('.container');
const alldays = document.querySelector('.alldays');
const inputtext = document.getElementById('inputText');
const valider = document.getElementById('Valider');
const loc = document.querySelector('.Location');
const temp = document.querySelector('.Temp');
const heure = document.querySelector('.Time');
const vent = document.querySelector('.Wind');
const condition = document.querySelector('.Condition');
var lat, lng;
//cacher tout les elements de la page
container.style.display = 'none';
valider.addEventListener('click', async () => {
  ville = inputtext.value;

  try {
    const villeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${ville}&key=AIzaSyDHmEElB8bEGwizIvNvgEKIrc4K39RGAc0`);
    const villeData = await villeResponse.json();
    lat = villeData.results[0].geometry.location.lat;
    lng = villeData.results[0].geometry.location.lng;
    Ville = villeData.results[0].formatted_address;
    container.style.display = 'block';

    const meteoResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&current_weather=true&timezone=Europe%2FBerlin`);
    const meteoData = await meteoResponse.json();
    var temperature = meteoData.current_weather.temperature;
    var wind = meteoData.current_weather.windspeed;
    var winddir = meteoData.current_weather.winddirection;
    var wmo = meteoData.current_weather.weathercode;
    loc.innerHTML = `<i class="material-icons locationIcon">place</i> ${Ville}`;
    temp.innerHTML = `${temperature} <span id="C">&#8451;</span>`;
    vent.innerHTML = `Vent : ${wind}km/h ${DirectionVent(winddir)}`;
    condition.innerHTML = `${WMOtoWeather(wmo)}`;
    const date = await getDate(lat, lng);
    heure.innerHTML = formatDate(date);
    const previousDays = document.querySelectorAll('.day');  // remove previous days
    previousDays.forEach(day => day.remove());
    for (i = 1; i < 7; i++) {
      const day = document.createElement('div');
      day.classList.add('container', 'day');
      day.innerHTML = `
        <div class="background">
          <div class="Circle1"></div>
          <div class="Circle2"></div>
          <div class="Circle3"></div>
          <div class="content">
              <h1 class="Condition"><i class="material-icons sun">wb_sunny</i> Sunny</h1>
              <h1 class="TempMin">Min : ${meteoData.daily.temperature_2m_min[i]} <span id="Cmin">&#8451;</span></h1>
              <h1 class="TempMax">Max : ${meteoData.daily.temperature_2m_max[i]} <span id="Cmax">&#8451;</span></h1>
              <h1 class="Wind">Vent : ${meteoData.daily.windspeed_10m_max[i]}km/h</h1>
              <h1 class="Time"></h1>
              <h1 class="Location"><i class="material-icons locationIcon">place</i> ${Ville}</h1>
          </div>
        </div>
      `;
      alldays.appendChild(day);
    }
  } catch (error) {
    console.error(error);
  }
});
async function getDate(lat, lng) {
  try {
    const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=Z0D7A4QE30I2&format=json&by=position&lat=${lat}&lng=${lng}`);
    const data = await response.json();
    const date = new Date(data.formatted);
    return date;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
function DirectionVent(winddir) {
  if (winddir >= 360 - 22.5 && winddir <= 22.5) {
    return "N";
  }
  else if (winddir > 22.5 && winddir <= 45 + 22.5) {
    return "NE";
  }
  else if (winddir > 45 + 22.5 && winddir <= 90 + 22.5) {
    return "E";
  }
  else if (winddir > 90 + 22.5 && winddir < 135 + 22.5) {
    return "SE";
  }
  else if (winddir > 135 + 22.5 && winddir <= 180 + 22.5) {
    return "S";
  }
  else if (winddir > 180 + 22.5 && winddir <= 225 + 22.5) {
    return "SO";
  }
  else if (winddir > 225 + 22.5 && winddir <= 270 + 22.5) {
    return "O";
  }
  else {
    return "NO";
  }
}
function WMOtoWeather(wmo) {
  console.log(wmo);
  switch (true) {
    case wmo >= 0 && wmo <= 3:
      return "Temps dégagé";
    case wmo > 3 && wmo <= 19:
      return "Nuageux";
    case (wmo > 19 && wmo <= 29) || (wmo > 60 && wmo <= 69):
      return "Pluie";
    case wmo > 69 && wmo <= 79:
      return "Neige";
    case wmo > 79 && wmo <= 99:
      return "Pluie violente";
    default:
      return "Risque de pluie";
  }
}


