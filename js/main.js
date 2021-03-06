const start = document.querySelector(".start");
const menu = document.querySelector(".menu-game");
const main = document.querySelector(".main");
const setting_btn = document.querySelector(".setting-btn");
var myGamePiece=[];
var myPreviusPieceX=[];
var myPreviusPieceY=[];
var alive = true;
var bait;
var length = 3;
var step = 20;
var random = 0;
var random2 = 0;

var moveLeft=true;
var moveRight=true;
var moveUp=true;
var moveDown = true;

start.addEventListener('click',startGame)
setting_btn.addEventListener('click',startGame)

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        // xác định độ rộng của vùng game
        this.canvas.width = 400;

        // xác định độ cao của vùng game
        this.canvas.height = 400;
        
      
        // nội dung bên trong của vùng không gian này là các thứ được vẽ từ đối tượng getContext("2d")
        this.context = this.canvas.getContext("2d");
        //Method start() tạo ra 1 <canvas> và chèn nó như childnode đầu tiên của <body>
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        if(alive)
        {
        this.interval = setInterval(updateGameArea, 300);
        }
        else
        {
            document.getElementsByTagName('canvas').style.display="none";
        }
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function startGame(){
    menu.style.display = "none";
    setting_btn.style.display = " ";
    main.style.display = "none";
    myGameArea.start();
    random = Math.floor(Math.random() * (400 - 0 +10)) + 0;
    random2 = Math.floor(Math.random() * (400 - 0 +10)) + 0;
    bait = new component(20,20,"black",random,random2);
    myGamePiece[0] = new component(20,20,"red",80,200);
    for(i=1;i<length;i++)
    {
    myGamePiece[i] = new component(20,20,"blue",myGamePiece[i-1].x-20,200);
    }
}    
function component(width, height, color, x, y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    cxt = myGameArea.context;
    cxt.fillStyle = color;
    cxt.fillRect(this.x,this.y,this.width,this.height);

    this.speedX = 0;
    this.speedY = 0;
    this.update = function(){
        
        
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.x >= myGameArea.canvas.width)
        {
            this.x=0;
        }
        else if(this.x <= 0)
        {
            this.x=myGameArea.canvas.width;
        }
        else if(this.y >= myGameArea.canvas.height)
        {
            this.y=0;
        }else if(this.y <= 0)
        {
            this.y=myGameArea.canvas.height;
        }
        
    }

    this.newPos = function() {
    	// toạ độ mới của khối hình bằng toạ độ cũ cộng với chỉ số tốc độ tương ứng
        // toạ độ x mới bằng toạ độ x cũ cộng với speedX
        this.x += this.speedX;
        //toạ độ y mới bằng toạ độ y cũ cộng với speedY
        this.y += this.speedY;
    }
}

function moveup(snake) {
	// mỗi khi di chuyển khối hình lên trên thì toạ độ y sẽ bị giảm đi 1, tương ứng với  việc speedY giảm đi 1.
    snake.speedY = -step;
    snake.speedX = 0;
    canMove(true,true,true,false);
}

// hàm chuyển động xuống
function movedown(snake) {
	// mỗi khi di chuyển khối hình xuống dưới thì toạ độ y sẽ tăng lên 1, tương ứng với  việc speedY tăng thêm 1.
    snake.speedY = step;
    snake.speedX = 0;
    canMove(true,true,false,true);
}

// hàm sang trái
function moveleft(snake) {
	// mỗi khi di chuyển khối hình sang trái thì toạ độ x sẽ giảm đi 1, tương ứng với  việc speedX giảm đi 1.
    snake.speedX = -step;
    snake.speedY = 0;
    canMove(true,false,true,true);
}

// hàm sang phải
function moveright(snake) {
	// mỗi khi di chuyển khối hình sang phải thì toạ độ x sẽ tăng lên 1, tương ứng với  việc speedX tăng lên 1.
    snake.speedX = step;
    snake.speedY = 0;
    canMove(false,true,true,true);
}
function updateGameArea() {
    myGameArea.clear();

    for(i=0;i<length;i++)
    {
    myPreviusPieceX[i]=myGamePiece[i].x;
    myPreviusPieceY[i]=myGamePiece[i].y;
    }

    for(i=1;i<length;i++)
    {
    myGamePiece[i].x=myPreviusPieceX[i-1];
    myGamePiece[i].y=myPreviusPieceY[i-1];

    if(checkImpact(myGamePiece[0],myGamePiece[i]))
    {
        console.log("chết");
    }
    myGamePiece[i].update();
    }

    myGamePiece[0].newPos();
    myGamePiece[0].update();

    if(checkImpact(bait,myGamePiece[0]))
    {
      
        bait.x=Math.floor(Math.random() * (400 - 0 +10)) + 0;
        bait.y=Math.floor(Math.random() * (400 - 0 +10)) + 0;
        length++;
        myGamePiece[length-1] = new component(20,20,"green",myGamePiece[length-2].x,myGamePiece[length-2].y);
        bait.update();
    }
    else
    {
    bait.x=bait.x;
    bait.y=bait.y;
    bait.update();
    }
   
    // mỗi lần update Game ta sẽ gọi hàm newPos 1 lần để xác định lại vị trí của khối hình sau mỗi lần thay đổi.
   

}

window.addEventListener("keydown", function(event) {
    switch(event.key)
    {
        case 'ArrowLeft':
            if(moveLeft){moveleft(myGamePiece[0]);}
            
        break;
        case 'ArrowUp':
            if(moveUp){moveup(myGamePiece[0]);}
        break;
        case 'ArrowRight':
            if(moveRight){moveright(myGamePiece[0]);}
        break;
        case 'ArrowDown':
            if(moveDown){movedown(myGamePiece[0]);}  
        break;
    }
    console.log(moveLeft);
})

function checkImpact(object,another)
{
    var left = object.x - (another.x + another.width);
	var top = (object.y + object.height) - another.y;
	var right = (object.x + object.width) - another.x;
	var bottom = object.y - (another.y + another.height);

    return !(left >= -0.1 || right <= -0.1 || top <= -0.1 || bottom >= -0.1);
}
function openMenu(){
    menu.style.display = "block";
}

function canMove(left,right,up,down){
    moveLeft = left;
    moveRight = right;
    moveUp = up;
    moveDown = down;
}
