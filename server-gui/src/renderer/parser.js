'use module';

function decodePos(code) {
  const arr = code.split(' ');
  return {
    // 0-indexed
    y: parseInt(arr[0], 10) - 1,
    x: parseInt(arr[1], 10) - 1,
  };
}

// ([{x: integer, y: integer}], integer, integer) -> Symmetry
export function checkSymmetry(positions, w, h) {
  console.log(positions);
  console.log(w, h);
  const mirrorX = positions[0].x === w - positions[1].x - 1;
  const mirrorY = positions[0].y === h - positions[1].y - 1;
  console.log(mirrorX, mirrorY);
  if (mirrorX && mirrorY) return 'Point';
  const sameX = positions[0].x === positions[1].x;
  const sameY = positions[0].y === positions[1].y;
  if (mirrorX && sameY) return 'MirrorY';
  if (mirrorY && sameX) return 'MirrorX';
  return 'Asymmetry';
}

// (
//   {tbl: [[{agent: bool, color: string, score: integer}]], w: integer, h: integer},
//   [[{x: integer, y: integer}]],
//   string
// )
// -> {
//   tbl: {tbl: [[{agent: bool, color: string, score: integer}]], w: integer, h: integer},
//   succes: bool
// }
export function tryInferAgents(tbl, positions, myColor) {
  const symmetry = checkSymmetry(positions, tbl.w, tbl.h);
  const rivalColor = myColor === 'Red' ? 'Blue' : 'Red';
  const { h, w, arr } = tbl;
  let succes = true;
  for (let i = 0; i < positions.length; i += 1) {
    const { x, y } = positions[i];
    arr[y][x].color = myColor;
    arr[y][x].agent = true;
    if (symmetry === 'Point') {
      arr[h - y - 1][x].color = rivalColor;
      arr[h - y - 1][x].agent = true;
    } else if (symmetry === 'MirrorX') {
      arr[y][w - x - 1].color = rivalColor;
      arr[y][w - x - 1].agent = true;
    } else if (symmetry === 'MirrorY') {
      arr[h - y - 1][x].color = rivalColor;
      arr[h - y - 1][x].agent = true;
    } else { // Asymmetry
      succes = false;
    }
  }
  return { tbl: { arr, w, h }, succes };
}

// (string, string)
// -> {tbl: [[{agent: bool, color: string, score: integer}]], w: integer, h: integer}
export default function parseQR(code, myColor) {
  const sections = code.split(':');
  const header = sections[0].split(' ');
  const h = header[0];
  const w = header[1];
  const agents = [
    decodePos(sections[sections.length - 2]),
    decodePos(sections[sections.length - 3]),
  ];
  const body = sections.slice(1, sections.length - 3);
  const emptyTbl =
    body.map(line => line.split(' ').map(score => ({
      score: parseInt(score, 10),
      agent: false,
      color: 'Neut',
    })));
  const { tbl, succes } = tryInferAgents({ arr: emptyTbl, w, h }, agents, myColor);
  return {
    tbl: {
      arr: tbl,
      w,
      h,
    },
    succes,
  };
}

