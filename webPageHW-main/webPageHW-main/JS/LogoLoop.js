
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('[data-logo-track]');
    
    if (!track) {
        console.warn('LogoLoop.js: [data-logo-track] element not found.');
        return;
    }


    const originalItems = Array.from(track.children);
    if (originalItems.length === 0) return;

    let totalWidth = 0;
    originalItems.forEach(item => {

        const style = window.getComputedStyle(item);
        const marginRight = parseFloat(style.marginRight) || 0;
        const marginLeft = parseFloat(style.marginLeft) || 0;
        totalWidth += item.offsetWidth + marginLeft + marginRight;
    });

    track.style.setProperty('--logo-track-width', `${totalWidth}px`);
    const screenWidth = window.innerWidth;
    let currentWidth = totalWidth;

    while (currentWidth < (screenWidth * 2) || track.children.length < 20) { // 최소 20개, 또는 화면x2 너비
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', true); 
            track.appendChild(clone);
        });
        currentWidth += totalWidth;
        
        // 무한 루프 방지 
        if (track.children.length > 100) break;
    }
});