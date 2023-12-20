const FLIP_FLOPP_REFIX = '%',
  CONJUCTION_PREFIX = '&';
const INITIAL_STATE = 0;
const LOW_PULSE = false,
  HIGH_PULSE = true;
const INITIAL_CONJUCTION_INPUT_STATE = LOW_PULSE;
const BUTTON_PUSHES = 1000;

const START_MODULE_NAME = 'broadcaster';

const MODULE_TYPES = {
  FLIP_FLOP: 0,
  CONJUCTION: 1,
  BROADCAST: 2,
  OUTPUT: 3,
};

const outputEmitter = () => {};

const getFlipFlopEmitter = () => {
  let currState = INITIAL_STATE;
  return pulse => {
    if (pulse === LOW_PULSE) {
      currState = !currState;
      return currState ? HIGH_PULSE : LOW_PULSE;
    }
  };
};

const getConjuctionEmitter = (...inputNames) => {
  const inputValues = inputNames.reduce((acc, curr) => {
    acc[curr] = INITIAL_CONJUCTION_INPUT_STATE;
    return acc;
  }, {});

  return (pulse, inputName) => {
    // console.log('ConjuctionEmitter', inputValues, pulse, inputName);
    inputValues[inputName] = pulse;
    if (Object.values(inputValues).every(v => v === HIGH_PULSE)) return LOW_PULSE;
    return HIGH_PULSE;
  };
};

const broadcastEmitter = pulse => pulse;
const flipFlopEmitter = pulse => (pulse === LOW_PULSE ? !currState : currState);
const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const input = readFileToString('input.txt');

const getModuleType = str => {
  if (str.startsWith(FLIP_FLOPP_REFIX)) return MODULE_TYPES.FLIP_FLOP;
  if (str.startsWith(CONJUCTION_PREFIX)) return MODULE_TYPES.CONJUCTION;
  if (str === 'broadcaster') return MODULE_TYPES.BROADCAST;
  return MODULE_TYPES.OUTPUT;
};

const getModuleName = (str, type) => {
  if ([MODULE_TYPES.FLIP_FLOP, MODULE_TYPES.CONJUCTION].includes(type)) return str.slice(1);
  return str;
};

const getAllConjuctionModuleNames = strings =>
  strings
    .filter(s => s.startsWith(CONJUCTION_PREFIX))
    .map(s => getModuleName(s.split(' -> ')[0], MODULE_TYPES.CONJUCTION));

const getAllConjuctionModuleInputs = (moduleName, strings) => {
  return strings
    .map(s => s.split(' -> '))
    .filter(([, destinations]) => destinations.includes(moduleName))
    .map(([name]) => getModuleName(name, getModuleType(name)));
};

const getModuleEmitor = (moduleType, inputs, res) => {
  switch (moduleType) {
    case MODULE_TYPES.FLIP_FLOP:
      return getFlipFlopEmitter();
    case MODULE_TYPES.CONJUCTION:
      return getConjuctionEmitter(...inputs);
    case MODULE_TYPES.BROADCAST:
      return broadcastEmitter;
    case MODULE_TYPES.OUTPUT:
      return outputEmitter;
  }
};

const getAnswer = strings => {
  const res = {
    low: 0,
    high: 0,
  };

  const allConjuctionModuleNames = getAllConjuctionModuleNames(strings);

  const comjuctionModuleInputs = allConjuctionModuleNames.reduce((acc, curr) => {
    acc[curr] = getAllConjuctionModuleInputs(curr, strings);
    return acc;
  }, {});

  const moduleMap = strings.reduce((acc, curr) => {
    const [moduleNameStr, destinationsStr] = curr.split(' -> ');
    const type = getModuleType(moduleNameStr),
      name = getModuleName(moduleNameStr, type),
      destinations = destinationsStr.split(', '),
      emitor = getModuleEmitor(type, comjuctionModuleInputs[name], res);
    acc[name] = {type, destinations, emitor};
    return acc;
  }, {});

  console.log('moduleMap', moduleMap);

  moduleMap['rx'] = {
    type: MODULE_TYPES.OUTPUT,
    destinations: [],
    emitor: outputEmitter,
  };

  let counter = {
    low: 0,
    high: 0,
  };

  for (let i = 0; i < BUTTON_PUSHES; i++) {
    console.log(i);
    const inputPulse = LOW_PULSE;
    const queue = [
      {
        pulse: LOW_PULSE,
        moduleName: START_MODULE_NAME,
      },
    ];
    while (queue.length > 0) {
      // console.log('queue', queue);
      const {moduleName, pulse, sourceName} = queue.pop();

      counter[pulse ? 'high' : 'low']++;

      const currModuleOutput = moduleMap[moduleName].emitor(pulse, sourceName);

      if (currModuleOutput !== undefined) {
        const currModuleDestinations = moduleMap[moduleName].destinations;

        currModuleDestinations.forEach(d =>
          console.log(moduleName, currModuleOutput ? 'high' : 'low', d)
        );

        queue.unshift(
          ...currModuleDestinations
            .map(dest => ({pulse: currModuleOutput, moduleName: dest, sourceName: moduleName}))
            .reverse()
        );
      }
    }
  }

  console.log(counter, counter.high * counter.low);

  return '';
};
writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
