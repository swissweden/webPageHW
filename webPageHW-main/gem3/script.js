const STORAGE_KEY = 'my_memos_v2'; // 키 변경 (구조가 바뀌었으므로)

// DOM 요소 참조
const memoInput = document.getElementById('memoInput');
const imageInput = document.getElementById('imageInput');
const previewArea = document.getElementById('previewArea');
const memoGrid = document.getElementById('memoGrid');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toast = document.getElementById('toast');

let currentImageBase64 = null; // 현재 선택된 이미지 데이터

document.addEventListener('DOMContentLoaded', () => {
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }

    // 페이지별 로직
    if (memoGrid) {
        renderMemoList();
    } else if (memoInput) {
        checkSharedUrl();
        
        // 이미지 업로드 리스너
        if (imageInput) {
            imageInput.addEventListener('change', handleImageUpload);
        }
    }
});

function toggleMenu() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function getMemos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveMemos(memos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
    } catch (e) {
        alert('저장 용량이 초과되었습니다! 이미지를 줄이거나 기존 메모를 삭제하세요.');
        console.error(e);
    }
}

/* --- 이미지 처리 로직 (압축 및 미리보기) --- */
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }

    // FileReader + Canvas를 이용한 이미지 리사이징 (용량 줄이기)
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 600; // 최대 너비 제한
            const scaleSize = MAX_WIDTH / img.width;
            
            // 리사이징 필요 여부 확인
            if (scaleSize < 1) {
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // 압축하여 Base64로 변환 (JPEG, 품질 0.7)
            currentImageBase64 = canvas.toDataURL('image/jpeg', 0.7);
            
            // 미리보기 표시
            previewArea.innerHTML = `<img src="${currentImageBase64}" alt="Preview">`;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

/* --- 메인 페이지 기능 --- */
function renderMemoList() {
    const memos = getMemos();
    memoGrid.innerHTML = '';

    if (memos.length === 0) {
        memoGrid.innerHTML = `
            <div class="empty-state">
                <h3>저장된 메모가 없습니다.</h3>
                <p>사진과 함께 메모를 남겨보세요!</p>
            </div>
        `;
        return;
    }

    memos.sort((a, b) => b.id - a.id);

    memos.forEach(memo => {
        const card = document.createElement('div');
        card.className = 'memo-card';
        
        // 이미지가 있으면 img 태그 추가
        let imageHtml = '';
        if (memo.image) {
            imageHtml = `<img src="${memo.image}" class="card-image" alt="메모 이미지">`;
        }

        card.innerHTML = `
            ${imageHtml}
            <div class="card-body">
                <div class="memo-date">${memo.date}</div>
                <div class="memo-content">${memo.content}</div>
                <div class="card-footer">
                    <button class="action-btn share-btn" onclick="copyShareLink('${encodeURIComponent(memo.content)}')">공유</button>
                    <button class="action-btn delete-btn" onclick="deleteMemo(${memo.id})">삭제</button>
                </div>
            </div>
        `;
        memoGrid.appendChild(card);
    });
}

function deleteMemo(id) {
    if(confirm('정말 삭제하시겠습니까?')) {
        let memos = getMemos();
        memos = memos.filter(memo => memo.id !== id);
        saveMemos(memos);
        renderMemoList();
        showToast('메모가 삭제되었습니다.');
    }
}

function deleteAll() {
    if(confirm('모든 메모를 삭제하시겠습니까?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderMemoList();
        toggleMenu();
        showToast('전체 삭제되었습니다.');
    }
}

function copyShareLink(encodedContent) {
    const path = window.location.pathname.replace('index.html', ''); 
    const baseUrl = window.location.origin + path + (path.endsWith('/') ? '' : '/') + 'write.html';
    const shareUrl = `${baseUrl}?note=${encodedContent}`; // 이미지는 URL 공유 불가(너무 길어서)

    navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('텍스트 내용 링크 복사 완료! (이미지 제외)');
    }).catch(() => {
        alert('링크 복사 실패');
    });
}

/* --- 작성 페이지 기능 --- */
function saveMemo() {
    const text = memoInput.value.trim();
    
    // 내용이나 이미지 중 하나라도 있어야 저장
    if (text === '' && !currentImageBase64) {
        alert('내용을 입력하거나 사진을 추가해주세요.');
        return;
    }

    const newMemo = {
        id: Date.now(),
        content: text,
        image: currentImageBase64, // 이미지 데이터 저장
        date: new Date().toLocaleString()
    };

    const memos = getMemos();
    memos.push(newMemo);
    saveMemos(memos);

    if(confirm('저장되었습니다. 목록으로 이동할까요?')) {
        window.location.href = 'index.html';
    } else {
        memoInput.value = '';
        currentImageBase64 = null;
        previewArea.innerHTML = '<span class="preview-placeholder">이미지가 없습니다</span>';
        imageInput.value = ''; // 파일 인풋 초기화
        showToast('저장되었습니다.');
    }
}

function checkSharedUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedNote = urlParams.get('note');

    if (sharedNote) {
        memoInput.value = decodeURIComponent(sharedNote);
        showToast('공유된 텍스트를 불러왔습니다.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}