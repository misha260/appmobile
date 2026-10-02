/* ============================================================================
   Gallera — curated collection
   Public-domain masterworks. Images are pulled live from Wikimedia Commons
   (Special:FilePath redirects to the current full file). When an image can't
   load — e.g. inside a sandboxed preview that blocks external images — each
   card falls back to its own hand-tuned colour field, so the layout and the
   interactions stay intact.
   ============================================================================ */

(function (global) {
  'use strict';

  // Build a stable Wikimedia Commons image URL from a file name.
  function wiki(name, width) {
    return (
      'https://commons.wikimedia.org/wiki/Special:FilePath/' +
      encodeURIComponent(name) +
      '?width=' +
      (width || 1000)
    );
  }

  var COLLECTION = [
    {
      id: 'starry-night',
      title: 'The Starry Night',
      artist: 'Vincent van Gogh',
      year: 1889,
      movement: 'Post-Impressionism',
      medium: 'Oil on canvas',
      dimensions: '73.7 × 92.1 cm',
      location: 'Museum of Modern Art, New York',
      img: 'assets/starry-night.jpg',
      tone: '#0b1d3a',
      accent: '#f4c84a',
      estimate: 'Priceless',
      estimateNote: 'Insurance value estimated above $100 million',
      facts: [
        'Painted from memory in the asylum at Saint-Rémy-de-Provence.',
        'The village below is imaginary — only the cypress and hills are real.',
        'Van Gogh thought it a failure; it is now his most famous canvas.'
      ],
      description:
        'A turbulent night sky rolls over a quiet Provençal village, painted ' +
        'from the window of van Gogh’s asylum room just before sunrise. ' +
        'The swirling currents of blue and the eleven blazing stars turn the ' +
        'heavens into something alive and restless.\n\n' +
        'The towering cypress in the foreground — a tree traditionally linked ' +
        'to mourning — reaches toward that sky like a dark flame, bridging the ' +
        'earth and the infinite.'
    },
    {
      id: 'pearl-earring',
      title: 'Girl with a Pearl Earring',
      artist: 'Johannes Vermeer',
      year: 1665,
      movement: 'Dutch Golden Age',
      medium: 'Oil on canvas',
      dimensions: '44.5 × 39 cm',
      location: 'Mauritshuis, The Hague',
      img: wiki('1665 Girl with a Pearl Earring.jpg'),
      tone: '#10131a',
      accent: '#d9b98c',
      estimate: 'Not for sale',
      estimateNote: 'Called the “Mona Lisa of the North”',
      facts: [
        'Not a portrait but a “tronie” — a study of an expression.',
        'The luminous pearl is painted with just two strokes of white.',
        'The sitter’s identity has never been established.'
      ],
      description:
        'A girl turns toward us out of absolute darkness, lips parted as if ' +
        'about to speak. There is no setting, no story — only a face, a blue ' +
        'and gold turban, and a single impossible pearl catching the light.\n\n' +
        'Vermeer gives the whole image to that glance. Three centuries later it ' +
        'still feels like being noticed by a stranger across a room.'
    },
    {
      id: 'the-kiss',
      title: 'The Kiss',
      artist: 'Gustav Klimt',
      year: 1908,
      movement: 'Symbolism · Art Nouveau',
      medium: 'Oil and gold leaf on canvas',
      dimensions: '180 × 180 cm',
      location: 'Belvedere, Vienna',
      img: wiki('The Kiss - Gustav Klimt - Google Cultural Institute.jpg'),
      tone: '#6b4a12',
      accent: '#f2d675',
      estimate: 'Priceless',
      estimateNote: 'The jewel of Klimt’s “Golden Phase”',
      facts: [
        'Painted with real gold leaf, echoing Byzantine mosaics.',
        'The two figures dissolve into a single shimmering field of gold.',
        'Bought by the Austrian state while still unfinished.'
      ],
      description:
        'A couple kneels at the edge of a flowering meadow, wrapped in a single ' +
        'robe of gold. He crowns her with ivy; she tilts her face to receive the ' +
        'kiss, eyes closed, utterly still.\n\n' +
        'Klimt sets ornament against tenderness — hard rectangles for him, soft ' +
        'circles for her — until the two patterns, and the two lovers, become one.'
    },
    {
      id: 'great-wave',
      title: 'The Great Wave off Kanagawa',
      artist: 'Katsushika Hokusai',
      year: 1831,
      movement: 'Ukiyo-e',
      medium: 'Woodblock print',
      dimensions: '25.7 × 37.9 cm',
      location: 'Multiple collections worldwide',
      img: 'assets/great-wave.jpg',
      tone: '#0e3a52',
      accent: '#eae2cf',
      estimate: '$2.8M',
      estimateNote: 'Record for a single impression (2023)',
      facts: [
        'First print in the series Thirty-six Views of Mount Fuji.',
        'Mount Fuji sits tiny and calm beneath the towering wave.',
        'Thousands of impressions were printed from the same carved blocks.'
      ],
      description:
        'A colossal wave rears up, its foam splitting into claws above three ' +
        'slender boats. Far in the distance, dwarfed by the sea, Mount Fuji ' +
        'holds perfectly still.\n\n' +
        'Hokusai was in his seventies when he cut this scene. Its deep Prussian ' +
        'blue and restless geometry have made it the most reproduced image to ' +
        'come out of Japan.'
    },
    {
      id: 'birth-of-venus',
      title: 'The Birth of Venus',
      artist: 'Sandro Botticelli',
      year: 1485,
      movement: 'Early Renaissance',
      medium: 'Tempera on canvas',
      dimensions: '172.5 × 278.9 cm',
      location: 'Uffizi Gallery, Florence',
      img: wiki('Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg'),
      tone: '#3f5b52',
      accent: '#e8d2a0',
      estimate: 'Priceless',
      estimateNote: 'A cornerstone of the Uffizi collection',
      facts: [
        'One of the first large canvases of the Italian Renaissance.',
        'Venus’s pose is borrowed from an antique marble statue.',
        'Painted for a Medici villa outside Florence.'
      ],
      description:
        'Newly born from the sea, the goddess of love arrives on a shell, blown ' +
        'to shore by the winds while a nymph rushes to clothe her. Everything ' +
        'drifts — hair, flowers, drapery — in a slow, weightless breeze.\n\n' +
        'Botticelli trades anatomy for grace, lengthening the body into a long ' +
        'flowing line. The result is less a woman than an ideal taking its first breath.'
    },
    {
      id: 'the-scream',
      title: 'The Scream',
      artist: 'Edvard Munch',
      year: 1893,
      movement: 'Expressionism',
      medium: 'Tempera and pastel on cardboard',
      dimensions: '91 × 73 cm',
      location: 'National Gallery, Oslo',
      img: 'assets/the-scream.jpg',
      tone: '#8a3410',
      accent: '#f3c23a',
      estimate: '$119.9M',
      estimateNote: 'A pastel version sold at auction in 2012',
      facts: [
        'Munch described a sky “turned blood red” over a fjord at sunset.',
        'He made four versions in paint, pastel and print.',
        'The figure isn’t screaming — it’s shielding itself from a scream in nature.'
      ],
      description:
        'A figure stops on a bridge, hands pressed to a hollow, skull-like face, ' +
        'while the sky behind it burns orange and red. The whole world seems to ' +
        'ripple with the sound it cannot escape.\n\n' +
        'Munch took the pose from a real walk at dusk, when he felt “a great, ' +
        'infinite scream pass through nature.” It has become the modern emblem ' +
        'of anxiety itself.'
    },
    {
      id: 'impression-sunrise',
      title: 'Impression, Sunrise',
      artist: 'Claude Monet',
      year: 1872,
      movement: 'Impressionism',
      medium: 'Oil on canvas',
      dimensions: '48 × 63 cm',
      location: 'Musée Marmottan Monet, Paris',
      img: wiki('Claude Monet, Impression, soleil levant.jpg'),
      tone: '#3a4a63',
      accent: '#f08a3c',
      estimate: 'Priceless',
      estimateNote: 'The painting that named a movement',
      facts: [
        'A critic mocked it as a mere “impression” — and named the movement.',
        'It shows the port of Le Havre, Monet’s home town, at dawn.',
        'The small orange sun has the same brightness as the grey sky around it.'
      ],
      description:
        'Dawn over a misty harbour: a small orange sun hangs in a grey-blue haze ' +
        'while its reflection flickers across the water in quick, broken strokes. ' +
        'Masts and cranes are barely more than smudges.\n\n' +
        'Monet wasn’t painting the port so much as the light on it, in a single ' +
        'passing moment. The loose, unfinished look gave Impressionism its name.'
    },
    {
      id: 'night-watch',
      title: 'The Night Watch',
      artist: 'Rembrandt van Rijn',
      year: 1642,
      movement: 'Dutch Golden Age · Baroque',
      medium: 'Oil on canvas',
      dimensions: '363 × 437 cm',
      location: 'Rijksmuseum, Amsterdam',
      img: wiki('The Nightwatch by Rembrandt - Rijksmuseum.jpg'),
      tone: '#2a1d0e',
      accent: '#e0b25a',
      estimate: 'Priceless',
      estimateNote: 'The Rijksmuseum’s central masterpiece',
      facts: [
        'Not nocturnal at all — darkened varnish gave it the “night” name.',
        'A militia company caught mid-motion instead of posing in a row.',
        'Trimmed on all sides in 1715 to fit a new wall.'
      ],
      description:
        'A city militia surges forward out of shadow, its captain stepping ' +
        'straight toward us as the whole company stirs into motion — muskets ' +
        'loading, a drum beating, a small girl glowing at the centre.\n\n' +
        'Rembrandt broke every rule of the group portrait, replacing the tidy ' +
        'line-up with drama, movement and light. It remains the most ambitious ' +
        'painting of the Dutch Golden Age.'
    },
    {
      id: 'grande-jatte',
      title: 'A Sunday on La Grande Jatte',
      artist: 'Georges Seurat',
      year: 1886,
      movement: 'Pointillism · Neo-Impressionism',
      medium: 'Oil on canvas',
      dimensions: '207.5 × 308.1 cm',
      location: 'Art Institute of Chicago',
      img: wiki('A Sunday on La Grande Jatte, Georges Seurat, 1884.jpg'),
      tone: '#2f4a2a',
      accent: '#e6cf86',
      estimate: 'Priceless',
      estimateNote: 'A defining work of Neo-Impressionism',
      facts: [
        'Built entirely from tiny separate dots of pure colour.',
        'Seurat spent two years and dozens of studies on it.',
        'The colours mix in the viewer’s eye, not on the canvas.'
      ],
      description:
        'Parisians relax on an island in the Seine on a bright Sunday — strolling, ' +
        'fishing, lounging in the grass — frozen into a calm, almost ceremonial ' +
        'stillness under the afternoon sun.\n\n' +
        'Seurat built the entire scene from millions of small dots of unmixed ' +
        'colour, letting the eye blend them. It was science turned into serenity.'
    },
    {
      id: 'the-milkmaid',
      title: 'The Milkmaid',
      artist: 'Johannes Vermeer',
      year: 1658,
      movement: 'Dutch Golden Age',
      medium: 'Oil on canvas',
      dimensions: '45.5 × 41 cm',
      location: 'Rijksmuseum, Amsterdam',
      img: wiki('Johannes Vermeer - The Milkmaid - Google Art Project.jpg'),
      tone: '#2a3a52',
      accent: '#edc34a',
      estimate: 'Priceless',
      estimateNote: 'Among the most beloved of Vermeer’s interiors',
      facts: [
        'A humble kitchen maid given the dignity of a monument.',
        'Vermeer dotted the bread and basket with tiny beads of light.',
        'A faint cupid tile hides along the skirting at her feet.'
      ],
      description:
        'A kitchen maid stands pouring milk in a shaft of morning light, ' +
        'completely absorbed in the thin stream falling into the bowl. Nothing ' +
        'else in the room moves.\n\n' +
        'Vermeer makes an everyday chore feel sacred. Light pours over the bread, ' +
        'the earthenware and her sturdy arms until the whole quiet corner seems to glow.'
    },
    {
      id: 'moulin-galette',
      title: 'Bal du moulin de la Galette',
      artist: 'Pierre-Auguste Renoir',
      year: 1876,
      movement: 'Impressionism',
      medium: 'Oil on canvas',
      dimensions: '131 × 175 cm',
      location: 'Musée d’Orsay, Paris',
      img: wiki('Pierre-Auguste Renoir, Le Moulin de la Galette.jpg'),
      tone: '#6a3b52',
      accent: '#f0cf9a',
      estimate: '$78M',
      estimateNote: 'A smaller version sold in 1990',
      facts: [
        'Painted outdoors at a real open-air dance hall in Montmartre.',
        'Dappled sunlight falls through the trees onto the dancers.',
        'Renoir’s own friends posed for the crowd.'
      ],
      description:
        'A Sunday dance in Montmartre: couples turn, friends lean over tables, ' +
        'and sunlight filters through the trees to scatter coins of light across ' +
        'faces, hats and jackets.\n\n' +
        'Renoir dissolves the whole crowd into warmth and movement. It is ' +
        'Impressionism at its most joyful — happiness caught in the open air.'
    },
    {
      id: 'american-gothic',
      title: 'American Gothic',
      artist: 'Grant Wood',
      year: 1930,
      movement: 'Regionalism',
      medium: 'Oil on beaverboard',
      dimensions: '78 × 65.3 cm',
      location: 'Art Institute of Chicago',
      img: wiki('Grant Wood - American Gothic - Google Art Project.jpg'),
      tone: '#3a4034',
      accent: '#dcc488',
      estimate: 'Priceless',
      estimateNote: 'An icon of American art',
      facts: [
        'The “couple” are Wood’s sister and his dentist.',
        'Named for the Gothic window of the little white house behind them.',
        'Read as both a tribute to and a gentle joke about rural life.'
      ],
      description:
        'A stern farmer grips a pitchfork beside a tight-lipped woman, the ' +
        'pointed window of their farmhouse rising behind. Every line — the fork, ' +
        'the seams of his overalls, the window tracery — stands rigidly upright.\n\n' +
        'Wood meant it as a portrait of Midwestern endurance. America has argued ' +
        'ever since over whether it is earnest or sly, and never stopped looking.'
    }
  ];

  global.GALLERA_DATA = COLLECTION;
})(typeof window !== 'undefined' ? window : this);
