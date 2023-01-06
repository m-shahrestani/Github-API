// Storing all elements in constants to access them easier.
const inputElm = document.getElementById("input");
const submitBtn = document.getElementById("submit");
const profElm = document.getElementById("prof");
const nameElm = document.getElementById("name");
const blogElm = document.getElementById("blog");
const locationElm = document.getElementById("location");
const languageElm = document.getElementById("language");
const bioElm = document.getElementById("bio");
const errorElm = document.getElementById("error");
// Accepted regex for username.
const regex = /((?!.*(-){2,}.*)[a-z0-9][a-z0-9-]{0,38}[a-z0-9])/;
const isUserameValid = regex.test.bind(regex);
// Error's timeout for displaying the error box.
let timeOutId;

// Whenever an error occurs, this function with error's message (msg) is called.
const notifyError = (msg, mode=0) => {
    if (mode == 0)
        errorElm.style.backgroundColor = 'red';
    if (mode == 1)
        errorElm.style.backgroundColor = 'yellow';
    if (mode == 2)
        errorElm.style.backgroundColor = 'green';
    profElm.src = 'img/prof.png';
    nameElm.innerText = '';
    blogElm.innerText = '';
    locationElm.innerText = '';
    languageElm.innerText = '';
    bioElm.innerText = '';
    if(timeOutId)
        clearTimeout(timeOutId);
    errorElm.innerText = msg;
    errorElm.style.visibility = 'visible';
    timeOutId = setTimeout(() => {
        errorElm.style.visibility = 'hidden';
        timeOutId = null;
    }, 3000);
    console.log(msg);
};

// This function modifies result.
const modifyRes = (prof, name, blog, location, language, bio) => {
    profElm.src = prof != "null" ? prof : "img/prof.png";
    nameElm.innerText = name != "null" ? name : "";
    blogElm.innerText = blog != "null" ? blog : "";
    locationElm.innerText = location != "null" ? location : "";
    languageElm.innerText = language != "null" ? language : "";
    bioElm.innerText = bio != "null" ? bio : "";
};

// This function sets username to its argument then is will send a request and call for storage related functions.
const setUsername = (username) => {
    if (checkStorage(username))
        return;
    fetch('https://api.github.com/users/' + username)
        .then(response => response.json())
        .then((response) => {
            const {message, avatar_url, name, blog, location, bio} = response;
            if (message == 'Not Found') // Username not found error.
                notifyError("Username is not found!");
            else {
                modifyRes(avatar_url, name, blog, location, 'python', bio);
                saveLocalStorage(username, avatar_url, name, blog, location, 'python', bio);
            }
        }) // Any Network error.
        .catch((error) => notifyError("Some problems happened! (details: " + error.toString() + ")"));
};

// A wrapper function for checking if username is accepted or not and preventing defaults.
const getResponseOrError = (e, func) => {
    e.preventDefault();
    const username = document.forms['input-form']['username'].value.trim().toLowerCase();
    if(! isUserameValid(username)) // Valid username error.
        notifyError("Username is not valid!");
    else
        return func(username);
};

// This function checks if name is in storage or not, if it is, this function will display the answer.
const checkStorage = (username) => {
    const value = window.localStorage.getItem(username);
    if (! value) {
        notifyError("Not found in local storage.", 1);
        return false;
    }
    notifyError("Found in local storage.", 2);
    loadedKey = value.split(' | ');
    modifyRes(loadedKey[0], loadedKey[1], loadedKey[2], loadedKey[3], loadedKey[4], loadedKey[5]);
    return true;
};

// Saves name in local storage and then display.
const saveLocalStorage = (username, avatar_url, name, blog, location, language, bio) => {
    value = avatar_url + ' | ' + name + ' | ' + blog + ' | ' + location + ' | ' + language + ' | ' + bio;
    window.localStorage.setItem(username, value);
};

// Submit form button onclick event.
submitBtn.onclick = (e) => getResponseOrError(e, setUsername);