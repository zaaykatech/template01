const fs = require('fs');
let content = fs.readFileSync('src/app/MenuClient.tsx', 'utf8');

const sectionCompOld = 'const SectionComponent = ({ section }: { section: MenuSection }) => {';
const sectionCompNew = `const SectionComponent = ({ section: originalSection }: { section: MenuSection }) => {
    let currentCell = 0;
    const processedItems = originalSection.items.map(item => {
        let isSquare = false;
        if (item.isSignature) {
            if (currentCell % 2 === 1) {
                isSquare = true;
                currentCell += 1;
            } else {
                currentCell += 2;
            }
        } else {
            currentCell += 1;
        }
        return { ...item, _isSquareMobile: isSquare };
    });
    const section = { ...originalSection, items: processedItems };`;
content = content.replace(sectionCompOld, sectionCompNew);

content = content.replace(/className=\"col-span-1 (md:col-span-[23]) group signature-card ([^\"]+) flex flex-col md:flex-row justify-between([^\"]*)\"/g, 'className={`\\${item._isSquareMobile ? \'col-span-1 flex-col md:flex-row md:items-center\' : \'col-span-2 flex-row items-center\'} $1 group signature-card $2 flex justify-between$3`}');

content = content.replace(/<div className=\"text-left flex-1 mb-3 md:mb-0\">/g, '<div className={`text-left flex-1 \\${item._isSquareMobile ? \'mb-3 md:mb-0\' : \'mr-2 md:mr-0\'}`}>');

fs.writeFileSync('src/app/MenuClient.tsx', content);
