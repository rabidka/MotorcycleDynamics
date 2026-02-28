import os
import re

# Путь к папке с файлами
folder_path = "F:\moto\Motorcycle_Dynamics\docs"

# Функция для извлечения текста заметок/комментариев из файла
def extract_translator_notes(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Регулярка для поиска всех вариантов заголовков и захвата всего текста после них
    match = re.search(r"(##{1,3}\s*(Заметки|Комментарии)\s*переводчика\s*(.*))", content, re.DOTALL)
    
    if match:
        # Возвращаем весь текст после заголовка
        return match.group(3).strip()  # Текст после заголовка
    return None

# Функция для обработки всех файлов в папке
def collect_translator_notes(folder_path):
    notes = []  # Текст без заголовков
    notes_with_filenames = []  # Текст с названием файла
    missing_notes_files = []  # Список файлов, где не найдены заметки

    for filename in os.listdir(folder_path):
        if filename.endswith('.md'):
            file_path = os.path.join(folder_path, filename)
            print(f"Обрабатывается файл: {filename}")  # Логирование обработки файла
            note = extract_translator_notes(file_path)
            if note:
                notes.append(note)
                notes_with_filenames.append(f"{filename}\n{note}")  # Добавляем название файла перед текстом
            else:
                missing_notes_files.append(file_path)  # Добавляем файл в список, если заметки не найдены

    return notes, notes_with_filenames, missing_notes_files

# Сохраняем заметки в два файла
def save_notes_to_file(notes, notes_with_filenames, output_file_text, output_file_with_filenames):
    with open(output_file_text, 'w', encoding='utf-8') as file:
        for note in notes:
            file.write(note + "\n\n")

    with open(output_file_with_filenames, 'w', encoding='utf-8') as file:
        for note in notes_with_filenames:
            file.write(note + "\n\n")

# Основной процесс
notes, notes_with_filenames, missing_notes_files = collect_translator_notes(folder_path)

# Сохраняем все заметки в два разных файла
save_notes_to_file(notes, notes_with_filenames, "translator_notes_text.md", "translator_notes_with_filenames.md")

print(f"Заметки переводчика собраны в два файла: 'translator_notes_text.md' и 'translator_notes_with_filenames.md'. Всего заметок: {len(notes)}")

# Выводим файлы, где не были найдены заметки
if missing_notes_files:
    print("\nФайлы, где не были найдены заметки переводчика:")
    for file in missing_notes_files:
        print(file)
else:
    print("Заметки найдены в каждом файле.")