// Start New Game
function step(){
    board.tick(); 
}
function run(){
    for(i=0; i<1000; i++){
        board.tick();
        setTimeout(function(){


        }, 500);     
    }
}
function newGame(size) {
    // On selection of mode, create corresponding grids.
    switch (size) {
        case 'small':
            board = new Board(5,5);
            break;
        case 'medium':
            board = new Board(10, 10);
            break;
        case 'large':
        default:
            board = new Board(15, 15);
            break;
    }
    board.render();
    board.gameOver = false;

    $('.space').click(function (eventObject) {
        board.click(eventObject.target);
    });

    return board;
}

// Board Object
function Board(row, col){
    this.row = row;
    this.col = col;   
    this.cells = [];    
    this.endGame = false;    
    this.livigCells = 0;

    this.click = function (target_elem) {
        var row = $(target_elem).attr("data-row");
        var col = $(target_elem).attr("data-col");

        if (this.endGame === true) {
            return;
        }

        if (this.cells[row - 1][col - 1].actual == 1) {
            this.cells[row - 1][col - 1].actual=0;
            console.log(this.cells[row - 1][col - 1].actual);
            this.clear(row-1,col-1);            
        }
        else if (this.cells[row - 1][col - 1].actual == 0) {            
            this.cells[row - 1][col - 1].actual=1;
            console.log(this.cells[row - 1][col - 1].actual);
            this.clear(row-1,col-1);
        } 
    }

    this.render = function() {
        var cells = "";
        for (i = 1; i <= row; i++) {
            for (j = 1; j <= col; j++) {
                cells = cells.concat('<div class="space" data-row="' + i + '" data-col="' + j + '">&nbsp;</div>');
            }
            cells = cells.concat('<br />');
        }
        $('#board').empty();
        $('#board').append(cells);
    }
    this.tick = function(){                
        size = this.row;
        for(i=0; i<size; i++)
            for(j=0; j<size; j++){
                //Count neighbors 
                neighbors = 0;
                for (y=-1; y<=1; y++){
                    if(!(i+y<0 || i+y>=size))
                    for(x=-1; x<=1; x++){                
                        if(!(j+x<0 || j+x>=size))
                            if(!(x==0 && y==0))
                                if(this.cells[i+y][j+x].actual==1)
                                    neighbors++;
                    }
                }
                this.cells[i][j].next = this.cells[i][j].actual;
                //Check rules.
                //Under population and over population             
                if(neighbors<2 || neighbors>3)
                    this.cells[i][j].next=0;
                //Alive or reproduction
                if(neighbors==3)
                    this.cells[i][j].next = 1;
            }
        for (i=0; i<size; i++)
            for(j=0; j<size; j++){
                this.cells[i][j].actual = this.cells[i][j].next;
                this.clear(i, j);
            }

    }    
    //Initializing the Object

    if (this.cells !== undefined) {
        this.cells = new Array(this.row);

        for (i = 0; i < this.row; i++) {
            this.cells[i] = new Array(this.col);
            for (j = 0; j < this.col; j++) {
                this.cells[i][j] = new Cell(0,0);
            }
        }
    }

    this.clear = function (row, col) {
        var dom_target = 'div[data-row="' + (row + 1) + '"][data-col="' + (col + 1) + '"]';        
        if(this.cells[row][col].actual==1){
            $(dom_target).css({"background-color":"green"});                        
        }else{
            $(dom_target).css({"background-color":"red"});                        
        }        
        $(dom_target).html('&nbsp');                                
    }

    
}

//Cell Object
function Cell(actual, next){
    this.actual = actual;
    this.next = next;
}