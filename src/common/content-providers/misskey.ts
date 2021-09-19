import axios from 'axios';

function splice(account: string) {
    const splices = account.split('@');
    if (splices.length < 2) {
        return false;
    }
    const username = splices[0];
    const instance = splices[1];
    return {
        instance,
        username,
    };
}

interface FeedItem {
    content_html: string; // Full content
    url: string; // Note link
    title: string; // New note by {{ user.name }}
    date_modified: string; // Timestamp
}

export default {
    verify: async (account: string, rns: string, ethAddress: string): Promise<boolean> => {
        const { username, instance } = splice(account);
        try {
            const res = await axios.post(`https://${instance}/api/users/show`, {
                username: username,
            });
            const u = res.data;
            if (u) {
                // Phase 1: in "name"
                if ((rns && u.name?.includes(rns)) || u.name?.includes(ethAddress)) {
                    return true;
                }

                // Phase 2: in "description"
                if ((rns && u.description?.includes(rns)) || u.description?.includes(ethAddress)) {
                    return true;
                }

                // Phase 3: in "fields"
                if (u.fields?.length) {
                    for (const pair of u.fields) {
                        if ((rns && pair.value?.includes(rns)) || pair.value?.includes(ethAddress)) {
                            return true;
                        }
                    }
                }

                // Phase 4: in "pinnedNotes"
                if (u.pinnedNotes?.length) {
                    for (const note of u.pinnedNotes) {
                        if ((rns && note.text?.includes(rns)) || note.text?.includes(ethAddress)) {
                            return true;
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
            return false;
        }

        // Else: not verified
        return false;
    },
    get: async (account: string): Promise<FeedItem[]> => {
        const { username, instance } = splice(account);
        try {
            const res = await axios.get(`https://${instance}/@${username}.json`);
            const data = res.data;
            if (data.items?.length) {
                return <FeedItem[]>data.items;
            }
        } catch (e) {
            console.log(e);
        }
        return [];
    },
};
