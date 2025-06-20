from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any
import io

# Import your image generation function
from image_generator import generate_image

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to handle incoming data
class MapData(BaseModel):
    map_data: List[List[str]]  # 2D array of strings
    non_water_tiles: List[List[int]]  # List of coordinate pairs
    gen_factor: float

@app.post("/generate-image")
async def generate_image_from_data(map_data: MapData):
    try:
        # Call your image generation function
        display = generate_image(map_data.map_data, map_data.non_water_tiles, map_data.gen_factor)

        # Save image to in-memory bytes buffer
        img_byte_arr = io.BytesIO()
        display.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        # Return the image as a response
        return Response(content=img_byte_arr.read(), media_type="image/png")
    except Exception as e:
        print(f"Error generating image: {e}")
        return JSONResponse(content={"message": f"Image generation failed: {str(e)}"}, status_code=500)