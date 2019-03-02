"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NetworkEngine_1 = require("./NetworkEngine");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function getTypes(data) {
    return {
        vsWorld: data.move ? [data.move] : [],
        vsEnv: data.act ? [data.act] : [],
        vsClient: data.fire ? [data.fire] : []
    };
}
function actionResult(actions, snapshots) {
    snapshots.map(s => s.state.action = actions[0]);
    return [];
}
const gameEngine = {
    step: function (state) { return {}; },
    applyResults: (state, results) => { }
};
const adapter = {
    getActionTypes: getTypes,
    getActionResult: actionResult
};
const engine = new NetworkEngine_1.default(20, gameEngine, adapter);
const cl1 = {
    id: 'client1',
    interp: 100,
    latency: 100
};
engine.registerClient(cl1);
rl.prompt();
rl.on('line', (l) => {
    const tokens = l.split(' ');
    switch (tokens[0]) {
        case 'm':
            engine.handleInput('client1', { move: 'move' });
            break;
        case 'a':
            engine.handleInput('client1', { act: 'act' });
            break;
        case 'f':
            engine.handleInput('client1', { fire: 'fire' });
            break;
    }
    const step = Number(tokens[1] || '15');
    console.clear();
    engine.advance(step);
    const state = engine.state;
    let topRow = '';
    let midRow = '';
    let botRow = '';
    let cliRow = '';
    for (let i = state.length - 30; i < state.length; i++) {
        if (state[i] !== undefined) {
            if (i % 2 === 0) {
                topRow += (state[i].time + '      ').slice(0, 6);
                midRow += '+-----';
                botRow += '      ';
            }
            else {
                topRow += '      ';
                midRow += '+-----';
                botRow += (state[i].time + '      ').slice(0, 6);
            }
            switch (state[i].state.action) {
                case 'move':
                    cliRow += '^move ';
                    break;
                case 'act':
                    cliRow += '^act  ';
                    break;
                case 'fire':
                    cliRow += '^fire ';
                    break;
                default:
                    cliRow += '      ';
            }
        }
    }
    console.log(topRow);
    console.log(midRow + '>');
    console.log(botRow);
    console.log(cliRow);
    rl.prompt();
});
//# sourceMappingURL=index.js.map