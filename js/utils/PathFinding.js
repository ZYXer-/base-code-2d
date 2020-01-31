import PriorityQueue from "./PriorityQueue.js";


class PathFinding {


    constructor(start, end, directions, isFreeCallback) { // directions = 4, 6 or 8. If 6 assuming hex-tiles where odd rows are offset to the right

        this.isFreeCallback = isFreeCallback;

        this.setupGrid(start, end);

        this.start = { x : (start.x - this.gridMinX), y : (start.y - this.gridMinY) };
        this.end = { x : (end.x - this.gridMinX), y : (end.y - this.gridMinY) };

        let nodeQueue = new PriorityQueue(node => {
            return node.f;
        });

        nodeQueue.push(this.grid[this.start.x][this.start.y]);

        while(nodeQueue.size() > 0) {

            let currentNode = nodeQueue.pop();

            if(currentNode.x === this.end.x && currentNode.y === this.end.y) {
                let path = [];
                while(currentNode.parent !== null) {
                    path.push({ x : (currentNode.x + this.gridMinX), y : (currentNode.y + this.gridMinY) });
                    currentNode = currentNode.parent;
                }
                return path.reverse();
            }

            currentNode.processed = true;

            let neighbors = this.getNeighbors(currentNode, directions);

            for(let i in neighbors) {
                let neighbor = neighbors[i];

                let gScore = currentNode.g + neighbor.tempCost;
                let beenVisited = neighbor.visited;

                if(!beenVisited || gScore < neighbor.g) {

                    let xDistance = Math.abs(neighbor.x - this.end.x);
                    let yDistance = Math.abs(neighbor.y - this.end.y);
                    let hScore;
                    if(xDistance > yDistance) {
                        hScore = (1414 * yDistance) + (1000 * (xDistance - yDistance));
                    } else {
                        hScore = (1414 * xDistance) + (1000 * (yDistance - xDistance));
                    }

                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = hScore;
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if(!beenVisited) {
                        nodeQueue.push(neighbor);
                    } else {
                        nodeQueue.rescore(neighbor);
                    }
                }
            }
        }

        return [];
    }


    setupGrid(start, end) {

        if(start.x < end.x) {
            this.gridMinX = start.x;
            this.gridMaxX = end.x;
        } else {
            this.gridMinX = end.x;
            this.gridMaxX = start.x;
        }

        if(start.y < end.y) {
            this.gridMinY = start.y;
            this.gridMaxY = end.y;
        } else {
            this.gridMinY = end.y;
            this.gridMaxY = start.y;
        }

        this.gridMinX -= PathFinding.GRID_PADDING_SIZE;
        this.gridMaxX += PathFinding.GRID_PADDING_SIZE;
        this.gridMinY -= PathFinding.GRID_PADDING_SIZE;
        this.gridMaxY += PathFinding.GRID_PADDING_SIZE;

        this.gridWidth = 1 + this.gridMaxX - this.gridMinX;
        this.gridHeight = 1 + this.gridMaxY - this.gridMinY;

        this.grid = [];
        for(let x = 0; x < this.gridWidth; x++) {
            this.grid[x] = [];
            for(let y = 0; y < this.gridHeight; y++) {
                this.grid[x][y] = {
                    x : x,
                    y : y,
                    f : 0,
                    g : 0,
                    h : 0,
                    tempCost : 0,
                    processed : false,
                    visited : false,
                    checkedIfFree : false,
                    free : true,
                    parent : null
                };
            }
        }
    }


    getNeighbors(node, directions) {

        let neighbors = [];

        if(directions === 6) {

            for(let dir = 0; dir < directions; dir++) {

                let odd = (node.y + this.gridMinY) % 2;

                let newX = node.x + PathFinding.HEX_NEIGHBOR_X[odd][dir];
                let newY = node.y + PathFinding.HEX_NEIGHBOR_Y[odd][dir];

                if(newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {

                    if(!this.grid[newX][newY].checkedIfFree) {
                        this.grid[newX][newY].free = this.isFreeCallback(newX + this.gridMinX, newY + this.gridMinY);
                    }

                    if(!this.grid[newX][newY].processed && this.grid[newX][newY].free) {
                        this.grid[newX][newY].tempCost = 1;
                        neighbors.push(this.grid[newX][newY]);
                    }
                }
            }

        } else {

            for(let dir = 0; dir < directions; dir++) {

                let newX = node.x + PathFinding.NEIGHBOR_X[dir];
                let newY = node.y + PathFinding.NEIGHBOR_Y[dir];

                if(newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {

                    if(!this.grid[newX][newY].checkedIfFree) {
                        this.grid[newX][newY].free = this.isFreeCallback(newX + this.gridMinX, newY + this.gridMinY);
                    }

                    if(!this.grid[newX][newY].processed && this.grid[newX][newY].free) {
                        this.grid[newX][newY].tempCost = PathFinding.NEIGHBOR_COST[dir];
                        neighbors.push(this.grid[newX][newY]);
                    }
                }
            }
        }

        return neighbors;
    }

}


PathFinding.HEX_NEIGHBOR_X = [[  0,  1,  0, -1, -1, -1 ], [  0,  1,  0, -1,  1,  1 ]];
PathFinding.HEX_NEIGHBOR_Y = [[ -1,  0,  1,  0,  1, -1 ], [ -1,  0,  1,  0, -1,  1 ]];

PathFinding.NEIGHBOR_X = [  0,  1,  0, -1,  1,  1, -1, -1 ];
PathFinding.NEIGHBOR_Y = [ -1,  0,  1,  0, -1,  1,  1, -1 ];
PathFinding.NEIGHBOR_COST = [ 1000, 1000, 1000, 1000, 1414, 1414, 1414, 1414 ];

PathFinding.GRID_PADDING_SIZE = 10;


export default PathFinding;