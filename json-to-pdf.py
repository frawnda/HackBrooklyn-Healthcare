import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

input_file = "newyork-presbyterian-hospital_standardcharges.json"
output_file = "big_output.pdf"

c = canvas.Canvas(output_file, pagesize=letter)
width, height = letter

x = 40
y = height - 40
line_height = 12

with open(input_file, "r", encoding="utf-8") as f:
    for line in f:
        wrapped_lines = [line[i:i+95] for i in range(0, len(line), 95)]
        for wrapped in wrapped_lines:
            c.drawString(x, y, wrapped.rstrip())
            y -= line_height

            if y < 40:
                c.showPage()
                y = height - 40

c.save()
print(f"Saved PDF: {output_file}")