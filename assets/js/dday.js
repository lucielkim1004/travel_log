document.addEventListener('DOMContentLoaded', () => {
    const ddayForm = document.getElementById('dday-form');
    const ddayListContainer = document.getElementById('dday-list-container');

    // localStorage에서 데이터 로드 (없으면 빈 배열로 초기화)
    let ddays = JSON.parse(localStorage.getItem('ddays')) || [];

    // D-Day 렌더링 함수
    function renderDdays() {
        // 목표 날짜가 임박한 순서로 정렬
        ddays.sort((a, b) => new Date(a.date) - new Date(b.date));

        ddayListContainer.innerHTML = ''; // 기존 목록 초기화

        if (ddays.length === 0) {
            ddayListContainer.innerHTML = '<p class="no-ddays">등록된 D-Day가 없습니다.</p>';
            return;
        }

        ddays.forEach((dday, index) => {
            const ddayCard = document.createElement('div');
            ddayCard.classList.add('dday-card');

            const today = new Date();
            today.setHours(0, 0, 0, 0); // 시간 정보를 제거하여 날짜만 비교
            const targetDate = new Date(dday.date);
            targetDate.setHours(0, 0, 0, 0);

            const diffTime = targetDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let ddayText = '';
            if (diffDays === 0) {
                ddayText = 'D-DAY';
                ddayCard.classList.add('today');
            } else if (diffDays > 0) {
                ddayText = `D-${diffDays}`;
            } else {
                ddayText = `D+${Math.abs(diffDays)}`;
                ddayCard.classList.add('past');
            }

            ddayCard.innerHTML = `
                <div class="dday-info">
                    <span class="dday-title">${dday.title}</span>
                    <span class="dday-date">${dday.date}</span>
                </div>
                <div class="dday-counter">${ddayText}</div>
                <button class="delete-dday-btn" data-index="${index}">&times;</button>
            `;
            ddayListContainer.appendChild(ddayCard);
        });
    }

    // D-Day 추가 함수
    function addDday(e) {
        e.preventDefault();

        const titleInput = document.getElementById('dday-title-input');
        const dateInput = document.getElementById('dday-date-input');

        const title = titleInput.value.trim();
        const date = dateInput.value;

        if (!title || !date) {
            alert('이벤트 이름과 날짜를 모두 입력해주세요.');
            return;
        }

        const newDday = { title, date };
        ddays.push(newDday);

        // localStorage에 저장
        localStorage.setItem('ddays', JSON.stringify(ddays));

        // 화면 다시 렌더링
        renderDdays();

        // 폼 초기화
        ddayForm.reset();
    }

    // D-Day 삭제 함수
    function deleteDday(e) {
        if (e.target.classList.contains('delete-dday-btn')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            
            // 배열에서 해당 D-Day 삭제
            ddays.splice(index, 1);

            // localStorage 업데이트
            localStorage.setItem('ddays', JSON.stringify(ddays));

            // 화면 다시 렌더링
            renderDdays();
        }
    }

    // 이벤트 리스너 연결
    ddayForm.addEventListener('submit', addDday);
    ddayListContainer.addEventListener('click', deleteDday);

    // 페이지 로드 시 초기 렌더링
    renderDdays();
});
