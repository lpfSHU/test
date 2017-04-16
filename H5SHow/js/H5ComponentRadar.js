/**
 * Created by lpf on 2017/2/27.
 */
var H5ComponentRadar = function (name, cfg) {
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

    var r = w/2;
    var step = cfg.data.length;

    // ctx.beginPath();
    // ctx.arc(r, r, r-7, 0, 2*Math.PI);
    // ctx.closePath();
    // ctx.stroke();

    // 计算多边形的顶点坐标
    // 已知：圆心坐标(a,b)、半径 r、角度deg
    // rad = (2*Math.PI/step)*i
    // x = a + Math.sin(rad) * r
    // y = b - Math.cos(rad) * r

    // 绘制网格背景
    var isBlue = false;
    for(var s=7; s>0; s--){
        ctx.beginPath();
        for(var i=0; i<step; i++){
            var rad = (2*Math.PI/step)*i;
            var x = r + Math.sin(rad) * (r-7) * (s/7);
            var y =  r - Math.cos(rad) * (r-7) * (s/7);

            // ctx.moveTo(r,r);
            ctx.lineTo(x,y);
            // ctx.arc(x, y, 6, 0, 2*Math.PI);

        }
        ctx.fillStyle = (isBlue = !isBlue) ? '#99c0ff' : '#FFFFFF';
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    // 绘制伞骨、文字
    ctx.beginPath();
    for( i=0; i<step; i++){
        rad = (2*Math.PI/step)*i;
        x = r + Math.sin(rad) * (r-7);
        y =  r - Math.cos(rad) * (r-7);
        ctx.moveTo(r,r);
        ctx.lineTo(x,y);


        var text = $('<div class="text">');
        text.text(cfg.data[i][0]);


        if(i==0 || (cfg.data.length % 2 == 0 && i== cfg.data.length / 2)){
            text.css('left', x).css('margin-left', -cfg.data[i][0].length/4+'em');
        }else if(x>w/2){
            text.css('left', x+3);
        }else {
            text.css('right', w-x+3);
        }

        if(cfg.data.length % 4 == 0 && ( i == cfg.data.length/4 || i== 3*cfg.data.length/4)){
            text.css('top', y).css('margin-top', '-0.5em');
        }else if(y>h/2){
            text.css('top', y+3);
        }else {
            text.css('bottom', h-y+3);
        }
        component.append(text);

    }
    ctx.strokeStyle = "#e0e0e0";
    ctx.stroke();


    //加入画布-数据层
    cns = document.createElement('canvas');
    ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);
    ctx.strokeStyle = '#f00';
    var draw = function (per) {
        ctx.clearRect(0, 0, w, h);
        // 输出数据的折线
        for(var i=0; i<step; i++){
            var rad = (2*Math.PI/step)*i;
            var rate = cfg.data[i][1];
            var x = r + Math.sin(rad) * (r-7) * rate * per;
            var y =  r - Math.cos(rad) * (r-7) * rate * per;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        //输出数据的点
        ctx.fillStyle = '#f00';
        for( i=0; i<step; i++){
            rad = (2*Math.PI/step)*i;
            rate = cfg.data[i][1];
            x = r + Math.sin(rad) * (r-7) * rate * per;
            y =  r - Math.cos(rad) * (r-7) * rate * per;
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

    };

    component.on('onLoad', function () {
        //折线图生长动画
        var s = 0;
        for(i=0; i<100; i++){
            setTimeout(function () {
                s+=.01;
                draw(s);
            }, i*10);
        }
        return false;
    });

    component.on('onLeave', function () {
        var s = 1;
        for(i=0; i<100; i++){
            setTimeout(function () {
                s-=.01;
                draw(s);
            }, i*10);
        }
        return false;
    });
    return component;
};