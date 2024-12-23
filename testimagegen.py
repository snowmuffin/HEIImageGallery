import os
from PIL import Image, ImageDraw, ImageFont
import tkinter as tk
from tkinter import filedialog, messagebox, colorchooser

def generate_images():
    # 입력 값 가져오기
    output_dir = output_dir_var.get()
    try:
        image_size = (int(width_var.get()), int(height_var.get()))
        background_color = bg_color_var.get()
        text_color = text_color_var.get()
        font_size = int(font_size_var.get())
        num_images = int(num_images_var.get())
        file_prefix = file_prefix_var.get()  # 파일명 프리픽스
    except ValueError:
        messagebox.showerror("입력 오류", "올바른 숫자를 입력해주세요.")
        return

    os.makedirs(output_dir, exist_ok=True)

    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except IOError:
        font = ImageFont.load_default()

    for number in range(1, num_images + 1):
        img = Image.new('RGB', image_size, color=background_color)
        d = ImageDraw.Draw(img)
        text = str(number)
        text_width, text_height = d.textsize(text, font=font)
        position = ((image_size[0] - text_width) / 2, (image_size[1] - text_height) / 2 - 10)
        d.text(position, text, fill=text_color, font=font)
        img_filename = f"{file_prefix}_{number}.png"  # 파일명에 프리픽스 추가
        img_path = os.path.join(output_dir, img_filename)
        img.save(img_path)

    messagebox.showinfo("완료", f"{num_images}개의 이미지가 생성되었습니다!")

def select_output_dir():
    selected_dir = filedialog.askdirectory()
    if selected_dir:
        output_dir_var.set(selected_dir)

def choose_bg_color():
    color = colorchooser.askcolor()[1]
    if color:
        bg_color_var.set(color)

def choose_text_color():
    color = colorchooser.askcolor()[1]
    if color:
        text_color_var.set(color)

# Tkinter 윈도우 설정
root = tk.Tk()
root.title("이미지 생성기")

# 변수
output_dir_var = tk.StringVar(value="images")
width_var = tk.StringVar(value="200")
height_var = tk.StringVar(value="200")
bg_color_var = tk.StringVar(value="#FFFFFF")
text_color_var = tk.StringVar(value="#FF0000")
font_size_var = tk.StringVar(value="100")
num_images_var = tk.StringVar(value="10")
file_prefix_var = tk.StringVar(value="image")  # 파일명 프리픽스

# 레이아웃
tk.Label(root, text="출력 폴더:").grid(row=0, column=0, sticky="e")
tk.Entry(root, textvariable=output_dir_var).grid(row=0, column=1, padx=5, pady=5)
tk.Button(root, text="폴더 선택", command=select_output_dir).grid(row=0, column=2, padx=5, pady=5)

tk.Label(root, text="가로 크기:").grid(row=1, column=0, sticky="e")
tk.Entry(root, textvariable=width_var).grid(row=1, column=1, padx=5, pady=5)

tk.Label(root, text="세로 크기:").grid(row=2, column=0, sticky="e")
tk.Entry(root, textvariable=height_var).grid(row=2, column=1, padx=5, pady=5)

tk.Label(root, text="배경 색상:").grid(row=3, column=0, sticky="e")
tk.Entry(root, textvariable=bg_color_var).grid(row=3, column=1, padx=5, pady=5)
tk.Button(root, text="색상 선택", command=choose_bg_color).grid(row=3, column=2, padx=5, pady=5)

tk.Label(root, text="텍스트 색상:").grid(row=4, column=0, sticky="e")
tk.Entry(root, textvariable=text_color_var).grid(row=4, column=1, padx=5, pady=5)
tk.Button(root, text="색상 선택", command=choose_text_color).grid(row=4, column=2, padx=5, pady=5)

tk.Label(root, text="폰트 크기:").grid(row=5, column=0, sticky="e")
tk.Entry(root, textvariable=font_size_var).grid(row=5, column=1, padx=5, pady=5)

tk.Label(root, text="이미지 개수:").grid(row=6, column=0, sticky="e")
tk.Entry(root, textvariable=num_images_var).grid(row=6, column=1, padx=5, pady=5)

tk.Label(root, text="파일명 프리픽스:").grid(row=7, column=0, sticky="e")
tk.Entry(root, textvariable=file_prefix_var).grid(row=7, column=1, padx=5, pady=5)

tk.Button(root, text="이미지 생성", command=generate_images).grid(row=8, column=0, columnspan=3, pady=10)

# Tkinter 루프 시작
root.mainloop()
