from utils.pdf_extractor import extract_text_from_pdf

def parse_resume(filepath):
    text = extract_text_from_pdf(filepath)
    # Mock parsing: extract name, skills, experience
    lines = text.split('\n')
    name = lines[0] if lines else 'Unknown'
    skills = [line for line in lines if 'skill' in line.lower()]
    experience = [line for line in lines if 'experience' in line.lower()]
    return {
        'name': name,
        'skills': skills,
        'experience': experience
    }
