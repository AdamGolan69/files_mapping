import { error, log } from 'console';
import { readdirSync, writeFileSync, lstatSync, existsSync, mkdirSync } from 'fs';
import { MAPS } from './vars';
import { platform } from 'os';
let count = 0;

type Branch = { [k: string]: string | (string | Branch)[] };

async function mapDirTree(path: string): Promise<any> {
    return new Promise(async (res) => {
        let tree: (string | Branch)[] = [];
        const directories = await readdirSync(path);
        for (const dir of directories) {
            await lstatSync(`${path}/${dir}`).isFile()
                ? Array.isArray(tree) ? tree.push(dir) : tree = [dir]
                : tree.push({ [dir]: await mapDirTree(`${path}/${dir}`) });
        }
        res(tree);
    })
}

export async function generateFilesMap(path: string, savePath = `./${MAPS}/${path.slice(path.lastIndexOf('/') + 1)}.json`) {
    try {
        const dir = savePath.slice(0, savePath.lastIndexOf('\\'));
        if (!existsSync(dir)) mkdirSync(dir);
        await writeFileSync(savePath, JSON.stringify(await mapDirTree(path)), { encoding: 'utf8', flag: 'w+' });
    } catch (err) {
        error(err);
    }
}

// export function mapIt(ref, name, headerRef) {
//     fetch(`${location.origin}/${name}`)
//         .then(res => res.json())
//         .then(dirs => ref.append(printDirs(dirs)))
//         .catch(err => console.error(err))
//         .finally(() => {
//             if (headerRef) headerRef.innerText = `${count} Files`;
//             count = 0;
//         })
// }

export function printDirs(dirs: (string | Branch)[] | Branch): Node[] {
    console.log(dirs);
    const list = document.createElement('ul');
    const files = Array.isArray(dirs);
    if (files) {
        dirs.forEach(async (dir: string | Branch) => {
            const [isFile, li] = dirInitPkg(dir);
            if (isFile) {
                setFile(li, dir as string);
            } else {
                li.className = 'dir';
                li.append(...await printDirs(dir as Branch));
            }
            list.append(li);
        })
    } else {
        return Object.entries(dirs).map(([key, value]: [string, string | (string | Branch)[]]) => {
            const [isFile, li] = dirInitPkg(value);
            if (isFile) {
                setFile(li, value as string);
                return li;
            } else {
                const span = document.createElement('span');
                span.innerText = key;
                span.className = 'dir close';
                span.onclick = ({ target }: Event) => {
                    const isClosed = (target as HTMLSpanElement).classList.contains('close');
                    (target as HTMLSpanElement).classList.replace(isClosed ? 'close' : 'open', isClosed ? 'open' : 'close');
                }
                return [span, printDirs(value as (string | Branch)[])];
            }
        }).flat() as Node[];
    }
    return [list];
}

function dirInitPkg(dir: any): [boolean, HTMLLIElement] {
    return [
        typeof dir === 'string',
        document.createElement('li')
    ]
}

function setFile(el: HTMLElement, fileName: string): void {
    el.innerText = fileName;
    el.className = 'file';
    count++;
}