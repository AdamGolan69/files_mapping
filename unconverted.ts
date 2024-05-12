import { readdirSync, lstatSync, renameSync } from 'fs';

let count = 0;

function scanDir(basePath: string): void {
    const content = readdirSync(basePath);
    content.forEach(dir => {
        lstatSync(`${basePath}/${dir}`).isDirectory()
            ? scanDir(`${basePath}/${dir}`)
            : dir.includes('.mkv.mkv')
                ? renameSync(`${basePath}/${dir}`, `${basePath}/${dir.replace('.mkv.mkv', '.mkv')}`)
                : null && console.log(`${basePath}/${dir}`);
    });
}

scanDir('D:/Movies/Genre');
console.log(`There are ${count} unconverted.`);