const app = document.getElementById('app');
const header = document.getElementById('header');
let count = 0;

fetch(`${location.origin}/Temporary`)
    .then(res => res.json())
    .then(dirs => app.append(printDirs(dirs)))
    .catch(err => console.error(err))
    .finally(() => header.innerText = `${count} ${header.innerText}`)


function printDirs(dirs) {
    const list = document.createElement('ul');
    const files = Array.isArray(dirs);
    if (files) {
        dirs.forEach(async (dir) => {
            const [isFile, li] = dirInitPkg(dir);
            if (isFile) {
                setFile(li, dir);
            } else {
                li.className = 'dir';
                li.append(...await printDirs(dir));
            }
            list.append(li);
        })
    } else {
        return Object.entries(dirs).map(([key, value]) => {
            const [isFile, li] = dirInitPkg(value);
            if (isFile) {
                setFile(li, value);
                return li;
            } else {
                const span = document.createElement('span');
                span.innerText = key;
                span.className = 'dir close';
                span.onclick = ({ target }) => {
                    const isClosed = target.classList.contains('close');
                    target.classList.replace(isClosed ? 'close' : 'open', isClosed ? 'open' : 'close');
                }
                return [span, printDirs(value)];
            }
        }).flat();
    }
    return list;
}

function dirInitPkg(dir) {
    return [
        typeof dir === 'string',
        document.createElement('li')
    ]
}

function setFile(el, fileName) {
    el.innerText = fileName;
    el.className = 'file';
    count++;
}