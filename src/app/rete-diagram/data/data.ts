export const inverterData = [
  {
    id: 1,
    inputs: [
      {
        id: 1,
        name: 'Input 1',
      },
      {
        id: 2,
        name: 'Input 2',
      },
    ],
    outputs: [
      {
        id: 1,
        name: 'Output 1',
      },
    ],
    name: 'Inverter 1',
    type: 'inverter',
    imgUrl: 'assets/images/inverter.png',
    layer: -350,
  },
  {
    id: 2,
    inputs: [
      {
        id: 1,
        name: 'Input 1',
      },
      {
        id: 2,
        name: 'Input 2',
      },
      {
        id: 3,
        name: 'Input 3',
      },
    ],
    outputs: [
      {
        id: 1,
        name: 'Output 1',
      },
    ],
    name: 'Inverter 2',
    type: 'inverter',
    imgUrl: 'assets/images/inverter.png',
    layer: -350,
  },
];

export const combinerBoxData = [
  {
    id: 1,
    inputs: [
      {
        id: 1,
        name: 'Input 1',
      },
      {
        id: 2,
        name: 'Input 2',
      },
      {
        id: 3,
        name: 'Input 3',
      },
    ],
    outputs: [
      {
        id: 1,
        name: 'Output 1',
      },
    ],
    name: 'Combiner Box 1',
    type: 'combinerbox',
    imgUrl: 'assets/images/combinerbox.png',
    layer: 0,
  },
  {
    id: 1,
    inputs: [
      {
        id: 1,
        name: 'Input 1',
      },
      {
        id: 2,
        name: 'Input 2',
      },
      {
        id: 3,
        name: 'Input 3',
      },
      {
        id: 4,
        name: 'Input 4',
      },
    ],
    outputs: [
      {
        id: 1,
        name: 'Output 1',
      },
    ],
    name: 'Combiner Box 2',
    type: 'combinerbox',
    imgUrl: 'assets/images/combinerbox.png',
    layer: 0,
  },
];

export const transformerData = [
  {
    id: 1,
    inputs: [
      {
        id: 1,
        name: 'Input 1',
      },
      {
        id: 2,
        name: 'Input 2',
      },
      {
        id: 3,
        name: 'Input ',
      },
    ],
    outputs: [
      {
        id: 1,
        name: 'Output 1',
      },
    ],
    name: 'Transformer 1',
    type: 'transformer',
    imgUrl: 'assets/images/transformer.png',
    layer: 350,
  },
];

export const response = {
  strings: [
    {
      id: 1,
    },
    {
      id: 2,
    },
    ,
    {
      id: 3,
    },
  ],
  inverters: [
    {
      id: 1,
      noOfTackerConfig: 3,
      inverteTrackerConfigs: [
        {
          inputA: [1],
          inputB: [2, 3],
        },
      ],
    },
  ],
  common: [
    {
      id: 10,
      name: 'combinerBox',
      noOfInput: 6,
      noOfOutPut: 2,
      input: [
        {
          type: 'inverter',
          output: 'index 1',
          id: 1,
        },
        {
          type: 'inverter',
          output: 'index 2',
          id: 2,
        },
      ],
    },
    {
      id: 100,
      name: 'Transfomer',
      noOfInput: 4,
      noOfOutPut: 2,
      input: [
        {
          type: 'combinerBox',
          output: 'index 1',
          id: 10,
        },
      ],
    },
    {
      id: 101,
      name: 'Transfomer',
      noOfInput: 4,
      noOfOutPut: 2,
      input: [
        {
          type: 'combinerBox',
          output: 'index 1',
          id: 10,
        },
      ],
    },
  ],
};
