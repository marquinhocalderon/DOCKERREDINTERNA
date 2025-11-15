import os
import signal
import subprocess
import threading
from typing import Dict

sessions: Dict[str, subprocess.Popen] = {}

# Inicia una nueva sesión
def start_session(session_id: str, command: str, cwd: str):
    if session_id in sessions:
        return f"Sesión '{session_id}' ya está en ejecución."

    try:
        # Iniciar el proceso
        process = subprocess.Popen(
            command,
            cwd=cwd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            stdin=subprocess.PIPE,
            text=True
        )

        sessions[session_id] = process

        # Hilo para monitorear la salida
        def monitor_output():
            while process.poll() is None:
                output = process.stdout.readline()
                if output:
                    print(f"[{session_id}] {output.strip()}")

        threading.Thread(target=monitor_output, daemon=True).start()

        return f"Sesión '{session_id}' iniciada con PID {process.pid}."
    except Exception as e:
        return f"Error al iniciar la sesión '{session_id}': {str(e)}"

# Detener una sesión activa
def stop_session(session_id: str):
    if session_id not in sessions:
        return f"Sesión '{session_id}' no encontrada."

    process = sessions[session_id]
    try:
        os.kill(process.pid, signal.SIGINT)
        process.wait()  # Esperar a que el proceso termine
        del sessions[session_id]
        return f"Sesión '{session_id}' detenida correctamente."
    except Exception as e:
        return f"Error al detener la sesión '{session_id}': {str(e)}"

# Obtener la salida de una sesión en tiempo real
def get_session_output(session_id: str):
    if session_id not in sessions:
        return f"Sesión '{session_id}' no encontrada."

    process = sessions[session_id]
    output = process.stdout.readline()
    return output.strip() if output else ""

if __name__ == "__main__":
    while True:
        print("\n=== Gestor de Sesiones ===")
        print("1. Iniciar una sesión")
        print("2. Detener una sesión")
        print("3. Listar sesiones activas")
        print("4. Salir")

        opcion = input("Selecciona una opción: ").strip()

        if opcion == "1":
            session_id = input("ID de la sesión: ").strip()
            command = input("Comando a ejecutar: ").strip()
            cwd = input("Directorio de trabajo (dejar vacío para actual): ").strip() or os.getcwd()
            print(start_session(session_id, command, cwd))

        elif opcion == "2":
            session_id = input("ID de la sesión a detener: ").strip()
            print(stop_session(session_id))

        elif opcion == "3":
            if sessions:
                print("\nSesiones activas:")
                for session_id, process in sessions.items():
                    print(f"- {session_id} (PID: {process.pid})")
            else:
                print("\nNo hay sesiones activas.")

        elif opcion == "4":
            print("Saliendo...")
            break

        else:
            print("Opción no válida. Inténtalo nuevamente.")
