// header.js

const headerHTML = `
    <header class="site-header">
    <button id="menu-toggle-btn" onclick="initializeMenu()">&#9776;</button> <span class="site-title">Test Site</span>
</header>

<nav id="main-menu" class="main-menu">
    <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="login.html">Login</a></li>
    </ul>
</nav>

`;

// 이 스크립트를 불러오는 곳의 #header 태그에 내용을 삽입합니다.
document.querySelector("#header").innerHTML = headerHTML;
