

export function useTestHelpers(options?:any) {
    console.log(options)
    const greet = (name: string) => `Hello111, ${name}!`

    return {
        greet
    }
}

const {greet} = useTestHelpers()

console.log(greet('GREG'))