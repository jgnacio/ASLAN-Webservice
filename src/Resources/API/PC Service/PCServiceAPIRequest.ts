export interface PCServiceCategoryCodeType {
  name: string;
  nameES: string;
  code: number;
  subCategories: {
    name: string;
    nameES: string;
    code: number;
  }[];
}

export const defaultPCServiceRelevantCategories = [
  {
    name: "Apple",
    nameES: "Apple",
    code: 66822,
    subCategories: [
      {
        name: "ACCESORIOS IPAD",
        nameES: "ACCESORIOS IPAD",
        code: 66823,
      },
      {
        name: "ACCESORIOS MACBOOK",
        nameES: "ACCESORIOS MACBOOK",
        code: 66825,
      },
      {
        name: "MAC MINI",
        nameES: "MAC MINI",
        code: 85422,
      },
      {
        name: "MACBOOK",
        nameES: "MACBOOK",
        code: 66831,
      },
    ],
  },
  {
    name: "Headphones - Microphones",
    nameES: "Auriculares - Microfonos",
    code: 447,
    subCategories: [
      {
        name: "ACCESORIOS",
        nameES: "ACCESORIOS",
        code: 69285,
      },
      {
        name: "BLUETOOTH",
        nameES: "BLUETOOTH",
        code: 40465,
      },
      {
        name: "CABLEADOS",
        nameES: "CABLEADOS",
        code: 359,
      },
      {
        name: "CABLEADOS",
        nameES: "CABLEADOS",
        code: 272,
      },
      {
        name: "MICROFONOS",
        nameES: "MICROFONOS",
        code: 69413,
      },
      {
        name: "HEADSETS",
        nameES: "PC / GAMING",
        code: 69270,
      },
    ],
  },
  {
    name: "Cooling",
    nameES: "Cooling",
    code: 830,
    subCategories: [
      {
        name: "COOLING",
        nameES: "COOLING",
        code: 321,
      },
    ],
  },
  {
    name: "Storage",
    nameES: "Discos Duros - Solidos",
    code: 651,
    subCategories: [
      {
        name: "HDD 2.5'' EXTERNOS",
        nameES: "HDD 2.5'' EXTERNOS",
        code: 2081,
      },
      {
        name: "HDD 3.5'' INTERNOS",
        nameES: "HDD 3.5'' INTERNOS",
        code: 3705,
      },
      {
        name: 'SSD 2.5"  INTERNOS',
        nameES: 'SSD 2.5"  INTERNOS',
        code: 15035,
      },
      {
        name: "SSD EXTERNO 2.5",
        nameES: "SSD EXTERNO 2.5",
        code: 61068,
      },
      {
        name: "SSD M2",
        nameES: "SSD M2",
        code: 72423,
      },
    ],
  },
  {
    name: "Built PCs",
    nameES: "Equipos Armados",
    code: 2074,
    subCategories: [
      {
        name: "MINI PC",
        nameES: "MINI PC",
        code: 19054,
      },
      {
        name: "PC DE ESCRITORIO",
        nameES: "PC DE ESCRITORIO",
        code: 2083,
      },
    ],
  },
  {
    name: "Cases - Combos",
    nameES: "Gabinetes - Combos",
    code: 635,
    subCategories: [
      {
        name: "COMBOS",
        nameES: "COMBOS",
        code: 397,
      },
      {
        name: "GABINETES",
        nameES: "GABINETES",
        code: 399,
      },
    ],
  },
  {
    name: "Gaming",
    nameES: "Gaming - PC",
    code: 35373,
    subCategories: [
      {
        name: "MSI",
        nameES: "MSI",
        code: 30425,
      },
      {
        name: "COOLMAX",
        nameES: "COOLMAX",
        code: 70075,
      },
      {
        name: "MARVO",
        nameES: "MARVO",
        code: 67932,
      },
    ],
  },
  {
    name: "Memories",
    nameES: "Memorias",
    code: 211,
    subCategories: [
      {
        name: "DIMM DDR4",
        nameES: "DIMM DDR4",
        code: 67230,
      },
      {
        name: "SODIMM DDR4",
        nameES: "SODIMM DDR4",
        code: 213,
      },
      {
        name: "SODIM DDR5",
        nameES: "SODIM DDR5",
        code: 89264,
      },
    ],
  },
  {
    name: "CPU",
    nameES: "CPU",
    code: 696,
    subCategories: [
      {
        name: "AMD",
        nameES: "AMD",
        code: 346,
      },
    ],
  },
  {
    name: "Monitors",
    nameES: "Monitores",
    code: 637,
    subCategories: [
      {
        name: "MONITORES GAMING",
        nameES: "MONITORES GAMING",
        code: 71138,
      },
    ],
  },
  {
    name: "Motherboards",
    nameES: "Motherboards",
    code: 698,
    subCategories: [
      {
        name: "AMD",
        nameES: "AMD",
        code: 312,
      },
      {
        name: "INTEL",
        nameES: "INTEL",
        code: 311,
      },
    ],
  },
  {
    name: "Notebooks",
    nameES: "Notebooks",
    code: 2075,
    subCategories: [
      {
        name: "NETBOOKS\r\nNUEVOS",
        nameES: "NETBOOKS\r\nNUEVOS",
        code: 2089,
      },
      {
        name: "2 EN 1",
        nameES: "2 EN 1",
        code: 72175,
      },
      {
        name: "GAMERS",
        nameES: "GAMERS",
        code: 68558,
      },
      {
        name: "MACBOOKS",
        nameES: "MACBOOKS",
        code: 66294,
      },
      {
        name: "NOTEBOOKS",
        nameES: "NOTEBOOKS",
        code: 52200,
      },
      {
        name: 'NUEVOS 14" A  15,6"',
        nameES: 'NUEVOS 14" A  15,6"',
        code: 3708,
      },
    ],
  },
  {
    name: "For Notebooks",
    nameES: "Accesorios de Notebooks",
    code: 531,
    subCategories: [
      {
        name: "ACCESORIOS",
        nameES: "ACCESORIOS",
        code: 306,
      },
      {
        name: "MACBOOKS",
        nameES: "MACBOOKS",
        code: 66294,
      },
    ],
  },
  {
    name: "Notebooks Bags",
    nameES: "Notebooks - Bolsos - Sobres",
    code: 2158,
    subCategories: [
      {
        name: 'BOLSOS 14"',
        nameES: 'BOLSOS 14"',
        code: 66795,
      },
      {
        name: 'BOLSOS 15,6"',
        nameES: 'BOLSOS 15,6"',
        code: 6764,
      },
      {
        name: 'BOLSOS 17"',
        nameES: 'BOLSOS 17"',
        code: 6765,
      },
      {
        name: "SOBRES",
        nameES: "SOBRES",
        code: 35819,
      },
    ],
  },
  {
    name: "Notebooks - Backpacks",
    nameES: "Notebooks - Mochilas",
    code: 2157,
    subCategories: [
      {
        name: "MOCHILAS 14'' - 15.6''",
        nameES: "MOCHILAS 14'' - 15.6''",
        code: 6931,
      },
      {
        name: "MOCHILAS 16'' - 18.4''",
        nameES: "MOCHILAS 16'' - 18.4''",
        code: 6930,
      },
      {
        name: "MOCHILAS XIOAMI",
        nameES: "MOCHILAS XIOAMI",
        code: 75014,
      },
    ],
  },
  {
    name: "Speakers",
    nameES: "Parlantes",
    code: 248,
    subCategories: [
      {
        name: "BARRAS DE SONIDO",
        nameES: "BARRAS DE SONIDO",
        code: 56276,
      },
      {
        name: "PARLANTES BT",
        nameES: "PARLANTES BT",
        code: 35371,
      },
    ],
  },
  {
    name: "GPU",
    nameES: "GPU",
    code: 959,
    subCategories: [
      {
        name: "TARJETAS VIDEO GAMING",
        nameES: "TARJETAS VIDEO GAMING",
        code: 401,
      },
    ],
  },
  {
    name: "Keyboards - Combos",
    nameES: "Teclados - Combos",
    code: 440,
    subCategories: [
      {
        name: "COMBOS CABLEADOS",
        nameES: "COMBOS CABLEADOS",
        code: 382,
      },
      {
        name: "COMBOS ERGONOMICO",
        nameES: "COMBOS ERGONOMICO",
        code: 83223,
      },
      {
        name: "COMBOS INALÁMBRICOS",
        nameES: "COMBOS INALÁMBRICOS",
        code: 381,
      },
      {
        name: "TECLADO ERGONOMICO",
        nameES: "TECLADO ERGONOMICO",
        code: 83239,
      },
      {
        name: "TECLADOS GAMING",
        nameES: "TECLADOS GAMING",
        code: 67672,
      },
      {
        name: "TECLADOS INALÁMBRICOS",
        nameES: "TECLADOS INALÁMBRICOS",
        code: 11999,
      },
      {
        name: "TECLADOS MINI",
        nameES: "TECLADOS MINI",
        code: 11886,
      },
      {
        name: "TECLADOS USB",
        nameES: "TECLADOS USB",
        code: 383,
      },
    ],
  },
  {
    name: "Webcams",
    nameES: "Webcam - TV - Video",
    code: 493,
    subCategories: [
      {
        name: "WEBCAM",
        nameES: "WEBCAM",
        code: 274,
      },
    ],
  },
];
