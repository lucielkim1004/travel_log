document.addEventListener('DOMContentLoaded', () => {
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const amountInput = document.getElementById('amount');
    const swapButton = document.getElementById('swap-btn');
    const currencyForm = document.getElementById('currency-form');
    const resultDiv = document.getElementById('result');

    const apiUrl = 'https://open.er-api.com/v6/latest/USD';

    // 1. API에서 국가 코드 목록 가져와 드롭다운 채우기
    async function populateCurrencies() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('환율 정보를 가져오는 데 실패했습니다.');
            }
            const data = await response.json();
            const currencies = Object.keys(data.rates);

            currencies.forEach(currency => {
                const option1 = document.createElement('option');
                option1.value = currency;
                option1.textContent = currency;
                fromCurrencySelect.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = currency;
                option2.textContent = currency;
                toCurrencySelect.appendChild(option2);
            });

            // 기본값 설정
            fromCurrencySelect.value = 'USD';
            toCurrencySelect.value = 'KRW';

        } catch (error) {
            resultDiv.textContent = `오류: ${error.message}`;
            console.error(error);
        }
    }

    // 2. 환율 계산 함수
    async function calculateExchangeRate(e) {
        e.preventDefault(); // 폼 제출 기본 동작 방지

        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        const amount = amountInput.value;

        if (!amount || amount <= 0) {
            resultDiv.textContent = '계산할 금액을 입력해주세요.';
            return;
        }

        try {
            resultDiv.textContent = '계산 중...';
            const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
            if (!response.ok) {
                throw new Error('환율 정보를 가져오는 데 실패했습니다.');
            }
            const data = await response.json();
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);

            resultDiv.innerHTML = `
                <span class="amount-display">${amount} ${fromCurrency}</span> = 
                <span class="result-display">${parseFloat(convertedAmount).toLocaleString()} ${toCurrency}</span>
            `;

        } catch (error) {
            resultDiv.textContent = `오류: ${error.message}`;
            console.error(error);
        }
    }

    // 3. 통화 전환 함수
    function swapCurrencies() {
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
    }

    // 이벤트 리스너 연결
    currencyForm.addEventListener('submit', calculateExchangeRate);
    swapButton.addEventListener('click', swapCurrencies);

    // 페이지 로드 시 통화 목록 채우기
    populateCurrencies();
});
