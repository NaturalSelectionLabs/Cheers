import RSS3 from '@/common/rss3';

const setupTheme = async () => {
    // Setup theme
    const pageOwner = RSS3.getPageOwner();
    const apuUser = RSS3.getAPIUser();
    const assets = (await apuUser.persona?.assets.auto.getList(pageOwner.address)) || [];
    const themes = RSS3.getAvailableThemes(assets);
    if (themes[0]) {
        document.body.classList.add(themes[0].class);
    } else {
        document.body.classList.remove(...document.body.classList);
    }
};

export default setupTheme;
