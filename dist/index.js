export function useTestHelpers(options) {
    console.log(options);
    const greet = (name) => `Hello111, ${name}!`;
    return {
        greet
    };
}
const { greet } = useTestHelpers();
console.log(greet('GREG'));
