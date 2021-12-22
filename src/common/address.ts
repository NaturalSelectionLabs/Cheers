export const formatter = (address?: string): string => {
    if (address) {
        return address.length > 14 ? `${address.slice(0, 6)}....${address.slice(-4)}` : address;
    }
    return '...';
};

export const copyToClipboard = (text?: string) => {
    if (!text) return;

    navigator.clipboard.writeText(text).then(
        function () {
            console.log('Async: Copying to clipboard was successful!');
        },
        function (err) {
            console.log('Async: Could not copy the account: ', err);
        },
    );
};
