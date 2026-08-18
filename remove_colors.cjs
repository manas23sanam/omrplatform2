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

    // We want one blue color (blue-600 mostly) and slate/gray for others.
    // Replace all vibrant colors with either blue or slate.
    const replacements = [
        { from: /indigo-/g, to: 'blue-' },
        { from: /emerald-/g, to: 'slate-' },
        { from: /amber-/g, to: 'slate-' },
        { from: /orange-/g, to: 'slate-' },
        { from: /rose-/g, to: 'slate-' },
        { from: /red-/g, to: 'slate-' },
        { from: /green-/g, to: 'slate-' },
        { from: /purple-/g, to: 'blue-' },
        { from: /yellow-/g, to: 'slate-' },
        { from: /teal-/g, to: 'blue-' },
        { from: /cyan-/g, to: 'blue-' },
        { from: /sky-/g, to: 'blue-' },
        { from: /pink-/g, to: 'slate-' },
        { from: /fuchsia-/g, to: 'blue-' },
        { from: /violet-/g, to: 'blue-' }
    ];

    replacements.forEach(r => {
        content = content.replace(r.from, r.to);
    });

    // Also put back the gradient on the Student Dashboard exactly how they wanted (faded blue instead of black)
    if (file.includes('StudentDashboard.tsx')) {
        content = content.replace('bg-slate-900 rounded-3xl', 'bg-gradient-to-r from-blue-800 via-blue-900 to-slate-950 rounded-3xl');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        totalChanges++;
    }
});

console.log(`Removed extra colors in ${totalChanges} files.`);
