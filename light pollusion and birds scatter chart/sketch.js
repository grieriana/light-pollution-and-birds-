//Scatter Graph showing the realtionship between light pollution and the amoung of birds
// LED light vs HPS in relation to birds
// Size shows the brightness

let data;
let scatterData;

async function setup() {
  createCanvas(1200, 700);

  data = await tableToDataFrame('data/light_bird_data.csv', ',', 'header');

  // Lux values
  data = data.addColumn('LuxValue', (row) => {
    let lux = Number(row['Lux']);
    return Number.isFinite(lux) ? lux : null;
  });

  //  Bird Song values
  data = data.addColumn('BirdSongs', (row) => {
    let birds = parseInt(row['Bird_Songs'], 10);
    return !isNaN(birds) ? birds : null;
  });

  // Light Type
  data = data.addColumn('LightType', (row) => {
    let type = String(row['Light_Type'] || '').trim();
    if (type === 'LED') return 'LED';
    if (type === 'HPS') return 'HPS';
    return 'Unknown';
  });

  // Filter to valid rows
  let validData = data.filter((row) => {
    return row['LuxValue'] !== null &&
      row['BirdSongs'] !== null &&
      row['LightType'] !== 'Unknown';
  });

  scatterData = validData;
}

function draw() {
  background(250);

  if (!scatterData) {
    fill(20);
    noStroke();
    textSize(18);
    textAlign(CENTER, CENTER);
    text('Loading light dataset...', width / 2, height / 2);
    return;
  }

  // Reset hover state
  p5.prototype.chart.hoverState.active = false;

  // display data in a scatter graph
  scatter(scatterData, {
    x: 'LuxValue',
    y: 'BirdSongs',
    size: 'LuxValue',
    color: 'LightType',

    title: 'Birds and light pollution',
    subtitle: 'The amount of bird songs heard around LED and HPS lighting',

    xLabel: 'Light Intensity (Lux)',
    yLabel: 'Number of Bird Songs Heard',

    minSize: 15,
    maxSize: 30,
    pointStyle: 'filled',

    palette: ['#3498db', '#f39c12'],

    showValues: false,

    minX: 0,
    maxX: 400,
    minY: 0,
    maxY: 6,

    margin: { top: 120, right: 180, bottom: 80, left: 80 },

    legend: true,

    tooltipColumns: [
      { col: 'LightType', label: 'Light Type' },
      { col: 'LuxValue', label: 'Lux' },
      { col: 'BirdSongs', label: 'Bird Songs' },
     
    ]
  });

  // Display hovered light type
  let hover = p5.prototype.chart.hoverState;

  if (hover.active && hover.content && hover.content.length > 0) {

    let typeText = '';

    for (let i = 0; i < hover.content.length; i++) {
      const line = String(hover.content[i]);

      if (line.toLowerCase().startsWith('light type:')) {
        typeText = line;
        break;
      }
    }

    if (typeText) {
      fill(20);
      noStroke();
      textSize(14);
      textAlign(LEFT, BOTTOM);
      text('Type of Light: ' + typeText.replace(/^Light Type:\s*/i, ''), 20, height - 15);
    }
  }
}
