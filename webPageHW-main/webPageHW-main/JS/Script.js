// window.addEventListener('load', function(){
//     var allElements = document.getElementsByTagName('*');
//     Array.prototype.forEach.call(allElements, function(el) {
//         var includePath = el.dataset.includePath;
//         if(includePath){
//             var xhttp = new XMLHttpRequest();
//             xhttp.onreadystatechange = function(){
//                 if(this.readyState == 4 && this.status == 200){
//                     el.outerHTML = this.responseText;
//                 }
//             };
//             xhttp.open('GET', includePath, true);
//             xhttp.send();
//         }
//     });
// });

// fetch("header.html",{
//     method: "POST",
// 	credentials: "include"
// }).then(response => {
//     return response.text()
// }).then(data => {
//     document.querySelector("#header").innerHTML = data;
// })
// fetch("header.html") // 기본적으로 GET 방식
//     .then(response => {
//         if (!response.ok) { // 응답이 성공적인지 확인 (예: 404 에러 방지)
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.text();
//     })
//     .then(data => {
//         document.querySelector("#header").innerHTML = data;
//     })
//     .catch(error => {
//         console.error('Fetch Error:', error);
//     });
// fetch("footer.html").then(response => {
//     return response.text()
// }).then(data => {
//     document.querySelector("#footer").innerHTML = data;
// })

function initializeMenu() {
    const menu = document.getElementById('main-menu');
    menu.classList.toggle('is-open');
}
