// set defaults
var nextEp, prevEp,
    players = Object.keys(series);
	cURL = location.pathname;
// getPlayer
function getPlayer (type, episode){
    // collect data
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
		historyState(0,this.selectedIndex);
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
		historyState(this.selectedIndex,type);
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
				historyState(episode+1,type);
            };
            nextEpBtn.classList.remove('link-button_disabled');
            nextEpBtn.addEventListener('click', nextEp);
        }
        if(episode > 0){
            prevEp = function(){
                getPlayer(type, episode-1);
				historyState(episode-1,type);
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

var historyState = function (episode, type) {	
	var state = { 'ep': episode, 'pl': type };
	window.history.pushState(state, null, cURL+'?video='+(state.ep+1));
}

document.addEventListener('DOMContentLoaded',function(){
    var videoNumReq = parseInt(new URLSearchParams(window.location.search).get('video'));
    if(videoNumReq && videoNumReq - 1 > 0 && videoNumReq - 1 < series[players[0]].length){
        videoNumReq = videoNumReq - 1;
    }
    else{
        videoNumReq = 0;
    }
    getPlayer(players[0], videoNumReq);
	var state = { 'ep': videoNumReq, 'pl': players[0] };
	window.history.replaceState(state, null, cURL+'?video='+(state.ep+1));
});

window.addEventListener('popstate', function(e) {
  var state = e.state;
  getPlayer(players[state.pl], state.ep);
});
