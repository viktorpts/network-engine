export default interface Adapter {
    getActionTypes: GetActionTypesFn,
    getActionResult: GetActionResultFn
}

interface GetActionTypesFn {
    (data: {}): { vsWorld?: any[], vsEnv?: any[], vsClient?: any[] };
}

interface GetActionResultFn {
    (actions: any[], snapshots: any[]): any[];
}
