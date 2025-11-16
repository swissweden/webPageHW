
const footerHTML = `
<body>
    <footer class="site-footer">
    <p>&copy; 2025</p>
    </footer>
</body>`;

// 이 스크립트를 불러오는 곳의 #header 태그에 내용을 삽입합니다.
document.querySelector("#footer").innerHTML = footerHTML.trim();