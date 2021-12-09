import RSS3 from '@/common/rss3';
import { RSS3Asset } from 'rss3-next/types/rss3';

const setupTheme = (assets: RSS3Asset[]) => {
    // Setup theme
    const themes = RSS3.getAvailableThemes(assets);
    if (themes[0]) {
        document.body.classList.add(themes[0].class);
    } else {
        document.body.classList.remove(...document.body.classList);
    }
};

export default setupTheme;
