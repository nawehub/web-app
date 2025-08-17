export const formatResponse = (response: string) => {
    const regex: RegExp = /"([^"]+)"/;
    const match: RegExpExecArray | null = regex.exec(response);

    let desiredString: string = '';
    if (match && match.length > 1) {
        desiredString = match[1];
    }
    return desiredString;
};