export const randomWidthPercent = (from: number, to: number) => {
    return `${Math.floor(Math.random() * (to - from + 1) + from)}%`
}

export const randomNumber = (from: number, to: number) => {
    return Math.floor(Math.random() * (to - from + 1) + from)
}

export const randomTrueFalse = () => {
    return Math.random() < 0.5
}
