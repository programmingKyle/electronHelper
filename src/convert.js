const convertButton_el = document.getElementById('convertButton');
const htmlText_el = document.getElementById('htmlText');
const output_el = document.getElementById('output');
const copyAllButton_el = document.getElementById('copyAllButton');
const pasteConvert_el = document.getElementById('pasteConvert');

const contentLoadedButton_el = document.getElementById('contentLoadedButton');
const addEventListenerButton_el = document.getElementById('addEventListenerButton');
const preloadButton_el = document.getElementById('preloadButton');
const timeoutButton_el = document.getElementById('timeoutButton');
const tryCatchButton_el = document.getElementById('tryCatchButton');
const promiseButton_el = document.getElementById('promiseButton');
const fileFolderButton_el = document.getElementById('fileFolderButton');
const clipboardButton_el = document.getElementById('clipboardButton');
const asyncCheckbox_el = document.getElementById('asyncCheckbox');

const requireDataCheckbox_el = document.getElementById('requireDataCheckbox');
const ipcNameInput_el = document.getElementById('ipcNameInput');
const copyPreloadLineButton_el = document.getElementById('copyPreloadLineButton');
const copyIpcMainButton_el = document.getElementById('copyIpcMainButton');

const clearButton_el = document.getElementById('clearButton');

let variableList = [];

convertButton_el.addEventListener('click', () => {
    if (htmlText_el.value === '') return;
    variableList.length = 0;
    output_el.innerHTML = '';
    idToVariables(htmlText_el.value);
    confirmButtonClick(convertButton_el);
});

pasteConvert_el.addEventListener('click', async () => {
    const clipboard = await api.pasteFromClipboard();
    idToVariables(clipboard);
    confirmButtonClick(pasteConvert_el);
});



function idToVariables(input){
    //variableList.length = 0;
    //output_el.innerHTML = '';
    const htmlLines = input.split('\n');
    const htmlTrimmed = htmlLines.map(line => line.trim());
    for (const line of htmlTrimmed){
        if (line.includes('id=') || line.includes('id =')){
            const lineSegments = line.split(' ');
            const variableName = grabVariableName(lineSegments);
            const variableElement = convertToVariable(variableName);
            if (!variableList.includes(variableElement)){
                variableList.push(variableElement);
            }
            const variableDiv_el = document.createElement('div');
            variableDiv_el.className = 'variable-div-grid';
            variableDiv_el.addEventListener('mouseover', () => {
                variableAddEventListenerButton_el.style.display = 'inline-block';
            });
            variableDiv_el.addEventListener('mouseout', () => {
                variableAddEventListenerButton_el.style.display = 'none';
            })
            
            const variableButton_el = document.createElement('button');
            variableDiv_el.append(variableButton_el);
            variableButton_el.textContent = variableName;
            variableButton_el.addEventListener('click', () => {
                api.copyToClipboard(variableElement);
                confirmButtonClick(variableButton_el);
            })

            const variableAddEventListenerButton_el = document.createElement('button');
            variableAddEventListenerButton_el.style.display = 'none';
            variableAddEventListenerButton_el.style.fontSize = '12px';
            variableAddEventListenerButton_el.textContent = 'EventListener';
            variableAddEventListenerButton_el.addEventListener('click', async () => {
                await api.variableCopySelect({request: 'AddEventListener', variableName: `${variableName}_el`});
                confirmButtonClick(variableAddEventListenerButton_el);
            })
            variableDiv_el.append(variableAddEventListenerButton_el);
            output_el.append(variableDiv_el);
        }
    }
}

copyAllButton_el.addEventListener('click', () => {
    if (variableList.length === 0) return;    
    const copyContent = variableList.join('\n');
    api.copyToClipboard(copyContent);
    confirmButtonClick(copyAllButton_el);
})

async function confirmButtonClick(button) {
    button.disabled = true;
    const buttonString = await button.textContent;
    button.textContent = '';
    button.classList ='fas fa-check';
    setTimeout(() => {
        button.disabled = false;
        button.textContent = buttonString; // Replace with your original text
        button.classList = '';
    }, 1500);
}

function convertToVariable(variableName){
    return `const ${variableName}_el = document.getElementById('${variableName}');`
}

function grabVariableName(lineSegments) {
    for (const segment of lineSegments) {
        if (segment.includes('id=') || segment.includes('id =')) {
            const name = segment.split('"')[1];
            return name;
        }
    }
    return null; // Or whatever makes sense in your case when no ID is found
}

contentLoadedButton_el.addEventListener('click', async () => {
    await api.quickCopySelect('DOMContentLoaded');
    confirmButtonClick(contentLoadedButton_el);
});

addEventListenerButton_el.addEventListener('click', async () => {
    await api.quickCopySelect('AddEventListener');
    confirmButtonClick(addEventListenerButton_el);
})

preloadButton_el.addEventListener('click', async () => {
    await api.quickCopySelect('Preload');
    confirmButtonClick(preloadButton_el);
})

copyPreloadLineButton_el.addEventListener('click', async () => {
    await api.ipcQuickCopySelect({request: 'preload', needData: requireDataCheckbox_el.checked, ipcName: ipcNameInput_el.value});
    confirmButtonClick(copyPreloadLineButton_el);
})

copyIpcMainButton_el.addEventListener('click', async () => {
    await api.ipcQuickCopySelect({request: 'ipcMain', needData: requireDataCheckbox_el.checked, ipcName: ipcNameInput_el.value, async: asyncCheckbox_el.checked});
    confirmButtonClick(copyIpcMainButton_el);
})

timeoutButton_el.addEventListener('click', async () => {
    await api.quickCopySelect('SetTimeout');
    confirmButtonClick(timeoutButton_el);
});

tryCatchButton_el.addEventListener('click', async () => {
    await api.quickCopySelect('TryCatch');
    confirmButtonClick(tryCatchButton_el);
});

promiseButton_el.addEventListener('click', async () => {
    await api.quickCopySelect('Promise');
    confirmButtonClick(promiseButton_el);
});

fileFolderButton_el.addEventListener('click', async () => {
    await api.quickCopySelect('OpenFileFolder');
    confirmButtonClick(fileFolderButton_el);
});

clipboardButton_el.addEventListener('click', async () => {
    await api.quickCopySelect('Clipboard');
    confirmButtonClick(clipboardButton_el);
});

clearButton_el.addEventListener('click', () => {
    variableList.length = 0;
    output_el.innerHTML = '';
});
