import fs from 'fs';
import path from 'path';

const niches = ['fashion', 'beauty', 'health', 'home', 'tech', 'food', 'jewelry', 'pet', 'sports', 'kids', 'auto', 'art', 'travel', 'b2b', 'digital'];
const categories = ['footer', 'cart', 'testimonial', 'pdp'];

const templatesDir = path.join(process.cwd(), 'dev-theme-peri', 'templates');
if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir, { recursive: true });

const sectionFiles = fs.readdirSync(path.join(process.cwd(), 'dev-theme-peri', 'sections'));

for (const cat of categories) {
    for (const niche of niches) {
        let matchingSections = sectionFiles.filter(f => f.startsWith(`${cat}-${niche}-`) && f.endsWith('.liquid'));
        
        if (matchingSections.length === 0) {
            console.log(`No sections found for ${cat} ${niche}`);
            continue;
        }

        // Limit to max 25 sections for a single JSON template
        matchingSections = matchingSections.slice(0, 25);

        const templateName = `collection.preview-${cat}-${niche}.json`;
        
        const sectionsObj = {};
        const orderArr = [];
        
        matchingSections.forEach((filename, idx) => {
            const sectionName = filename.replace('.liquid', '');
            const id = `sec_${idx}`;
            sectionsObj[id] = { type: sectionName };
            orderArr.push(id);
        });
        
        const jsonContent = {
            sections: sectionsObj,
            order: orderArr
        };
        
        fs.writeFileSync(path.join(templatesDir, templateName), JSON.stringify(jsonContent, null, 2), 'utf8');
        console.log(`Created ${templateName}`);
    }
}
