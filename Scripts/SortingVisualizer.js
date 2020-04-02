let ARRAY = [];
let BARS = [];
let TEMP_BARS = [];
let DELAY = 10; //1 second
let ANIMATIONS = [];
let step = 0;
let SI;
let isRunning = false;

let prev_i = -1, prev_j = -1;

function animationStep(){
    if(step < ANIMATIONS.length){
        var action = ANIMATIONS[step];
        console.log(action);
        if(prev_i > -1){
            TEMP_BARS[prev_i].style.background = "darkcyan";
            TEMP_BARS[prev_j].style.background = "darkorchid";
        }
        switch(action[0]) {
            case "copy1": {
                let l = action[1], h = action[2];
                for(let k = l; k <= h; k++){
                    TEMP_BARS[k].style.height = BARS[k].style.height;
                    TEMP_BARS[k].style.background = "darkcyan";
                }
                break;
            }
            case "copy2": {
                let l = action[1], h = action[2];
                for(let k = l; k <= h; k++){
                    TEMP_BARS[k].style.height = BARS[k].style.height;
                    TEMP_BARS[k].style.background = "darkorchid";
                }
                break;
            }

            case "compare_true": {
                let i = action[1], j = action[2];
                prev_i = i, prev_j = j;
                TEMP_BARS[i].style.background = "lightgreen";
                TEMP_BARS[j].style.background = "lightgreen";
                break;
            }

            case "compare_false": {
                let i = action[1], j = action[2];
                prev_i = i, prev_j = j;
                TEMP_BARS[i].style.background = "red";
                TEMP_BARS[j].style.background = "red";
                break;
            }

            case "put": {
                let i = action[1], val = action[2];
                BARS[i].innerHTML = val;
                BARS[i].style.height = `${val}px`;
                break;
            }

            case "merge_complete": {
                let l = action[1], h = action[2];
                prev_i = -1, prev_j = -1;
                console.log("Debug: " + action)
                for(let k = l; k <= h; k++){
                    // TEMP_BARS[k].style.height = BARS[k].style.height;
                    TEMP_BARS[k].style.background = "transparent";
                }
                break;
            }
        }
        step++;
    }
    else {
        clearInterval(SI);
        isRunning = false;
        console.log("finisjed");
    }
}

function generateRandomArray(){
    if(isRunning)
        return;
    ARRAY = [];
    let str = "", strTemp = "";

    console.log(window.innerWidth);
    let n = Math.floor(window.innerWidth * 0.13) + 5

    for(let i = 0; i < n; i++){
        let temp = Math.floor(Math.random() * 250) + 5;
        ARRAY.push(temp);
        str += `<div class="arrayElement" style="height:${temp}px">${temp}</div>`
        strTemp += `<div class="tempArrayElement" style="height:${temp}px">${temp}</div>`
    }
    document.getElementById("array").innerHTML = str;
    document.getElementById("tempArray").innerHTML = strTemp;
}

function merge(low, high, mid){
    let arr1 = [], arr2 = [];
    for(let i = low; i <= mid; i++){
        arr1.push(ARRAY[i]);
    }
    for(let i = mid+1; i <= high; i++){
        arr2.push(ARRAY[i]);
    }

    ANIMATIONS.push(["copy1", low, mid]);
    ANIMATIONS.push(["copy2", mid+1, high]);
    // console.log("arr1:" + arr1);
    // console.log("arr2:" + arr2);

    let i = 0, j = 0, l = low; 
    while(i < arr1.length && j < arr2.length){
        if(arr1[i] > arr2[j]){
            ANIMATIONS.push(["compare_false", low+i, mid+1+j]);
            ARRAY[l] = arr2[j];
            j++
        }
        else {
            ANIMATIONS.push(["compare_true", low+i, mid+1+j]);
            ARRAY[l] = arr1[i];
            i++;
        }
        ANIMATIONS.push(["put", l, ARRAY[l]]);
        l++;
    }

    while(i < arr1.length){
        ARRAY[l] = arr1[i];
        ANIMATIONS.push(["put", l, ARRAY[l]]);
        i++;
        l++;
    }
    while(j < arr2.length){
        ARRAY[l] = arr2[j];
        ANIMATIONS.push(["put", l, ARRAY[l]]);
        j++;
        l++;
    }
    ANIMATIONS.push(["merge_complete", low, high]);
}

function mergeSort(low, high){
    if(low < high){
    let mid = Math.floor((low + high)/2);
    // console.log("mid:" + mid);
    mergeSort(low, mid);
    mergeSort(mid+1, high);
    merge(low, high, mid);
    }
}

function sortArray(){
    isRunning = true;
    ANIMATIONS = [];
    BARS = document.getElementsByClassName("arrayElement");
    TEMP_BARS = document.getElementsByClassName("tempArrayElement");
    console.log(ARRAY);
    mergeSort(0, ARRAY.length-1);
    console.log(ARRAY);
    animate();
    // for(let i = 0; i < ARRAY.length; i++){
    //     //delayFunction(delay);
    //     console.log("changed");
    //     BARS[i].innerHTML = ARRAY[i];
    //     BARS[i].style.height = `${ARRAY[i]}px`;
    // }
}

function animate(){
    step = 0;
    SI = setInterval(animationStep , DELAY);   
}