/**
 * Created by lipengfei on 2017/4/19.
 */
//定义类
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}
const point = new Point(1,2);
console.log(point.toString());
