let simpleRTTime = 0;
let choiceRTTime = 0;
let minWaitTime = 2;
let maxWaitTime = 7;
let rounds = 5;
let DEBUG = true;
function hideItem(itemID){
    document.getElementById(itemID).style.display = 'none';
}

function showItem(itemID){
    document.getElementById(itemID).style.display = 'block';
}

function keyPress(key){
    return new Promise((resolve)=> {
        document.addEventListener('keypress', e => {
            if (e.key === key){
                resolve();
            }
        });
    })
}


function randomDelay(min, max, fun) {
    // delay [min, max] seconds
    let delay = (Math.random() * (max-min+1) + min)*1000;
    setTimeout(fun, delay);
}

function hideAllLight(){
    hideItem('centerLight');
    hideItem('leftLight');
    hideItem('rightLight');
}


// Inital Game State
function initialGameState() {
    hideAllLight()
    hideItem("intro");
    button = document.getElementById('playButton');
    button.innerHTML = "PLAY";
    button.onclick = simpleRT;
    showItem("playButton");
}

// Simple Reaction Time
async function simpleRT(){
    hideAllLight()
    let starttime = 0;
    let endtime = 0;
    simpleRTTime = 0;


    hideItem('playButton');
    // instruction
    let instruction = "<p> We are first going to test Simple Reaction Time </p> \
                    <p> Press <strong> J </strong> when you see object</p>\
                    <p>Press Enter to start</p>";
    document.getElementById("intro").innerHTML = instruction;
    showItem('intro')

    await keyPress('Enter')
    hideItem('intro');

    // game
    for (let i=0; i<rounds; i++){
        randomDelay(minWaitTime, maxWaitTime, ()=>showItem("centerLight"))
        starttime = performance.now();
        await keyPress('j')
        endtime = performance.now();
        simpleRTTime += (endtime-starttime);
        hideItem("centerLight");
    }
    simpleRTTime /= 5;  // average time, in milliseconds

    // show score
    let info = "It takes you an average of <strong>" + simpleRTTime + 
                "</strong> milliseconds to react"
    document.getElementById("intro").innerHTML = info;
    button = document.getElementById('playButton');
    button.innerHTML = "NEXT";
    button.onclick = choiceRT;
    showItem("intro");
    showItem("playButton");
}

// Choice Reaction Time
async function choiceRT(){
    hideAllLight()
    let starttime = 0;
    let endtime = 0;
    choiceRTTime = 0;

    hideItem('playButton');
    let instruction = "<p>We are now going to test Choice Reaction Time</p>\
                    <p>Press <strong> J </strong> when you see Green circle</p>\
                    <p>Press <strong> K </strong> when you see Purple circle</strong></p>\
                    <p>Press Enter to start</p>";
    document.getElementById("intro").innerHTML = instruction;
    await keyPress('Enter')
    hideItem('intro');

    // game
    for (let i=0; i<rounds; i++){
        let showLeft = Math.round(Math.random()) === 0; // generate 0/1
        randomDelay(minWaitTime, maxWaitTime, ()=>showItem(showLeft ? "leftLight" : "rightLight"))
        starttime = performance.now();
        await keyPress(showLeft ? 'j' : 'k');
        endtime = performance.now();
        choiceRTTime += (endtime-starttime);
        hideItem("leftLight");
        hideItem("rightLight");
    }
    choiceRTTime /= 5;  // average time, in milliseconds

    // show score
    let info = "It takes you an average of <strong>" + choiceRTTime + 
                "</strong> milliseconds to react"
    document.getElementById("intro").innerHTML = info;
    button = document.getElementById('playButton');
    button.innerHTML = "Show Stats";
    button.onclick = showStats;
    showItem("intro");
    showItem("playButton");
}


function showStats() {
    hideAllLight()
    let simpleInfo = "<p> Simple Reaction Time: <strong>" + simpleRTTime + 
    "</strong> milliseconds </p>"
    let choiceInfo = "<p> Choice Reaction Time: <strong>" + choiceRTTime + 
    "</strong> milliseconds </p>"
    let decisionInfo = "<p> Decision Time: <strong>" + (choiceRTTime-simpleRTTime) + 
    "</strong> milliseconds </p>"
    document.getElementById("intro").innerHTML = simpleInfo + choiceInfo + decisionInfo;
    showItem("intro");

    button = document.getElementById('playButton');
    button.innerHTML = "Restart";
    button.onclick = initialGameState;
    showItem("playButton");

    if (DEBUG) {
        console.log("Simple Reaction Time: " + simpleRTTime + " ms");
        console.log("Choice Reaction Time: " + choiceRTTime + " ms");
        console.log("Decision Time: " + (choiceRTTime-simpleRTTime) + " ms");
        console.log("======================================")
    }
}