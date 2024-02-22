const sendCallbackButton_el = document.getElementById('sendCallbackButton');
const preloadCallbackButton_el = document.getElementById('preloadCallbackButton');
const viewCallbackButton_el = document.getElementById('viewCallbackButton');
const callbackNameInput_el = document.getElementById('callbackNameInput');

sendCallbackButton_el.addEventListener('click', async () => {
    if (callbackNameInput_el.value !== ''){
        await api.callbackCopyHandler({request: 'send', name: callbackNameInput_el.value});
        confirmButtonClick(sendCallbackButton_el);
    }
});

preloadCallbackButton_el.addEventListener('click', async () => {
    if (callbackNameInput_el.value !== ''){
        await api.callbackCopyHandler({request: 'preload', name: callbackNameInput_el.value});
        confirmButtonClick(preloadCallbackButton_el);
    }
});

viewCallbackButton_el.addEventListener('click', async () => {
    if (callbackNameInput_el.value !== ''){
        await api.callbackCopyHandler({request: 'view', name: callbackNameInput_el.value});
        confirmButtonClick(viewCallbackButton_el);
    }
});