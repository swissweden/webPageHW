
const footerHTML = `
<footer class="site-footer">
    <div class="footer-content">
        <p>&copy; 2025 Many Manage Memos. All rights reserved.
            <br>swissweden, gkfg
        </p>

        <div class="social-links">
            <a href="https://github.com/swissweden" target="_blank" aria-label="Github">
                <span class="material-icons">code</span>
            </a>
            <a href="#" aria-label="Email">
                <span class="material-icons">mail</span>
            </a>
            <a href="#" aria-label="Help">
                <span class="material-icons">help_outline</span>
            </a>
        </div>
    </div>
</footer>`;

// 이 스크립트를 불러오는 곳의 #header 태그에 내용을 삽입합니다.
document.querySelector("#footer").innerHTML = footerHTML.trim();