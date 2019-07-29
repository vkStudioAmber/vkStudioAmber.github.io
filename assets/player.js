// set defaults
var nextEp, prevEp,
    players = Object.keys(series);
// getPlayer
function getPlayer (type, episode){
    // collect data
    type    = series[type]          ? type    : players[0];
    episode = series[type][episode] ? episode : 0;
    if(!series[type][episode]){
        return;
    }
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
    selPlayBx = document.createElement('span');
    selPlayBx.classList.add("select-button");
    selPlayBx.classList.add("video-select__select-button");
    selPlayBx.classList.add("video-select__select-button_episode");
    selPlayCont = document.createElement('div');
    selPlayCont.classList.add("video-select__select-container");
    selPlayCont.appendChild(selPlayBx);
    selPlayEl = document.createElement('select');
    selPlayEl.classList.add("select-button__select");
    selPlayEl.classList.add("video-select__select");
    selPlayBx.appendChild(selPlayEl);
    selPlayEl.addEventListener('change',function(){ 
        getPlayer(players[this.selectedIndex]);
        historyState(players[this.selectedIndex], 1);
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
    selectEl.appendChild(selPlayCont);
    // make new selection 2
    selPlayBx = document.createElement('span');
    selPlayBx.classList.add("select-button");
    selPlayBx.classList.add("video-select__select-button");
    selPlayBx.classList.add("video-select__select-button_episode");
    selPlayCont = document.createElement('div');
    selPlayCont.classList.add("video-select__select-container");
    selPlayCont.appendChild(selPlayBx);
    selPlayEl = document.createElement('select');
    selPlayEl.classList.add("select-button__select");
    selPlayEl.classList.add("video-select__select");
    selPlayBx.appendChild(selPlayEl);
    selPlayEl.addEventListener('change',function(){ 
        getPlayer(type, this.selectedIndex);
        historyState(type, this.selectedIndex+1);
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
    selectEl.appendChild(selPlayCont);
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
                historyState(type, episode+2);
            };
            nextEpBtn.classList.remove('link-button_disabled');
            nextEpBtn.addEventListener('click', nextEp);
        }
        if(episode > 0){
            prevEp = function(){
                getPlayer(type, episode-1);
                historyState(type, episode);
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
    // return data
    return { player: type, video: episode+1 };
}

var historyState = function (type, video, func) {
    state = { player: type, video: video };
    func  = func ? func : 'pushState';
    window.history[func](state, null, location.pathname + '?' + new URLSearchParams(state).toString());
}

window.addEventListener('popstate', function(e) {
    state = e.state ? e.state : { player: '', video: 1 };
    getPlayer(state.player, state.video-1);
});

document.addEventListener('DOMContentLoaded',function(){
    var playerTypeReq  = new URLSearchParams(window.location.search).get('player');
    playerTypeReq = players.indexOf(playerTypeReq) > -1 ? playerTypeReq : players[0];
    var videoNumReq    = parseInt(new URLSearchParams(window.location.search).get('video'));
    videoNumReq = videoNumReq 
        && videoNumReq > 0 
        && videoNumReq - 1 < series[playerTypeReq].length 
        ? videoNumReq : 1;
    var curPageData = getPlayer(playerTypeReq, videoNumReq-1);
    if(curPageData){
        historyState(curPageData.player, curPageData.video, 'replaceState');
    }
});
