// units: mm

const main = () => [
  motor(),
  slipring().translate([0, 0, 35]),
  bearingLarge().translate([0, 0, 38]),
  // bearingSmall().translate([80, 0, 0]),

  base().subtract(bearingLarge().translate([0, 0, 38])),
  // motorScrews().translate([0, 0, 40]),
];

const fn = 100;


const base = () => color('blue',
  union(
    difference(
      cube({ size: [40, 40, 2], center: [true, true, false] }),
      cylinder({ h: 3, d: 23 }),
      motorScrews()
    ),
    arrangeInCircle({
      items: range(4).map(n => union(
        rotate( // arm  TODO: going to need more clearance under inner ring so that the arm for next gimbal can clamp on
          [0, -5, 0],
          cube({
            size: [30, 15, 5],
            center: [false, true, false],
            radius: 2,
            fn: 10,
          })),
        translate( // bearing holder nub
          [26, 0, 0],
          difference(
            cube({
              size: [10, 15, 15],
              center: [true, true, false],
              radius: 2,
              fn: 10,
            }),
            cube({
              size: [5, 15, 10],
              center: [false, true, false],
            }).translate([-5, 0, 8.5])
          )
        )
      )),
      r: 12
    }),
    difference(
      cylinder({ h: 2.3, d: 44.5 }),
      slipringScrews(),
      cylinder({ d: 23, h: 3 })
    ).translate([0, 0, 15]),
    rotate(
      [0, 0, 180],
      arrangeInCircle({
      items: range(3).map(n => cylinder({ d: 8, h: 16 })),
      r: 16,
    }))
  ).translate([0, 0, 30.75]));

const bearing = ({ h, dInnerInner, dInnerOuter, dOuterInner, dOuterOuter, numBalls, rBalls }) =>
  union(
    ring({
      dInner: dInnerInner,
      dOuter: dInnerOuter,
      h,
    }),
    ring({
      dInner: dOuterInner,
      dOuter: dOuterOuter,
      h,
    })/*,
    translate(
      [0, 0, h / 2],
      arrangeInCircle({
        items: range(numBalls).map(n => sphere({ r: rBalls })),
        r: (dOuterInner - (dOuterInner - dInnerOuter) / 2) / 2
      })
    )*/
  );

const ring = ({ dInner, dOuter, h }) => difference(
  cylinder({ d: dOuter, h, fn }),
  cylinder({ d: dInner, h, fn })
);

const rad = 180 / Math.PI;

const arrangeInCircle = ({ items, r }) => {
  const dTheta = (Math.PI * 2) / items.length;
  return items.map((item, i) => translate(
    [r * Math.cos(i * dTheta), r * Math.sin(i * dTheta)],
    rotate([0, 0, i * dTheta * rad], item)
  ));
};

const bearingLarge = () => bearing({
  h: 12.95,
  dInnerInner: 54.95,
  dInnerOuter: 62,
  dOuterInner: 73.1,
  dOuterOuter: 80,
  numBalls: 15,
  rBalls: 4.5,
});

const bearingSmall = () => bearing({
  h: 12.75,
  dInnerInner: 25.35,
  dInnerOuter: 31.21,
  dOuterInner: 40.9,
  dOuterOuter: 50.75,
  numBalls: 10,
  rBalls: 3.75,
});

const slipringScrews = () => union(arrangeInCircle({
  items: range(3).map(n => cylinder({ d: 5.45, h: 3 })),
  r: 18,
}));

const slipring = () => {
  const dCyl = 22;

  return union(
    translate(
      [0, 0, 13],
      difference(
        cylinder({ h: 2.3, d: 44.5 }),
        slipringScrews(),
        cylinder({ d: dCyl, h: 3 })
      )
    ),
    ring({
      dOuter: dCyl,
      dInner: 13.3,
      h: 20.75,
    }),
    color('red', // TODO: bottom side actually has a smaller ring that rotates
      ring({
        dOuter: 13.3,
        dInner: 5,
        h: 20.75,
      })
    )
  );
};

const motor = () => {
  const h = 30.75;
  const w = 38.5;

  return union(
    // body
    difference(
      cube({
        size: [w, w, h],
        center: [true, true, false],
        radius: [5, 5, 0],
      }),
      motorScrews().translate([0, 0, h - 5])
    ),

    // spacer
    cylinder({
      d: 22, h: 2
    }).translate([0, 0, h]),

    // shaft
    cylinder({ d: 5, h: 20 })
      .subtract(
        cube({
          size: [5, 1, 18],
          center: [true, true, false],

        })
          .translate([0, 2, 2]))
      .translate([0, 0, h + 2])
  ).setColor([0.8, 0.8, 0.8]);
};

const motorScrews = () => union(
  vertsSquare(31)
    .map(arr => cylinder({ d: 3.5, h: 5 })
      .translate(arr))
);


const vertsSquare = (diameter) =>
  [[-0.5, -0.5], [-0.5, 0.5], [0.5, -0.5], [0.5, 0.5]]
    .map(arr => arr.map((n) => n * diameter));

const range = n => Array(n).join().split(',').map((n, i) => i);