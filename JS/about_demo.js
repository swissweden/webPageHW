// JS/about_demo.js

document.addEventListener('DOMContentLoaded', () => {

    setupMemoDemo();
    setupTodoDemo();

});


function setupMemoDemo() {
    const memoTextArea = document.getElementById('memo-textarea');
    const saveButton = document.getElementById('memo-save-btn');
    const memoListContainer = document.getElementById('memo-list-container');


    saveButton.addEventListener('click', () => {
        const text = memoTextArea.value.trim(); // 앞뒤 공백 제거

        if (text === "") {
            alert("메모 내용을 입력하세요!");
            return;
        }


        const newCard = document.createElement('div');
        newCard.className = 'memo-card-demo'; 

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'memo-delete-btn';
        deleteBtn.innerHTML = '&times;'; 
        newCard.appendChild(deleteBtn);

        const newTitle = document.createElement('strong');
        newTitle.textContent = '새 메모';
        newCard.appendChild(newTitle);
        
        const newText = document.createElement('p');
        newText.textContent = text;
        newText.style.whiteSpace = 'pre-wrap'; 
        newCard.appendChild(newText);

        memoListContainer.prepend(newCard);

        memoTextArea.value = '';
    });


    memoListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('memo-delete-btn')) {

            const card = e.target.closest('.memo-card-demo');

            if (card) {
                card.remove();
            }
        }
    });

}



function setupTodoDemo() {
    const todoList = document.getElementById('todo-list');
    const todoInput = document.getElementById('todo-input');
    const todoAddButton = document.getElementById('todo-add-btn');


    function addTodoItem() {
        const text = todoInput.value.trim();
        if (text === "") return; 

        const newLi = document.createElement('li');
        const newId = `todo_${Date.now()}`; 
        
        newLi.innerHTML = `
            <input type="checkbox" id="${newId}">
            <label for="${newId}">${text}</label>
        `;

        todoList.appendChild(newLi);
        todoInput.value = '';
    }


    todoAddButton.addEventListener('click', addTodoItem);

    // 엔터키도 동일하게 추가
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodoItem();
        }
    });

    todoList.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            const li = e.target.closest('li'); 
            li.classList.toggle('completed', e.target.checked);
        }
    });


    todoList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const checkbox = e.target.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked; 
                checkbox.dispatchEvent(new Event('change')); 
            }
        }
    });
}