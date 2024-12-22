import os
from PIL import Image, ImageDraw, ImageFont
import zipfile

output_dir = 'images'
image_size = (200, 200)
background_color = (255, 255, 255)
text_color = (0, 0, 0)
font_size = 100
font_path = None

os.makedirs(output_dir, exist_ok=True)

try:
    font = ImageFont.truetype("arial.ttf", font_size)
except IOError:
    font = ImageFont.load_default()
    

for number in range(1, 101):
    img = Image.new('RGB', image_size, color=background_color)
    d = ImageDraw.Draw(img)
    text = str(number)
    text_width, text_height = d.textsize(text, font=font)
    position = ((image_size[0] - text_width) / 2, (image_size[1] - text_height) / 2 - 10)
    d.text(position, text, fill=text_color, font=font)
    img_filename = f"{number}.png"
    img_path = os.path.join(output_dir, img_filename)
    img.save(img_path)
    print(f"생성됨: {img_path}")



