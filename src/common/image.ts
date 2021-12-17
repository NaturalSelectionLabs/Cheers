export function imgRegSrc(oldStr: string): { newStr: string; srcArr: string[] } {
    const imgReg = /<img.*?(?:>|\/>)/gi;
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    const imgArr = oldStr.match(imgReg) || [];
    const srcArr: string[] = [];
    let newStr = oldStr.replaceAll('">,<img', '"><img');
    imgArr.forEach((item) => {
        if (!item.includes('class="emoji"')) {
            // Only for non-emoji images
            // TODO: SPLIT ATTACHMENT FILES!!!
            let tem = srcReg.exec(item);
            if (tem) {
                srcArr.push(tem[1]);
            }
            newStr = newStr.replace(item, '');
        } else {
            newStr = newStr.replace(
                item,
                item.replace('class="emoji"', 'style="display:inline;width:1.6em; height:1.6em;"'),
            );
        }
    });

    return {
        newStr,
        srcArr,
    };
}

export function mdImgRegSrc(oldStr: string): { newStr: string; srcArr: string[] } {
    let imgReg = /!\[(.*?)\]\(.*?\)/gi;
    let srcReg = /\((.+?)\)/gi;
    let imgArr = oldStr.match(imgReg) || [];
    let srcArr: string[] = [];
    imgArr.forEach((item) => {
        let tem = srcReg.exec(item);
        if (tem) {
            srcArr.push(tem[1]);
        }
    });

    return {
        newStr: oldStr.replaceAll(imgReg, ''),
        srcArr: srcArr,
    };
}
