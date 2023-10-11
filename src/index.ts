// Get references to HTML elements
const board = document.querySelector('.game-container') as HTMLElement;
const button = document.querySelector('.button') as HTMLElement;
const winMessage = document.querySelector('.winner') as HTMLElement;

// Track the number of filled boxes
let filledBoxesCount: number = 0; 

// Define a type for the current turn
type Turn = "X" | "O" | "";

// Initialize the first turn
let turn: Turn = "X";

// Function to listen for clicks on the game board
function listenBoard(): void {
    board.addEventListener('click', runGame);
}

// Main function to set up the game
function main(): void {
    createBoard();
    listenBoard();
}

// Function to handle a move when a box is clicked
function runGame(e: Event): void {
    const boxId: string | null = (<HTMLElement>e.target).id;

    // Check if boxId is null (e.g., clicked outside of a box)
    if (boxId === null) return;

    const box: HTMLElement | null = document.querySelector(`#${boxId}`);

    // Check if box is null or already filled
    if (box === null || box.textContent !== "") return;

    // Fill the box with the current player's symbol
    box.textContent = turn;

    // Change the box background to indicate the player's symbol
    changeBoxBackground(box);

    filledBoxesCount++; // Increment filled box count

    // Check if there is a winner
    const winner: boolean = checkWinner();

    if (!winner) {
        // If no winner and all boxes are filled, it's a tie
        if (filledBoxesCount === 9) {
            endGame("No winners :("); // Display tie game message
        } else {
            // If no winner and not a tie, switch to the next player's turn
            switchPlayer();
        }
    } else {
        // If there is a winner, end the game
        endGame(`Winner is ${turn}!!!`);
    }
}

// Function to change the box background based on the current player's turn
function changeBoxBackground(box: HTMLElement): void {
    if (turn === "X") {
        box.classList.replace("box", "x");
    } else {
        box.classList.replace("box", "o");
    }
}

// Function to end the game with an optional message
function endGame(message: string = ""): void {
    board.removeEventListener('click', runGame);
    button.addEventListener('click', resetGame);

    // Display the message
    if (winMessage === null) return;
    winMessage.textContent = message;
    winMessage.style.display = 'block';

    button.style.visibility = 'visible';
}

// Function to reset the game
function resetGame(): void {
    // Reset the turn to "X"
    turn = "X";

    // Clear the boxes and reset the board
    resetBoxes();

    // Reset filledBoxesCount
    filledBoxesCount = 0;

    // Hide the button and winner message
    button.style.visibility = "hidden";
    winMessage.textContent = "";

    // Add click event listener back to the board
    board.addEventListener('click', runGame);
}

// Function to reset all the boxes on the board
function resetBoxes(): void {
    for (let i = 0; i <= 8; i++) {
        const box = document.querySelector(`#box-${i}`) as HTMLElement;
        box.textContent = "";
        const boxClass: string = box.className;
        box.classList.remove(boxClass);
        void box.offsetWidth;
        box.classList.add("box");
    }
}

// Function to check if there is a winner
function checkWinner(): boolean {
    const boxes: Array<string> = getBoxes();
    const winningCombinations: number[][] = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]            // Diagonals
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (boxes[a] !== "" && boxes[a] === boxes[b] && boxes[b] === boxes[c]) {
            return true; // Found a winning combination
        }
    }

    return false; // No winning combinations found
}

// Function to get the content of all the boxes on the board
function getBoxes(): Array<string> {
    const boxesContent: Array<string> = [];
    for (let i = 0; i < 9; i++) {
        const box = document.querySelector(`#box-${i}`) as HTMLElement;
        const boxContent: string | null = box.textContent;
        if (boxContent === null) boxesContent.push("");
        else {
            boxesContent.push(boxContent);
        }
    }
    return boxesContent;
}

// Function to switch the current player's turn
function switchPlayer(): void {
    if (turn == "X") {
        turn = "O"
    } else {
        turn = "X"
    }
}

// Function to create the game board with boxes
function createBoard(): void {
    for (let i = 0; i < 9; i++) makeBox(i)
}

// Function to create a single box element
function makeBox(i: number): void {
    const box: HTMLDivElement = document.createElement('div');
    box.className = 'box';
    box.id = `box-${i}`;
    box.textContent = '';
    board.append(box);
}

// Start the game by calling the main function
main();
