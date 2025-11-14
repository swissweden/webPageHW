document.addEventListener('DOMContentLoaded', () => {

    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length === 0) return;

    revealElements.forEach(element => {
        // 1. (수정됨) setupElement 함수를 수정된 버전으로 호출합니다.
        setupElement(element);
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });

});


function setupElement(element) {
    const childNodes = Array.from(element.childNodes);
    element.innerHTML = '';
    const indexCounter = { count: 0 };
    processNodesRecursive(childNodes, element, indexCounter);
}

/**

 * @param {NodeList} nodes 
 * @param {HTMLElement} parentElement 
 * @param {object} indexCounter 
 */
function processNodesRecursive(nodes, parentElement, indexCounter) {
    
    nodes.forEach(node => {
        
        if (node.nodeType === 3) {
            const text = node.textContent;
            const words = text.split(/\s+/).filter(word => word.length > 0);

            words.forEach(word => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word';
                wordSpan.textContent = word;
                wordSpan.style.transitionDelay = `${indexCounter.count * 0.04}s`; 

                const wrapperSpan = document.createElement('span');
                wrapperSpan.className = 'word-wrapper';
                wrapperSpan.appendChild(wordSpan);

                parentElement.appendChild(wrapperSpan);
                parentElement.appendChild(document.createTextNode(' '));
                
                indexCounter.count++;
            });
        } 
        

        else if (node.nodeType === 1) { 
            

            if (node.tagName === 'BR') {
                parentElement.appendChild(document.createElement('br'));
            }

            else {

                const newNode = node.cloneNode(false);
                parentElement.appendChild(newNode);
                processNodesRecursive(Array.from(node.childNodes), newNode, indexCounter);
            }
        }

    });
}