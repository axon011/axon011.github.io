import sys
import os

# Force utf-8 output for print statements
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "AI Product Engineer.pdf"

try:
    from pypdf import PdfReader
except ImportError:
    try:
        from PyPDF2 import PdfReader
    except ImportError:
        print("No PDF library found.")
        sys.exit(1)

try:
    reader = PdfReader(pdf_path)
    text = ""
    for i, page in enumerate(reader.pages):
        try:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        except Exception as e:
            print(f"Warning: Could not extract text from page {i}: {e}")
    
    output_file = "pdf_extracted_utf8.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(text)
    
    print(f"Successfully extracted text to {output_file}")
    print("--- PREVIEW ---")
    print(text[:500]) # Print first 500 chars
    print("--- END PREVIEW ---")

except Exception as e:
    print(f"Global error reading PDF: {e}")
