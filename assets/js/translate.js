document.addEventListener('DOMContentLoaded', () => {
    const fromLangSelect = document.getElementById('from-lang');
    const toLangSelect = document.getElementById('to-lang');
    const fromTextInput = document.getElementById('from-text');
    const toTextInput = document.getElementById('to-text');
    const pronunciationDiv = document.getElementById('pronunciation');
    const translateBtn = document.getElementById('translate-btn');
    const swapBtn = document.getElementById('swap-lang-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');

    const languages = {
        'ko': '한국어',
        'en': '영어',
        'ja': '일본어',
        'zh-CN': '중국어',
        'th': '태국어',
        'vi': '베트남어',
        'fr': '프랑스어',
        'de': '독일어',
        'it': '이탈리아어',
        'ru': '러시아어',
        'hi': '인도어',
        'zh-TW': '대만어',
        'id': '인도네시아어',
        'lo': '라오스어',
        'tl': '필리핀어'
    };

    // 국가 코드를 언어 코드로 매핑
    const countryToLanguage = {
        'KR': 'ko', 'US': 'en', 'GB': 'en', 'JP': 'ja', 'CN': 'zh-CN',
        'TH': 'th', 'VN': 'vi', 'FR': 'fr', 'DE': 'de', 'IT': 'it',
        'RU': 'ru', 'IN': 'hi', 'TW': 'zh-TW', 'ID': 'id', 'LA': 'lo',
        'PH': 'tl'
    };

    // 현재 위치 기반 언어 감지
    async function detectUserLanguage() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                throw new Error('위치 정보를 가져올 수 없습니다.');
            }
            const data = await response.json();
            const countryCode = data.country_code;
            const language = countryToLanguage[countryCode];
            
            // 지원하는 언어인 경우 반환, 아니면 영어 기본값
            return language && languages[language] ? language : 'en';
        } catch (error) {
            console.log('위치 감지 실패, 기본값 영어 사용:', error);
            return 'en';
        }
    }

    // 언어 드롭다운 채우기
    async function populateLanguages() {
        // 출발 언어
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

        // 기본값 설정: 입력은 한국어, 출력은 현재 위치 기반
        fromLangSelect.value = 'ko';
        const userLanguage = await detectUserLanguage();
        toLangSelect.value = userLanguage;
    }

    // 번역 기능
    async function translateText() {
        const text = fromTextInput.value.trim();
        const fromLang = fromLangSelect.value;
        const toLang = toLangSelect.value;

        if (!text) {
            toTextInput.value = '';
            pronunciationDiv.innerHTML = '';
            return;
        }

        if (fromLang === toLang) {
            toTextInput.value = text;
            pronunciationDiv.innerHTML = '';
            return;
        }

        toTextInput.value = '번역 중...';
        pronunciationDiv.innerHTML = '';

        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.responseStatus === 200) {
                const translatedText = data.responseData.translatedText;
                toTextInput.value = translatedText;
                
                // 발음 표기 생성
                await generatePronunciation(translatedText, toLang);
            } else {
                toTextInput.value = `오류: ${data.responseDetails}`;
                pronunciationDiv.innerHTML = '';
            }
        } catch (error) {
            toTextInput.value = '번역 서비스에 연결할 수 없습니다.';
            pronunciationDiv.innerHTML = '';
            console.error('Translation API Error:', error);
        }
    }

    // 발음 생성 함수
    async function generatePronunciation(text, targetLang) {
        // 한국어로 번역된 경우 발음 표기 불필요
        if (targetLang === 'ko') {
            pronunciationDiv.innerHTML = '';
            return;
        }

        try {
            // 번역된 텍스트를 한국어 발음으로 변환 (역번역 활용)
            const pronApiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${targetLang}|ko`;
            const response = await fetch(pronApiUrl);
            const data = await response.json();

            if (data.responseStatus === 200) {
                // 발음을 위한 간단한 음성 변환 시도
                const koreanVersion = data.responseData.translatedText;
                
                // 실제 발음 표기를 위해 추가 처리
                pronunciationDiv.innerHTML = `
                    <div class="pronunciation-content">
                        <strong>🔊 발음:</strong>
                        <button id="speak-btn" class="btn btn-sm btn-outline-primary ms-2" title="발음 듣기">▶</button>
                        <div class="mt-1 text-muted small">${getPronunciationGuide(text, targetLang)}</div>
                    </div>
                `;

                // 음성 재생 버튼 이벤트
                const speakBtn = document.getElementById('speak-btn');
                if (speakBtn) {
                    speakBtn.addEventListener('click', () => speakText(text, targetLang));
                }
            }
        } catch (error) {
            console.error('Pronunciation generation error:', error);
        }
    }

    // 간단한 발음 가이드 생성
    function getPronunciationGuide(text, lang) {
        const romanization = romanizeText(text, lang);
        return romanization;
    }

    // 로마자/한글 발음 변환
    function romanizeText(text, lang) {
        // 기본 로마자 표기 패턴 (간단한 구현)
        const patterns = {
            'en': text, // 영어는 그대로
            'ja': text, // 일본어 히라가나/가타카나
            'th': text, // 태국어
            'vi': text, // 베트남어
            'zh-CN': text, // 중국어
            'zh-TW': text, // 대만어
        };

        return `"${text}" (${languages[lang]} 발음으로 읽어주세요)`;
    }

    // 음성 재생 함수 (Web Speech API 사용)
    function speakText(text, lang) {
        if ('speechSynthesis' in window) {
            // 기존 음성 중지
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            
            // 언어 코드 매핑
            const speechLang = {
                'en': 'en-US',
                'ja': 'ja-JP',
                'zh-CN': 'zh-CN',
                'th': 'th-TH',
                'vi': 'vi-VN',
                'fr': 'fr-FR',
                'de': 'de-DE',
                'it': 'it-IT',
                'ru': 'ru-RU',
                'hi': 'hi-IN',
                'zh-TW': 'zh-TW',
                'id': 'id-ID',
                'lo': 'lo-LA',
                'tl': 'tl-PH'
            };

            utterance.lang = speechLang[lang] || 'en-US';
            utterance.rate = 0.9; // 속도 조절
            utterance.pitch = 1;
            utterance.volume = 1;

            window.speechSynthesis.speak(utterance);
        } else {
            alert('이 브라우저는 음성 재생을 지원하지 않습니다.');
        }
    }

    // 언어 전환
    function swapLanguages() {
        const fromLang = fromLangSelect.value;
        const toLang = toLangSelect.value;

        fromLangSelect.value = toLang;
        toLangSelect.value = fromLang;

        // 텍스트도 교환
        const fromText = fromTextInput.value;
        const toText = toTextInput.value;
        fromTextInput.value = toText;
        toTextInput.value = fromText;
        
        // 발음 초기화
        pronunciationDiv.innerHTML = '';
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
        pronunciationDiv.innerHTML = '';
    }

    // 이벤트 리스너 설정
    translateBtn.addEventListener('click', translateText);
    swapBtn.addEventListener('click', swapLanguages);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearAll);
    
    // 언어 선택 변경 시 자동 번역
    fromLangSelect.addEventListener('change', () => {
        if (fromTextInput.value.trim()) {
            translateText();
        }
    });
    
    toLangSelect.addEventListener('change', () => {
        if (fromTextInput.value.trim()) {
            translateText();
        }
    });

    // 초기화
    populateLanguages();
});
