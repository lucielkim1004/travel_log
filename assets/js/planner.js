document.addEventListener('DOMContentLoaded', () => {
    const planForm = document.getElementById('plan-form');
    const planListContainer = document.getElementById('plan-list-container');

    // localStorage에서 데이터 로드
    let plans = JSON.parse(localStorage.getItem('travelPlans')) || [];

    // 일정 렌더링 함수
    function renderPlans() {
        // 날짜순으로 일정 정렬
        plans.sort((a, b) => new Date(a.date) - new Date(b.date));

        planListContainer.innerHTML = ''; // 기존 목록 초기화

        if (plans.length === 0) {
            planListContainer.innerHTML = '<p class="no-plans">등록된 일정이 없습니다.</p>';
            return;
        }

        plans.forEach((plan, index) => {
            const planItem = document.createElement('div');
            planItem.classList.add('plan-item');
            planItem.innerHTML = `
                <div class="plan-header">
                    <h3>${plan.date}</h3>
                    <h4>${plan.city}</h4>
                    <button class="delete-plan-btn" data-index="${index}">삭제</button>
                </div>
                <p class="plan-details">${plan.details.replace(/\n/g, '<br>')}</p>
            `;
            planListContainer.appendChild(planItem);
        });
    }

    // 일정 추가 함수
    function addPlan(e) {
        e.preventDefault();

        const date = document.getElementById('plan-date').value;
        const city = document.getElementById('plan-city').value;
        const details = document.getElementById('plan-details').value;

        if (!date || !city || !details) {
            alert('모든 항목을 입력해주세요.');
            return;
        }

        const newPlan = { date, city, details };
        plans.push(newPlan);

        // localStorage에 저장
        localStorage.setItem('travelPlans', JSON.stringify(plans));

        // 화면 다시 렌더링
        renderPlans();

        // 폼 초기화
        planForm.reset();
    }

    // 일정 삭제 함수
    function deletePlan(e) {
        if (e.target.classList.contains('delete-plan-btn')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            
            // 배열에서 해당 일정 삭제
            plans.splice(index, 1);

            // localStorage 업데이트
            localStorage.setItem('travelPlans', JSON.stringify(plans));

            // 화면 다시 렌더링
            renderPlans();
        }
    }

    // 이벤트 리스너 연결
    planForm.addEventListener('submit', addPlan);
    planListContainer.addEventListener('click', deletePlan);

    // 페이지 로드 시 초기 렌더링
    renderPlans();
});
