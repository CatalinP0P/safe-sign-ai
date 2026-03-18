import pdfplumber
import os


def extract_text_from_pdf(file_path: str) -> str:
    if not os.path.exists(file_path):
        return ""

    all_text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages[:10]:
                text = page.extract_text()
                if text:
                    all_text += text + "\n"
        return all_text.strip()
    except Exception:
        return ""
