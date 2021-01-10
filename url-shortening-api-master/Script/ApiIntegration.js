const input = document.querySelector("#shorten");
const button = document.querySelector("#submit-shorten");
const ul = document.querySelector("#items");
const labelError = document.querySelector("#error-label");
let highlightedButton = "";

function getInput(){
    return input.value;
}

function shortenString(inputed){
    let input = inputed;
    if(window.innerWidth < 400 && inputed.length > 24){
        input = inputed.substr(0, 24) + "...";   
    }

    return input;
}

function createListElement(inputed, shortened){
    const li = document.createElement("LI");
    
    inputed = shortenString(inputed);
    li.classList.add("item");
    li.innerHTML = `
        <span class="item__full-link">
            ${inputed}
        </span>
        <hr>
        <span class="item__shortened-link">
            ${shortened}
        </span>
        <button class="cta">
            Copy
        </button>
    `

    return li;
}

async function fetchShortenedLink(inputAddress){
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${inputAddress}`);
    const json = await res.json();

    return {
        json
    };
}

function shortening(button){
    button.textContent = "Shortening...";
    button.disabled = true;
}

function clearShortening(button){
    button.textContent = "Shorten it!";
    button.disabled = false;
}

function addToUi(e){
    e.preventDefault();
    shortening(e.target);
    const input = getInput();
    fetchShortenedLink(input).then(data => {
        try{
            clearShortening(e.target);
            const li = createListElement(input, data.json.result.full_short_link);
            ul.appendChild(li);
            clearInput();
            clearError();
        }catch(err){
            showError();
        }
    });
}

function clearError(){
    if(labelError.classList.contains("error")){
        labelError.classList.remove("error");
        input.classList.remove("error");
    }
}

function showError(){
    if(!labelError.classList.contains("error")){
        labelError.classList.add("error");
        input.classList.add("error");
    }
}

function clearInput(){
    input.value = "";
}

function copy(value){
    navigator.clipboard.writeText(value);
}

button.addEventListener("click", addToUi);
ul.addEventListener("click", (e) => {  
    if(e.target.nodeName.toLowerCase() === "button"){
        highlightedButtonRemoveClass();
        highlightedButtonResetText();
        setHighlightedButton(e.target);
        setHighlightedButtonClass();
        setHighlightedButtonText();
        
        const valueToCopy = e.target.parentElement.querySelector(".item__shortened-link").textContent;
        copy(valueToCopy);
    }
})

function isHighlightedButtonSet(){
    return highlightedButton !== "";
}

function highlightedButtonRemoveClass(){
    if(isHighlightedButtonSet() && highlightedButton.classList.contains("copied")) highlightedButton.classList.remove("copied");
}

function highlightedButtonResetText(){
    if(isHighlightedButtonSet()) highlightedButton.textContent = "Copy";
}

function setHighlightedButton(button){
    highlightedButton = button;
}

function setHighlightedButtonClass(){
    highlightedButton.classList.add("copied");
}

function setHighlightedButtonText(){
    highlightedButton.textContent = "Copied";
}