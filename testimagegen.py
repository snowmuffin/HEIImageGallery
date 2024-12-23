import os
import argparse
from PIL import Image, ImageDraw, ImageFont
import tkinter as tk
from tkinter import filedialog, messagebox, colorchooser


def generate_images_cli(output_dir, image_size, background_color, text_color, font_size, num_images, file_prefix):
    """CLI에서 이미지를 생성하는 함수"""
    os.makedirs(output_dir, exist_ok=True)

    try:
        font = ImageFont.truetype("arial.ttf", font_size)
    except IOError:
        font = ImageFont.load_default()

    for number in range(1, num_images + 1):
        img = Image.new('RGB', image_size, color=background_color)
        d = ImageDraw.Draw(img)
        text = str(number)

        # 텍스트 크기 계산 (getbbox 사용)
        bbox = font.getbbox(text)
        text_width, text_height = bbox[2] - bbox[0], bbox[3] - bbox[1]

        position = ((image_size[0] - text_width) / 2, (image_size[1] - text_height) / 2)
        d.text(position, text, fill=text_color, font=font)
        img_filename = f"{file_prefix}_{number}.png"
        img_path = os.path.join(output_dir, img_filename)
        img.save(img_path)


def generate_images_gui():
    """GUI에서 이미지를 생성하는 함수"""
    output_dir = output_dir_var.get()
    try:
        image_size = (int(width_var.get()), int(height_var.get()))
        background_color = bg_color_var.get()
        text_color = text_color_var.get()
        font_size = int(font_size_var.get())
        num_images = int(num_images_var.get())
        file_prefix = file_prefix_var.get()
    except ValueError:
        messagebox.showerror("입력 오류", "올바른 숫자를 입력해주세요.")
        return

    generate_images_cli(output_dir, image_size, background_color, text_color, font_size, num_images, file_prefix)
    messagebox.showinfo("완료", f"{num_images}개의 이미지가 생성되었습니다!")


def select_output_dir():
    """출력 폴더 선택"""
    selected_dir = filedialog.askdirectory()
    if selected_dir:
        output_dir_var.set(selected_dir)


def choose_bg_color():
    """배경 색상 선택"""
    color = colorchooser.askcolor()[1]
    if color:
        bg_color_var.set(color)


def choose_text_color():
    """텍스트 색상 선택"""
    color = colorchooser.askcolor()[1]
    if color:
        text_color_var.set(color)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="이미지 생성기")
    parser.add_argument("--output_dir", type=str, help="출력 디렉토리")
    parser.add_argument("--width", type=int, help="이미지 가로 크기")
    parser.add_argument("--height", type=int, help="이미지 세로 크기")
    parser.add_argument("--bg_color", type=str, help="배경 색상 (16진수)")
    parser.add_argument("--text_color", type=str, help="텍스트 색상 (16진수)")
    parser.add_argument("--font_size", type=int, help="폰트 크기")
    parser.add_argument("--num_images", type=int, help="생성할 이미지 개수")
    parser.add_argument("--file_prefix", type=str, help="파일명 프리픽스")

    args = parser.parse_args()

    # CLI 옵션이 없으면 GUI 실행
    if not any(vars(args).values()):  # 모든 옵션이 비어 있다면
        root = tk.Tk()
        root.title("이미지 생성기")

        # GUI 변수 설정
        output_dir_var = tk.StringVar(value="images")
        width_var = tk.StringVar(value="200")
        height_var = tk.StringVar(value="200")
        bg_color_var = tk.StringVar(value="#FFFFFF")
        text_color_var = tk.StringVar(value="#FF0000")
        font_size_var = tk.StringVar(value="100")
        num_images_var = tk.StringVar(value="10")
        file_prefix_var = tk.StringVar(value="image")

        # GUI 레이아웃 설정
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

        tk.Button(root, text="이미지 생성", command=generate_images_gui).grid(row=8, column=0, columnspan=3, pady=10)

        # Tkinter 루프 시작
        root.mainloop()
    else:  # CLI 모드 실행
        required_args = ['output_dir', 'width', 'height', 'bg_color', 'text_color', 'font_size', 'num_images', 'file_prefix']
        missing_args = [arg for arg in required_args if getattr(args, arg) is None]

        if missing_args:
            print(f"필수 옵션이 누락되었습니다: {', '.join(missing_args)}")
            print("다음 명령어 형식으로 실행해주세요:")
            print("python testimagegen.py --output_dir ./output --width 300 --height 300 --bg_color '#000000' --text_color '#FFFFFF' --font_size 50 --num_images 10 --file_prefix 'test'")
        else:
            generate_images_cli(
                args.output_dir,
                (args.width, args.height),
                args.bg_color,
                args.text_color,
                args.font_size,
                args.num_images,
                args.file_prefix,
            )
