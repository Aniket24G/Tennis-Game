//variable initilization
var canvas;
var canvasContext;
var ballX = 300;
var ballY = 300;
var ballSpeedX = 10;
var ballSpeedY = 5;
var paddle1Y = 250;
var paddle2Y = 250;
const paddle_Height = 100;
const paddle_Thickness = 20;
var p1Score = 0;
var p2Score = 0;
const winner_Score = 11;
var pickWinner = false;

//function to draw net

function drawNet() {
    for (let i = 0; i< canvas.clientHeight; i+=40){
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(canvas.clientWidth/2-1,i,2,20);
        }
}


//function to draw the board, balls and the paddles

function drawEverything() {
    //winner annoouncement
    if(pickWinner){
        canvasContext.fillStyle = 'white';
        if(p1Score >= winner_Score){
            canvasContext.fillText("left player won",200,200)
        } else if (p2Score>= winner_Score) {
            canvasContext.fillText("right player won",200,200)
        }
            canvasContext.fillText("click to continue",500,200);
        return;
    }
        
    
    //play ground area
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0,10,canvas.clientWidth,canvas.clientHeight);

    //function call to draw net
    drawNet();
    
    //left player paddle
    canvasContext.fillStyle= 'white';
    canvasContext.fillRect(0,paddle1Y,paddle_Thickness,paddle_Height);
    
    //right player paddle
    canvasContext.fillStyle= 'white';
    canvasContext.fillRect(canvas.clientWidth-paddle_Thickness,paddle2Y,paddle_Thickness,paddle_Height);

    //circular ball design
    canvasContext.fillStyle = 'white';
    canvasContext.beginPath();
    canvasContext.arc(ballX,ballY,10,0,Math.PI*2,true);
    canvasContext.fill();

    //drawing score cards
    canvasContext.fillText(p1Score,100,100);
    canvasContext.fillText(p2Score,canvas.clientWidth-100,100);
}

function ballReset() {
    if(p1Score >= winner_Score || p2Score>= winner_Score) {
        pickWinner = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.clientWidth/2;
    ballY = canvas.clientHeight/2;
}

function computerMove() {
    var paddle2YCenter = paddle2Y + (paddle_Height/2);
    if (paddle2YCenter < ballY-25) {
        paddle2Y += 5;
    } else if(paddle2YCenter> ballY+25) {
        paddle2Y -= 5;
    }
}

function moveEverything() {
    if(pickWinner){
        return;
    }
    computerMove();
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;
    if (ballX > canvas.clientWidth) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddle_Height) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY-(paddle2Y+paddle_Height/2);
            ballSpeedY = deltaY * 0.35;
        } else{
            p1Score++; //scores must be updated before the ball resets to check for winning condition
            ballReset();
        }
    }
    if(ballX<0){
        if (ballY > paddle1Y && ballY < paddle1Y + paddle_Height) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY-(paddle1Y+paddle_Height/2);
            ballSpeedY = deltaY * 0.35;
        } else{
            p2Score++;
            ballReset();
        }
    }
    if (ballY > canvas.clientHeight || ballY < 25) {
        ballSpeedY = -ballSpeedY;
    }
}

function move() {
    moveEverything();
    drawEverything();
}

function handleClick(event) {
    if(pickWinner){
        p1Score = 0;
        p2Score = 0;
        pickWinner = false;
    }
}

function mousePos(event) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

window.onload = function name(params) {
    canvas = document.getElementById('playGround');
    canvasContext = canvas.getContext('2d');
    var frameRate = 30;
    setInterval(() => {
        move();
    }, 1000/frameRate);

    canvas.addEventListener('mousedown',handleClick);

    canvas.addEventListener('mousemove', 
    function(event){
        var myMousePos = mousePos(event);
        paddle1Y = myMousePos.y-(paddle_Height/2);
    })
}


