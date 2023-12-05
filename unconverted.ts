import { readdirSync, lstatSync } from 'fs';

function scanDir(basePath: string): void {
    readdirSync(basePath).forEach(dir => {
        lstatSync(`${basePath}/${dir}`).isDirectory()
            ? scanDir(`${basePath}/${dir}`)
            : dir.includes('.mkv') && (/\(\d\)/g).test(dir)
                ? null
                : console.log(`${basePath}/${dir}`);
    })
}

scanDir('D:/Movies/Genre/Comic');