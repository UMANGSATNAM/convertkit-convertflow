import os

filepath = 'i:/converflow app/app/templatesHtml.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any escaped backtick followed by <!DOCTYPE html>
fixed_content = content.replace('\\`<!DOCTYPE html>', '`<!DOCTYPE html>')

diff_count = len(content) - len(fixed_content)
if diff_count != 0:
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    print(f"Fixed templatesHtml.js. Content length reduced by {diff_count} bytes.")
else:
    print("No escaped backticks found in templatesHtml.js.")
