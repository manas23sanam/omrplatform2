const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

let totalChanges = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/JEE & NEET/g, 'NEET');
    content = content.replace(/JEE\/NEET/g, 'NEET');
    content = content.replace(/JEE/g, 'NEET');
    content = content.replace(/jee/g, 'neet');
    
    content = content.replace(/Mathematics/g, 'Biology');
    content = content.replace(/Maths/g, 'Biology');
    content = content.replace(/maths/g, 'biology');
    content = content.replace(/math/g, 'biology');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        totalChanges++;
        console.log('Updated:', file);
    }
});

console.log(`Replaced JEE and Math references in ${totalChanges} files.`);
