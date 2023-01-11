'use strict';
const N = 4;
var flag = Array(N * N);
function numf(toward) {
    return function (x, y) {
        switch(toward) {
            case 119: return x * N + y;     //w
            case 97: return x + y * N;      //a
            case 115: return N * N - x * N - y - 1;     //s
            case 100: return N * N - x - y * N - 1;     //d
        }
    }
}
function updateColor() {
    let pieces = $('#chessBox>.pieceBox');
    for(let k of pieces) {
        var color = getColor(k.innerText);
        k.style.backgroundColor = color;
        if(color === 'black') k.style.color = 'white';
    }
}
function getColor(val) {
    switch (val) {
        case '':        return 'rgba(238, 228, 218, 0.35)';
        case '2':       return '#eee4da';
        case '4':       return '#eee1c9';
        case '8':       return '#f3b27a';
        case '16':      return '#f69664';
        case '32':      return '#f77c5f';
        case '64':      return '#f75f3b';
        case '128':     return '#edd073';
        case '256':     return '#edcc62';
        case '512':     return '#edc950';
        case '1024':    return '#edc53f';
        case '2048':    return '#edc22e';
        default:        return 'black';
    }
}
function getRdPlace() {
    var num;
    while(num === undefined || flag[num]) {
        num = Math.floor(Math.random() * N * N);
    }
    flag[num] = true;
    return num;
}
function init() {
    flag.fill(false);
    $('#score').text(0);
    $('#chessBox>.pieceBox').remove();
    $('#over').remove();
    let chessBox= $('#chessBox');
    for(let i = 0; i < N * N; i++)
        chessBox.append(`<div class="pieceBox" id="piece${i}"></div>`);
    for(let k = 0; k < 2; k++) newPiece();
    updateColor();
}
function newPiece() {
    let pieces = $('#chessBox>.pieceBox');
    for(let i = 0; i < N * N; i++)
        flag[i] = pieces[i].innerText !== '';
    let [n, p] = [Math.random() > 0.3 ? 2 : 4, getRdPlace()];
    pieces[p].innerText = String(n);
    updateColor();
}
function move(toward) {
    let [pieces, flagmove] = [$('#chessBox>.pieceBox'), false];
    var num = numf(toward);
    for(let i = 1; i < N; i++) {
        for(let j = 0; j < N; j++) {
            if(pieces[num(i, j)].innerText === '') continue;
            let [flagGo, flagPlus, notGo, notPlus] = [0, 0, false, false];
            for(let k = 1; k <= i; k++) {
                if(pieces[num(i - k, j)].innerText === '' && !notGo) 
                    flagGo = k;
                else if(pieces[num(i - k, j)].innerText === pieces[num(i, j)].innerText && !notPlus) 
                    [flagPlus, notGo, notPlus] = [k, true, true];
                else 
                    [notGo, notPlus] = [true, true];
            }
            if(flagGo > flagPlus) {
                pieces[num(i - flagGo, j)].innerText = pieces[num(i, j)].innerText;
                pieces[num(i, j)].innerText = '';
                [flag[num(i, j)], flag[num(i - flagGo, j)]] = [false, true];
            }
            else if(flagGo < flagPlus) {
                $('#score').text(parseInt(pieces[num(i - flagPlus, j)].innerText) * 2 + parseInt($('#score').text()));
                pieces[num(i - flagPlus, j)].innerText = String(parseInt(pieces[num(i - flagPlus, j)].innerText) * 2);
                pieces[num(i, j)].innerText = '';
                flag[num(i, j)] = false;
            }
            flagmove = flagmove || flagGo !== flagPlus;
            updateColor();
        }
    }
    if(flagmove) newPiece();
    if(isOver() && document.getElementById('over') === null) $('#score').after('<p id="over">Game is over! Your score is ' + $('#score').text() + ' </p>');
}
function isOver() {
    let [pieces, flagmove, towards] = [$('#chessBox>.pieceBox'), true, [119, 97, 115, 100]];
    for(var toward of towards) {
        var num = numf(toward);
        for(let i = 1; i < N; i++) {
            for(let j = 0; j < N; j++) {
                if(pieces[num(i, j)].innerText === '') continue;
                let [flagGo, flagPlus, notGo, notPlus] = [0, 0, false, false];
                for(let k = 1; k <= i; k++) {
                    if(pieces[num(i - k, j)].innerText === '' && !notGo) 
                        flagGo = k;
                    else if(pieces[num(i - k, j)].innerText === pieces[num(i, j)].innerText && !notPlus) 
                        [flagPlus, notGo, notPlus] = [k, true, true];
                    else 
                        [notGo, notPlus] = [true, true];
                }
                flagmove = flagmove && flagGo === flagPlus;
            }
        }
    }
    return flagmove;
}
$(function() {init();});
$(function() {
    $(document).keypress(function(event){
        move(event.which);
    });
});