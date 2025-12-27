import sys
import os

pdf_path = "AI Product Engineer.pdf"

if not os.path.exists(pdf_path):
    print(f"Error: {pdf_path} not found")
    sys.exit(1)

try:
    from pypdf import PdfReader
    print("Using pypdf")
except ImportError:
    try:
        from PyPDF2 import PdfReader
        print("Using PyPDF2")
    except ImportError:
        print("No PDF library found (pypdf or PyPDF2). Cannot read PDF.")
        sys.exit(1)

try:
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print("--- PDF CONTENT START ---")
    print(text)
    print("--- PDF CONTENT END ---")
except Exception as e:
    print(f"Error reading PDF: {e}")
