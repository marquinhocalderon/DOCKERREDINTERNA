import cv2
import os
from PIL import Image
from apng import APNG
from transformers import pipeline

# ==============================
# ⚙️ CONFIGURACIÓN GLOBAL
INPUT_VIDEO = "nuevo.mp4"          # 🎬 Archivo de entrada
OUTPUT_APNG = "nuevofeee.apng"   # 📦 Archivo de salida
FPS = 30                             # ⏱️ Frames por segundo
# ==============================

# 🚀 Cargar modelo BRIA-RMBG
print("📥 Cargando modelo BRIA-RMBG-1.4...")
pipe = pipeline("image-segmentation", model="C:\\Users\\LENOVO\\Desktop\\USB\\briaai\\RMBG-1.4\\snapshots\\2ceba5a5efaec153162aedea169f76caf9b46cf8", trust_remote_code=True)

def extract_frames(input_file, output_dir="frames_raw", fps=FPS):
    print("🎬 Extrayendo frames del video...")
    cap = cv2.VideoCapture(input_file)
    os.makedirs(output_dir, exist_ok=True)

    frame_count = 0
    saved_count = 0
    video_fps = cap.get(cv2.CAP_PROP_FPS)

    interval = int(video_fps // fps) if video_fps > fps else 1

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % interval == 0:
            fname = os.path.join(output_dir, f"frame{saved_count+1}.png")
            cv2.imwrite(fname, frame)
            saved_count += 1

            if saved_count % 10 == 0:
                print(f"   ➡️  {saved_count} frames extraídos...")

        frame_count += 1

    cap.release()
    print(f"✅ {saved_count} frames extraídos en la carpeta: {output_dir}")
    return output_dir


def remove_backgrounds(input_dir="frames_raw", output_dir="frames_nobg"):
    print("🖼️  Removiendo fondos de los frames con BRIA-RMBG...")
    os.makedirs(output_dir, exist_ok=True)

    files = sorted(os.listdir(input_dir), key=lambda x: int(''.join(filter(str.isdigit, x))))
    processed_count = 0
    total_files = len(files)

    for fname in files:
        if fname.lower().endswith(".png"):
            inp_path = os.path.join(input_dir, fname)
            out_path = os.path.join(output_dir, fname)

            try:
                img = Image.open(inp_path).convert("RGBA")

                # 🔥 Usar BRIA-RMBG para obtener máscara
                mask = pipe(inp_path, return_mask=True).convert("L")

                # Aplicar máscara → fondo transparente
                img_nobg = img.copy()
                img_nobg.putalpha(mask)
                img_nobg.save(out_path)

                processed_count += 1

            except Exception as e:
                print(f"   ⚠️  Error procesando {fname}: {e}")
                continue

            if processed_count % 5 == 0:
                print(f"   ➡️  {processed_count}/{total_files} frames procesados...")

    print(f"✅ {processed_count} frames procesados y guardados en: {output_dir}")
    return output_dir


def frames_to_apng(input_dir="frames_nobg", output_file=OUTPUT_APNG, fps=FPS):
    print("📦 Generando animación APNG...")
    files = sorted(os.listdir(input_dir), key=lambda x: int(''.join(filter(str.isdigit, x))))
    apng = APNG()
    delay = int(1000 / fps)  # duración de cada frame en ms

    total_files = len(files)
    added_count = 0

    for fname in files:
        if fname.lower().endswith(".png"):
            path = os.path.join(input_dir, fname)

            if not os.path.exists(path):
                print(f"   ⚠️  {fname} no existe, saltando...")
                continue

            apng.append_file(path, delay=delay)
            added_count += 1

            if added_count % 5 == 0:
                print(f"   ➡️  {added_count}/{total_files} frames añadidos al APNG...")

    apng.save(output_file)
    print(f"✅ APNG guardado como {output_file}")


if __name__ == "__main__":
    print("🚀 Iniciando pipeline de procesamiento de video...")

    # 1. Extraer frames
    frames_raw = extract_frames(INPUT_VIDEO, "frames_raw", fps=FPS)

    # 2. Remover fondos con BRIA-RMBG
    frames_clean = remove_backgrounds(frames_raw, "frames_nobg")

    # 3. Confirmación antes de unir
    ready = input("👉 ¿Listo para unir los frames en APNG? (yes/no): ").strip().lower()
    if ready != "yes":
        print("⏹️ Proceso detenido. Revisa o edita los frames en 'frames_nobg'.")
        exit()

    # 4. Generar animación APNG
    frames_to_apng(frames_clean, OUTPUT_APNG, fps=FPS)

    print("🎉 Proceso completado con éxito.")
