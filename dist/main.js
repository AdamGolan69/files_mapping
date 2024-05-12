const app = document.getElementById('app');
const header = document.getElementById('header');
let count = 0;
let memCount = 0;

mapIt(app, 'Movies', header);

function mapIt(ref, name, headerRef) {
    fetch(`${location.origin}/${name}`)
        .then(res => res.json())
        .then(dirs => ref.append(createSearch(), printDirs(dirs)))
        .catch(err => console.error(err))
        .finally(() => {
            if (headerRef) headerRef.innerHTML = `${count} Movies<br>${(memCount / 1024).toFixed(2)} Tb`;
        })
}

function createSearch() {
    const
        label = document.createElement('label'),
        inp = document.createElement('input'),
        span = document.createElement('span');
    label.id = 'searchbar';
    inp.oninput = (e) => {
        e.target.value.length > 3 ? search(e.target.value.toLowerCase()) : resetSearch();
    }
    span.innerText = 'Search';
    label.append(span, inp);
    return label;
}

function search(str) {
    resetSearch();
    const files = document.getElementsByClassName('file');
    Array.from(files).forEach(file => {
        if (file.innerText.toLowerCase().includes(str)) {
            let parent = file.parentElement;
            const bubbleArr = [];
            while (!parent.id.length) {
                if (parent.className === 'dir') bubbleArr.push(parent);
                parent = parent.parentElement;
            }
            bubbleArr.forEach(bubble => bubble.children[0].classList.replace('close', 'open'));
        }
    })
}

function resetSearch() {
    Array.from(document.getElementsByClassName('dir open')).forEach(dir => dir.classList.replace('open', 'close'));
}

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
                    if (!isClosed) {
                        document.getElementsByClassName
                        const nestedDirs = target.parentElement.getElementsByClassName('open');
                        Array.from(nestedDirs).forEach(el => el.classList.replace('open', 'close'));
                    }
                }
                return [span, printDirs(value)];
            }
        }).flat();
    }
    return list;
}

function dirInitPkg(dir) {
    return [typeof dir === 'string', document.createElement('li')];
}

function setFile(el, fileName) {
    memCount += +fileName.slice(fileName.lastIndexOf(' - ') + 3, fileName.lastIndexOf('Gb'));
    el.innerText = fileName;
    el.className = 'file';
    count++;
}