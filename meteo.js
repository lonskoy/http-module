const https = require('https');
const readline = require('readline');
require('dotenv').config();

const apiKey = process.env.API_KEY; 
const apiTempUrl = "https://api.weather.yandex.ru/v2/geo-suggest?part=";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const options = {
    headers: {
        "X-Yandex-API-Key": apiKey,
    }
};

function fetchWeather(city) {
    const apiUrl = `${apiTempUrl}${city}`;

    const request = https.get(apiUrl, options, (response) => {
        let data = '';
      
        // Получение данных по мере их поступления
        response.on('data', (chunk) => {
            data += chunk;
        });
      
        // Завершение запроса и вывод данных
        response.on('end', () => {
            if (response.statusCode === 200) {
                try {
                    const jsonData = JSON.parse(data);
                    console.log("Погода в", city, ':', jsonData);
                    // здесь можно обработать полученные данные, например, вывести в HTML
                } catch (error) {
                    console.error("Ошибка при разборе JSON:", error.message);
                }
            } else {
                console.error("Ошибка HTTP:", response.statusCode);
            }
            rl.close(); // Закрываем интерфейс readline после завершения запроса
        });
    });
      
    request.on('error', (error) => {
        console.error("Ошибка при запросе к API Яндекс Погоды:", error.message);
        rl.close(); // Закрываем интерфейс readline при ошибке запроса
    });
}

// Запрос ввода города у пользователя
rl.question('Введите название города (на английском языке): ', (city) => {
    fetchWeather(city);
});


