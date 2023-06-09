import { error } from 'console';
import { readdirSync, writeFileSync, lstatSync } from 'fs';
import { MAPS } from './vars';

type Branch = { [k: string]: string | string[] | Branch};

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

export async function generateJSON(path: string) {
    try {
        await writeFileSync(`${MAPS}/${path.slice(path.lastIndexOf('/') + 1)}.json`, JSON.stringify(await mapDirTree(path)), 'utf8');
    } catch (err) {
        error(err);
    }
}