function getPlayer (type, episode){
    var players = Object.keys(series);
    type = series[type] ? type : players[0];
    episode = series[type][episode] ? series[type][episode] : series[type][0];
    var esh = document.querySelector("#select");
    var esx = esh.lastElementChild;
    while (esx) { 
        esh.removeChild(esx); 
        esx = esh.lastElementChild; 
    }
    var plh = document.querySelector("#player");
    var pll = plh.lastElementChild;
    if(pll){
        plh.removeChild(pll);
    }
    var plt = document.createElement("select");
    plt.onchange = function(){
        getPlayer(players[this.selectedIndex]);
    }
    for(var p of players){
        var pltype = document.createElement("option");
        pltype.value = p;
        pltype.text = p;
        if(p==type){
            pltype.selected = "selected";
        }
        plt.appendChild(pltype);
    }
    document.querySelector("#select").appendChild(plt);
    var ple = document.createElement("select");
    ple.onchange = function(){
        getPlayer(type, this.selectedIndex);
    }
    for(var e in series[type]){
        var plep = document.createElement("option");
        plep.value = e;
        plep.text = series[type][e].title;
        if(plep.text == episode.title){
            plep.selected = "selected";
        }
        ple.appendChild(plep);
    }
    document.querySelector("#select").appendChild(ple);
    var plframe = document.createElement("iframe");
    plframe.src = episode.url;
    document.querySelector("#player").appendChild(plframe);
    return;
}

document.addEventListener('DOMContentLoaded',function(){
    getPlayer();
});