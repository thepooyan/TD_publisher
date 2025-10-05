let publishProfileCache:string | null = null;

export const getPublishProfile = () => {
    if (!publishProfileCache) publishProfileCache = selectPublishProfile()
    return publishProfileCache
}

export const selectPublishProfile = () => {
    return ""
}