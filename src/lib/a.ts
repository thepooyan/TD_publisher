export const determineError = (str: string) => {
    let target = errors.find(er => str.includes(er.identifier))
    if (!target) return errorTyes.Unknown
    return target.type
}

export enum errorTyes {
    Internet,
    Unknown
}

const errors = [
    {
        identifier: "unable to access",
        type: errorTyes.Internet
    }
]