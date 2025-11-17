// JS/contact.js

document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {

            e.preventDefault(); 
            
            alert('메시지가 성공적으로 전송되었습니다! (예시입니다.)');

            contactForm.reset();
        });
    }
});