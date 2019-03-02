import Adapter from './Adapter';
import AdaptableEngine from './AdaptableEngine';
import Client from './Client';
export default class NetworkEngine {
    private gameEngine;
    private adapter;
    private clients;
    private actionResults;
    private stateHistory;
    private simulationInterval;
    private lastTime;
    private currentTime;
    constructor(simulationInterval: number, gameEngine: AdaptableEngine, adapter: Adapter);
    registerClient(client: Client): void;
    handleInput(clinetId: string, data: any): void;
    private getNearestSnapshot;
    advance(delta: any): void;
    private applyActionResults;
    private step;
    readonly state: {
        time: number;
        state: any;
    }[];
}
