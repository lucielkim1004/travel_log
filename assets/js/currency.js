document.addEventListener('DOMContentLoaded', () => {
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const amountInput = document.getElementById('amount');
    const swapButton = document.getElementById('swap-btn');
    const currencyForm = document.getElementById('currency-form');
    const resultDiv = document.getElementById('result');

    const apiUrl = 'https://open.er-api.com/v6/latest/USD';

    // 화폐 정보 (기호와 국가명)
    const currencyInfo = {
        'USD': { symbol: '$', name: '미국 달러' },
        'EUR': { symbol: '€', name: '유로' },
        'JPY': { symbol: '¥', name: '일본 엔' },
        'GBP': { symbol: '£', name: '영국 파운드' },
        'KRW': { symbol: '₩', name: '대한민국 원' },
        'CNY': { symbol: '¥', name: '중국 위안' },
        'AUD': { symbol: 'A$', name: '호주 달러' },
        'CAD': { symbol: 'C$', name: '캐나다 달러' },
        'CHF': { symbol: 'Fr', name: '스위스 프랑' },
        'HKD': { symbol: 'HK$', name: '홍콩 달러' },
        'SGD': { symbol: 'S$', name: '싱가포르 달러' },
        'NZD': { symbol: 'NZ$', name: '뉴질랜드 달러' },
        'THB': { symbol: '฿', name: '태국 바트' },
        'VND': { symbol: '₫', name: '베트남 동' },
        'IDR': { symbol: 'Rp', name: '인도네시아 루피아' },
        'MYR': { symbol: 'RM', name: '말레이시아 링깃' },
        'PHP': { symbol: '₱', name: '필리핀 페소' },
        'TWD': { symbol: 'NT$', name: '대만 달러' },
        'INR': { symbol: '₹', name: '인도 루피' },
        'LAK': { symbol: '₭', name: '라오스 킵' },
        'KHR': { symbol: '៛', name: '캄보디아 리엘' }
    };

    // 국가 코드를 통화 코드로 매핑
    const countryToCurrency = {
        'US': 'USD', 'EU': 'EUR', 'JP': 'JPY', 'GB': 'GBP', 'KR': 'KRW',
        'CN': 'CNY', 'AU': 'AUD', 'CA': 'CAD', 'CH': 'CHF', 'HK': 'HKD',
        'SG': 'SGD', 'NZ': 'NZD', 'TH': 'THB', 'VN': 'VND', 'ID': 'IDR',
        'MY': 'MYR', 'PH': 'PHP', 'TW': 'TWD', 'IN': 'INR', 'LA': 'LAK',
        'KH': 'KHR'
    };

    // 현재 위치 기반 통화 감지
    async function detectUserCurrency() {
        try {
            // IP 기반 위치 정보 API 사용
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                throw new Error('위치 정보를 가져올 수 없습니다.');
            }
            const data = await response.json();
            const countryCode = data.country_code;
            const currency = countryToCurrency[countryCode];
            
            // 지원하는 통화인 경우 반환, 아니면 USD 기본값
            return currency && currencyInfo[currency] ? currency : 'USD';
        } catch (error) {
            console.log('위치 감지 실패, 기본값 USD 사용:', error);
            return 'USD';
        }
    }

    // 1. API에서 국가 코드 목록 가져와 드롭다운 채우기
    async function populateCurrencies() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('환율 정보를 가져오는 데 실패했습니다.');
            }
            const data = await response.json();
            
            // currencyInfo에 정의된 통화만 사용
            const availableCurrencies = Object.keys(currencyInfo);

            // 주요 통화를 먼저 표시
            const priorityCurrencies = ['USD', 'EUR', 'JPY', 'GBP', 'KRW', 'CNY', 'AUD', 'CAD'];
            const otherCurrencies = availableCurrencies.filter(c => !priorityCurrencies.includes(c)).sort();
            const sortedCurrencies = [...priorityCurrencies.filter(c => availableCurrencies.includes(c)), ...otherCurrencies];

            sortedCurrencies.forEach(currency => {
                const info = currencyInfo[currency];
                const displayText = `${info.symbol} ${currency} - ${info.name}`;

                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = displayText;
                fromCurrencySelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = currency;
                option2.textContent = displayText;
                toCurrencySelect.appendChild(option2);
            });

            // 사용자 위치 기반 통화 감지 및 설정
            const userCurrency = await detectUserCurrency();
            fromCurrencySelect.value = userCurrency;
            toCurrencySelect.value = 'KRW';

        } catch (error) {
            resultDiv.textContent = `오류: ${error.message}`;
            console.error(error);
        }
    }

    // 2. 환율 계산 함수
    async function calculateExchangeRate(e) {
        if (e) e.preventDefault(); // 폼 제출 기본 동작 방지

        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        const amount = amountInput.value;

        if (!amount || amount <= 0) {
            resultDiv.innerHTML = `
                <div class="initial-message">
                    <span class="emoji">💰</span>
                    <p>금액을 입력해주세요</p>
                </div>
            `;
            return;
        }

        if (!fromCurrency || !toCurrency) {
            return;
        }

        try {
            resultDiv.innerHTML = '<div class="calculating">계산 중...</div>';
            const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
            if (!response.ok) {
                throw new Error('환율 정보를 가져오는 데 실패했습니다.');
            }
            const data = await response.json();
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);

            const fromInfo = currencyInfo[fromCurrency];
            const toInfo = currencyInfo[toCurrency];

            // USD 환율 계산 (대상 통화가 KRW일 때)
            let usdEquivalent = '';
            if (toCurrency === 'KRW' && fromCurrency !== 'USD') {
                const usdRate = data.rates['USD'];
                const usdAmount = (amount * usdRate).toFixed(2);
                usdEquivalent = `
                    <div class="usd-equivalent">
                        $ ${parseFloat(usdAmount).toLocaleString()} <span class="currency-code">USD</span>
                    </div>
                `;
            }

            resultDiv.innerHTML = `
                <div class="conversion-result">
                    <div class="from-amount">
                        ${fromInfo ? fromInfo.symbol : ''} ${parseFloat(amount).toLocaleString()} 
                        <span class="currency-code">${fromCurrency}</span>
                    </div>
                    <div class="equals-sign">=</div>
                    <div class="to-amount">
                        ${toInfo ? toInfo.symbol : ''} ${parseFloat(convertedAmount).toLocaleString()} 
                        <span class="currency-code">${toCurrency}</span>
                    </div>
                    ${usdEquivalent}
                    <div class="exchange-rate">환율: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}</div>
                </div>
            `;

        } catch (error) {
            resultDiv.innerHTML = `
                <div class="error-message">
                    <span class="emoji">⚠️</span>
                    <p>오류: ${error.message}</p>
                </div>
            `;
            console.error(error);
        }
    }

    // 3. 통화 전환 함수
    function swapCurrencies() {
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
        // 전환 후 자동 계산
        calculateExchangeRate();
    }

    // 이벤트 리스너 연결
    currencyForm.addEventListener('submit', calculateExchangeRate);
    swapButton.addEventListener('click', swapCurrencies);
    
    // 실시간 자동 계산 - 입력값 변경 시
    amountInput.addEventListener('input', calculateExchangeRate);
    fromCurrencySelect.addEventListener('change', calculateExchangeRate);
    toCurrencySelect.addEventListener('change', calculateExchangeRate);

    // 페이지 로드 시 통화 목록 채우기
    populateCurrencies().then(() => {
        // 초기 로드 시 기본값으로 자동 계산
        calculateExchangeRate();
    });
});
