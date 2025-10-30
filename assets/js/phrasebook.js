document.addEventListener('DOMContentLoaded', () => {
  // 회화 데이터: 태국어(th), 베트남어(vi), 중국어(zh), 일본어(ja)
  const phrasesData = [
    // 태국어 - 인사
    { lang: 'th', category: '인사', kor: '안녕하세요', local: 'สวัสดีครับ/ค่ะ', pron: '싸왓디- 크랍/카' },
    { lang: 'th', category: '인사', kor: '감사합니다', local: 'ขอบคุณครับ/ค่ะ', pron: '컵-쿤- 크랍/카' },
    { lang: 'th', category: '인사', kor: '죄송합니다', local: 'ขอโทษครับ/ค่ะ', pron: '커-톳- 크랍/카' },
    { lang: 'th', category: '인사', kor: '네 / 아니오', local: 'ใช่ / ไม่ใช่', pron: '차이 / 마이차이' },
    // 태국어 - 식당
    { lang: 'th', category: '식당', kor: '고수 빼주세요', local: 'ไม่ใส่ผักชี', pron: '마이 싸이 팍치-' },
    { lang: 'th', category: '식당', kor: '덜 맵게 해주세요', local: 'เผ็ดน้อย', pron: '펫- 노이' },
    { lang: 'th', category: '식당', kor: '물 한 잔 주세요', local: 'ขอน้ำหนึ่งแก้ว', pron: '컨- 남- 느응- 깨우' },
    // 태국어 - 쇼핑
    { lang: 'th', category: '쇼핑', kor: '얼마예요?', local: 'ราคาเท่าไหร่', pron: '라-카- 타오-라이' },
    { lang: 'th', category: '쇼핑', kor: '좀 깎아주세요', local: 'ลดหน่อยได้ไหม', pron: '롯- 너이- 다이- 마이' },
    // 태국어 - 교통
    { lang: 'th', category: '교통', kor: '이곳으로 가주세요', local: 'ไปที่นี่ครับ/ค่ะ', pron: '빠이 티- 니- 크랍/카' },

    // 베트남어 - 인사
    { lang: 'vi', category: '인사', kor: '안녕하세요', local: 'Xin chào', pron: '씬 짜오' },
    { lang: 'vi', category: '인사', kor: '감사합니다', local: 'Cảm ơn', pron: '깜 언' },
    { lang: 'vi', category: '인사', kor: '죄송합니다', local: 'Xin lỗi', pron: '씬 로이' },
    { lang: 'vi', category: '인사', kor: '네 / 아니오', local: 'Vâng / Không', pron: '벙 / 콩' },
    // 베트남어 - 식당
    { lang: 'vi', category: '식당', kor: '고수 빼주세요', local: 'Đừng cho rau mùi', pron: '등 초 자우 무이' },
    { lang: 'vi', category: '식당', kor: '덜 맵게 해주세요', local: 'Ít cay thôi', pron: '잇 까이 토이' },
    { lang: 'vi', category: '식당', kor: '물 한 잔 주세요', local: 'Cho tôi một cốc nước', pron: '쪼 또이 못 껵 느억' },
    // 베트남어 - 쇼핑
    { lang: 'vi', category: '쇼핑', kor: '얼마예요?', local: 'Bao nhiêu tiền?', pron: '바오 니에우 띠엔?' },
    { lang: 'vi', category: '쇼핑', kor: '좀 깎아주세요', local: 'Giảm giá được không?', pron: '잠 자 즈억 콩?' },
    // 베트남어 - 교통
    { lang: 'vi', category: '교통', kor: '이곳으로 가주세요', local: 'Làm ơn đưa tôi đến đây', pron: '람 언 드어 또이 덴 데이' },

    // 중국어 - 인사
    { lang: 'zh', category: '인사', kor: '안녕하세요', local: '你好', pron: '니하오' },
    { lang: 'zh', category: '인사', kor: '감사합니다', local: '谢谢', pron: '씨에씨에' },
    { lang: 'zh', category: '인사', kor: '죄송합니다', local: '对不起', pron: '뚜이부치' },
    { lang: 'zh', category: '인사', kor: '네 / 아니오', local: '是 / 不是', pron: '스 / 부스' },
    // 중국어 - 식당
    { lang: 'zh', category: '식당', kor: '고수 빼주세요', local: '不要香菜', pron: '부야오 샹차이' },
    { lang: 'zh', category: '식당', kor: '덜 맵게 해주세요', local: '少辣一点', pron: '사오라 이디엔' },
    { lang: 'zh', category: '식당', kor: '물 한 잔 주세요', local: '请给我一杯水', pron: '칭 게이워 이베이 슈이' },
    { lang: 'zh', category: '식당', kor: '계산서 주세요', local: '买单', pron: '마이단' },
    // 중국어 - 쇼핑
    { lang: 'zh', category: '쇼핑', kor: '얼마예요?', local: '多少钱?', pron: '뚜어사오 치엔?' },
    { lang: 'zh', category: '쇼핑', kor: '좀 깎아주세요', local: '便宜一点', pron: '피엔이 이디엔' },
    { lang: 'zh', category: '쇼핑', kor: '이거 주세요', local: '我要这个', pron: '워야오 쩌거' },
    // 중국어 - 교통
    { lang: 'zh', category: '교통', kor: '이곳으로 가주세요', local: '请去这里', pron: '칭 취 쩌리' },
    { lang: 'zh', category: '교통', kor: '공항으로 가주세요', local: '去机场', pron: '취 지창' },
    { lang: 'zh', category: '교통', kor: '얼마나 걸리나요?', local: '要多久?', pron: '야오 뚜어지우?' },

    // 일본어 - 인사
    { lang: 'ja', category: '인사', kor: '안녕하세요', local: 'こんにちは', pron: '콘니치와' },
    { lang: 'ja', category: '인사', kor: '감사합니다', local: 'ありがとうございます', pron: '아리가또 고자이마스' },
    { lang: 'ja', category: '인사', kor: '죄송합니다', local: 'すみません', pron: '스미마센' },
    { lang: 'ja', category: '인사', kor: '네 / 아니오', local: 'はい / いいえ', pron: '하이 / 이이에' },
    // 일본어 - 식당
    { lang: 'ja', category: '식당', kor: '메뉴판 주세요', local: 'メニューをください', pron: '메뉴오 쿠다사이' },
    { lang: 'ja', category: '식당', kor: '물 한 잔 주세요', local: 'お水をください', pron: '오미즈오 쿠다사이' },
    { lang: 'ja', category: '식당', kor: '계산서 주세요', local: 'お会計お願いします', pron: '오카이케이 오네가이시마스' },
    { lang: 'ja', category: '식당', kor: '잘 먹겠습니다', local: 'いただきます', pron: '이타다키마스' },
    // 일본어 - 쇼핑
    { lang: 'ja', category: '쇼핑', kor: '얼마예요?', local: 'いくらですか?', pron: '이쿠라데스카?' },
    { lang: 'ja', category: '쇼핑', kor: '이거 주세요', local: 'これをください', pron: '코레오 쿠다사이' },
    { lang: 'ja', category: '쇼핑', kor: '좀 깎아주세요', local: '安くしてください', pron: '야스쿠 시테 쿠다사이' },
    { lang: 'ja', category: '쇼핑', kor: '카드 되나요?', local: 'カードは使えますか?', pron: '카-도와 츠카에마스카?' },
    // 일본어 - 교통
    { lang: 'ja', category: '교통', kor: '이곳으로 가주세요', local: 'ここに行ってください', pron: '코코니 잇테 쿠다사이' },
    { lang: 'ja', category: '교통', kor: '공항으로 가주세요', local: '空港に行ってください', pron: '쿠-코-니 잇테 쿠다사이' },
    { lang: 'ja', category: '교통', kor: '역은 어디인가요?', local: '駅はどこですか?', pron: '에키와 도코데스카?' },
  ];

  const langButtons = document.getElementById('lang-buttons');
  const categoryButtons = document.getElementById('category-buttons');
  const phraseList = document.getElementById('phrase-list');

  let selectedLang = 'th';
  let selectedCategory = '전체';

  function renderPhrases() {
    const items = phrasesData.filter(p => p.lang === selectedLang && (selectedCategory === '전체' || p.category === selectedCategory));

    if (items.length === 0) {
      phraseList.innerHTML = '<p class="no-phrases">해당 조건의 문장이 없습니다.</p>';
      return;
    }

    phraseList.innerHTML = items.map(p => `
      <div class="phrase-card">
        <div class="phrase-kor">${p.kor}</div>
        <div class="phrase-local">${p.local}</div>
        <div class="phrase-pron">${p.pron}</div>
      </div>
    `).join('');
  }

  function setActive(container, button) {
    Array.from(container.querySelectorAll('button')).forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  }

  // 언어 버튼 이벤트
  langButtons.addEventListener('click', (e) => {
    if (e.target.matches('button[data-lang]')) {
      selectedLang = e.target.getAttribute('data-lang');
      setActive(langButtons, e.target);
      // 카테고리는 유지, 문장 렌더
      renderPhrases();
    }
  });

  // 카테고리 버튼 이벤트
  categoryButtons.addEventListener('click', (e) => {
    if (e.target.matches('button[data-category]')) {
      selectedCategory = e.target.getAttribute('data-category');
      setActive(categoryButtons, e.target);
      renderPhrases();
    }
  });

  // 초기 렌더 (태국어 + 전체)
  const defaultLangBtn = langButtons.querySelector('button[data-lang="th"]');
  const defaultCategoryBtn = categoryButtons.querySelector('button[data-category="전체"]');
  if (defaultLangBtn) defaultLangBtn.classList.add('active');
  if (defaultCategoryBtn) defaultCategoryBtn.classList.add('active');
  renderPhrases();
});
