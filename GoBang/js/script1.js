/**
 * Created by lipengfei on 17/3/27.
 */
window.onload = function () {
    new Chess({chessId: 'chess',chessBaseId:'chessBase', formId:'form'});

};
function Chess(cfg) {
    this.chessId = cfg.chessId || '';
    this.chessBaseId = cfg.chessBaseId || '';
    this.formId = cfg.formId || '';
    //用户悔棋机会
    this.undoCount = 3;
    //棋子canvas图层
    this.chessmanCanvas = [];
    // 计算机与用户的step数
    this.oneStepCount = 0;
    //用户下的是黑棋还是白棋
    this.userChoice = 'black';
    //用户选择是否禁用
    this.userChoiceDisabled = false;
    //是否让用户下棋的标志
    this.me= true;
    //棋盘
    this.chessBoard = [];
    //是否结束
    this.over = false;
    //赢法数组
    this.win = [];
    //赢法数量
    this.count = 0;
    //每一种赢法的x，y坐标范围。
    // this.winXYRange = [];
    //赢法的统计数组,用于判断是否赢
    this.myWin = [];
    this.computerWin = [];
    //赢法数组的历史记录
    this.myWinHistory = [];
    this.computerWinHistory = [];
    //画背景层的canvas
    this.chess = document.getElementById(cfg.chessBaseId);
    this.context = this.chess.getContext('2d');
    this.init();
    this.drawChess();
    this.addCSSToChice();
    document.getElementById(cfg.chessId).onclick = function (e) {
        this.clickFn(e);
    }.bind(this);
    // console.log(document.getElementById(cfg.formId).childNodes);
    document.getElementById(cfg.formId).childNodes[7].onclick = function () {
        this.reset();
    }.bind(this);
    document.getElementById(cfg.formId).childNodes[1].onclick = function () {
        if(this.userChoiceDisabled){
            return
        }
        console.log("黑棋");
        this.userChoice = 'black';
        this.me= true;
        //设置样式
        this.addCSSToChice();
    }.bind(this);
    document.getElementById(cfg.formId).childNodes[4].onclick = function () {
        if(this.userChoiceDisabled){
            return
        }
        console.log("白棋");
        this.userChoice = 'white';
        this.me= false;
        this.oneStep(7,7,false);
        this.me = true;
        //设置样式
        this.addCSSToChice();
    }.bind(this);
    document.getElementById(cfg.formId).childNodes[9].onclick = function () {
        this.undo();
    }.bind(this);
}
Chess.prototype.init = function () {
    //初始化棋盘
    //0:未下棋；1:黑棋；2:白棋
    for(var i=0; i<15; i++){
        this.chessBoard[i] = [];
        for(var j=0; j<15; j++){
            this.chessBoard[i][j] = 0;
        }
    }
    //初始化赢法数组
    for(i=0; i<15; i++){
        this.win[i] = [];
        for(j=0; j<15; j++){
            this.win[i][j] = [];
        }
    }
    for(i=0; i<15; i++){
        for(j=0; j<11; j++){
            for(var k=0; k<5; k++){
                this.win[i][j+k][this.count] = true;
            }
            // this.winXYRange.push({x1:i, x2:i, y1:j, y2:j+k-1, oblique:false});
            this.count++;
        }
    }
    for(i=0; i<15; i++){
        for(j=0; j<11; j++){
            for( k=0; k<5; k++){
                this.win[j+k][i][this.count] = true;
            }
            // this.winXYRange.push({x1:j, x2:j+k-1, y1:i, y2:i, oblique:false});
            this.count++;
        }
    }
    for(i=0; i<11; i++){
        for(j=0; j<11; j++){
            for( k=0; k<5; k++){
                this.win[i+k][j+k][this.count] = true;
            }
            // this.winXYRange.push({x1:i, x2:i+k-1, y1:j, y2:j+k-1, oblique:true});
            this.count++;
        }
    }
    for(i=0; i<11; i++){
        for(j=14; j>3; j--){
            for( k=0; k<5; k++){
                this.win[i+k][j-k][this.count] = true;
            }
            // this.winXYRange.push({x1:i, x2:i+k-1, y1:j, y2:j-k+1, oblique:true});
            this.count++;
        }
    }
    //初始化赢法统计数组和赢法统计数组的历史记录
    for(i=0; i<this.count; i++){
        this.myWin[i] = 0;
        this.computerWin[i] = 0;
        this.myWinHistory[i] = [];
        this.computerWinHistory[i] = [];
    }
};
Chess.prototype.drawChess = function () {
    // var chess = document.getElementById('chess');
    // var context = this.chess.getContext('2d');
    this.context.strokeStyle = "#BFBFBF";
    var logo = new Image();
    logo.onload=function () {
        this.context.drawImage(logo, 0, 0, 450, 450);
        drawChessBoard(this.context);
        if(this.userChoice === 'white'){
            this.oneStep(7,7,false);
            this.me = true;
        }
    }.bind(this);
    logo.src = "timg.jpeg";
    var drawChessBoard = function (context) {
        for(var i=0; i<15; i++){
            context.moveTo(15, 15+i*30);
            context.lineTo(435, 15+i*30);
            context.stroke();
            context.moveTo(15+i*30, 15);
            context.lineTo(15+i*30, 435);
            context.stroke();
        }
    };
};
Chess.prototype.reset = function () {
    this.me = true;
    this.over = false;
    this.userChoice = 'black';
    this.oneStepCount = 0;
    this.undoCount = 3;
    this.removeDisableToChioce();
    this.init();
    // this.context.clearRect(0 ,0, 450, 450);
    // this.chess.width = this.chess.width;
    var canvas = null;
    while (this.chessmanCanvas.length > 0){
        canvas = this.chessmanCanvas.pop();
        (canvas.parentElement || canvas.parentNode).removeChild(canvas);
    }

    // var toDeleted = document.querySelectorAll('#chess canvas:nth-of-type(n+2)');
    // for(var i=0; i<toDeleted.length; i++){
    //     (toDeleted[i].parentElement || toDeleted[i].parentNode).removeChild(toDeleted[i]);
    // }
    this.addCSSToChice();
};

/**
 *
 * @param i
 * @param j
 * @param me
 */
Chess.prototype.oneStep = function (i, j, me) {
    if(this.oneStepCount++ == 0){
        this.addDisableToChioce();
    }
    var canvas= document.createElement('canvas');
    canvas.setAttribute('id', 'chessmanCanvas'+this.oneStepCount);
    canvas.setAttribute('chessx', i);
    canvas.setAttribute('chessy', j);
    canvas.width = 450;
    canvas.height = 450;
    var context = canvas.getContext('2d');
    document.getElementById('chess').appendChild(canvas);
    this.chessmanCanvas.push(canvas);
    context.beginPath();
    context.arc(15+i*30, 15+j*30, 13, 0, 2*Math.PI);

    var gradient = context.createRadialGradient(15+i*30, 15+j*30, 1, 15+i*30, 15+j*30, 13);
    if(!me){
        if(this.userChoice === 'black'){
            gradient.addColorStop(1, '#D1D1D1');
            gradient.addColorStop(0, '#F9F9F9');
        }else if(this.userChoice === 'white'){
            gradient.addColorStop(0, '#636766');
            gradient.addColorStop(1, '#0A0A0A');
        }
    }else {
        if(this.userChoice === 'white'){
            gradient.addColorStop(1, '#D1D1D1');
            gradient.addColorStop(0, '#F9F9F9');
        }else if(this.userChoice === 'black'){
            gradient.addColorStop(0, '#636766');
            gradient.addColorStop(1, '#0A0A0A');
        }
    }
    context.fillStyle = gradient;
    context.fill();
    // console.log(i+"--"+j);
    context.closePath();
    if(me){
        this.chessBoard[i][j] = 1;
        for(var k=0; k<this.count; k++){
            if(this.win[i][j][k]){
                this.myWinHistory[k].push(this.myWin[k]);
                this.computerWinHistory[k].push(this.computerWin[k]);
                this.myWin[k]++;
                this.computerWin[k] = 6;
                if(this.myWin[k] == 5){
                    alert("你赢了");
                    this.over = true;
                }
            }
        }
    }else {
        this.chessBoard[i][j] = 2;
        for(k=0; k<this.count; k++){
            if(this.win[i][j][k]){
                this.myWinHistory[k].push(this.myWin[k]);
                this.computerWinHistory[k].push(this.computerWin[k]);
                this.computerWin[k]++;
                this.myWin[k] = 6;
                if(this.computerWin[k] == 5){
                    alert("计算机赢了");
                    this.over = true;
                }
            }
        }
    }
};
Chess.prototype.undo = function () {
    if(this.over || !this.me || this.chessmanCanvas.length == 0 || this.chessmanCanvas.length == 1 || this.undoCount==0){
        return false;
    }
    // 第一次pop出的数据是计算机的
    var canvas = this.chessmanCanvas.pop();
    var i = canvas.getAttribute('chessx');
    var j = canvas.getAttribute('chessy');
    this.chessBoard[i][j] = 0;
    for(var k=0; k<this.count; k++){
        if(this.win[i][j][k]){
            this.myWin[k] = this.myWinHistory[k].pop();
            this.computerWin[k]=this.computerWinHistory[k].pop();
        }
    }
    (canvas.parentElement || canvas.parentNode).removeChild(canvas);
    // 第二次pop出的数据是用户的
    canvas = this.chessmanCanvas.pop();
    i = canvas.getAttribute('chessx');
    j = canvas.getAttribute('chessy');
    this.chessBoard[i][j] = 0;
    for(k=0; k<this.count; k++){
        if(this.win[i][j][k]){
            this.myWin[k] = this.myWinHistory[k].pop();
            this.computerWin[k]=this.computerWinHistory[k].pop();
        }
    }
    (canvas.parentElement || canvas.parentNode).removeChild(canvas);
    this.count -= 2;
    this.undoCount--;
};
Chess.prototype.conputerAI = function () {
    var myScore = [];
    var computerScore = [];
    var max = 0, u=0, v=0;
    for(var i=0; i<15; i++){
        myScore[i] = [];
        computerScore[i] = [];
        for(var j=0; j<15; j++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for(i=0; i<15; i++){
        for(j=0; j<15; j++){
            if(this.chessBoard[i][j] ==0){
                for(var k=0; k<this.count; k++){
                    if(this.win[i][j][k]){
                        //用户棋谱
                        if(this.myWin[k] == 1){
                            myScore[i][j] += 200;
                        }else if(this.myWin[k] == 2){
                            myScore[i][j] += 400;
                        }else  if(this.myWin[k] == 3){
                            myScore[i][j] += 2000;
                        }else  if(this.myWin[k] == 4){
                            myScore[i][j] += 10000;
                        }
                        //计算机棋谱
                        if(this.computerWin[k] == 1){
                            computerScore[i][j] += 400;
                        }else if(this.computerWin[k] == 2){
                            computerScore[i][j] += 800;
                        }else  if(this.computerWin[k] == 3){
                            computerScore[i][j] += 2200;
                        }else  if(this.computerWin[k] == 4){
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if(max < myScore[i][j]){
                    max = myScore[i][j];
                    u = i;
                    v = j;
                }
                if(max < computerScore[i][j]){
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                }
            }
        }
    }
    // this.oneStep(u, v, false);
    setTimeout(function () {
        this.oneStep(u, v, false);
    }.bind(this),100);
};
Chess.prototype.clickFn = function (e) {
    if(this.over || !this.me){
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x/30);
    var j= Math.floor(y/30);
    if(this.chessBoard[i][j] == 0) {
        this.oneStep(i, j, this.me);
        if(!this.over){
            //切换到计算机下棋
            this.me = !this.me;
            this.conputerAI();
            //切换到用户下棋
            this.me = !this.me;
        }
    }
};
Chess.prototype.addDisableToChioce =function () {
    this.userChoiceDisabled = true;
};
Chess.prototype.removeDisableToChioce =function () {
    this.userChoiceDisabled = false;
};
Chess.prototype.addCSSToChice =function () {
    if(this.userChoice == 'black'){
        document.getElementById(this.formId).childNodes[1].style.backgroundColor = "rgb(29, 31, 27)";
        document.getElementById(this.formId).childNodes[1].style.color = "white";
        document.getElementById(this.formId).childNodes[4].style.backgroundColor = "white";
        document.getElementById(this.formId).childNodes[4].style.color = "black";
    }else if(this.userChoice = 'white'){
        document.getElementById(this.formId).childNodes[4].style.backgroundColor = "rgb(29, 31, 27)";
        document.getElementById(this.formId).childNodes[4].style.color = "white";
        document.getElementById(this.formId).childNodes[1].style.backgroundColor = "white";
        document.getElementById(this.formId).childNodes[1].style.color = "black";
    }
};
