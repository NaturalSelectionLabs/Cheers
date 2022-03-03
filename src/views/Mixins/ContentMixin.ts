import { Vue } from 'vue-class-component';
import utils from '@/common/utils';

export class ContentMixin extends Vue {
    isLoadingContents: boolean = true;
    isWeb3Only: boolean = false;
    contents: any[] = [];
    contentTimestamp: string = '';
    isContentsHaveMore: boolean = true;

    async startLoadingContents() {
        this.isLoadingContents = true;
        const localStoreIsWeb3Only = JSON.parse(utils.getStorage('isWeb3Only') || 'false');
        this.isWeb3Only = localStoreIsWeb3Only;
        const { listed, haveMore, timestamp } = await utils.initContent('', this.isWeb3Only);
        while (listed.length > 0) {
            if ('target' in listed[0] && listed[0].target.field.includes('Mirror.XYZ')) {
                if (this.contents.findIndex((item) => 'target' in item && item.title === listed[0].title) === -1) {
                    this.contents.push(listed[0]);
                }
            } else {
                this.contents.push(listed[0]);
            }
            listed.shift();
        }
        this.contentTimestamp = timestamp;
        this.isContentsHaveMore = haveMore;
        this.isLoadingContents = false;
    }

    async loadMoreContents() {
        this.isLoadingContents = true;

        if (this.isContentsHaveMore) {
            const { listed, haveMore, timestamp } = await utils.initContent(this.contentTimestamp, this.isWeb3Only);
            while (listed.length > 0) {
                if ('target' in listed[0] && listed[0].target.field.includes('Mirror.XYZ')) {
                    if (this.contents.findIndex((item) => 'target' in item && item.title === listed[0].title) === -1) {
                        this.contents.push(listed[0]);
                    }
                } else {
                    this.contents.push(listed[0]);
                }
                listed.shift();
            }
            this.contentTimestamp = timestamp;
            this.isContentsHaveMore = haveMore;
        }

        this.isLoadingContents = false;
    }

    async updateFilteredContent() {
        const { listed, haveMore, timestamp } = await utils.initContent('', this.isWeb3Only);
        while (listed.length > 0) {
            if ('target' in listed[0] && listed[0].target.field.includes('Mirror.XYZ')) {
                if (this.contents.findIndex((item) => 'target' in item && item.title === listed[0].title) === -1) {
                    this.contents.push(listed[0]);
                }
            } else {
                this.contents.push(listed[0]);
            }
            listed.shift();
        }
        this.contentTimestamp = timestamp;
        this.isContentsHaveMore = haveMore;
    }

    async toggleWeb3Only() {
        this.isLoadingContents = true;
        this.contents = [];
        if (this.isWeb3Only !== undefined) {
            this.isWeb3Only = !this.isWeb3Only;
            utils.setStorage('isWeb3Only', JSON.stringify(this.isWeb3Only));
        }
        await this.updateFilteredContent();
        this.isLoadingContents = false;
    }

    clearContentDetails() {
        this.contents = [];
        this.contentTimestamp = '';
        this.isContentsHaveMore = true;
    }
}
