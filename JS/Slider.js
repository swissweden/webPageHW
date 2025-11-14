document.addEventListener('DOMContentLoaded', () => {

    const sliderContainer = document.querySelector('.draggable-slider-container');
    const sliderTrack = document.querySelector('.slider-track');
    let sliderItems = document.querySelectorAll('.slide-item');

    if (!sliderContainer || !sliderTrack || sliderItems.length === 0) {
        console.warn("Draggable slider elements not found.");
        return;
    }
    

    const autoPlaySpeed = 0.5; 

    const slidesPerView = 5; 
    const originalSlideCount = sliderItems.length;


    const clonesEnd = [];
    for (let i = 0; i < slidesPerView; i++) {
        const clone = sliderItems[i].cloneNode(true);
        clone.classList.add('slide-clone');
        sliderTrack.appendChild(clone);
        clonesEnd.push(clone);
    }
    const clonesStart = [];
    for (let i = originalSlideCount - slidesPerView; i < originalSlideCount; i++) {
         if(sliderItems[i]) {
            const clone = sliderItems[i].cloneNode(true);
            clone.classList.add('slide-clone');
            sliderTrack.insertBefore(clone, sliderTrack.firstElementChild);
            clonesStart.push(clone);
         }
    }


    sliderItems = document.querySelectorAll('.slide-item'); 
    const itemWidth = sliderItems[0].getBoundingClientRect().width;
    const realSlidesWidth = originalSlideCount * itemWidth; 

    let initialOffset = clonesStart.length * itemWidth;
    sliderTrack.style.transform = `translateX(-${initialOffset}px)`;
    sliderTrack.style.transition = 'none'; 

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = -initialOffset; 
    let prevTranslate = -initialOffset; 
    let animationID = 0;

    let velocity = 0;   
    let lastPos = 0;       
    let lastTime = 0;    


    sliderContainer.addEventListener('mousedown', dragStart);
    sliderContainer.addEventListener('touchstart', dragStart, { passive: true });

    sliderContainer.addEventListener('mouseup', dragEnd);
    sliderContainer.addEventListener('mouseleave', dragEnd);
    sliderContainer.addEventListener('touchend', dragEnd);

    sliderContainer.addEventListener('mousemove', dragMove);
    sliderContainer.addEventListener('touchmove', dragMove, { passive: true });

    function dragStart(e) {
        isDragging = true;
        startPos = getPositionX(e);
        
        lastPos = startPos;
        lastTime = Date.now();
        velocity = 0; 
        

        cancelAnimationFrame(animationID);


        prevTranslate = currentTranslate;
        
        sliderContainer.classList.add('grabbing');
        sliderTrack.style.transition = 'none'; 
    }

    function dragMove(e) {
        if (!isDragging) return;

        const currentPosition = getPositionX(e);
        
        const now = Date.now();
        const dt = now - lastTime;
        const dx = currentPosition - lastPos;

        if (dt > 0) {
            velocity = dx / dt;
        }
        
        lastPos = currentPosition;
        lastTime = now;

        const moveX = currentPosition - startPos;
        currentTranslate = prevTranslate + moveX;

        setSliderPosition();
        checkInfiniteLoop();
    }

    function dragEnd() {
        if (!isDragging) return; 
        
        isDragging = false;
        sliderContainer.classList.remove('grabbing');
        
        prevTranslate = currentTranslate; 
        

        animationID = requestAnimationFrame(momentumLoop);

    }

    function autoPlayLoop() {

        if (isDragging) return; 

        currentTranslate -= autoPlaySpeed;
        
        checkInfiniteLoop(); 
        setSliderPosition(); 
        

        animationID = requestAnimationFrame(autoPlayLoop);
    }


    function momentumLoop() {

        if (isDragging) {
            cancelAnimationFrame(animationID);
            return;
        }

        if (Math.abs(velocity) < 0.05) {
            velocity = 0;
            cancelAnimationFrame(animationID);

            animationID = requestAnimationFrame(autoPlayLoop);
            return;
        }

        currentTranslate += velocity * 16.6;
        velocity *= 0.95; // 서서히 감속

        checkInfiniteLoop(); 
        setSliderPosition();
        
        animationID = requestAnimationFrame(momentumLoop);
    }


    function getPositionX(e) {
        return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    }

    function setSliderPosition() {
        sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    function checkInfiniteLoop() {
        const thresholdEnd = -(realSlidesWidth + initialOffset);
        if (currentTranslate < thresholdEnd) {
            currentTranslate += realSlidesWidth;
            prevTranslate += realSlidesWidth; 
            setSliderPosition();
        }

        const thresholdStart = -initialOffset;
        if (currentTranslate > thresholdStart) {
            currentTranslate -= realSlidesWidth;
            prevTranslate -= realSlidesWidth