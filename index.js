function generateRandomTestCases() {
    const gridSize = 9;
    const sudokuGrid = document.getElementById("sudoku-grid");

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            // Generate a random number between 1 and 9 for each cell
            const randomValue = Math.floor(Math.random() * 9) + 1;
            cell.value = randomValue;
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const res_btn=document.getElementById("reset-btn");
    const solveButton = document.getElementById("solve-btn");
    solveButton.addEventListener('click', solveSudoku);

    let sudokuGrid = document.getElementById("sudoku-grid");
    // Create the sudoku grid and input cells
    res_btn.addEventListener('click', function(){
        location.reload();
    });
    for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr");
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
});

async function solveSudoku() {
    const gridSize = 9;
    const sudokuArray = [];

    // Fill the sudokuArray with input values from the grid
    for (let row = 0; row < gridSize; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            if (cellValue === "" || (parseInt(cellValue) >= 1 && parseInt(cellValue) <= 9)) {
                sudokuArray[row][col] = cellValue === "" ? '.' : parseInt(cellValue);
            } else {
                alert("Invalid input. Please enter numbers from 1 to 9.");
                return; // Exit the function
            }
        }
    }


    // Check if the input Sudoku is valid
    console.log(sudokuArray);
    var chk=isValidSudoku(sudokuArray);
    if (!chk) {
        console.log(chk);
        alert("The input Sudoku puzzle is not valid.");
        return;
    }
    
    // Identify user-input cells and mark them
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if (sudokuArray[row][col] !== '.') {
                cell.classList.add("user-input");
            }
        }
    }

    // Solve the sudoku and display the solution
    if (solveSudokuHelper(sudokuArray)) {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Fill in solved values and apply animation
                if (!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(20); // Add a delay for visualization
                }
            }
        }
    } else {
        alert("No solution exists for the given Sudoku puzzle.");
    }
}

// Rest of the code (solveSudokuHelper, isValidMove, sleep) remains the same
function isValidSudoku(board) {
    const gridSize = 9;

    // Check rows and columns for duplicates
    for (let i = 0; i < gridSize; i++) {
        const rowSet = new Set();
        const colSet = new Set();

        for (let j = 0; j < gridSize; j++) {
            const rowVal = board[i][j];
            const colVal = board[j][i];

            if (rowVal !== "." && rowSet.has(rowVal)) {
                return false;
            }
            rowSet.add(rowVal);

            if (colVal !== "." && colSet.has(colVal)) {
                return false;
            }
            colSet.add(colVal);
        }
    }

    // Check subgrids for duplicates
    for (let i = 0; i < gridSize; i += 3) {
        for (let j = 0; j < gridSize; j += 3) {
            const subgridSet = new Set();

            for (let r = i; r < i + 3; r++) {
                for (let c = j; c < j + 3; c++) {
                    const subgridVal = board[r][c];

                    if (subgridVal !== "." && subgridSet.has(subgridVal)) {
                        return false;
                    }
                    subgridSet.add(subgridVal);
                }
            }
        }
    }

    return true; // If all checks pass, the Sudoku is valid
}

function solveSudokuHelper(board) {
    const gridSize = 9;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === '.') {
                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;

                        // Recursively attempt to solve the Sudoku
                        if (solveSudokuHelper(board)) {
                            return true; // Puzzle solved
                        }

                        board[row][col] = '.'; // Backtrack
                    }
                }
                return false; // No valid number found
            }
        }
    }

    return true; // All cells filled
}

function isValidMove(board, row, col, num) {
    const gridSize = 9;

    // Check row and column for conflicts
    for (let i = 0; i < gridSize; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false; // Conflict found
        }
    }

    // Check the 3*3 subgrid for conflicts
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) {
                return false; // Conflict found
            }
        }
    }

    return true; // No conflicts found
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}









