type Positions = Array<Array<number>>

class Grid {
    static GRID_SIZE = 9
    static BOX_SIZE = 3
    constructor(public positions: Positions) {}

    clone(): Grid {
        return new Grid(this.positions.map(row => row.concat()))
    }

    foundInSeries(num: number, colOrRow: number, isRow: boolean) {
        for (let i = 0; i < Grid.GRID_SIZE; i++) {
            if (this.positions[isRow ? colOrRow : i][isRow ? i : colOrRow] === num) {
                return true
            }
        }
        return false
    }

    foundInBox(num: number, row: number, col: number) {
        const boxRow = row - (row % Grid.BOX_SIZE)
        const boxCol = col - (col % Grid.BOX_SIZE)
        for (let i = 0; i < Grid.BOX_SIZE; i++) {
            for (let j = 0; j < Grid.BOX_SIZE; j++) {
                if (this.positions[i + boxRow][j + boxCol] === num) {
                    return true
                }
            }
        }
        return false
    }

    canMove(num: number, row: number, col: number) {
        return !this.foundInSeries(num, row, true) && !this.foundInSeries(num, col, false) && !this.foundInBox(num, row, col)
    }

    makeMove(num: number, row: number, col: number) {
        this.positions[row][col] = num
        return this
    }

    nextOpenSpace() {
        for (let i = 0; i < Grid.GRID_SIZE; i++) {
            for (let j = 0; j < Grid.GRID_SIZE; j++) {
                if (this.positions[i][j] === 0) {
                    return [i, j]
                }
            }
        }
        return null
    }

    print() {
        this.positions.forEach(row => {
            console.log(row.join(' '))
        })
    }
}

const startingGrid = new Grid([
    [9,4,0,0,0,0,0,0,0],
    [0,0,3,0,0,7,0,0,0],
    [5,0,7,0,2,0,0,0,6],
    [0,0,6,0,9,0,0,4,0],
    [0,0,0,5,7,4,0,0,0],
    [0,5,0,0,1,0,3,0,0],
    [1,0,0,0,4,0,7,0,2],
    [0,0,0,6,0,0,8,0,0],
    [0,0,0,0,0,0,0,9,1]
])

function solve(grid: Grid): false | Grid {
    let nextSpaceToTry = grid.nextOpenSpace()
    if (!nextSpaceToTry) {
        return grid
    }
    const [rowToTry, colToTry] = nextSpaceToTry
    for (let numToTry = 1; numToTry <= Grid.GRID_SIZE; numToTry++) {
        if (grid.canMove(numToTry, rowToTry, colToTry)) {
            const result = solve(grid.clone().makeMove(numToTry, rowToTry, colToTry))
            if (result) {
                return result
            }
        }
    }
    return false
}

const resultGrid = solve(startingGrid)
if (resultGrid) {
    resultGrid.print()
} else {
    console.log('No solutions')
}
