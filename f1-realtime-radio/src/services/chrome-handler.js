
// CHROME TAB HANDLER //


/* Method invoked whenever a live radio message is received. Temporarily mutes chrome tabs. */
export const ToggleTabMute = async () => {
  
    const tabs = await chrome.tabs.query({});

    await tabs.forEach( async (tab) => {
        const muted = !tab.mutedInfo.muted;
        await chrome.tabs.update(tab.id, {muted})
    })


}
