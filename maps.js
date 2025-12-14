const mapSteps = [
  {
    id: "pictorial_1735",
    year: "1735",
    title: "Pictorial Chongqing（四川湖北水道图）",
    subtitle: "Map of the Waterways in Sichuan and Hubei Provinces",
    text: `
In the early eighteenth century, Chongqing appears as a marginal settlement embedded within mountainous terrain.
Located in southwest China at the confluence of the Yangtze River and the Jialing River, the city is defined primarily by its geography.
Due to steep topography and limited accessibility three centuries ago, Chongqing existed as little more than a fortified town.
Rather than precise measurement, the map emphasizes rivers, mountains, and natural barriers, reflecting a spatial worldview shaped by landscape and defense.
    `,
    image: "images/cq_map_1735.jpg",
    bounds: [
      [29.53, 106.50],
      [29.60, 106.60]
    ],
    isBase: true,
    features: [
      {
        image: "images/features/layer1_wall.png",
        bounds: [
          [29.534478, 106.508043],
          [29.610450, 106.619204]
        ]
      }
    ]
  },

  {
    id: "imperial_1886",
    year: "1886",
    title: "Imperial Administrative Chongqing（重庆府治全图）",
    subtitle: "Qing Dynasty",
    text: `
By the late Qing dynasty, Chongqing is no longer merely a strategic outpost but a clearly defined administrative city.
In addition to the original seat of Chongqing Fu, the area corresponding to today’s Yuzhong District began to experience rapid growth.
The city is portrayed as a dense, lively urban environment.
Mapping priorities shift toward governance, jurisdiction, and settlement density, signaling a transition from symbolic landscape to bureaucratic order.
    `,
    image: "images/cq_map_1886.jpg",
    bounds: [
      [29.540461, 106.495925],
      [29.582284, 106.597402]
    ],
    features: [
      {
        image: "images/features/layer2_boats.png",
        bounds: [
          [29.531652, 106.494862],
          [29.578679, 106.605735]
        ]
      }
    ]
  },

  {
    id: "republican_1943",
    year: "1943",
    title: "Latest Chongqing Street Map（最新重庆街道图）",
    subtitle: "Republican Era",
    text: `
Produced toward the end of the wartime bombing of Chongqing, this map reflects a city increasingly shaped by circulation and movement.
As tourism began to grow, a more developed street network emerged as the dominant organizing structure.
Urban space is defined through roads, intersections, and connectivity, reframing Chongqing as a navigable modern city rather than an administrative territory.
Infrastructure and mobility replace terrain as the primary spatial logic.
    `,
    image: "images/cq_map_1943.png",
    bounds: [
      [29.531960, 106.518235],
      [29.587826, 106.608924]
    ],
    features: [
      {
        image: "images/features/layer3_roads.png",
        bounds: [
          [29.531960, 106.518235],
          [29.587826, 106.608924]
        ]
      }
    ]
  },

  {
    id: "modern_1990",
    year: "1990",
    title: "Chongqing Transportation & Tourism Map（重庆交通旅游图）",
    subtitle: "Late 20th Century",
    text: `
By 1990, Chongqing is represented as a modern, functional metropolis.
The city’s structure closely resembles its present-day form, with transportation networks, landmarks, and tourist attractions taking visual priority.
Mapping emphasizes legibility, efficiency, and usability over historical narrative.
Chongqing is no longer explained through terrain or administration, but through systems designed for movement, orientation, and consumption.
    `,
    image: "images/cq_map_1990.png",
    bounds: [
      [29.529830, 106.517795],
      [29.582693, 106.595108]
    ]
  }
];
