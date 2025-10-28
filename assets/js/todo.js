document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');

    // localStorage에서 데이터 로드
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // 할 일 렌더링 함수
    function renderTodos() {
        todoList.innerHTML = '';

        if (todos.length === 0) {
            todoList.innerHTML = '<li class="no-todos">할 일이 없습니다.</li>';
            return;
        }

        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (todo.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <span class="todo-text" data-index="${index}">${todo.text}</span>
                <button class="delete-todo-btn" data-index="${index}">&times;</button>
            `;

            todoList.appendChild(li);
        });
    }

    // 할 일 추가 함수
    function addTodo() {
        const text = todoInput.value.trim();

        if (!text) {
            alert('할 일을 입력해주세요.');
            return;
        }

        const newTodo = {
            text: text,
            completed: false
        };

        todos.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
        todoInput.value = '';
    }

    // 할 일 완료 토글 함수
    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    // 할 일 삭제 함수
    function deleteTodo(index) {
        todos.splice(index, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
    }

    // 이벤트 리스너
    addBtn.addEventListener('click', addTodo);
    
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('todo-text')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            toggleTodo(index);
        } else if (e.target.classList.contains('delete-todo-btn')) {
            const index = parseInt(e.target.getAttribute('data-index'), 10);
            deleteTodo(index);
        }
    });

    // 페이지 로드 시 초기 렌더링
    renderTodos();
});
