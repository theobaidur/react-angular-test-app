import dateFromString from './dateFromString';

export function getMonths(start: Date, end: Date) {
  const years = end.getFullYear() - start.getFullYear();
  const months = years * 12 - (start.getMonth() + 1) + (end.getMonth() + 1);
  return months;
}

export function getAge(start: Date | string, end: Date | string = new Date()) {
  const s = dateFromString(start),
    e = dateFromString(end),
    months = getMonths(s, e);
  return Math.floor(months / 12);
}

export function getPensionDate(birth: Date | string, gender: number[]) {
  const birthDate = dateFromString(birth),
    pensionDate = new Date(+birthDate);
  pensionDate.setFullYear(
    pensionDate.getFullYear() + constantNumbers.defaultPension[gender[0] - 1]
  );
  return pensionDate;
}

export const constantNumbers = {
  workYears: [44, 43, 44],
  defaultPension: [65, 64, 65],

  AHV_max: 28440,
  AHV_needed: 4701,
  AHV_disWidow: 1.2,
  AHV_widow: 0.8,
  AHV_child: 0.4,
  AHV_orphan: 0.6,
  AHV_age: 21,

  AHV_minMedMax: function(level: number) {
    return level === 1 ? this.AHV_max / 24 : level === 2 ? Math.round(this.AHV_max / 16) : this.AHV_max / 12;
  },

  AHV_ageCut: function(age: number) {
    const index: number = Math.max(3, Math.min(5, Math.floor(age / 10))) - 3;
    return [0.7, 0.8, 0.9, 1][index];
  },

  UVG_max: 148200,
  UVG_basePercent: 0.8,
  UVG_720: 0.8,
  UVG_dis: 0.8,
  UVG_widow: 0.4,
  UVG_orphan: 0.15,
  UVG_child: 0.15,
  UVG_exwidow: 0.2,
  UVG_branches: [
    { ill: { from: 2, till: 730, percent: 90 }, acc: { from: 3, till: 730, percent: 80 } },
    { ill: { from: 2, till: 720, percent: 90 }, acc: { from: 3, till: 720, percent: 80 } },
    { ill: { from: 1, till: 720, percent: 90 }, acc: { from: 1, till: 720, percent: 80 } },
    { ill: { from: 1, till: 720, percent: 90 }, acc: { from: 1, till: 720, percent: 80 } },
    { ill: { from: 2, till: 720, percent: 90 }, acc: { from: 3, till: 720, percent: 80 } },
    { ill: { from: 2, till: 720, percent: 90 }, acc: { from: 3, till: 720, percent: 80 } },
    { ill: { from: 2, till: 720, percent: 90 }, acc: { from: 3, till: 720, percent: 80 } },
    { ill: { from: 2, till: 720, percent: 90 }, acc: { from: 3, till: 720, percent: 80 } },
    { ill: { from: 1, till: 720, percent: 90 }, acc: { from: 1, till: 720, percent: 80 } },
    { ill: { from: 1, till: 720, percent: 90 }, acc: { from: 1, till: 720, percent: 80 } },
    { ill: { from: 1, till: 720, percent: 90 }, acc: { from: 1, till: 720, percent: 80 } },
    { ill: { from: 1, till: 720, percent: 90 }, acc: { from: 1, till: 720, percent: 80 } },
    { ill: { from: 1, till: 720, percent: 90 }, acc: { from: 1, till: 720, percent: 80 } }
  ],

  BVG_child: 0.2,
  BVG_minPercent: 0.125,
  BVG_coordPercent: 0.875,
  BVG_pensionPercent: 0.068,

	BVG_dis: 0.0680,
	BVG_widow: 0.0408,
	BVG_orphan: 0.0136,
  BVG_interest: 0.01,
  BVG_offset: 0.0025,

  BVG_lvls: [
    { f: 25, t: 35, p: 0.07 },
    { f: 35, t: 45, p: 0.1 },
    { f: 45, t: 55, p: 0.15 },
    { f: 55, t: 65, p: 0.18 }
  ],

  BVG_lvl: function(start: number, end: number) {
    const lvl = this.BVG_lvls;
    let result = 0;
    for (var k = 0; k < lvl.length; k++) {
      if (start > lvl[k].t || end < lvl[k].f) {
        continue;
      }
      let year = 0;
      if (end > lvl[k].t) {
        year = Math.min(lvl[k].t - start, 10);
      } else if (end < lvl[k].t) {
        year = Math.min(end - lvl[k].f, end - start);
      }
      result += lvl[k].p * year;
    }
    return result;
  },
  BVG_stepin: function() {
    return (this.AHV_max * 3) / 4;
  },
  BVG_min: function() {
    return this.AHV_max * this.BVG_minPercent;
  },
  BVG_max: function() {
    return this.AHV_max * 2.125;
  },
  BVG_coord: function() {
    return this.AHV_max * this.BVG_coordPercent - this.BVG_min();
  }
};

export function getMyScale(average: number) {
  const maxAHV = constantNumbers.AHV_max,
    steps = maxAHV / 20,
    scaleMax = maxAHV * 3,
    scaleMin = maxAHV / 2;

  const myAverage = Math.min(Math.max(average, scaleMin), scaleMax);
  const scale = Math.min(Math.ceil(myAverage / steps) - 10, 50);

  const scaleArray = [
    0.083333,
    0.077756,
    0.07305,
    0.069122,
    0.065704,
    0.06279,
    0.060195,
    0.057974,
    0.05591,
    0.054125,
    0.052518,
    0.051064,
    0.04971,
    0.048474,
    0.04734,
    0.046326,
    0.04539,
    0.044497,
    0.043693,
    0.04292,
    0.042222,
    0.041295,
    0.040426,
    0.039587,
    0.038819,
    0.038095,
    0.037411,
    0.036764,
    0.036133,
    0.035552,
    0.035,
    0.034475,
    0.033975,
    0.033482,
    0.033027,
    0.032593,
    0.032177,
    0.031779,
    0.031383,
    0.031003,
    0.030667,
    0.03033,
    0.030005,
    0.02968,
    0.02938,
    0.029091,
    0.028812,
    0.028543,
    0.028271,
    0.02802,
    0.027778
  ];

  const myScale = scaleArray[scale];

  return (scaleMin + steps * scale) * myScale;
}

export function getMyScaleUVG(workregion: string, workyear: number) {
  var scale = {
    region: [
      [
        'AG',
        'AR',
        'AI',
        'BE',
        'FR',
        'GE',
        'GL',
        'GR',
        'JU',
        'LU',
        'NE',
        'NW',
        'OW',
        'SG',
        'SZ',
        'SO',
        'TI',
        'UR',
        'VD',
        'VS',
        'ZG'
      ],
      ['BL', 'BS'],
      ['ZH', 'SH', 'TG']
    ],
    name: ['bern', 'basel', 'zurich'],
    bern: [
      { s: 1, y: 1, t: 21 },
      { s: 2, y: 2, t: 30 },
      { s: 3, y: 4, t: 60 },
      { s: 5, y: 9, t: 90 },
      { s: 10, y: 14, t: 120 },
      { s: 15, y: 19, t: 150 },
      { s: 20, y: 99, t: 180 }
    ],
    basel: [
      { s: 1, y: 1, t: 21 },
      { s: 2, y: 3, t: 60 },
      { s: 4, y: 10, t: 90 },
      { s: 11, y: 15, t: 120 },
      { s: 16, y: 20, t: 150 },
      { s: 21, y: 99, t: 180 }
    ],
    zurich: [
      { s: 1, y: 1, t: 21 },
      { s: 2, y: 2, t: 56 },
      {
        s: 3,
        y: 99,
        t: function(a:any) {
          return 56 + +a * 7;
        }
      }
    ]
  };

  let useScale : any = [];
  for (var i = 0; i < scale.region.length; i++) {
    if (scale.region[i].find(x => x === workregion)) {
      const use : any  = scale.name[i];
      useScale = scale[use as 'basel' | 'bern' | 'zurich' ];
    }
  }
  var myScale = useScale.find( (x:any) => x.s <= workyear && x.y >= workyear);
  var days = 0;
  if( myScale ){ 
    if (typeof myScale.t === 'function') {
      days = myScale.t(workyear);
    } else {
      days = myScale.t;
    }
  }
  var result = { from: 1, till: days, percent: 100 };

  return result;
}
