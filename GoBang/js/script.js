/**
 * Created by lipengfei on 17/3/25.
 */
var chess = function () {
    //是否让用户下棋的标志
    var me= false;
    //棋盘
    var chessBoard = [];
    //是否结束
    var over = false;
    //赢法数组
    var win = [];
    //赢法数量
    var count = 0;
    //赢法的统计数组,用于判断是否赢
    var myWin = [];
    var computerWin = [];
    //初始化棋盘
    //0:未下棋；1:黑棋；2:白棋
    for(var i=0; i<15; i++){
        chessBoard[i] = [];
        for(var j=0; j<15; j++){
            chessBoard[i][j] = 0;
        }
    }
    //初始化赢法数组
    for(i=0; i<15; i++){
        win[i] = [];
        for(j=0; j<15; j++){
            win[i][j] = [];
        }
    }
    for(i=0; i<15; i++){
        for(j=0; j<11; j++){
            for(var k=0; k<5; k++){
                win[i][j+k][count] = true;
            }
            count++;
        }
    }
    for(i=0; i<15; i++){
        for(j=0; j<11; j++){
            for( k=0; k<5; k++){
                win[j+k][i][count] = true;
            }
            count++;
        }
    }
    for(i=0; i<11; i++){
        for(j=0; j<11; j++){
            for( k=0; k<5; k++){
                win[i+k][j+k][count] = true;
            }
            count++;
        }
    }
    for(i=0; i<11; i++){
        for(j=14; j>3; j--){
            for( k=0; k<5; k++){
                win[i+k][j-k][count] = true;
            }
            count++;
        }
    }
    //初始化赢法统计数组
    for(i=0; i<count; i++){
        myWin[i] = 0;
        computerWin[i] = 0;
    }

    //
    //
    var chess = document.getElementById('chess');
    var context = chess.getContext('2d');
    context.strokeStyle = "#BFBFBF";
    var logo = new Image();
    logo.onload=function () {
        context.drawImage(logo, 0, 0, 450, 450);
        drawChessBoard();
        oneStep(7,7,false);
        me = true;
    };
    logo.src = "timg.jpeg";
    var drawChessBoard = function () {
        for(var i=0; i<15; i++){
            context.moveTo(15, 15+i*30);
            context.lineTo(435, 15+i*30);
            context.stroke();
            context.moveTo(15+i*30, 15);
            context.lineTo(15+i*30, 435);
            context.stroke();
        }
    };
    /**
     * 画一步棋，并判断是否会赢
     * @param i
     * @param j
     * @param me
     */
    var oneStep = function (i, j, me) {
        context.beginPath();
        context.arc(15+i*30, 15+j*30, 13, 0, 2*Math.PI);

        var gradient = context.createRadialGradient(15+i*30, 15+j*30, 1, 15+i*30, 15+j*30, 13);
        if(me){
            gradient.addColorStop(0, '#636766');
            gradient.addColorStop(1, '#0A0A0A');
        }else {
            gradient.addColorStop(1, '#D1D1D1');
            gradient.addColorStop(0, '#F9F9F9');
        }
        context.fillStyle = gradient;
        context.fill();
        console.log(i+"--"+j);
        context.closePath();
        if(me){
            chessBoard[i][j] = 1;
            for(var k=0; k<count; k++){
                if(win[i][j][k]){
                    myWin[k]++;
                    //
                    computerWin[k] = 6;
                    if(myWin[k] == 5){
                        alert("你赢了");
                        over = true;
                    }
                }
            }
        }else {
            chessBoard[i][j] = 2;
            for(k=0; k<count; k++){
                if(win[i][j][k]){
                    computerWin[k]++;
                    //
                    myWin[k] = 6;
                    if(computerWin[k] == 5){
                        alert("计算机赢了");
                        over = true;
                    }
                }
            }
        }
    };

    var conputerAI = function () {
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
                if(chessBoard[i][j] ==0){
                    for(var k=0; k<count; k++){
                        if(win[i][j][k]){
                            //用户棋谱
                            if(myWin[k] == 1){
                                myScore[i][j] += 200;
                            }else if(myWin[k] == 2){
                                myScore[i][j] += 400;
                            }else  if(myWin[k] == 3){
                                myScore[i][j] += 2000;
                            }else  if(myWin[k] == 4){
                                myScore[i][j] += 10000;
                            }
                            //计算机棋谱
                            if(computerWin[k] == 1){
                                computerScore[i][j] += 220;
                            }else if(computerWin[k] == 2){
                                computerScore[i][j] += 420;
                            }else  if(computerWin[k] == 3){
                                computerScore[i][j] += 2200;
                            }else  if(computerWin[k] == 4){
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
        // oneStep(u, v, false);
        setTimeout(function () {
            oneStep(u, v, false);
        },100);
    };

    chess.onclick = function (e) {
        if(over || !me){
            return;
        }
        var x = e.offsetX;
        var y = e.offsetY;
        var i = Math.floor(x/30);
        var j= Math.floor(y/30);
        if(chessBoard[i][j] == 0) {
            oneStep(i, j, me);
            if(!over){
                //切换到计算机下棋
                me = !me;
                conputerAI();
                //切换到用户下棋
                me = !me;
            }
        }
    };
};
chess();

