/**
 * Created by lpf on 2017/2/27.
 */
var H5ComponentPie = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg);
    //绘制网格线
    var w = cfg.width/2;
    var h = cfg.height/2;
    //加入画布-背景层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('z-index', 1);
    component.append(cns);

    // 加入底图层
    var r = w/2;
    ctx.beginPath();
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.arc(r, r, r-2, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    //绘制数据层
    cns = document.createElement('canvas');
    ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('z-index', 2);
    component.append(cns);

    var colors = ['red', 'green', 'blue', 'orange', 'Gray', 'steelBlue'];
    var sAngel = 1.5 * Math.PI;
    var eAngel = 0;
    var aAngel = Math.PI * 2;


    var step = cfg.data.length;
    for(var i=0; i<step; i++){
        var item = cfg.data[i];
        var color = item[2] || (colors.pop());
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(r,r);
        eAngel = sAngel + aAngel*item[1];
        ctx.arc(r,r,r-4,sAngel,eAngel);
        ctx.fill();
        ctx.stroke();
        sAngel = eAngel;
        //加入所有的项目文本以及百分比
        var text = $('<div class="text">');
        text.text(cfg.data[i][0]);
        component.append(text);
        var per = $('<div class="text">');
        per.text(cfg.data[i][1]*100 + '%');
        text.append(per);
        var x = r + Math.sin();

    }



    // 加入蒙版层
    cns = document.createElement('canvas');
    ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('z-index', 3);
    component.append(cns);
    r = w/2;

    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;




    var draw = function (per) {
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.moveTo(r, r);
        if(per>=1){
        }else if(per<=0){
            ctx.arc(r, r, r-2, 0, 2*Math.PI);
        }else {
            ctx.arc(r, r, r-2, sAngel, sAngel + 2*Math.PI*per, true);
        }

        ctx.fill();
        ctx.stroke();
    };

    component.on('onLoad', function () {
        //饼图生长动画
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