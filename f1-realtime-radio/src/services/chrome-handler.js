

export const ToggleTabMute = async () => {
    // const queryOptions = {audible: true};

    const tabs = await chrome.tabs.query({});

    await tabs.forEach( async (tab) => {
        const muted = !tab.mutedInfo.muted;
        await chrome.tabs.update(tab.id, {muted})
    })


}