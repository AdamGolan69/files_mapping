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