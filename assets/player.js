var nextEp, prevEp;
function getPlayer (type, episode){
    // collect data
    var players = Object.keys(series);
    type    = series[type]          ? type    : players[0];
    episode = series[type][episode] ? episode : 0;
    // predef
    var selectEl = document.querySelector('#select');
    var playerEl = document.querySelector('#player');
    var selPlayEl, optPlayEl, playerFrame; 
    // clean up elements
    while (selectEl.firstChild) { 
        selectEl.removeChild(selectEl.firstChild);
    }
    while (playerEl.firstChild) { 
        playerEl.removeChild(playerEl.firstChild);
    }
    // make new selection 1
    selPlayEl = document.createElement('select');
    selPlayEl.addEventListener('change',function(){ 
        getPlayer(players[this.selectedIndex]);
    });
    for(var p of players){
        optPlayEl = document.createElement('option');
        optPlayEl.value = p;
        optPlayEl.text = p;
        if(type == p){
            optPlayEl.setAttribute('selected', 'selected');
        }
        selPlayEl.appendChild(optPlayEl);
    }
    selectEl.appendChild(selPlayEl);
    // make new selection 2
    selPlayEl = document.createElement('select');
    selPlayEl.addEventListener('change',function(){ 
        getPlayer(type, this.selectedIndex);
    });
    for(var e in series[type]){
        optPlayEl = document.createElement('option');
        optPlayEl.value = e;
        optPlayEl.text  = series[type][e].title;
        if(episode == e){
            optPlayEl.setAttribute('selected', 'selected');
        }
        selPlayEl.appendChild(optPlayEl);
    }
    selectEl.appendChild(selPlayEl);
    // next - prev
    var nextEpBtn = document.querySelector('.video-select__link_next');
    var prevEpBtn = document.querySelector('.video-select__link_prev');
    if(nextEp){
        nextEpBtn.removeEventListener('click', nextEp);
        nextEpBtn.classList.add('link-button_disabled');
    }
    if(prevEp){
        prevEpBtn.removeEventListener('click', prevEp);
        prevEpBtn.classList.add('link-button_disabled');
    }
    // reset buttons function
    nextEp = false, prevEp = false;
    // make buttons
    if(series[type].length > 1){
        if(episode+1 < series[type].length){
            nextEp = function(){
                getPlayer(type, episode+1);
            };
            nextEpBtn.classList.remove('link-button_disabled');
            nextEpBtn.addEventListener('click', nextEp);
        }
        if(episode > 0){
            prevEp = function(){
                getPlayer(type, episode-1);
            };
            prevEpBtn.classList.remove('link-button_disabled');
            prevEpBtn.addEventListener('click', prevEp);
        }
    }
    // add iframe
    playerFrame = document.createElement('iframe');
    playerFrame.src = series[type][episode].url;
    playerFrame.setAttribute('allowFullScreen', 'true');
    playerEl.appendChild(playerFrame);
    return;
}

document.addEventListener('DOMContentLoaded',function(){
    getPlayer();
});
