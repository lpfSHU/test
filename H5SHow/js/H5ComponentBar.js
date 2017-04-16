/**
 * Created by lpf on 2017/2/27.
 */
var H5ComponentBar = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg);
    $.each(cfg.data,function (inx, item) {
        var line = $('<div class="line">');
        var name = $('<div class="name">');
        var rate = $('<div class="rate">');
        var peer = $('<div class="peer">');

        var width = item[1]*100 + '%';

        rate.html('<div class="bg"></div>');
        rate.css('width', width);

        name.text(item[0]);

        peer.text(width);
        line.append(name).append(rate).append(peer);

        component.append(line);
    });
    return component;
};