document.addEventListener('DOMContentLoaded', () => {
    const fromLangSelect = document.getElementById('from-lang');
    const toLangSelect = document.getElementById('to-lang');
    const fromTextInput = document.getElementById('from-text');
    const toTextInput = document.getElementById('to-text');
    const translateBtn = document.getElementById('translate-btn');
    const swapBtn = document.getElementById('swap-lang-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    const languages = {
        'en': '영어',
        'ko': '한국어',
        'vi': '베트남어',
        'th': '태국어',
        'zh': '중국어',
        'ja': '일본어'
    };

    // 언어 드롭다운 채우기
    function populateLanguages() {
        // 출발 언어 (자동 감지 포함)
        fromLangSelect.innerHTML = '<option value="auto">자동 감지</option>';
        for (const code in languages) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = languages[code];
            fromLangSelect.appendChild(option);
        }

        // 도착 언어
        for (const code in languages) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = languages[code];
            toLangSelect.appendChild(option);
        }

        // 기본값 설정
        fromLangSelect.value = 'auto';
        toLangSelect.value = 'ko';
    }

    // 번역 기능
    async function translateText() {
        const text = fromTextInput.value.trim();
        let fromLang = fromLangSelect.value;
        const toLang = toLangSelect.value;

        if (!text) {
            toTextInput.value = '';
            return;
        }
        
        if (fromLang === 'auto') {
            fromLang = ''; // MyMemory API는 auto-detect를 위해 빈 문자열을 사용
        }

        if (fromLang === toLang) {
            toTextInput.value = text;
            return;
        }

        toTextInput.value = '번역 중...';

        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.responseStatus === 200) {
                toTextInput.value = data.responseData.translatedText;
            } else {
                toTextInput.value = `오류: ${data.responseDetails}`;
            }
        } catch (error) {
            toTextInput.value = '번역 서비스에 연결할 수 없습니다.';
            console.error('Translation API Error:', error);
        }
    }

    // 언어 전환
    function swapLanguages() {
        const fromLang = fromLangSelect.value;
        const toLang = toLangSelect.value;

        if (fromLang !== 'auto') {
            fromLangSelect.value = toLang;
            toLangSelect.value = fromLang;
        }
    }

    // 클립보드 복사
    function copyToClipboard() {
        if (toTextInput.value) {
            navigator.clipboard.writeText(toTextInput.value)
                .then(() => {
                    // 간단한 알림 효과
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '복사 완료!';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 1500);
                })
                .catch(err => {
                    console.error('Copy failed', err);
                });
        }
    }

    // 내용 지우기
    function clearAll() {
        fromTextInput.value = '';
        toTextInput.value = '';
    }

    // 이벤트 리스너 설정
    translateBtn.addEventListener('click', translateText);
    swapBtn.addEventListener('click', swapLanguages);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearAll);

    // 초기화
    populateLanguages();
});
