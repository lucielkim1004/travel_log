document.addEventListener('DOMContentLoaded', function () {
    // Leaflet.js 지도를 초기화합니다.
    // 지도의 중심을 기본 위치(예: 서울)로 설정하고 확대/축소 레벨을 지정합니다.
    const map = L.map('map').setView([37.5665, 126.9780], 13);

    // OpenStreetMap 타일 레이어를 추가합니다.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Geolocation API를 사용하여 사용자의 현재 위치를 가져옵니다.
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // 지도의 중심을 사용자의 현재 위치로 이동합니다.
            map.setView([lat, lng], 15);

            // 사용자의 현재 위치에 마커를 추가합니다.
            L.marker([lat, lng]).addTo(map)
                .bindPopup('현재 위치')
                .openPopup();
        }, error => {
            console.error('Geolocation 오류:', error);
            // 오류 발생 시 기본 마커를 추가할 수 있습니다.
            L.marker([37.5665, 126.9780]).addTo(map)
                .bindPopup('기본 위치 (서울)')
                .openPopup();
        });
    } else {
        console.log('이 브라우저에서는 Geolocation API를 지원하지 않습니다.');
        // Geolocation을 지원하지 않을 경우 기본 마커를 추가합니다.
        L.marker([37.5665, 126.9780]).addTo(map)
            .bindPopup('기본 위치 (서울)')
            .openPopup();
    }
});
