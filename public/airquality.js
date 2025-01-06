async function getAirQuality() {
    const apiKey = "";
    const city = prompt("Enter your city name:");

    if (!city) {
        alert("City name is required!");
        return;
    }

    try {
        // Step 1: Get latitude and longitude of the city
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData || geoData.length === 0) {
            document.getElementById('air-quality-data').innerHTML = `<p>Could not find location: ${city}</p>`;
            return;
        }

        const { lat, lon } = geoData[0];

        // Step 2: Fetch air quality data using latitude and longitude
        const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const airResponse = await fetch(airUrl);
        const airData = await airResponse.json();

        if (airData && airData.list && airData.list.length > 0) {
            const airQuality = airData.list[0];
            document.getElementById('air-quality-data').innerHTML = `
                <p><strong>Location:</strong> ${city}</p>
                <p><strong>AQI:</strong> ${airQuality.main.aqi}</p>
                <p><strong>PM2.5:</strong> ${airQuality.components.pm2_5} μg/m³</p>
                <p><strong>PM10:</strong> ${airQuality.components.pm10} μg/m³</p>
                <p><strong>Ozone:</strong> ${airQuality.components.o3} μg/m³</p>
            `;
        } else {
            document.getElementById('air-quality-data').innerHTML = `<p>No air quality data found for ${city}.</p>`;
        }
    } catch (error) {
        console.error("Error fetching air quality data:", error);
        document.getElementById('air-quality-data').innerHTML = `<p>Error fetching data. Please try again.</p>`;
    }
}
