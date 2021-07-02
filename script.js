const board_border = 'black';
const board_background = 'lightgreen';
const snake_col = '#BEBEBE';
const snake_border = 'black';


let snake =  [ 
    {x:200, y:200},
    {x:190, y:200},
    {x:180, y:200},
    {x:170, y:200},
    {x:160, y:200}
];

let score = 0;

// true if changing direction
let changing_direction =false;
//horizontal velocity
let dx = 10;
//vetical velocity
let dy = 0;

// snake food
let food_x;
let food_y;

// game speed 
let speed = 100;


/* //move directions
const goingUp = dy === -10;
const goingDown = dy === 10;
const goingRight = dx === 10;
const goingLeft = dx === -10;
 */

const snakeboard = document.getElementById('snakeboard');
const snakeboard_ctx= snakeboard.getContext('2d');
const playBtn = document.getElementById('playBtn');
const restartBtn = document.getElementById('restartBtn');
const gameOver = document.getElementById('game-over');
const canvas = document.querySelector('.canvas');

playBtn.addEventListener('click',playGame);

function playGame(){
    main();
    gen_food();
    document.addEventListener('keydown', change_direction);    
}

function main(){
    
    if (has_game_ended()){
        /* alert('Game over ! 😥, \nRefresh to play again 😁'); */

        gameOver.classList.add('show')
        restartBtn.addEventListener('click', () =>{
            window.location.reload();
        })
        return;
    }

    changing_direction = false;
    
    setTimeout(
        function onTick() {
            clearCanvas();
            drawFood();
            move_snake();
            drawSnake();
            
            // call main again
            main();
        }, 100 )
}


function clearCanvas() {
        //  Select the colour to fill the drawing
        snakeboard_ctx.fillStyle = board_background;
        //  Select the colour for the border of the canvas
        snakeboard_ctx.strokestyle = board_border;
        // Draw a "filled" rectangle to cover the entire canvas
        snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
        // Draw a "border" around the entire canvas
        snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawSnake(){
    snake.forEach(drawSnakePart);
}

function drawFood(){
    snakeboard_ctx.fillStyle = 'red';
    snakeboard_ctx.strokeStyle = 'darkred';
    snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
    snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

function drawSnakePart(snakePart){
    snakeboard_ctx.fillStyle = snake_col;
    snakeboard_ctx.strokeStyle = snake_border;
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10,10);
}

function has_game_ended (){
    for(let i = 4; i < snake.length; i++){
        const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;

        if(has_collided) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall 
}

function random_food(min, max){
    return Math.round((Math.random() * (max-min) + min) /10) *10;
}

function gen_food(){
    food_x = random_food(0, snakeboard.width -10);
    food_y = random_food(0, snakeboard.height - 10);
    snake.forEach(
        function has_snake_eaten_food(part){
            const has_eaten = part.x == food_x && part.y == food_y ;
            if(has_eaten) gen_food();
        }
    );
}

/* var startingX, startingY, movingX, movingY; 
function touchStart(e) {
    // e.preventDefault();
    startingX = e.touches[0].clientX;
    startingY = e.touches[0].clientY;
}
function touchMove(e) {
    // e.preventDefault();
    movingX = e.touches[0].clientX;
    movingY = e.touches[0].clientY;
}

function touchEnd() {
    if ((startingX + 100 < movingX) && !goingLeft) {
        dx = 10;
        dy = 0;
        console.log("right");
    } 
    if ((startingX - 100 > movingX) && !goingRight) {
        dx = -10;
        dy = 0;
        console.log("left");
    }
    
    if((startingY + 100 < movingY) && !goingUp){
        dx = 0;
        dy = 10;
        console.log("down");
    } 
    if ((startingY - 100 > movingY) && !goingDown) {
        dx = 0;
        dy = -10;
        console.log("up");
    }
    return "no touch direction";
} */

    
// Change Snake direction
function change_direction(e){
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40; 

    // Prevent the snake from reversing
    if(changing_direction) return;
    changing_direction = true;

    const keyPressed = e.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10; 

    if(keyPressed === LEFT_KEY && !goingRight){
        dx = -10;
        dy = 0;
    }

    if(keyPressed === UP_KEY && !goingDown){
        dx = 0;
        dy = -10;
    }
    
    if(keyPressed === RIGHT_KEY && !goingLeft){
        dx = 10;
        dy = 0;
    }

    if(keyPressed === DOWN_KEY && !goingUp){
        dx = 0;
        dy = 10;
    }

}

function move_snake(){
    // Creating the new Snake's head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // Add the new head to the beginning of the snake
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    if(has_eaten_food){
        //increase the score 
        score += 10;
        // display score on screen
        document.getElementById('score').innerHTML = score;
        // generate new food
        gen_food();
    }else{
        // remove the kast part of the snake body
        snake.pop();    
    }
    
 }




