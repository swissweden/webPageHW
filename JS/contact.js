// JS/contact.js

document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // 1. 폼의 기본 전송 기능(페이지 새로고침)을 막습니다.
            e.preventDefault(); 
            
            // 2. 데모 알림창을 띄웁니다.
            alert('메시지가 성공적으로 전송되었습니다! (데모)');
            
            // 3. (선택사항) 폼의 입력 내용을 초기화합니다.
            contactForm.reset();
        });
    }
});