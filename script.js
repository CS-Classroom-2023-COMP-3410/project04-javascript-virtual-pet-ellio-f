// hold all snorlax images - front, back, asleep
let snorlax_img = ["https://img.pokemondb.net/sprites/black-white/anim/normal/snorlax.gif", 
                "https://img.pokemondb.net/sprites/black-white/anim/back-normal/snorlax.gif", 
                "https://img.pokemondb.net/sprites/heartgold-soulsilver/normal/snorlax.png"];

// set changing variables and create something to change their text
let happinessLevelElement = document.getElementById("happiness-level");
let happinessLevel = parseInt(happinessLevelElement.innerText); 
let sleepinessLevelElement = document.getElementById("sleepiness-level"); 
let sleepinessLevel = parseInt(sleepinessLevelElement.innerText); 
let hungerLevelElement = document.getElementById("hunger-level"); 
let hungerLevel = parseInt(hungerLevelElement.innerText); 
let snorlaxElement = document.getElementById("snorlax-image");
let sleepState = false; // false = awake, true = asleep

// initial image setup
updateSnorlaxImage(happinessLevel);

// set initial sleep and hunger intervals
let sleepinessIntervalId = setInterval(function() {
    if (!sleepState) {
        sleepinessLevel += 1;
        sleepinessLevelElement.innerText = sleepinessLevel;  
    }
}, 6000);
let hungerIntervalId = setInterval(function() {
    hungerLevel += 1;
    hungerLevelElement.innerText = hungerLevel;  
}, 4000);

// set save data 
function saveState() {
    localStorage.setItem("snorlaxState", JSON.stringify({
        happinessLevel,
        sleepinessLevel: sleepinessLevel,
        hungerLevel,
        sleepState
    }));
}

// when snorlax is clicked, change happiness based on sleepiness
snorlaxElement.addEventListener("click", function() {
    if (sleepState) {
        changeSleepState();
        $(this).effect("bounce", { times: 3 }, 300);
    }
    else if (sleepinessLevel <= 10) {
        $(this).effect("bounce", { times: 3 }, 300);
        happinessLevel += 1;
    } else {
        $(this).effect("shake");
        happinessLevel = Math.max(0, happinessLevel - 1);
    }
    happinessLevelElement.innerText = happinessLevel;
    updateSnorlaxImage(happinessLevel);
    saveState();
});

// based on sleep button, change sleep state
let sleepButton = document.getElementById("sleep-button");
sleepButton.addEventListener("click", function() {
        changeSleepState();
});

// change image and background based on happiness level
function updateSnorlaxImage(happiness) {
    if (happiness <= 15) {
        document.body.style.backgroundColor = "#ffcccc";
        snorlaxElement.src = snorlax_img[1];
    } else {
        document.body.style.backgroundColor = "#ddefff";
        snorlaxElement.src = snorlax_img[0];
    }
}

// based on feed button, decrease hunger level, increase sleepiness, increase happiness
let feedButton = document.getElementById("feed-button");
feedButton.addEventListener("click", function() {
    hungerLevel = Math.max(0, hungerLevel - 2);
    hungerLevelElement.innerText = hungerLevel;
    sleepinessLevel += 1;
    sleepinessLevelElement.innerText = sleepinessLevel;
    happinessLevel += 1;
    happinessLevelElement.innerText = happinessLevel;
    updateSnorlaxImage(happinessLevel);
    saveState();
});


// function to change sleep state
function changeSleepState() {
    sleepState = !sleepState;
    if (sleepState) { // snorlax is asleep
        sleepButton.innerText = "Wake up";
        snorlaxElement.src = snorlax_img[2];
        document.body.style.backgroundColor = "#8791a5";
        clearInterval(sleepinessIntervalId);
        sleepinessIntervalId = setInterval(function() {
            sleepinessLevel = Math.max(0, sleepinessLevel - 1); // decrease while asleep
            sleepinessLevelElement.innerText = sleepinessLevel;  
        }, 1000);
        saveState();
    } else { // snorlax is awake
        sleepButton.innerText = "Put to bed";
        snorlaxElement.src = snorlax_img[0];
        document.body.style.backgroundColor = "#ddefff";
        clearInterval(sleepinessIntervalId);
        sleepinessIntervalId = setInterval(function() {
            sleepinessLevel += 1; // increase while awake
            sleepinessLevelElement.innerText = sleepinessLevel;  
        }, 6000);
        saveState();
    }
}

// load saved state on page load
window.addEventListener("DOMContentLoaded", function() {
    const saved = localStorage.getItem("snorlaxState");
    if (saved) {
        const state = JSON.parse(saved);
        happinessLevel = state.happinessLevel;
        sleepinessLevel = state.sleepinessLevel;
        hungerLevel = state.hungerLevel;
        sleepState = state.sleepState;

        happinessLevelElement.innerText = happinessLevel;
        sleepinessLevelElement.innerText = sleepinessLevel;
        hungerLevelElement.innerText = hungerLevel;

        // Optionally update UI based on sleepState
        if (sleepState) {
            snorlaxElement.src = snorlax_img[2];
            sleepButton.innerText = "Wake up";
            document.body.style.backgroundColor = "#8791a5";
        } else {
            snorlaxElement.src = snorlax_img[0];
            sleepButton.innerText = "Put to bed";
            document.body.style.backgroundColor = "#ddefff";
        }
        updateSnorlaxImage(happinessLevel);
    }
});

