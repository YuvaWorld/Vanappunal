import type { Region } from "./types";

export const regions: Region[] = [
  {
    slug: "himalaya",
    title: "Himalaya",
    continent: "South Asia",
    lede: "High villages, bigger weather, and the long approaches that make a pass feel earned.",
    body: "I come to the Himalaya for the walking culture as much as the altitude — tea houses, prayer walls, and the reminder that these trails are corridors, not wilderness in the American sense.",
  },
  {
    slug: "andes",
    title: "Andes",
    continent: "South America",
    lede: "Dry light, high plains, and cordillera that run like a spine down a continent.",
    body: "The Andes taught me distance: days of puna, then a sudden wall of ice. I travel here slowly, with respect for altitude that does not care how fit you were at sea level.",
  },
  {
    slug: "alps",
    title: "Alps",
    continent: "Europe",
    lede: "Hut networks, limestone, and the old European art of moving through mountains as infrastructure.",
    body: "The Alps are where I learned that a range can be both crowded and serious. I go early, I go in shoulder season, and I still treat every glacier as if the brochure were lying.",
  },
  {
    slug: "rockies",
    title: "Rockies",
    continent: "North America",
    lede: "Long granite, afternoon lightning, and the particular self-reliance of American backcountry.",
    body: "The Rockies are my home vocabulary — fourteeners, bushwhacks, and the summer pattern of being off a summit before the sky turns on you.",
  },
  {
    slug: "patagonia",
    title: "Patagonia",
    continent: "South America",
    lede: "Wind as a character, granite as cathedral, weather that rewrites the week while you eat breakfast.",
    body: "Patagonia is a lesson in waiting. The towers appear, then they don't. I pack extra food and a willingness to walk in a storm that has no interest in my itinerary.",
  },
  {
    slug: "sahara",
    title: "Sahara",
    continent: "Africa",
    lede: "Sand seas, wells, and the old geometry of moving between water.",
    body: "I crossed a corner of the Empty Quarter with people who still navigate by dune shape. The Sahara is not a backdrop for toughness. It is a living map of wells, families, and heat.",
  },
  {
    slug: "arctic",
    title: "Arctic",
    continent: "Circumpolar",
    lede: "Tundra rivers, midnight sun, and country that looks empty until you learn its names.",
    body: "Arctic travel shrunk my sense of a 'big day'. The Brooks Range in particular: braided water, caribou weather, and the knowledge that extraction is a story you don't want to star in.",
  },
  {
    slug: "east-africa",
    title: "East Africa",
    continent: "Africa",
    lede: "Escarpments, highland trails, and wildlife that refuses to be scenery.",
    body: "From the Simien to the Rift, I travel with local teams and I keep my wanting small. These are working landscapes. The privilege is being allowed to walk them.",
  },
  {
    slug: "japan",
    title: "Japan",
    continent: "East Asia",
    lede: "Pilgrim paths, cedar dark, volcanoes, and a hiking culture that still bows to the mountain.",
    body: "Japan is where I go to remember that walking can be a form of attention. Stone steps, onsen at the end, a forest that feels older than the idea of a trail.",
  },
  {
    slug: "mediterranean",
    title: "Mediterranean",
    continent: "Europe / North Africa",
    lede: "Coast paths, limestone, and the old human habit of living on the edge of a blue sea.",
    body: "I walk the Med for the mix — a morning of via ferrata, an afternoon swim, a village that has been a harbour since someone first named the wind.",
  },
  {
    slug: "indian-subcontinent",
    title: "Indian Subcontinent",
    continent: "South Asia",
    lede: "From Ghats to high valleys, a density of living that makes 'wilderness' a careful word.",
    body: "I travel here for the approaches as much as the peaks: trains, tea, and the reminder that a mountain day starts in a town that has its own weather of people.",
  },
  {
    slug: "north-america",
    title: "North America",
    continent: "North America",
    lede: "Cities, coasts, and high country between two oceans.",
    body: "From Mexican highlands to the Canadian shield — walking days that start in a city and end in thin air.",
  },
  {
    slug: "southern-africa",
    title: "Southern Africa",
    continent: "Africa",
    lede: "Cape light, escarpments, and long roads toward the sea.",
    body: "The south of the continent: table mountains, desert edges, and towns that face the Atlantic and the Indian Ocean at once.",
  },
  {
    slug: "world",
    title: "Elsewhere",
    continent: "World",
    lede: "Places that sit outside the usual ranges — still a pin, still a walk.",
    body: "Logged wherever the road went.",
  },
];

export function getRegion(slug: string) {
  return regions.find((r) => r.slug === slug);
}
