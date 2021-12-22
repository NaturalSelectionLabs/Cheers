import RSS3, { IRSS3 } from '@/common/rss3';

const setupTheme = async () => {
    // Setup theme
    const pageOwner = RSS3.getPageOwner();
    const apiUser = RSS3.getAPIUser().persona as IRSS3;
    const assets = (await apiUser.assets.auto.getList(pageOwner.address)) || [];
    const _passAssetsField = pageOwner.file?.['_pass']?.assets || [];
    const themes = RSS3.getAvailableThemes(assets, _passAssetsField);
    if (themes[0]) {
        document.body.classList.add(themes[0].class);
    } else {
        document.body.classList.remove(...document.body.classList);
    }
};

export default setupTheme;
