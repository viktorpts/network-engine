import Adapter from './Adapter';
import AdaptableEngine from './AdaptableEngine';
import Client from './Client';


export default class NetworkEngine {
    private gameEngine: AdaptableEngine;
    private adapter: Adapter;
    private clients: Map<string, Client>;
    private actionResults: any[];
    private stateHistory: { time: number, state: any }[];
    private simulationInterval: number;
    private lastTime: number;
    private currentTime: number;

    constructor(simulationInterval: number, gameEngine: AdaptableEngine, adapter: Adapter) {
        this.gameEngine = gameEngine;
        this.adapter = adapter;
        this.clients = new Map<string, Client>();
        this.actionResults = [];

        const historyLength = Math.ceil(1000 / simulationInterval);
        this.stateHistory = Array(historyLength - 1);
        this.stateHistory.push({time: 0, state: {}});
        this.simulationInterval = simulationInterval;
        this.lastTime = 0;
        this.currentTime = 0;
    }

    registerClient(client: Client) {
        this.clients.set(client.id, client);
    }

    handleInput(clinetId: string, data) {
        const client = this.clients.get(clinetId);
        const actions = this.adapter.getActionTypes(data);
        const currentState = this.stateHistory[this.stateHistory.length - 1];

        if (actions.vsWorld.length > 0) {
            this.adapter.getActionResult(actions.vsWorld, [currentState]).map(r => this.actionResults.push(r));
        }

        if (actions.vsEnv.length > 0) {
            const vsEnvShift = client.interp + client.latency;
            const snapshots = this.getNearestSnapshot(vsEnvShift);
            if (snapshots.length > 0) {
                this.adapter.getActionResult(actions.vsEnv, snapshots).map(r => this.actionResults.push(r));
            }
        }

        if (actions.vsClient.length > 0) {
            const vsClientShift = client.interp + client.latency + client.latency;
            const snapshots = this.getNearestSnapshot(vsClientShift);
            if (snapshots.length > 0) {
                this.adapter.getActionResult(actions.vsClient, snapshots).map(r => this.actionResults.push(r));
            }
        }
    }

    private getNearestSnapshot(delay: number): any[] {
        const result = [];
        for (let i = this.stateHistory.length - 1; i >= 0; i--) {
            const pastState = this.stateHistory[i];
            if (pastState === undefined) {
                break;
            } else if (pastState.time + delay <= this.currentTime) {
                result.push(pastState);
                if (pastState.time + delay !== this.currentTime && i < this.stateHistory.length - 1) {
                    result.push(this.stateHistory[i + 1]);
                }
                break;
            }
        }
        return result;
    }

    advance(delta) {
        this.applyActionResults();
        this.currentTime += delta;
        while (this.currentTime > this.lastTime + this.simulationInterval) {
            this.lastTime += this.simulationInterval;
            this.step();
        }
    }

    private applyActionResults() {
        this.gameEngine.applyResults(this.stateHistory[this.stateHistory.length - 1], this.actionResults);
        this.actionResults.length = 0;
    }

    private step() {
        const currentState = this.stateHistory[this.stateHistory.length - 1];
        const newState = this.gameEngine.step(currentState.state);

        this.stateHistory.shift();
        this.stateHistory.push({
            time: this.lastTime,
            state: newState
        });
    }

    get state() {
        return this.stateHistory;
    }
}