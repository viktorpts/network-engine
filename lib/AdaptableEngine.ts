export default interface AdaptableEngine {
    step(state: any): any;
    applyResults(state: any, results: any[]);
}