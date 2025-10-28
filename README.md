Travel Log Web App

This is a multi-page travel companion web app built with HTML, CSS, and vanilla JavaScript. It includes tools like a map, budget tracker, currency converter, translator, planner, weather forecast, D-Day counter, to-do list, transport launcher, and a phrasebook cheat sheet.

Pages
- index.html: Map with geolocation (Leaflet + OpenStreetMap)
- budget.html: Expense tracker with totals (localStorage)
- currency.html: Currency converter (ExchangeRate API)
- translate.html: Translator (MyMemory API)
- planner.html: Itinerary planner (localStorage)
- weather.html: Weather via Open-Meteo (no API key)
- dday.html: D-Day countdowns (localStorage)
- todo.html: To-do list (localStorage)
- transport.html: Directions launcher to Google Maps
- phrasebook.html: Quick phrasebook (Thai, Vietnamese)

Assets
- assets/css/style.css: Shared styles for layout and components
- assets/js/main.js: Navigation and common scripts
- assets/js/*: Page-specific scripts
- assets/images/weather/*.svg: Local weather icons

Phrasebook
- Supports language tabs (Thai, Vietnamese) and category filters (전체, 인사, 식당, 쇼핑, 교통)
- Shows Korean phrase, local script, and simple pronunciation
- Static data, no network required

Notes
- Works offline for non-API pages; currency, translate, and map need internet.

# travel_log
travel
