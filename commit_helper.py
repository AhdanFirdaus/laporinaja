import subprocess
from deep_translator import GoogleTranslator
import inquirer
import re
import sys

def run_command(command):
    """Menjalankan perintah shell dan mengembalikan output."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout, result.stderr

def get_git_status():
    """Mengambil status git dan mengembalikan daftar file yang diubah atau untracked."""
    stdout, stderr = run_command("git status --porcelain")
    if stderr:
        print(f"Error: {stderr}")
        return []
    # Parse output --porcelain: format seperti " M src/main.py" atau "?? coba.txt"
    files = []
    for line in stdout.splitlines():
        if line.strip():
            # Ambil nama file setelah status (misal, " M " atau "?? ")
            file_name = line[3:].strip()
            files.append(file_name)
    return files

def select_files(files):
    """Meminta pengguna memilih file untuk git add, default ke All jika Enter."""
    if not files:
        print("Tidak ada perubahan untuk di-commit.")
        return None
    choices = ["All (.)"] + files
    questions = [
        inquirer.Checkbox(
            "files",
            message="Pilih file untuk di-add (tekan Enter untuk All)",
            choices=choices,
            # Tanpa default untuk mencegah All (.) otomatis terpilih
        )
    ]
    try:
        answers = inquirer.prompt(questions)
        if not answers or not answers["files"]:
            print("Tidak ada file yang dipilih, menggunakan default: All")
            return "."
        if "All (.)" in answers["files"]:
            print("Memilih semua file karena 'All (.)' dipilih")
            return "."
        return answers["files"]
    except KeyboardInterrupt:
        print("\nPemilihan file dibatalkan (Ctrl+C).")
        return None

def add_files(files):
    """Menjalankan git add untuk file yang dipilih dan mengembalikan daftar file yang di-stage."""
    staged_files = []
    if files == ".":
        stdout, stderr = run_command("git add .")
        if stderr:
            print(f"Error saat git add .: {stderr}")
            return None
        print("Berhasil git add semua file.")
        staged_files = get_git_status()  # Ambil semua file yang di-stage
    else:
        for file in files:
            stdout, stderr = run_command(f'git add "{file}"')
            if stderr:
                print(f"Error saat git add {file}: {stderr}")
                return None
            print(f"Berhasil git add {file}")
            staged_files.append(file)
    return staged_files

def undo_staging(staged_files):
    """Membatalkan git add untuk file yang di-stage."""
    if not staged_files:
        return
    if staged_files == ["."]:
        stdout, stderr = run_command("git restore --staged .")
        if stderr:
            print(f"Error saat membatalkan staging: {stderr}")
        else:
            print("Berhasil membatalkan staging semua file.")
    else:
        for file in files:
            stdout, stderr = run_command(f'git restore --staged "{file}"')
            if stderr:
                print(f"Error saat membatalkan staging {file}: {stderr}")
            else:
                print(f"Berhasil membatalkan staging {file}")

def determine_commit_type(message):
    """Menentukan type commit berdasarkan kata kunci."""
    message = message.lower()
    if any(word in message for word in ["tambah", "buat", "menambahkan"]):
        return "✨ feat"
    elif any(word in message for word in ["perbaiki", "memperbaiki", "fix", "bug"]):
        return "✅ fix"
    elif any(word in message for word in ["dokumentasi", "readme", "docs"]):
        return "📃 docs"
    elif any(word in message for word in ["style", "format", "css"]):
        return "🎨 style"
    elif any(word in message for word in ["refactor", "optimasi"]):
        return "🛠️ refactor"
    elif any(word in message for word in ["test", "unit", "testing"]):
        return "🧪 test"
    elif any(word in message for word in ["progres"]):
        return "🕒 wip"
    elif any(word in message for word in ["assets"]):
        return "📂 assets"
    elif any(word in message for word in ["build"]):
        return "🏗️ build"
    elif any(word in message for word in ["ci"]):
        return "🔁 ci"
    elif any(word in message for word in ["keamanan"]):
        return "🛡️ sec"
    elif any(word in message for word in ["config", "konfigurasi"]):
        return "⚙️ config"
    elif any(word in message for word in ["api"]):
        return "🔥 api"
    elif any(word in message for word in ["env", "environment"]):
        return "🌱 env"
    else:
        return "📌 chore"

def translate_message(message):
    """Menerjemahkan pesan dari Indonesia ke Inggris."""
    try:
        translator = GoogleTranslator(source="id", target="en")
        translated = translator.translate(message)
        return translated.lower().strip()
    except Exception as e:
        print(f"Error terjemahan: {e}")
        return message.lower().strip()

def main():
    try:
        print("=== Commit Helper ===")
        
        # Cek git status
        files = get_git_status()
        if not files:
            return

        # Pilih file
        print("\n[Git Status]")
        for file in files:
            print(f"Modified/Untracked: {file}")
        selected_files = select_files(files)
        if not selected_files:
            return

        # Jalankan git add dan simpan daftar file yang di-stage
        staged_files = add_files(selected_files)
        if not staged_files:
            print("Gagal menambahkan file, commit dibatalkan.")
            return

        # Cek apakah ada file yang di-stage
        stdout, stderr = run_command("git status --porcelain")
        if not stdout.strip():
            print("Tidak ada file yang di-stage untuk di-commit.")
            undo_staging(staged_files)
            return

        # Input pesan commit
        commit_message_id = input("\nMasukkan pesan commit (bahasa Indonesia): ").strip()
        if not commit_message_id:
            print("Pesan commit tidak boleh kosong.")
            undo_staging(staged_files)
            return

        # Terjemahkan pesan
        commit_message_en = translate_message(commit_message_id)
        print(f"Pesan diterjemahkan: {commit_message_en}")

        # Tentukan type
        commit_type = determine_commit_type(commit_message_id)
        print(f"Tipe commit: {commit_type}")
        
        # Tentukan scope
        if commit_type == "config":
            scope = "config"
            print("Menggunakan scope default: config")
        else:
            scope = input("Masukkan scope (contoh: ui, auth, api): ").strip()
            if not scope:
                print("Scope tidak boleh kosong.")
                undo_staging(staged_files)
                return

        # Format pesan commit
        commit_message = f"{commit_type}({scope}): {commit_message_en}"
        print(f"Pesan commit: {commit_message}")

        # Konfirmasi
        confirm = input("Konfirmasi commit? (y/n): ").lower()
        if confirm != "y":
            print("Commit dibatalkan.")
            undo_staging(staged_files)
            return

        # Jalankan git commit
        stdout, stderr = run_command(f'git commit -m "{commit_message}"')
        if stderr:
            print(f"Error saat commit: {stderr}")
            undo_staging(staged_files)
        else:
            print("[Success] Commit berhasil!")

    except KeyboardInterrupt:
        print("\nProgram dihentikan oleh pengguna (Ctrl+C).")
        # Batalkan staging jika ada file yang sudah di-add
        if 'staged_files' in locals():
            undo_staging(staged_files)
        sys.exit(0)

if __name__ == "__main__":
    main()