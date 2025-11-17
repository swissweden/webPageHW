document.addEventListener('DOMContentLoaded', () => {
    setupMemoDemo();
    setupTodoDemo();
});


//메모 저장
function setupMemoDemo() {
    const memoTextArea = document.getElementById('memo-textarea');
    const saveButton = document.getElementById('memo-save-btn');
    const memoListContainer = document.getElementById('memo-list-container');
    const imageInput = document.getElementById('memo-image-input');
    
    const MEMO_STORAGE_KEY = 'memoDemoList'; // 메모 데모용 키

    function createMemoCard(text, imageUrl) {
        const newCard = document.createElement('div');
        newCard.className = 'memo-card-demo';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'memo-delete-btn';
        deleteBtn.innerHTML = '&times;';
        newCard.appendChild(deleteBtn);

        if (imageUrl) {
            const newImage = document.createElement('img');
            newImage.src = imageUrl;
            newImage.style.cssText = 'width: 100%; max-height: 200px; object-fit: cover; margin-bottom: 10px; border-radius: 4px;';
            newCard.appendChild(newImage);
            
        }

        const newTitle = document.createElement('strong');
        newTitle.textContent = '새 메모';
        newCard.appendChild(newTitle);

        const newText = document.createElement('p');
        newText.textContent = text || (imageUrl ? '(이미지 메모)' : '');
        if (text) {
            newText.style.whiteSpace = 'pre-wrap';
        }
        newCard.appendChild(newText);

        memoListContainer.prepend(newCard);
    }

    function saveMemosToStorage() {
        const memos = [];
        const cards = memoListContainer.querySelectorAll('.memo-card-demo');
        
        cards.forEach(card => {
            const img = card.querySelector('img');
            const p = card.querySelector('p');
            
            memos.push({
                text: p ? p.textContent : '',
                image: img ? img.src : null
            });
        });

        localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos.reverse()));
    }

    function loadMemosFromStorage() {
        const memoData = localStorage.getItem(MEMO_STORAGE_KEY);
        if (!memoData) return;

        try {
            const memos = JSON.parse(memoData); 
            memos.forEach(memo => {
                createMemoCard(memo.text, memo.image);
            });
        } catch (e) {
            console.error("메모 로딩 오류:", e);
            localStorage.removeItem(MEMO_STORAGE_KEY); 
        }
    }

    saveButton.addEventListener('click', () => {
        const text = memoTextArea.value.trim();
        const file = imageInput.files[0];

        if (text === "" && !file) {
            alert("메모 내용이나 이미지를 추가하세요!");
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                createMemoCard(text, e.target.result);
                saveMemosToStorage(); 
            };
            reader.readAsDataURL(file);
        } else {
            createMemoCard(text, null);
            saveMemosToStorage(); 
        }

        memoTextArea.value = '';
        imageInput.value = null;
    });

    memoListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('memo-delete-btn')) {
            const card = e.target.closest('.memo-card-demo');
            if (card) {
                card.remove();
                saveMemosToStorage(); 
            }
        }
    });

    loadMemosFromStorage();
}
// 오늘 할 일 저장
function setupTodoDemo() {
    const todoList = document.getElementById('todo-list');
    const todoInput = document.getElementById('todo-input');
    const todoAddButton = document.getElementById('todo-add-btn');
    
    const TODO_STORAGE_KEY = 'todoDemoList'; 

    function saveTodosToStorage() {
        const todos = [];
        todoList.querySelectorAll('li').forEach(li => {
            const label = li.querySelector('label');
            const checkbox = li.querySelector('input[type="checkbox"]');
            if (label && checkbox) {
                todos.push({
                    text: label.textContent,
                    completed: checkbox.checked
                });
            }
        });
        localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
    }

    function loadTodosFromStorage() {
        const todoData = localStorage.getItem(TODO_STORAGE_KEY);
        if (!todoData) return; 

        try {
            const todos = JSON.parse(todoData);
            todos.forEach(todo => {
                createTodoLi(todo.text, todo.completed);
            });
        } catch (e) {
            console.error("Todo 로딩 오류:", e);
            localStorage.removeItem(TODO_STORAGE_KEY);
        }
    }

    function createTodoLi(text, completed = false) {
        const newLi = document.createElement('li');
        const newId = `todo_${Date.now()}_${Math.random()}`; 
        
        newLi.innerHTML = `
            <input type="checkbox" id="${newId}" ${completed ? 'checked' : ''}>
            <label for="${newId}">${text}</label>
        `;
        
        if (completed) {
            newLi.classList.add('completed');
        }

        todoList.appendChild(newLi);
    }
    
    function addTodoItem() {
        const text = todoInput.value.trim();
        if (text === "") return;

        createTodoLi(text, false); 
        todoInput.value = '';
        saveTodosToStorage(); // <-- 함수 이름 변경
    }
    todoAddButton.addEventListener('click', addTodoItem);

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodoItem();
        }
    });

    // [수정] saveTodosToCookie -> saveTodosToStorage 호출
    todoList.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            const li = e.target.closest('li'); 
            li.classList.toggle('completed', e.target.checked);
            saveTodosToStorage(); // <-- 함수 이름 변경
        }
    });

    // (LI 클릭 이벤트는 변경 없음, 'change' 이벤트를 발생시키므로 자동 저장됨)
    todoList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const checkbox = e.target.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked; 
                checkbox.dispatchEvent(new Event('change', { bubbles: true })); 
            }
        }
    });

    loadTodosFromStorage(); 
}
