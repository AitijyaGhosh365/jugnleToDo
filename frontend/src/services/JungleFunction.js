export function generateMapStructure() {
    const TILE_SIZE = 12;
    var map_data = Array.from({ length: TILE_SIZE }, () => Array(TILE_SIZE).fill(1));

    function rsp(grid, start, end) {
        const rows = grid.length;
        const cols = grid[0].length;
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];
        const diagonals = [
            [-1, -1], [1, 1], [1, -1], [-1, 1]
        ];
        const queue = [[start, [start]]];
        const visited = new Set();
        visited.add(start.toString());

        while (queue.length > 0) {
            const [current, path] = queue.shift();
            const [x, y] = current;

            if (x === end[0] && y === end[1]) {
                path.forEach(([px, py]) => {
                    grid[px][py] = 0;
                });

                if (!(x === 0 || y === 0 || x === rows - 1 || y === cols - 1)) {
                    [...directions, ...diagonals].forEach(([dx, dy]) => {
                        const nx = x + dx;
                        const ny = y + dy;
                        if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] === 1) {
                            grid[nx][ny] = 0;
                        }
                    });
                }
                return grid;
            }

            if (Math.random() < 0.6) {
                directions.sort(() => Math.random() - 0.5); // Shuffle the directions
            }

            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && !visited.has([nx, ny].toString())) {
                    visited.add([nx, ny].toString());
                    queue.push([[nx, ny], [...path, [nx, ny]]]);
                }
            }
        }
        return null;
    }

    const waterStartPoint = [
        Math.floor(Math.random() * TILE_SIZE),
        Math.floor(Math.random() * TILE_SIZE)
    ];

    const waterEndPoint = [
        Math.floor(Math.random() * TILE_SIZE),
        Math.floor(Math.random() * TILE_SIZE)
    ];

    map_data = rsp(map_data, waterStartPoint, waterEndPoint);

    map_data = map_data.map(row => row.map(c => String(parseInt(c)).padStart(2, '0')));

    // Generate lists of unique numbers from 2 to 68, formatted as two-digit strings
    const flora_tiles = Array.from({ length: 29 - 2 }, (_, i) => String(i + 2).padStart(2, '0'));
    const animal_tiles = Array.from({ length: 69 - 38 }, (_, i) => String(i + 38).padStart(2, '0'));
    const extras_tiles = Array.from({ length: 36 - 29 }, (_, i) => String(i + 29).padStart(2, '0'));

    // Initialize non_water_tiles as an empty array
    const non_water_tiles = [];

    // Loop through each element in the map_data grid
    for (let i = 0; i < map_data.length; i++) {
        for (let j = 0; j < map_data[i].length; j++) {
            if (map_data[i][j] === '01') {
                // Push the coordinates as a list (array) instead of a tuple
                non_water_tiles.push([i, j]);

                // Replace '01' with a random element from the shuffled list of flora + extras
                map_data[i][j] = Math.random() < 0.1 
                    ? animal_tiles[Math.floor(Math.random() * animal_tiles.length)] 
                    : [...flora_tiles, ...extras_tiles][Math.floor(Math.random() * (flora_tiles.length + extras_tiles.length))];
            }
        }
    }

    non_water_tiles.sort(() => Math.random() - 0.5);

    return {
        map_data: map_data,
        non_water_tiles: non_water_tiles
    }
}

export async function drawMap(genFactor, map_data, non_water_tiles) {

    if (!map_data || !non_water_tiles) {
        console.error("No map data available");
        return null;
    }

    const genFactorValue = parseFloat(genFactor);
    
    // If they are accidentally strings, parse them
    if (typeof map_data === 'string') {
        try {
            map_data = JSON.parse(map_data);
        } catch (e) {
            console.error("Error parsing map_data:", e);
            return null;
        }
    }
    
    if (typeof non_water_tiles === 'string') {
        try {
            non_water_tiles = JSON.parse(non_water_tiles);
        } catch (e) {
            console.error("Error parsing non_water_tiles:", e);
            return null;
        }
    }

    const data = {
        map_data,
        non_water_tiles,
        gen_factor: genFactorValue
    };

    try {
        const response = await fetch('https://jugnletodo.onrender.com/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            return imageUrl;
        } else {
            console.error("Image generation failed:", await response.text());
            return null;
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
}
