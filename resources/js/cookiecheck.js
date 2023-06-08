"use strict";
function findCookie(name) {
    let cookievalue = null;

    // decode cookies, make array of all cookies
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');

    // find the requested cookie and return its value
    cookies.forEach(function(value, index) {
        value = value.trim();
        if(value.indexOf(name) === 0) {
            cookievalue = value;
        }
    })
    return cookievalue;
}

let cookies = findCookie('allowCookies');
console.log(cookies);
if (cookies === null || cookies === 'allowCookies=false') {
    const response = confirm('Allow Cookies?');
    document.cookie = 'allowCookies=' + response;
}
