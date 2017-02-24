var stickH = 400,//.colorStick的高度
    squareW = 400,//.bgSquare的宽度
    squareH = 400//.bgSquare的高度;
//设置rgb的取值范围在0-255
function getNum(aVal) {
    if (aVal == null || aVal == " ") {
        aVal = 0;
    } else {
        if (aVal > 255) {
            aVal = 255;
        }
    }
    return aVal;
}
//rgb转换成hsb
function rgb2hsb(r,g,b) {
    $(".bgSquare,.showColor").css("background","rgb(" + r + "," + g + "," + b + ")");
    var h,s,v;
    if (r > g) {
        if (g > b) {
            //r>g>b
            h = Math.round(60 * (g - b) / (r - b));
            s = 100 - Math.round(b / r * 100);
            v = Math.round(r / 255 * 100);
        } else {
            if (b > r) {
                //b>r>g
                h = Math.round(60 * (r - g) / (b - g)) + 240;
                s =  100 - Math.round(g / b * 100);
                v = Math.round(b / 255 * 100);
            } else {
                //r>=b,b>=g,r>g
                h = Math.round(60 * (g - b) / (r - g) + 360);
                s = 100 - Math.round(g / r * 100);
                v = Math.round(r / 255 * 100);
            }
        }
    } else {
        if (g < b) {
            //b > g>=r
            h = Math.round(60 * (r - g) / (b - r)) + 240;
            s = 100 - Math.round(r / b * 100);
            v = Math.round(b / 255 * 100);
        } else {
            if (b > r) {
                //g>=b,b>r
                h = Math.round(60 * (b - r) / (g - r) + 120);
                s = 100 - Math.round(r / g * 100);
                v = Math.round(g / 255 * 100);
            } else {
                //g>=r,r>=b
                if (r == b && g == b) {
                    h = 0;
                    s = 0;
                    v = 0;
                } else {
                    //g>=r,r>b
                    h = Math.round(60 * (b - r) / (g - b) + 120);
                    s = 100 - Math.round(b / g * 100);
                    v = Math.round(g / 255 * 100);
                }
            }
        }
    }    
    $("#colorH").val(h);
    $("#colorS").val(s);
    $("#colorBr").val(v);
    var seltop = stickH - Math.round(h / 360 * stickH) - 5,
        chostop = squareH - v / 100 * squareH,
        chosleft = squareW - s / 100 * squareW;
    $("#selectClr").css("top", seltop + "px");
    $(".chooseClr").css({top: chostop + "px",left: chosleft + "px"})
}
//获取rgb文本框中的取值
$(".rgbValue input").change(function (index, element) {
   var curR = getNum($("#colorR").val()),
       curG = getNum($("#colorG").val()),
       curB = getNum($("#colorB").val());    
    rgb2hsb(curR,curG,curB);
});

function hsb2rgb(h,s,v) {
    var r,g,b,p,q,t,m,f;
    s = s / 100;
    v = Math.round(v / 100 * 255);
    m = Math.floor(h / 60) % 6;
    f = Math.abs(h / 60 - m);
    p = Math.round(v * (1 - s));
    q = Math.round(v * (1 - f * s));
    t = Math.round(v * (1 - (1 - f) * s));
    
    switch (m) {
        case 0: r = v; g = t; b = p;break;
        case 1: r = q; g = v; b = p;break;
        case 2: r = p; g = v; b = t;break;
        case 3: r = q; g = p; b = v;break;
        case 4: r = t; g = p; b = v;break;
        case 5: r = v; g = p; b = q;break;
    }
    $("#colorR").val(r);
    $("#colorG").val(g);
    $("#colorB").val(b);
    $(".bgSquare,.showColor").css("background","rgb(" + $("#colorR").val() + "," + $("#colorG").val() + "," + $("#colorB").val() + ")");
}
//获取hsb文本框中取值
$(".hsbValue input").change(function (ind,ele) {
   var curH = $("#colorH").val() ? $("#colorH").val() : 0, 
       curS = $("#colorS").val() ? $("#colorS").val() : 0, 
       curV = $("#colorBr").val() ? $("#colorBr").val() : 0;
    hsb2rgb(curH,curS,curV);
});
$("#colorStick").mousedown(function (event) {
    $("#colorStick").mousemove(function (event) {
        var ecy = event.clientY,
            parentY = this.getBoundingClientRect().top,
            posy = Math.round(ecy - parentY);
        if (posy > stickH) {
            posy = stickH;
        }
        $("#selectClr").css("top",posy);
        var currentH = Math.round((stickH - posy) / stickH *360);
        $("#colorH").val(currentH);
        $(".hsbValue input").change();
        $(this).mouseup(function (event) {
            $(this).off("mousemove");
        })
    })
});

//
$(".bgSquare").mousedown(function () {
   $(".bgSquare").mousemove(function (event) {
       var absx = event.clientX,
           absy = event.clientY,
           relx = absx - this.getBoundingClientRect().left - 5,
           rely = absy - this.getBoundingClientRect().top - 5;
       if (relx > squareW) {
           relx = squareW;
       }
       if (rely > squareH) {
           rely = squareH;
       }
       if (relx < 0) {
           relx = 0;
       }
       if (rely < 0) {
           rely = 0;
       }
       $(".chooseClr").css({top:rely + "px",left:relx + "px"});
       var newS = Math.round((squareW - relx) / squareW * 100),
           newV = Math.round((squareH - rely) / squareH * 100);
       $("#colorS").val(newS);
       $("#colorBr").val(newV);
       $(".hsbValue input").change();
       $(this).mouseup(function (event) {
           $(this).off("mousemove");
       })
   });
});