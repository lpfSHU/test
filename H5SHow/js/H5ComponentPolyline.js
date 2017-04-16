/**
 * Created by lpf on 2017/2/27.
 */
var H5ComponentPolyline = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg);
    //绘制网格线
    var w = cfg.width/2;
    var h = cfg.height/2;
    //加入画布-背景层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    var step = 10;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#AAAAAA";
    for (var i=0; i<=step; i++){
        var y = h/step * i;
        ctx.moveTo(0,y);
        ctx.lineTo(w, y);
    }
    step = cfg.data.length+1;

    var text_w = w/step;

    for (i=0; i<=step; i++){
        var x = (w/step)*i;
        ctx.moveTo(x,0);
        ctx.lineTo(x,h);

        if(cfg.data[i]){
            var text = $('<div class="text">');
            text.text(cfg.data[i][0]);
            text.css('width', text_w).css('left', x+text_w/2);
            component.append(text);
        }
    }
    ctx.stroke();
    //加入画布-数据层
    cns = document.createElement('canvas');
    ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);

    var drawLine = function (per) {
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#ff8878";

        x=0; y=0;
        //画点
        for( i=0; i<cfg.data.length; i++ ){
            var item = cfg.data[i];
            x = (w/step)*(i+1);
            y = h  -  h*item[1]*per;
            ctx.moveTo(x,y);
            ctx.arc(x, y, 5, 0, 2*Math.PI);
        }


        //连线
        x = (w/step);
        y = h - h*cfg.data[0][1]*per;
        ctx.moveTo(x,y);

        for( i=0; i<cfg.data.length; i++ ){
            item = cfg.data[i];
            x = (w/step)*(i+1);
            y = h  -  h*item[1]*per;
            ctx.lineTo(x,y);
            // ctx.moveTo(x,y);
        }
        //写数据
        for( i=0; i<cfg.data.length; i++ ){
            item = cfg.data[i];
            x = (w/step)*(i+1);
            y = h - h*item[1]*per;
            ctx.fillStyle='#ff8878';
            ctx.fillText((item[1]*100)+'%', x-10, y-10);
        }
        ctx.stroke();
        ctx.lineWidth = 0.1;
        ctx.lineTo(x, h);
        ctx.lineTo(w/step, h);
        ctx.lineTo(w/step, h * (1 - cfg.data[0][1]));
        ctx.fillStyle=('rgba(255,136,120,0.3)');
        ctx.fill();
        ctx.stroke();
    };


    // drawLine(.4);
    // drawLine(.8);

    component.on('onLoad', function () {
        //折线图生长动画
        var s = 0;
        for(i=0; i<100; i++){
            setTimeout(function () {
                s+=.01;
                drawLine(s);
            }, i*10);
        }
        return false;
    });

    component.on('onLeave', function () {
        var s = 1;
        for(i=0; i<100; i++){
            setTimeout(function () {
                s-=.01;
                drawLine(s);
            }, i*10);
        }
        return false;
    });

    return component;
};