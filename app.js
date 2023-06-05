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
var background;
//cacher tout les elements de la page
container.style.display = 'none';
//ajouter une image au body
document.body.style.backgroundImage = "url('image/bg_meteo.jpg')";
valider.addEventListener('click', async () => {
  ville = inputtext.value;
  var i = 0;
  try {
    const villeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${ville}&key=AIzaSyDHmEElB8bEGwizIvNvgEKIrc4K39RGAc0`);
    const villeData = await villeResponse.json();
    lat = villeData.results[0].geometry.location.lat;
    lng = villeData.results[0].geometry.location.lng;
    Ville = villeData.results[0].formatted_address;
    container.style.display = 'block';
    container.id =`${i}`;
    const meteoResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max&daily=winddirection_10m_dominant&current_weather=true&timezone=Europe%2FBerlin`);
    const meteoData = await meteoResponse.json();
    var temperature = meteoData.current_weather.temperature;
    var wind = meteoData.current_weather.windspeed;
    var winddir = meteoData.current_weather.winddirection;
    var wmo = meteoData.current_weather.weathercode;
    loc.innerHTML = `<i class="material-icons locationIcon">place</i> ${Ville}`;
    temp.innerHTML = `${temperature} <span id="C">&#8451;</span>`;
    vent.innerHTML = `Vent : ${wind}km/h ${DirectionVent(winddir)}`;
    condition.innerHTML = `${loadImages(meteoData.daily.weathercode[i])}`;
    const date = await getDate(lat, lng);
    heure.innerHTML = formatDate(date, i);
    container.style.backgroundColor = background;
    const previousDays = document.querySelectorAll('.day');  // remove previous days
    previousDays.forEach(day => day.remove());
    for (i = 1; i < 7; i++) {
      const day = document.createElement('div');
      day.classList.add('container', 'day');
      day.id=`${i}`;
      day.innerHTML = `
        <div class="background">
          <div class="Circle1"></div>
          <div class="Circle2"></div>
          <div class="Circle3"></div>
          <div class="content">
              <h1 class="Condition">${loadImages(meteoData.daily.weathercode[i])}</h1>
              <h1 class="TempMin">Min : ${meteoData.daily.temperature_2m_min[i]} <span id="Cmin">&#8451;</span></h1>
              <h1 class="TempMax">Max : ${meteoData.daily.temperature_2m_max[i]} <span id="Cmax">&#8451;</span></h1>
              <h1 class="Wind">Vent : ${meteoData.daily.windspeed_10m_max[i]}km/h ${DirectionVent(meteoData.daily.winddirection_10m_dominant[i])}</h1>
              <h1 class="Time">${formatDate(date, i)}</h1>
              <h1 class="Location"><i class="material-icons locationIcon">place</i> ${Ville}</h1>
          </div>
        </div>
      `;
      day.style.backgroundColor = background;
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
function formatDate(date, i) {
  const day = String(date.getDate() + i).padStart(2, '0');
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
  switcher = {
    0: "Ciel dégagé",
    1: "Principalement dégagé",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brouillard et brouillard givrant",
    48: "Brouillard et brouillard givrant",
    51: "Bruine : Légère intensité",
    53: "Bruine : Intensité modérée",
    55: "Bruine : Intensité dense",
    56: "Bruine verglaçante : Légère intensité",
    57: "Bruine verglaçante : Intensité dense",
    61: "Pluie : Légère intensité",
    63: "Pluie : Intensité modérée",
    65: "Pluie : Forte intensité",
    66: "Pluie verglaçante : Légère intensité",
    67: "Pluie verglaçante : Forte intensité",
    71: "Chutes de neige : Légère intensité",
    73: "Chutes de neige : Intensité modérée",
    75: "Chutes de neige : Forte intensité",
    77: "Grains de neige",
    80: "Averses de pluie : Légère intensité",
    81: "Averses de pluie : Intensité modérée",
    82: "Averses de pluie : Intensité violente",
    85: "Averses de neige : Légère intensité",
    86: "Averses de neige : Forte intensité",
    95: "Orage",
    96: "Orage avec grêle légère",
    99: "Orage avec grêle importante"
  }
  return switcher[wmo];
}
function loadImages(wmo) {
  console.log(WMOtoWeather(wmo));
  if (wmo == 0) {
    background = 'orange';
    return `<img class="logo" src="Image/soleil.png" alt="Image">`
  } else if (wmo == 1 || wmo == 2) {
    background = '#ECECEC';
    return `<img class="logo" src="Image/couvert.png" alt="Image">`
  } else if (wmo == 3) {
    background = '#CDCDCD';
    return `<img class="logo" src="Image/nuageux.png" alt="Image">`
  } else if (wmo >= 80 && wmo <=86){
    background = '#1F74E782';
    return `<img class="logo" src="Image/averses.png" alt="Image">`
  } else if (wmo == 95 || wmo == 96 || wmo == 99){
    background = '#505050';
    return `<img class="logo" src="Image/orage.png" alt="Image">`
  } else if (wmo >=51 && wmo <=67){
    background = 'blue';
    return `<img class="logo" src="Image/pluie.png" alt="Image">`
  } else if (wmo <=71 && wmo >=77){
    background = '#1F74E730';
    return `<img class="logo" src="Image/neige.png" alt="Image">`
  }else{
    background = 'green';
    return `<img class="logo" src="Image/vent.png" alt="Image">`
  }
}

