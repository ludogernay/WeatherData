
const ville = document.getElementById('text-input');
const button = document.getElementById('button-input');
button.addEventListener('click', () => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=43.70&longitude=7.27&hourly=temperature_2m&current_weather=true')
        .then(response => response.json())
        .then(data => {
            const result = document.querySelector('.result');
            result.innerHTML = `Température : ${data.hourly.temperature_2m[0]}°C`;
        }
        );
}
);