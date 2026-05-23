from pypdf import PdfReader
import sys

pdf_path = "992840538-DİZGİ-COĞRAFYA-TUM-CIKMIŞ-SORULAR-2026.pdf"

try:
    reader = PdfReader(pdf_path)
    num_pages = len(reader.pages)
    print(f"Total Pages: {num_pages}")
    
    # Check if any page has text
    for i in [5, 10, 20, 50, 100, 150, 200]:
        if i < num_pages:
            text = reader.pages[i].extract_text()
            print(f"Page {i} text length: {len(text) if text else 0}")
            if text and len(text) > 10:
                print(f"--- Page {i} Sample ---")
                print(text[:500])
                print("----------------------")
                
except Exception as e:
    print(f"Error: {e}")
