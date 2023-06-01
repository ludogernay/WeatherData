const container = document.querySelector('.container');
const inputtext = document.getElementById('inputText');
const valider = document.getElementById('Valider');
const loc = document.querySelector('.Location');
const temp = document.querySelector('.Temp');
const heure = document.querySelector('.Time');
var lat,lng;
//cacher tout les elements de la page
container.style.display = 'none';
valider.addEventListener('click', async () => {
    ville = inputtext.value;
    console.log(ville);
  
    try {
      const villeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${ville}&key=AIzaSyDHmEElB8bEGwizIvNvgEKIrc4K39RGAc0`);
      const villeData = await villeResponse.json();
      lat = villeData.results[0].geometry.location.lat;
      lng = villeData.results[0].geometry.location.lng;
  
      container.style.display = 'block';
      console.log(lat, lng);
  
      const meteoResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FBerlin`);
      const meteoData = await meteoResponse.json();
      var temperature = meteoData.current_weather.temperature;
  
      loc.innerHTML = `<i class="material-icons locationIcon">place</i> ${ville}`;
      temp.innerHTML = `${temperature}<span id="C">&#8451;</span>`;
      heure.innerHTML = getDate();
    } catch (error) {
      console.error(error);
    }
  });
function getDate() {
    // Récupérer l'heure actuelle
    var date = new Date();
    var heures = date.getHours();
    var minutes = date.getMinutes();

    // Formater les heures et les minutes
    var heureFormattee = ("0" + heures).slice(-2);
    var minutesFormattees = ("0" + minutes).slice(-2);
    var heureActuelle = heureFormattee + ":" + minutesFormattees
    return heureActuelle;
}

