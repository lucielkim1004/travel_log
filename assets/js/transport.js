document.addEventListener('DOMContentLoaded', () => {
  const currentLocationSpan = document.getElementById('current-location');
  const destinationInput = document.getElementById('destination-input');
  const refreshBtn = document.getElementById('refresh-location-btn');
  const transitBtn = document.getElementById('btn-transit');
  const walkBtn = document.getElementById('btn-walk');
  const driveBtn = document.getElementById('btn-drive');

  let currentCoords = null; // { lat, lon }

  async function getLocation() {
    if (!('geolocation' in navigator)) {
      currentLocationSpan.textContent = '이 브라우저는 위치 기능을 지원하지 않습니다.';
      return;
    }

    currentLocationSpan.textContent = '현재 위치 확인 중...';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        currentCoords = { lat: latitude, lon: longitude };
        currentLocationSpan.textContent = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      },
      (err) => {
        console.error('Geolocation error:', err);
        currentLocationSpan.textContent = '위치 정보를 가져올 수 없습니다. 권한을 확인하세요.';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  function openDirections(dirFlag) {
    const dest = destinationInput.value.trim();
    if (!dest) {
      alert('목적지를 입력해주세요.');
      destinationInput.focus();
      return;
    }

    if (!currentCoords) {
      alert('현재 위치 정보를 먼저 가져와 주세요.');
      getLocation();
      return;
    }

    const base = 'https://maps.google.com/maps';
    const saddr = `${currentCoords.lat},${currentCoords.lon}`;
    const daddr = encodeURIComponent(dest);
    const url = `${base}?saddr=${encodeURIComponent(saddr)}&daddr=${daddr}&dirflg=${dirFlag}`;
    window.open(url, '_blank');
  }

  // Wire events
  refreshBtn.addEventListener('click', getLocation);
  transitBtn.addEventListener('click', () => openDirections('r'));
  walkBtn.addEventListener('click', () => openDirections('w'));
  driveBtn.addEventListener('click', () => openDirections('d'));

  destinationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      // 기본값: 대중교통
      openDirections('r');
    }
  });

  // On load
  getLocation();
});
