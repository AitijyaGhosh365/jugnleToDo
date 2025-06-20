from PIL import Image, ImageOps
import random
from collections import deque
import os

def generate_image(map_data, tiles_to_change, gen_factor):
    # print(gen_factor)
    factor = 5

    water_img = Image.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'assets', '00.png'))
    grass_img = Image.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'assets', '01.png'))

    flora_tiles = [f"{i:02}" for i in range(2, 29)]
    animal_tiles = [f"{i:02}" for i in range(38, 69)]
    extras_tiles = [f"{i:02}" for i in range(29, 36)]

    display = Image.new("RGBA", (300 * factor, 300 * factor), (0, 0, 0, 0))
    tiles_to_change = tiles_to_change[:int(len(tiles_to_change) * gen_factor)]

    # Draw the map
    for y, row in enumerate(map_data):
        for x, tile in enumerate(row):
            position = (150 * factor + x * 10 * factor - y * 10 * factor, 
                        100 * factor + x * 5 * factor + y * 5 * factor)
            
            img = water_img if map_data[y][x] == "00" else grass_img
            display.paste(img, position, img)
            
            if (map_data[y][x] not in ["00", "01"] and [y, x] in tiles_to_change) or (map_data[y][x] in extras_tiles):
                chosen_entity = Image.open(os.path.join(
                    os.path.dirname(os.path.abspath(__file__)), 'static', 'assets', f"{map_data[y][x]}.png"))
                
                if map_data[y][x] in animal_tiles and random.random() < 0.5:
                    chosen_entity = ImageOps.mirror(chosen_entity)
                
                _, tree_height = chosen_entity.size
                tree_position = (position[0] + 2 * factor, position[1] + 8 * factor)
                adjusted_position = (tree_position[0] - 3 * factor, 
                                   tree_position[1] - 1 * factor - tree_height)
                display.paste(chosen_entity, adjusted_position, chosen_entity)

    # --- Crop the excess part of the image ---
    # Get the bounding box of non-transparent pixels
    bbox = display.getbbox()
    
    if bbox:  # If there's content to crop
        display = display.crop(bbox)  # Crop to the bounding box

    return display


if __name__ == "__main__":
    TILE_SIZE = 12 
    GEN_FACTOR = 0.6
    
    map_data = [[1 for i in range(TILE_SIZE)] for j in range(TILE_SIZE)]

    def rsp(g, s, e):
        r, c = len(g), len(g[0])
        d = [(-1,0), (1,0), (0,-1), (0,1)]
        q = deque([(s, [s])])
        v = {s}
        
        while q:
            (x, y), p = q.popleft()
            if (x, y) == e:
                for px, py in p:
                    g[px][py] = 0
                if not (x==0 or y==0 or x==r-1 or y==c-1):
                    for dx, dy in d + [(-1,-1),(1,1),(1,-1),(-1,1)]:
                        nx, ny = x+dx, y+dy
                        if 0<=nx<r and 0<=ny<c and g[nx][ny]==1:
                            g[nx][ny] = 0
                return g
            
            if random.random() < 0.6:
                random.shuffle(d)
                
            for dx, dy in d:
                nx, ny = x+dx, y+dy
                if 0<=nx<r and 0<=ny<c and (nx,ny) not in v:
                    v.add((nx,ny))
                    q.append(((nx,ny), p+[(nx,ny)]))
        return None





    water_start_point = (random.randint(0,TILE_SIZE-1),random.randint(0,TILE_SIZE-1))
    water_end_point = (random.randint(0,TILE_SIZE-1),random.randint(0,TILE_SIZE-1))
    map_data = rsp(map_data, water_start_point, water_end_point)

    map_data = [[f"{int(c):02}" for c in row] for row in map_data]

    # f = open(r'D:\Programming\Projects\gardentToDo\py-scripts\static\extras\map.txt')
    # map_data = [[f"{int(c):02}" for c in row] for row in f.read().split('\n')]
    # f.close()

    # Generate a list of unique numbers from 2 to 68
    flora_tiles = [f"{i:02}" for i in range(2, 29)]
    animal_tiles = [f"{i:02}" for i in range(38, 69)]
    extras_tiles = [f"{i:02}" for i in range(29, 36)]

    non_water_tiles = []

    # Iterate through the map_data and replace '01' with random numbers
    for i in range(len(map_data)):
        for j in range(len(map_data[i])):
            if map_data[i][j] == '01':
                non_water_tiles.append((i,j))
                # Replace '01' with a random number from the shuffled list
                map_data[i][j] = random.choice(flora_tiles+extras_tiles)
                
                if random.random()<0.1:
                    map_data[i][j] = random.choice(animal_tiles)
                
                
    random.shuffle(non_water_tiles)
    
    non_water_tiles = [list(i) for i in non_water_tiles]
    # map_data = [['13', '13', '07', '06', '02', '31', '19', '11', '12', '63', '34', '57'], ['32', '13', '35', '20', '07', '11', '17', '02', '10', '20', '28', '26'], ['31', '07', '26', '23', '07', '21', '34', '47', '26', '00', '00', '00'], ['17', '25', '43', '35', '06', '26', '21', '41', '52', '00', '00', '00'], ['02', '16', '21', '30', '28', '68', '20', '00', '00', '00', '00', '00'], ['27', '23', '10', '13', '34', '57', '07', '00', '19', '35', '24', '28'], ['27', '49', '24', '15', '33', '13', '26', '00', '61', '12', '02', '23'], ['22', '02', '24', '24', '25', '14', '34', '13', '67', '35', '30', '29'], ['28', '28', '02', '34', '04', '31', '04', '06', '34', '35', '58', '64'], ['18', '02', '13', '35', '33', '05', '24', '17', '19', '30', '11', '28'], ['07', '10', '21', '19', '14', '21', '21', '29', '23', '23', '29', '14'], ['06', '13', '52', '16', '32', '68', '54', '04', '26', '21', '20', '11']]

    # non_water_tiles = [[11, 2], [11, 4], [9, 0], [8, 4], [3, 0], [3, 10], [11, 8], [9, 11], [5, 10], [2, 0], [10, 2], [7, 9], [3, 11], [11, 0], [8, 11], [1, 7], [1, 1], [7, 11], [7, 2], [2, 4], [8, 5], [1, 6], [8, 2], [8, 3], [2, 3], [9, 6], [1, 3], [4, 5], [9, 7], [1, 9], [7, 1], [11, 9], [6, 7], [11, 6], [0, 2], [10, 6], [4, 9], [6, 6], [6, 3], [2, 6], [10, 4], [10, 0], [1, 10], [6, 5], [4, 3], [2, 1], [4, 4], [7, 8], [6, 10], [10, 5], [2, 7], [2, 11], [5, 3], [3, 1], [3, 2], [10, 3], [11, 7], [2, 2], [9, 5], [4, 7], [0, 0], [9, 4], [1, 4], [5, 7], [3, 9], [1, 8], [9, 1], [7, 6], [0, 6], [1, 0], [6, 11], [11, 5], [11, 10], [6, 0], [5, 5], [4, 6], [6, 2], [7, 10], [0, 11], [5, 0], [8, 6], [6, 9], [9, 2], [1, 5], [4, 10], [9, 3], [5, 6], [6, 8], [7, 0], [2, 5], [6, 1], [0, 9], [3, 6], [5, 1], [0, 8], [5, 2], [11, 3], [11, 1], [0, 4], [10, 1], [1, 2], [2, 8], [8, 1], [4, 0], [5, 11], [0, 3], [0, 1], [11, 11], [7, 7], [10, 7], [3, 7], [3, 4], [0, 5], [1, 11], [0, 7], [5, 8], [2, 10], [3, 3], [4, 8], [7, 4], [3, 5], [6, 4], [5, 4], [4, 11], [10, 11], [0, 10], [8, 0], [7, 3], [7, 5], [2, 9], [3, 8], [4, 2], [4, 1], [8, 7], [5, 9]]
    # # print(map_data)
    # print(non_water_tiles)
    display = generate_image(map_data=map_data,tiles_to_change=non_water_tiles,gen_factor=GEN_FACTOR)
    
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'generated_map.png')
    display.save(output_path)
    print(f"Map image saved successfully at {output_path}!")