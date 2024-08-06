var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballColor = "#0095DD";//ボールの初期色 青
var paddleHeight = 10;
var paddleWidth = 85;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

//壊すブロック群
var brickRowCount = 5;//行を増減させる
var brickColumnCount = 7;//列を増減させる
var brickWidth = 50;
var brickHeight = 30;
var brickPadding = 5;
var brickOffsetTop = 30;
var brickOffsetLeft = 50;

var points = 0; // ポイントの初期化

var bricks = [];
for(var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status: 1 };
    }
}



document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}


//ボールの描画
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;;
    ctx.fill();
    ctx.closePath();
}

//パドル(反射バー)の描画
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//壊すブロック群の描画
function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
            var brickX = c*(brickWidth+brickPadding)+brickOffsetLeft; //列
            var brickY = r*(brickHeight+brickPadding)+brickOffsetTop; //行
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);//ブロックの位置（brickXとbrickY）、ブロックの幅（brickWidth）、ブロックの高さ（brickHeight）
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }
}
}

function drawPoints() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("ポイント: " + points, 8, 20);
}

//衝突検出
function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    points += 10; // 各ブロックに当たったときに追加するポイント
                    ballColor = getRandomColor(); // 衝突時にボールの色を変更する
                    if(score == brickRowCount*brickColumnCount) {
                    alert("!YOU WIN!");
                    document.location.reload();
                     clearInterval(interval);   
                }
            }
        }
    }
}
}

function getRandomColor() {
    // ランダムな色を生成する関数
    const letters = '0123456789ABCDEF';//6桁の16進数カラーコード
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawPoints(); // ポイントを描画する関数
    collisionDetection();//ブロックとボールの衝突を検出する。ボールがブロックに衝突した場合、ブロックのstatusを0にし、ボールの色をランダムに変更する。
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
           if(y= y-paddleHeight){
            dy = -dy  ;
			 }
        }
        else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); 
        }
    }
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 10;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 10;
    }
    
    x += dx;
    y += dy;
}

var interval = setInterval(draw, 7);