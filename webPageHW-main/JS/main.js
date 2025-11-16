document.addEventListener('DOMContentLoaded', () => {
    // 1. 메모 불러오기
    loadMemos();
    
    // 2. 할 일 불러오기
    loadTodos();
});

/**
 * 1. 'memoDemoList' 키로 localStorage에서 메모를 불러와 표시합니다.
 */
function loadMemos() {
    const memoContainer = document.getElementById('memo-display-area');
    const memoData = localStorage.getItem('memoDemoList'); // (about.js가 저장한 키)

    if (!memoData) {
        memoContainer.innerHTML = '<p>저장된 메모가 없습니다.</p>';
        return;
    }

    try {
        // (오래된 -> 최신) 순서로 저장되어 있음
        const memos = JSON.parse(memoData); 

        if (memos.length === 0) {
            memoContainer.innerHTML = '<p>저장된 메모가 없습니다.</p>';
            return;
        }

        // 최신 항목이 위로 오게 하려면 배열을 뒤집어 순회합니다.
        memos.reverse().forEach(memo => {
            const card = document.createElement('div');
            card.className = 'memo-card-display'; // main.html용 CSS 클래스 (임의)

            if (memo.image) {
                const img = document.createElement('img');
                img.src = memo.image;
                img.style.cssText = 'width: 100%; max-height: 200px; object-fit: cover;';
                card.appendChild(img);
            }

            const text = document.createElement('p');
            text.textContent = memo.text || '(이미지 메모)';
            text.style.whiteSpace = 'pre-wrap';
            card.appendChild(text);

            memoContainer.appendChild(card);
        });

    } catch (e) {
        console.error("메인 페이지 메모 로딩 오류:", e);
        memoContainer.innerHTML = '<p>데이터를 불러오는 데 실패했습니다.</p>';
    }
}

/**
 * 2. 'todoDemoList' 키로 localStorage에서 할 일을 불러와 표시합니다.
 */
function loadTodos() {
    const todoContainer = document.getElementById('todo-display-area');
    const todoData = localStorage.getItem('todoDemoList'); // (about.js가 저장한 키)

    if (!todoData) {
        todoContainer.innerHTML = '<ul><li>저장된 할 일이 없습니다.</li></ul>';
        return;
    }

    try {
        const todos = JSON.parse(todoData);
        
        if (todos.length === 0) {
            todoContainer.innerHTML = '<ul><li>저장된 할 일이 없습니다.</li></ul>';
            return;
        }

        const list = document.createElement('ul');
        
        todos.forEach(todo => {
            const li = document.createElement('li');
            
            // CSS를 위해 완료 여부 클래스 추가 (about.css의 .completed 재활용 가능)
            if (todo.completed) {
                li.className = 'completed'; 
            }
            
            // 여기서는 단순 텍스트로만 표시 (체크박스 X)
            li.textContent = `[${todo.completed ? '✓' : ' '}] ${todo.text}`; 
            
            list.appendChild(li);
        });

        todoContainer.appendChild(list);

    } catch (e) {
        console.error("메인 페이지 Todo 로딩 오류:", e);
        todoContainer.innerHTML = '<p>데이터를 불러오는 데 실패했습니다.</p>';
    }
}