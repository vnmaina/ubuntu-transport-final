import { mutation } from "./_generated/server";

// Ubuntu Logistics — Kenya travel blog seed.
// Idempotent: skips posts/categories that already exist (matched by slug).
// Run with: npx convex run seedBlogPosts:seedBlogPosts

const AUTHOR = {
  name: "Ubuntu Logistics Team",
  bio: "Travel specialists at Ubuntu Logistics and Transport — Kenya's trusted partner for safaris, tours, corporate shuttles and airport transfers.",
  role: "Travel & Transport Experts",
  email: "Ben@ubuntulogistics.co.ke",
};

const img = (id: string) => `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;

const CATEGORIES = [
  { name: "Safari Guides", slug: "safari-guides", icon: "🦁", color: "#d97706" },
  { name: "Destinations", slug: "destinations", icon: "🗺️", color: "#059669" },
  { name: "Travel Tips", slug: "travel-tips", icon: "💡", color: "#7c3aed" },
  { name: "Transport & Logistics", slug: "transport", icon: "🚐", color: "#2563eb" },
  { name: "Corporate Travel", slug: "corporate-travel", icon: "💼", color: "#dc2626" },
];

interface SeedPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  keywords: string[];
  readTime: string;
  metaTitle: string;
  metaDescription: string;
}

const POSTS: SeedPost[] = [
  {
    title: "The Ultimate Kenya Safari Guide: Planning Your First Trip",
    slug: "ultimate-kenya-safari-guide",
    excerpt:
      "Everything you need to know before your first Kenya safari — when to go, where to go, what it costs, and how to get there in comfort.",
    featuredImage: img("photo-1516426122078-c23e76319801"),
    category: "safari-guides",
    tags: ["safari", "kenya", "first-time", "planning", "big-five"],
    keywords: ["kenya safari", "safari planning", "first safari", "kenya travel guide", "big five safari"],
    readTime: "12 min read",
    metaTitle: "Kenya Safari Guide: Plan Your First Trip | Ubuntu Logistics",
    metaDescription:
      "A complete first-timer's guide to Kenya safaris — best parks, seasons, budgets, vehicles and transport. Plan the trip of a lifetime.",
    content: `
<p>Kenya is the birthplace of the safari. From the endless golden grasslands of the Maasai Mara to the snow-dusted peaks of Mount Kenya and the white-sand beaches of the coast, a Kenyan safari offers an almost unmatched concentration of wildlife, landscapes and cultures. If you are planning your first safari, this guide walks you through everything — parks, seasons, budgets, vehicles and the logistics that make or break the experience.</p>

<h2>Why Kenya for Your First Safari?</h2>
<p>Kenya's safari circuit is unusually accessible. Nairobi, the capital, is one of the few cities in the world with a national park on its doorstep — <a href="/collections/destinations">Nairobi National Park</a> — meaning you can be watching lions within an hour of landing at Jomo Kenyatta International Airport. Beyond the city, the country packs an extraordinary variety into relatively short distances: savannah, forest, desert, mountain and coast are all reachable within a single trip.</p>
<p>The wildlife viewing is exceptional year-round. Kenya is home to the Big Five — lion, leopard, elephant, buffalo and rhino — plus the Great Migration, one of the seven natural wonders of the world, which sees over a million wildebeest, zebra and gazelle thunder across the Mara-Serengeti ecosystem each year. For authoritative park information and conservation updates, the <a href="https://www.kws.go.ke" target="_blank" rel="noopener">Kenya Wildlife Service</a> and <a href="https://www.magicalkenya.com" target="_blank" rel="noopener">Magical Kenya</a> are excellent starting points.</p>

<h2>The Best National Parks &amp; Reserves</h2>
<h3>Maasai Mara National Reserve</h3>
<p>The Mara is Kenya's flagship safari destination and the stage for the Great Migration between July and October. It offers the densest big-cat populations in Africa and classic open-plains game viewing. For the full story, read our guide to <a href="/blogs/maasai-mara-vs-amboseli">Maasai Mara vs Amboseli</a>.</p>
<h3>Amboseli National Park</h3>
<p>Famous for large elephant herds and uninterrupted views of Mount Kilimanjaro — Africa's highest peak — Amboseli delivers some of the most photographed safari scenes on the continent.</p>
<h3>Samburu National Reserve</h3>
<p>In Kenya's arid north, Samburu offers rare species like the reticulated giraffe, Grevy's zebra and Somali ostrich, plus dramatic riverine landscapes along the Ewaso Ng'iro.</p>
<h3>Tsavo East &amp; West</h3>
<p>Together they form one of the largest protected areas on Earth. Tsavo is known for its red-dust elephants, Lugard Falls and the Yatta Plateau — the longest lava flow in the world.</p>
<h3>Lake Nakuru National Park</h3>
<p>A birder's paradise wrapped around a soda lake that can turn pink with millions of flamingos. Rhino and lion populations are easily viewed on the park's compact circuit.</p>
<h3>Nairobi National Park</h3>
<p>Just 7km from the city centre, this fenced park proves you don't need to travel far for real safari moments — lions, giraffes, rhinos and buffalo are all resident.</p>

<h2>Best Time to Visit</h2>
<p>Kenya is a year-round destination, but timing shapes the experience:</p>
<ul>
<li><strong>July–October (peak season):</strong> The Great Migration river crossings in the Mara, cool dry weather and the best overall game viewing. Book 6–12 months ahead.</li>
<li><strong>December–March:</strong> Calving season in the southern Mara-Serengeti — predators are busy and newborn animals abound. Hot but excellent.</li>
<li><strong>April–June (shoulder/low season):</strong> The long rains transform the landscape into green paradise. Fewer tourists, lower prices, and dramatic skies — ideal for photographers.</li>
</ul>
<p>For a month-by-month breakdown, see our <a href="/blogs/best-time-to-visit-kenya">complete seasonal guide</a>.</p>

<h2>How Much Does a Kenya Safari Cost?</h2>
<p>Budget honestly — a mid-range safari typically runs <strong>KES 25,000–60,000 per person per day</strong> once park fees, accommodation, vehicle and guide are included. Park fees alone range from roughly KES 1,000–1,500 per adult per day at most parks (verify current rates on the KWS website). Ways to control costs:</p>
<ul>
<li>Travel in shoulder season (April–June) for 20–40% savings.</li>
<li>Share a private 4x4 with other travellers on group departures.</li>
<li>Combine park circuits geographically — Mara + conservancies, or Amboseli + Tsavo.</li>
<li>Use a Nairobi-based operator for airport transfers and park hops instead of flying between every reserve.</li>
</ul>

<h2>Getting Around: The Vehicle Matters</h2>
<p>Most Kenyan parks are only accessible by 4x4. A proper safari vehicle has pop-up roofs for standing game viewing, large windows, charging ports and an experienced driver-guide who reads animal behaviour. If you're arranging transport, browse our <a href="/collections/fleet">safari fleet</a> or read <a href="/blogs/how-to-choose-safari-vehicle">how to choose the right safari vehicle</a>. For inter-city and park-to-park legs, dedicated <a href="/collections/services">transport services</a> keep the whole trip seamless.</p>

<h2>Practical Tips for First-Timers</h2>
<ul>
<li><strong>Pack light and neutral:</strong> khaki, olive and beige; avoid blue and black near tsetse areas.</li>
<li><strong>Binoculars are essential</strong> — 8x42 or 10x42.</li>
<li><strong>Be patient:</strong> game viewing is about stillness. Early morning and late afternoon drives are the most productive.</li>
<li><strong>Respect the rules:</strong> never get out of the vehicle in parks, keep noise down, and follow your guide's instructions.</li>
<li><strong>Malaria prophylaxis</strong> is recommended for most safari regions — consult a travel clinic before departure.</li>
</ul>

<h2>Plan Your Trip with Local Experts</h2>
<p>The difference between a good safari and an unforgettable one is usually logistics — vehicle quality, guide experience, park timing and seamless transfers. <a href="/collections">Ubuntu Logistics and Transport</a> has been moving travellers across Kenya since 2018, with NTSA-compliant 4x4 Land Cruisers, airport meet-and-greet and bespoke itineraries. Whether you need a single airport transfer or a full multi-park safari, our team handles the details so you can focus on the wildlife.</p>
<p><strong>Ready to start planning?</strong> Browse our <a href="/collections/destinations">destinations</a>, check the <a href="/collections/fleet">fleet</a>, or <a href="/collections/services">request a quote</a> — we'll build the safari around you.</p>
    `,
  },
  {
    title: "Maasai Mara vs Amboseli: Which Kenyan Safari is Right for You?",
    slug: "maasai-mara-vs-amboseli",
    excerpt:
      "Two of Kenya's most famous parks, two very different experiences. Here's how to choose between the Maasai Mara and Amboseli.",
    featuredImage: img("photo-1547471080-7cc2caa01a7e"),
    category: "destinations",
    tags: ["maasai mara", "amboseli", "safari", "comparison", "kenya"],
    keywords: ["maasai mara safari", "amboseli safari", "kenya safari parks", "amboseli vs mara"],
    readTime: "9 min read",
    metaTitle: "Maasai Mara vs Amboseli Safari Comparison | Ubuntu Logistics",
    metaDescription:
      "Compare Maasai Mara and Amboseli safaris — migration, elephants, Kilimanjaro views, crowds and costs. Which Kenya park should you choose?",
    content: `
<p>Ask any experienced safari traveller to name Kenya's two most iconic parks and you'll hear the same two names: the Maasai Mara and Amboseli. Both deliver world-class game viewing, but they are fundamentally different experiences. Choosing between them — or combining them — is one of the first decisions in planning a Kenyan safari. Here's an honest comparison.</p>

<h2>The Short Answer</h2>
<p><strong>Choose the Maasai Mara</strong> if your priority is the Great Migration, the highest density of predators (lion, cheetah, leopard), and classic open-plains game viewing.</p>
<p><strong>Choose Amboseli</strong> if you want large elephant herds, guaranteed views of Mount Kilimanjaro, a more intimate park feel, and a slightly lower price point.</p>
<p><strong>Choose both</strong> if you have 7+ days — they're only about 4–5 hours apart by road and pair beautifully.</p>

<h2>Maasai Mara: The Migration Capital</h2>
<p>The Maasai Mara National Reserve in Narok County is part of the larger Serengeti-Mara ecosystem, one of the last great wildlife migrations on Earth. Between July and October, over a million wildebeest, zebra and gazelle cross the Mara River in dramatic, often chaotic river crossings that attract visitors from around the world.</p>
<p><strong>Wildlife highlights:</strong> Exceptional predator density — lion prides, cheetah on the open plains, leopards in the riverine thickets. The Mara also hosts large elephant, buffalo and hippo populations.</p>
<p><strong>Landscape:</strong> Rolling grasslands, acacia woodlands and the Mara River — the classic East African safari postcard.</p>
<p><strong>Downsides:</strong> Peak season is crowded and expensive; off-season (April–June) the long rains can make roads challenging.</p>

<h2>Amboseli: Elephants &amp; Kilimanjaro</h2>
<p>Amboseli National Park in Kajiado County sits at the foot of Mount Kilimanjaro — Africa's highest mountain at 5,895m. When the mountain is clear (most reliably January–March and June–October), herds of elephants traverse the plains with Kilimanjaro filling the background: arguably the most photographed safari scene in Africa.</p>
<p><strong>Wildlife highlights:</strong> Large, well-studied elephant herds; good lion and cheetah populations; wetlands that attract huge numbers of birds and attract grazers year-round.</p>
<p><strong>Landscape:</strong> Open plains, seasonal swamps and the iconic mountain backdrop.</p>
<p><strong>Downsides:</strong> Smaller than the Mara; game viewing is excellent but less varied in terms of predator action than the migration circuit.</p>

<h2>Side-by-Side Comparison</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="background:#f3f4f6;"><th style="text-align:left;padding:10px;border:1px solid #e5e7eb;">Factor</th><th style="text-align:left;padding:10px;border:1px solid #e5e7eb;">Maasai Mara</th><th style="text-align:left;padding:10px;border:1px solid #e5e7eb;">Amboseli</th></tr>
<tr><td style="padding:10px;border:1px solid #e5e7eb;"><strong>Best for</strong></td><td style="padding:10px;border:1px solid #e5e7eb;">Migration, predators, big cats</td><td style="padding:10px;border:1px solid #e5e7eb;">Elephants, Kilimanjaro views</td></tr>
<tr><td style="padding:10px;border:1px solid #e5e7eb;"><strong>Peak season</strong></td><td style="padding:10px;border:1px solid #e5e7eb;">July–October (migration)</td><td style="padding:10px;border:1px solid #e5e7eb;">Jan–Mar, Jun–Oct (clear views)</td></tr>
<tr><td style="padding:10px;border:1px solid #e5e7eb;"><strong>Park fee (approx.)</strong></td><td style="padding:10px;border:1px solid #e5e7eb;">KES ~5,200/adult/day</td><td style="padding:10px;border:1px solid #e5e7eb;">KES ~1,200/adult/day</td></tr>
<tr><td style="padding:10px;border:1px solid #e5e7eb;"><strong>Distance from Nairobi</strong></td><td style="padding:10px;border:1px solid #e5e7eb;">~270km (5–6 hrs road / 45 min flight)</td><td style="padding:10px;border:1px solid #e5e7eb;">~240km (4–5 hrs road / 30 min flight)</td></tr>
<tr><td style="padding:10px;border:1px solid #e5e7eb;"><strong>Vibe</strong></td><td style="padding:10px;border:1px solid #e5e7eb;">Grand, busy, dramatic</td><td style="padding:10px;border:1px solid #e5e7eb;">Intimate, scenic, relaxed</td></tr>
</table>
<p><em>Park fees change — always verify current rates on the <a href="https://www.kws.go.ke" target="_blank" rel="noopener">Kenya Wildlife Service</a> portal before booking.</em></p>

<h2>Getting There</h2>
<p>Both parks are reachable by road or air. Road transfers in a comfortable 4x4 take 4–6 hours and let you stop at the <a href="/collections/destinations">Great Rift Valley</a> viewpoints and local markets — a journey in itself. Domestic flights from Wilson Airport to the Mara (Mara Serena, Keekorok) or Amboseli (Amboseli airstrip) take under an hour. Many travellers combine: fly into one park, road-transfer to the other.</p>
<p>For seamless park transfers, <a href="/collections/services">Ubuntu Logistics</a> runs scheduled and private transfers between Nairobi, the Mara, Amboseli and Tsavo in NTSA-compliant vehicles with experienced driver-guides.</p>

<h2>Which Should You Book?</h2>
<ul>
<li><strong>First safari, 3–4 days:</strong> Amboseli for value and scenery, or Mara if travelling July–October for the migration.</li>
<li><strong>Photographers:</strong> Amboseli for the Kilimanjaro backdrop; Mara for predator action.</li>
<li><strong>Families:</strong> Amboseli's shorter drives and smaller park feel are often easier with children.</li>
<li><strong>Big cat enthusiasts:</strong> Mara, hands down.</li>
</ul>
<p>Still deciding? Read our <a href="/blogs/ultimate-kenya-safari-guide">complete Kenya safari guide</a> or browse all <a href="/collections/destinations">Kenyan destinations</a> to build your itinerary.</p>
    `,
  },
  {
    title: "Best Time to Visit Kenya: A Month-by-Month Safari &amp; Beach Guide",
    slug: "best-time-to-visit-kenya",
    excerpt:
      "Dry season or green season? When to see the migration, when beaches are best, and when you can save on your Kenya trip.",
    featuredImage: img("photo-1469474968028-56623f02e42e"),
    category: "travel-tips",
    tags: ["best time", "seasons", "kenya", "safari", "beach"],
    keywords: ["best time to visit kenya", "kenya safari season", "kenya weather", "great migration dates", "kenya beach season"],
    readTime: "11 min read",
    metaTitle: "Best Time to Visit Kenya: Month-by-Month Guide | Ubuntu Logistics",
    metaDescription:
      "When is the best time to visit Kenya? Month-by-month guide to safari seasons, Great Migration dates, beach weather and budget travel.",
    content: `
<p>Kenya sits on the equator, which means there's no real winter — but the country still has distinct seasons that dramatically change the safari experience. Two rainy seasons, one dry season, and the Great Migration's own calendar all compete for your attention. This month-by-month guide helps you pick the perfect window for your trip.</p>

<h2>Kenya's Seasons at a Glance</h2>
<ul>
<li><strong>Dry season (July–October):</strong> Cool, dry, peak wildlife viewing. The Great Migration river crossings happen in the Mara. Best overall — and busiest.</li>
<li><strong>Short rains (November–December):</strong> Brief showers, landscapes turn green, migratory birds arrive. Good value.</li>
<li><strong>Hot/dry (January–March):</strong> Warm and dry. Calving season in the Mara ecosystem; excellent beach weather on the coast.</li>
<li><strong>Long rains (April–June):</strong> Heavier rain, lush scenery, fewer tourists, lowest prices. Roads can be muddy; some camps close.</li>
</ul>

<h2>Month-by-Month Breakdown</h2>
<h3>January–February</h3>
<p>Warm and relatively dry. The southern Mara-Serengeti sees the birth of hundreds of thousands of wildebeest calves — predators are highly active. Coastal beaches are at their best, with calm seas and hot sun. Ideal for combining safari + beach.</p>
<h3>March</h3>
<p>Transition month — hot, with increasing cloud and occasional storms. Still good for game viewing and the coast.</p>
<h3>April–May</h3>
<p>The long rains. Parks are green and beautiful but roads can be challenging and many lodges in remote areas close. The flip side: 20–40% lower prices, no crowds, and dramatic skies. A favourite with photographers and budget travellers.</p>
<h3>June</h3>
<p>Rains taper off. Migration herds begin moving north toward the Mara. Good shoulder-season value as conditions improve.</p>
<h3>July–October</h3>
<p><strong>Peak season.</strong> Dry weather, thin vegetation, animals concentrated around water — the best game viewing of the year. The Great Migration crosses the Mara River (mostly July–September). Book 6–12 months ahead; prices are highest.</p>
<h3>November</h3>
<p>Short rains begin. The migration starts moving south back to the Serengeti. Lush landscapes return and birdlife booms. Good value window opens.</p>
<h3>December</h3>
<p>Festive season brings families and higher prices again, but weather is generally good with brief showers. Excellent for a year-end safari + beach combo.</p>

<h2>Safari vs Beach: Timing Them Together</h2>
<p>If you want both, January–March and July–October are the sweet spots. A classic itinerary: 4 days in the Mara or Amboseli, then 3–4 days on the coast at Diani, Watamu or Lamu. The <a href="/collections/destinations">coastal destinations</a> are a short flight or scenic road trip from Nairobi — our <a href="/collections/services">transport team</a> handles inter-region transfers so you don't have to coordinate flights yourself.</p>

<h2>Budget Travel Windows</h2>
<p>The absolute cheapest time is <strong>April–June</strong>, followed by November. Shoulder months (March, June, December) offer a middle ground. For current exchange rates and park fees, check the <a href="https://www.centralbank.go.ke" target="_blank" rel="noopener">Central Bank of Kenya</a> and <a href="https://www.kws.go.ke" target="_blank" rel="noopener">KWS</a>.</p>

<h2>Events Worth Timing Your Trip Around</h2>
<ul>
<li><strong>Great Migration crossings:</strong> July–October in the Mara.</li>
<li><strong>Wildebeest calving:</strong> January–March in the southern Serengeti ecosystem.</li>
<li><strong>Lamu Cultural Festival:</strong> November — Swahili culture, donkey races and dhow racing on Lamu island.</li>
<li><strong>Nairobi Carnival / Diwali celebrations:</strong> Various dates — check <a href="https://www.magicalkenya.com" target="_blank" rel="noopener">Magical Kenya</a> events.</li>
</ul>

<h2>Plan Around the Season</h2>
<p>The best time to visit Kenya depends entirely on what you want from the trip. Whatever the month, <a href="/collections">Ubuntu Logistics</a> runs year-round safari transfers, airport pickups and custom itineraries. Start with our <a href="/blogs/ultimate-kenya-safari-guide">first-timer's safari guide</a>, then <a href="/collections/services">get a quote</a> for your dates.</p>
    `,
  },
  {
    title: "Top 10 Must-See Destinations in Kenya",
    slug: "top-10-destinations-in-kenya",
    excerpt:
      "From the Mara's migration to Lamu's coral streets — the ten Kenyan destinations every traveller should experience at least once.",
    featuredImage: img("photo-1516426122078-c23e76319801"),
    category: "destinations",
    tags: ["destinations", "kenya", "top-10", "travel", "safari"],
    keywords: ["best places in kenya", "kenya destinations", "top tourist attractions kenya", "kenya travel"],
    readTime: "10 min read",
    metaTitle: "Top 10 Must-See Destinations in Kenya | Ubuntu Logistics",
    metaDescription:
      "The 10 best destinations in Kenya — Maasai Mara, Amboseli, Lamu, Hell's Gate and more. Plan the ultimate Kenyan adventure.",
    content: `
<p>Kenya packs an absurd amount of diversity into 580,000 square kilometres — snow-capped mountains, coral reefs, volcanic parks, desert, rainforest and the greatest wildlife show on Earth. Here are the ten destinations that belong on every Kenyan itinerary, whether it's your first trip or your fifth.</p>

<h2>1. Maasai Mara National Reserve</h2>
<p>The crown jewel. The Great Migration, big cats and endless plains make the Mara Kenya's most famous destination. Visit July–October for river crossings, or December–March for calving season. See our <a href="/blogs/maasai-mara-vs-amboseli">Mara vs Amboseli comparison</a> for help deciding.</p>

<h2>2. Amboseli National Park</h2>
<p>Elephant herds and Mount Kilimanjaro views. Fewer crowds than the Mara, lower park fees, and some of the most reliable big-game viewing in Kenya.</p>

<h2>3. Nairobi National Park</h2>
<p>A real safari 7km from the city centre. Lions, rhinos, giraffes and buffalo against a downtown skyline — unique on the planet. Perfect for a pre- or post-safari night in the capital.</p>

<h2>4. Lake Nakuru National Park</h2>
<p>Famous for flamingos (when water levels are right), rhinos, and a compact park that's easy to cover in a day. Combine with Hell's Gate or the Great Rift Valley viewpoints.</p>

<h2>5. Hell's Gate National Park</h2>
<p>Kenya's adventure park — hike through volcanoes, cycle among zebra and giraffe, and walk through the deep red Fischer's Tower gorge. No safari vehicle needed. Details in our <a href="/blogs/hells-gate-national-park-guide">Hell's Gate guide</a>.</p>

<h2>6. Lamu Island</h2>
<p>A UNESCO World Heritage site of coral-stone Swahili architecture, dhows, donkey carts and some of East Africa's best beaches. Car-free Lamu Town is like stepping back 300 years. See <a href="/blogs/lamu-island-guide">our Lamu guide</a>.</p>

<h2>7. Diani Beach</h2>
<p>Kenya's most famous beach — powder-white sand, turquoise water, coral reefs and a lively beach town 30km south of Mombasa. Great for families and honeymooners.</p>

<h2>8. Mount Kenya &amp; the Central Highlands</h2>
<p>Africa's second-highest peak offers trekking routes for all levels, from the forested Sirimon route to the technical Point Lenana summit. The highlands also produce Kenya's best tea and coffee — tour a plantation en route.</p>

<h2>9. Tsavo East &amp; West</h2>
<p>One of the largest protected areas on Earth. Red-dust elephants, the Lugard Falls, and vast landscapes that feel gloriously wild. Pair with Amboseli for a southern circuit.</p>

<h2>10. Samburu National Reserve</h2>
<p>Kenya's remote northern gem — reticulated giraffes, Grevy's zebras, Somali ostriches and dramatic river landscapes. Fewer visitors, more exclusivity.</p>

<h2>How to Fit Them All In</h2>
<p>You can't see everything in one trip — and you shouldn't try. A realistic 10–14 day itinerary covers 3–4 destinations well. Popular combinations:</p>
<ul>
<li><strong>Classic safari:</strong> Mara + Amboseli (or Mara + Samburu for remoteness).</li>
<li><strong>Safari + coast:</strong> Mara/Amboseli + Diani or Lamu.</li>
<li><strong>Nairobi add-on:</strong> Add Nairobi National Park and Hell's Gate around the capital.</li>
</ul>
<p>For transfers between parks and the coast, <a href="/collections/services">Ubuntu Logistics</a> runs comfortable, reliable road transfers — or fly between regions and let us handle the ground transport. Browse our full <a href="/collections/destinations">destinations collection</a> to see what's available.</p>
    `,
  },
  {
    title: "How to Choose the Right Safari Vehicle: A 4x4 Land Cruiser Guide",
    slug: "how-to-choose-safari-vehicle",
    excerpt:
      "Pop-up roofs, ground clearance, charging ports — what actually matters when choosing a safari vehicle in Kenya.",
    featuredImage: img("photo-1469854523086-cc02fe5d8800"),
    category: "transport",
    tags: ["safari vehicle", "4x4", "land cruiser", "transport", "kenya"],
    keywords: ["safari vehicle hire", "4x4 land cruiser kenya", "safari van rental", "kenya transport"],
    readTime: "8 min read",
    metaTitle: "How to Choose a Safari Vehicle in Kenya | Ubuntu Logistics",
    metaDescription:
      "What to look for in a Kenya safari vehicle — pop-up roofs, clearance, seating, charging and driver-guides. Book the right 4x4.",
    content: `
<p>The vehicle is the most underrated part of a safari. A great guide in a mediocre vehicle still gives you a mediocre day; a great vehicle with a great driver-guide gives you memories. If you're arranging your own transport in Kenya — or checking what a tour operator provides — here's what actually matters.</p>

<h2>Why 4x4 Is Non-Negotiable</h2>
<p>Most Kenyan parks have unsealed roads that turn to mud in the rains and corrugated dust in the dry season. A standard saloon car will not cope — and isn't permitted in many parks anyway. A proper safari vehicle is a modified 4x4 (typically a Toyota Land Cruiser 78 series) with:</p>
<ul>
<li><strong>High ground clearance</strong> for ruts, rocks and river crossings.</li>
<li><strong>Low-range four-wheel drive</strong> for soft sand and steep gradients.</li>
<li><strong>Pop-up roof</strong> — the single most important feature for game viewing.</li>
<li><strong>Reinforced suspension</strong> for bumpy tracks.</li>
</ul>

<h2>The Pop-Up Roof: Game Viewing's Game-Changer</h2>
<p>When the roof pops up, everyone stands for a 360-degree view over the plains — essential for spotting wildlife that blends into the grass. Check that the roof is actually pop-up (not just a sunroof) and that all seats have clear sightlines. Some older vehicles have obstructed views from rear seats.</p>

<h2>Seating &amp; Space</h2>
<ul>
<li><strong>7-seater Land Cruisers:</strong> Standard for private safaris — comfortable for 6 adults + gear.</li>
<li><strong>Custom safari vans (12–24 seats):</strong> Common for group tours — cheaper per person but less flexible.</li>
<li><strong>Extended versions:</strong> Available for larger groups or extra luggage.</li>
</ul>
<p>Legroom matters on long drives — Nairobi to the Mara is 5–6 hours. If you're tall, sit in the front row or request an extended cabin.</p>

<h2>Charging &amp; Connectivity</h2>
<p>Modern safaris need power. Look for:</p>
<ul>
<li>USB charging ports at every seat</li>
<li>12V sockets for cameras/laptops</li>
<li>WiFi hotspot (some operators offer it)</li>
<li>Cool box for drinks on hot days</li>
</ul>

<h2>The Driver-Guide Factor</h2>
<p>In Kenya, your driver is often also your guide. A great driver-guide knows animal behaviour, park regulations, bird calls and where to find hidden wildlife. When booking, ask:</p>
<ul>
<li>Is the driver-guide KWS-licensed and first-aid trained?</li>
<li>How many years have they been guiding in this specific park?</li>
<li>Do they speak your language?</li>
<li>Can they accommodate specific interests (photography, birding, families)?</li>
</ul>

<h2>Questions to Ask Before Booking</h2>
<ol>
<li>What vehicle model/year, and can I see photos?</li>
<li>Is fuel included in the quoted price?</li>
<li>Are park fees included or extra?</li>
<li>What's the cancellation policy?</li>
<li>Is the vehicle insured and NTSA-compliant?</li>
</ol>

<h2>Book a Vehicle You Can Trust</h2>
<p><a href="/collections/fleet">Ubuntu Logistics and Transport</a> operates a modern fleet of NTSA-compliant 4x4 Land Cruisers and safari vans, all with pop-up roofs, charging ports and professional driver-guides. Whether you need a single transfer or a multi-day safari vehicle, our <a href="/collections/services">transport services</a> cover Nairobi, all major parks and the coast. <a href="/collections/services">Get a quote</a> — we'll match the vehicle to your itinerary.</p>
    `,
  },
  {
    title: "Airport Transfers in Nairobi: JKIA &amp; Wilson Airport Guide",
    slug: "nairobi-airport-transfers-guide",
    excerpt:
      "JKIA or Wilson? Meet-and-greet, flight tracking, and why your airport transfer sets the tone for your whole Kenya trip.",
    featuredImage: img("photo-1436491865332-7a61a109cc05"),
    category: "transport",
    tags: ["airport transfer", "jkia", "wilson", "nairobi", "transport"],
    keywords: ["nairobi airport transfer", "jkia transfer", "wilson airport", "airport pickup nairobi", "kenya airport transport"],
    readTime: "7 min read",
    metaTitle: "Nairobi Airport Transfers: JKIA & Wilson Guide | Ubuntu Logistics",
    metaDescription:
      "Complete guide to Nairobi airport transfers — JKIA vs Wilson, meet-and-greet, flight tracking, costs and why it matters for your trip.",
    content: `
<p>The first and last leg of every Kenya trip runs through Nairobi's airports — and it's where most travel plans go wrong. A missed pickup, a rogue taxi, or a three-hour delay in a hotel lobby can sour the entire experience. Here's how to get your airport transfer right.</p>

<h2>Which Airport? JKIA vs Wilson</h2>
<h3>Jomo Kenyatta International Airport (JKIA / NBO)</h3>
<p>Kenya's main international gateway, 15km southeast of the city centre. Handles all major international carriers — KLM, British Airways, Emirates, Qatar, Ethiopian, Kenya Airways and more. If you're flying internationally, you land here.</p>
<h3>Wilson Airport (WIL)</h3>
<p>15km southwest of the centre, handling domestic flights and regional routes to Tanzania, Uganda, Rwanda and the coast. If you're connecting to a safari or coastal flight within East Africa, you'll use Wilson.</p>

<h2>Why Pre-Book Your Transfer</h2>
<ul>
<li><strong>Fixed pricing:</strong> No haggling with touts or surge pricing.</li>
<li><strong>Meet-and-greet:</strong> Driver waits at arrivals with a name board.</li>
<li><strong>Flight tracking:</strong> Professional services monitor your flight and adjust for delays automatically.</li>
<li><strong>Safety:</strong> Licensed, insured vehicles vs unmarked taxis.</li>
<li><strong>Direct routing:</strong> No stops, no detours, straight to your hotel or onward destination.</li>
</ul>

<h2>What to Expect on Arrival</h2>
<ol>
<li>Clear immigration and collect your luggage.</li>
<li>Exit into the arrivals hall — your driver should be waiting with a sign bearing your name.</li>
<li>If they aren't there, call the number provided at booking (keep it saved).</li>
<li>Vehicle will be a clean, air-conditioned car or SUV with your name confirmed.</li>
<li>Most transfers to city hotels take 30–60 minutes depending on traffic.</li>
</ol>

<h2>Transfer Options Compared</h2>
<table style="width:100%;border-collapse:collapse;margin:1rem 0;">
<tr style="background:#f3f4f6;"><th style="text-align:left;padding:10px;border:1px solid #e5e7eb;">Option</th><th style="text-align:left;padding:10px;border:1px solid #e5e7eb;">Pros</th><th style="text-align:left;padding:10px;border:1px solid #e5e7eb;">Cons</th></tr>
<tr><td style="padding:10px;border:1px solid #e5e7eb;">Pre-booked private transfer</td><td style="padding:10px;border:1px solid #e5e7eb;">Fixed price, meet-and-greet, flight tracking</td><td style="padding:10px;border:1px solid #e5e7eb;">Must book ahead</td></tr>
<tr><td style="padding:10px;border:1px solid #e5e7eb;">Airport taxi (official)</td><td style="padding:10px;border:1px solid #e5e7eb;">Available on demand</td><td style="padding:10px;border:1px solid #e5e7eb;">Variable pricing, less reliable</td></tr>
<tr><td style="padding:10px;border:1px solid #e5e7eb;">Ride-hailing app</td><td style="padding:10px;border:1px solid #e5e7eb;">Convenient, cashless</td><td style="padding:10px;border:1px solid #e5e7eb;">Surge pricing, driver availability varies</td></tr>
<tr><td style="padding:10px;border:1px solid #e5e7eb;">Hotel shuttle</td><td style="padding:10px;border:1px solid #e5e7eb;">Often free with booking</td><td style="padding:10px;border:1px solid #e5e7eb;">Shared, scheduled times only</td></tr>
</table>

<h2>Costs (Approximate)</h2>
<ul>
<li><strong>JKIA → Nairobi CBD:</strong> KES 2,000–5,000 depending on vehicle and operator</li>
<li><strong>Wilson → Nairobi CBD:</strong> KES 1,500–3,500</li>
<li><strong>JKIA → Safari park (e.g., Mara):</strong> KES 15,000–35,000+ depending on distance</li>
<li><strong>JKIA → Coast (Mombasa/Diani):</strong> KES 20,000–40,000</li>
</ul>
<p>Prices vary by vehicle type, time of day and operator. Always confirm inclusions (tolls, waiting time, meet-and-greet).</p>

<h2>Connecting to Your Safari</h2>
<p>The smartest move for most travellers is to book a <strong>direct transfer from the airport to your safari destination</strong> — skipping Nairobi entirely. A JKIA-to-Mara transfer in a comfortable 4x4 takes 5–6 hours and delivers you straight to your lodge, refreshed for your first game drive. <a href="/collections/services">Ubuntu Logistics</a> runs daily airport-to-park transfers with experienced driver-guides who know the routes and can point out sights en route.</p>

<h2>Book Your Transfer</h2>
<p>Don't leave your arrival to chance. <a href="/collections/services">Request an airport transfer quote</a> from Ubuntu Logistics — we track your flight, meet you at arrivals, and get you to your destination safely and on time. Serving JKIA, Wilson and all Nairobi-area hotels.</p>
    `,
  },
  {
    title: "Corporate Staff Transport in Nairobi: A Complete Business Guide",
    slug: "corporate-staff-transport-nairobi",
    excerpt:
      "Punctual, compliant, comfortable — how Nairobi companies are solving employee transport with dedicated shuttles and logistics partners.",
    featuredImage: img("photo-1521737604893-d14cc237f11d"),
    category: "corporate-travel",
    tags: ["corporate transport", "staff shuttle", "nairobi", "business", "logistics"],
    keywords: ["corporate staff transport", "employee shuttle nairobi", "corporate logistics kenya", "staff transport service"],
    readTime: "9 min read",
    metaTitle: "Corporate Staff Transport in Nairobi Guide | Ubuntu Logistics",
    metaDescription:
      "How Nairobi businesses are solving staff transport — shuttle routes, fleet options, compliance and cost. A complete corporate guide.",
    content: `
<p>Nairobi's traffic is legendary — and it's one of the biggest hidden costs of doing business in Kenya. Employees spending 2–3 hours daily in matatus and traffic lose productivity, arrive stressed, and eventually leave for employers who solve the problem. Here's how forward-thinking companies are fixing it with dedicated staff transport.</p>

<h2>The Business Case for Staff Transport</h2>
<p>The numbers are compelling:</p>
<ul>
<li><strong>Reduced absenteeism:</strong> Reliable transport means fewer late arrivals and missed days.</li>
<li><strong>Talent retention:</strong> Commute quality is a top-3 reason employees cite for leaving jobs in surveys across East Africa.</li>
<li><strong>Productivity gains:</strong> Staff who arrive rested and on time deliver better work.</li>
<li><strong>Duty-of-care compliance:</strong> Providing safe, insured transport demonstrates employer responsibility.</li>
<li><strong>ESG credentials:</strong> Reduced car usage lowers your carbon footprint — increasingly important for ESG reporting.</li>
</ul>

<h2>Transport Options Compared</h2>
<h3>Matatu / Public Transport</h3>
<p>Cheap but unreliable, unsafe, and unpredictable. Not viable for corporate duty-of-care.</p>
<h3>Ride-Hailing Apps</h3>
<p>Convenient for individuals but expensive at scale, no route optimization, and inconsistent vehicle quality.</p>
<h3>Company-Owned Fleet</h3>
<p>Full control but high capital cost, maintenance burden, driver management, and idle capacity during off-peak.</p>
<h3>Outsourced Shuttle Service (Recommended)</h3>
<p>Dedicated routes, professional drivers, managed fleet, predictable monthly cost, and no capital expenditure. This is what most Nairobi corporates choose.</p>

<h2>What a Corporate Shuttle Service Includes</h2>
<ul>
<li><strong>Route planning:</strong> Pickup points across residential estates (Karen, Lavington, Kilimani, Ruaka, Syokimau, Athi River, etc.) to your office.</li>
<li><strong>Fleet:</strong> 14–33 seater minibuses or custom coaches, air-conditioned, with seatbelts.</li>
<li><strong>Professional drivers:</strong> Licensed, vetted, uniformed, trained in customer service.</li>
<li><strong>Real-time tracking:</strong> GPS monitoring so employees know when their bus is arriving.</li>
<li><strong>Flexible scheduling:</strong> Morning and evening peak routes, plus ad-hoc airport/event transfers.</li>
<li><strong>Maintenance &amp; insurance:</strong> Fully managed — you don't worry about breakdowns or NTSA compliance.</li>
</ul>

<h2>Compliance &amp; Safety</h2>
<p>Kenya's <a href="https://www.ntsa.go.ke" target="_blank" rel="noopener">National Transport and Safety Authority (NTSA)</a> regulates commercial passenger transport. Your provider should have:</p>
<ul>
<li>Valid NTSA operating licenses</li>
<li>Comprehensive passenger insurance</li>
<li>Drivers with valid PSV licenses and clean records</li>
<li>Vehicles that pass annual inspection</li>
</ul>
<p>For corporate clients, request copies of all certifications — reputable operators provide them readily.</p>

<h2>Pricing Models</h2>
<p>Corporate transport is typically priced per seat per month or per route. Factors affecting cost:</p>
<ul>
<li>Number of pickup points and route complexity</li>
<li>Vehicle capacity needed</li>
<li>Frequency (daily vs peak-only)</li>
<li>Distance from residential areas to office</li>
</ul>
<p>Most Nairobi corporates find that a shared shuttle service costs significantly less per employee than individual transport allowances — while delivering a far better experience.</p>

<h2>Getting Started</h2>
<p>Implementation typically takes 2–4 weeks: route survey, vehicle allocation, driver assignment, and a soft-launch with feedback loops. <a href="/collections/services">Ubuntu Logistics</a> has been providing corporate staff transport across Nairobi since 2018 — our <a href="/collections/fleet">fleet</a> includes minibuses and coaches ready for immediate deployment. <a href="/collections/services">Request a corporate transport quote</a> and we'll design a route plan around your team.</p>
    `,
  },
  {
    title: "Hell's Gate National Park: Hiking, Cycling & Wildlife Without a Safari Vehicle",
    slug: "hells-gate-national-park-guide",
    excerpt:
      "Kenya's adventure capital — hike through volcanoes, cycle with zebra, and walk through gorges. No 4x4 required.",
    featuredImage: img("photo-1506905925346-21bda4d32df4"),
    category: "destinations",
    tags: ["hells gate", "hiking", "cycling", "nairobi", "adventure"],
    keywords: ["hells gate national park", "hells gate hiking", "hells gate cycling", "nairobi day trip", "kenya adventure"],
    readTime: "8 min read",
    metaTitle: "Hell's Gate National Park Guide: Hiking & Cycling | Ubuntu Logistics",
    metaDescription:
      "Complete Hell's Gate guide — hiking trails, cycling safari, wildlife viewing and how to get there from Nairobi. Kenya's adventure park.",
    content: `
<p>Just 90 minutes from Nairobi, Hell's Gate National Park is where Kenya's safari experience meets genuine adventure. This is the only park in Kenya where you can hike, cycle and walk among wildlife without a vehicle — and it's one of the most underrated destinations in the country.</p>

<h2>Why Visit Hell's Gate?</h2>
<ul>
<li><strong>No vehicle required:</strong> Explore on foot or bicycle among zebra, giraffe, buffalo and antelope.</li>
<li><strong>Stunning geology:</strong> Volcanic cliffs, hot springs, gorges and the towering Fischer's Tower.</li>
<li><strong>Great Rift Valley scenery:</strong> Part of the East African Rift system — dramatic landscapes everywhere.</li>
<li><strong>Close to Nairobi:</strong> Perfect day trip or overnight stopover.</li>
<li><strong>Rock climbing:</strong> One of East Africa's best climbing spots (with guides).</li>
</ul>

<h2>Top Activities</h2>
<h3>Hiking</h3>
<p>The main circuit takes 2–4 hours depending on your route. Highlights:</p>
<ul>
<li><strong>Central Tower:</strong> A basalt rock formation offering panoramic views</li>
<li><strong>Fischer's Tower:</strong> A dramatic column rising from the plain</li>
<li><strong>Gorge walk:</strong> Navigate the narrow red-rock gorge (sure-footedness required)</li>
<li><strong>Hells Gate Gorge:</strong> The park's namesake — a deep volcanic slot canyon</li>
</ul>
<h3>Cycling Safari</h3>
<p>Rent bikes at the gate and cycle through the park among grazing zebra and giraffe — an experience found nowhere else in Kenya. Bikes are available for hire at the entrance.</p>
<h3>Wildlife Viewing</h3>
<p>While you won't see the Big Five here, the park is excellent for:</p>
<ul>
<li>Plains zebra, Grant's gazelle, impala</li>
<li>Giraffe, buffalo, warthog</li>
<li>Baboons (famous and entertaining)</li>
<li>Over 100 bird species including Verreaux's eagle</li>
</ul>
<h3>Hot Springs &amp; Spa</h3>
<p>The Olkaria geothermal area nearby has natural hot springs — perfect for soaking after a hike.</p>

<h2>Getting There</h2>
<p>Hell's Gate is 90km northwest of Nairobi via Naivasha — about 1.5–2 hours by road. Options:</p>
<ul>
<li><strong>Private transfer:</strong> Most convenient — we can arrange pickup from your Nairobi hotel.</li>
<li><strong>Matatu:</strong> Take a matatu from Nairobi's River Road to Naivasha, then a local taxi to the park gate (~30min).</li>
<li><strong>Self-drive:</strong> Park at the gate; the road is good all-weather.</li>
</ul>
<p><a href="/collections/services">Ubuntu Logistics</a> runs day-trip transfers to Hell's Gate combined with Lake Nakuru or the Great Rift Valley — ideal if you're short on time.</p>

<h2>Practical Tips</h2>
<ul>
<li><strong>Entry fees:</strong> ~KES 800/adult for residents, higher for non-residents (verify at KWS).</li>
<li><strong>Best time:</strong> Dry season (July–October, January–March) for easier hiking.</li>
<li><strong>What to bring:</strong> Water (2L+), sunscreen, hat, sturdy shoes, camera.</li>
<li><strong>Safety:</strong> Don't feed baboons; keep distance from buffalo; stay on marked trails.</li>
<li><strong>Combine with:</strong> Lake Nakuru (30min away), Mount Longonot hike, or the Great Rift Valley viewpoints.</li>
</ul>

<h2>Make It a Full Day</h2>
<p>Pair Hell's Gate with <a href="/collections/destinations">Lake Nakuru National Park</a> for a full-day Rift Valley adventure, or add an overnight at a Naivasha lakeside lodge. For transfers and itinerary planning, <a href="/collections/services">contact our team</a> — we know the routes and timing.</p>
    `,
  },
  {
    title: "Lamu Island: Swahili Culture, Beaches & UNESCO Heritage",
    slug: "lamu-island-guide",
    excerpt:
      "Car-free streets, coral stone architecture, dhows and some of East Africa's best beaches — discover Kenya's island gem.",
    featuredImage: img("photo-1519046904884-53103b34b206"),
    category: "destinations",
    tags: ["lamu", "beach", "swahili", "unesco", "kenya coast"],
    keywords: ["lamu island", "lamu kenya", "lamu beaches", "swahili coast", "lamu travel guide"],
    readTime: "9 min read",
    metaTitle: "Lamu Island Guide: Swahili Culture & Beaches | Ubuntu Logistics",
    metaDescription:
      "Discover Lamu Island — UNESCO old town, pristine beaches, Swahili culture and how to get there. Kenya's hidden coastal gem.",
    content: `
<p>Lamu is Kenya's best-kept secret. This car-free island off the northern coast is a <a href="https://whc.unesco.org/en/list/1055" target="_blank" rel="noopener">UNESCO World Heritage Site</a> where time moves at the pace of a sailing dhow — narrow coral-stone alleys, rooftop terraces, call to prayer echoing over the harbour, and beaches that rival any in the Indian Ocean.</p>

<h2>Why Lamu Is Special</h2>
<ul>
<li><strong>UNESCO heritage:</strong> Lamu Old Town has been continuously inhabited for over 700 years — one of the oldest and best-preserved Swahili settlements in East Africa.</li>
<li><strong>Car-free:</strong> No vehicles on the island — transport is by foot, donkey cart, or boat. It's blissfully quiet.</li>
<li><strong>Swahili culture:</strong> Deep Islamic and Swahili traditions, woodcarving, basket weaving, and the annual Lamu Cultural Festival.</li>
<li><strong>Beaches:</strong> Pristine white-sand beaches on the island's south side and the surrounding islets.</li>
<li><strong>Dhow building:</strong> Watch traditional wooden dhows being crafted — a craft passed down for centuries.</li>
</ul>

<h2>What to Do in Lamu</h2>
<h3>Explore Lamu Old Town</h3>
<p>Get lost in the labyrinth of narrow alleys, visit the 14th-century <strong>Lamu Fort</strong>, browse the <strong>souk</strong> for spices, textiles and brasswork, and climb to rooftop terraces for harbour views. The town's architecture — coral rag, mangrove poles, carved doors — is a living museum.</p>
<h3>Beach Time</h3>
<p>Lamu's beaches are on the island's southern tip and on nearby islets like Manda and Kiwayu. Expect powdery sand, turquoise water, and near-empty beaches — a world away from Diani's buzz.</p>
<h3>Dhow Trips</h3>
<p>Sail to the neighbouring islands, snorkel on coral reefs, or take a sunset cruise from Lamu harbour. Traditional dhows are still built by hand — visit the boatyard to see craftsmen at work.</p>
<h3>Water Sports</h3>
<p>Kayaking, kitesurfing, windsurfing and diving are all available — the Indian Ocean here is warm and clear year-round.</p>
<h3>Lamu Cultural Festival (November)</h3>
<p>The island's biggest event — donkey races, dhow races, traditional dances, and a celebration of Swahili heritage. Book accommodation months ahead.</p>

<h2>Getting to Lamu</h2>
<ul>
<li><strong>By air:</strong> Fly from Nairobi (Wilson or JKIA) to Lamu Airport (~1.5hrs) — the easiest option.</li>
<li><strong>By road + boat:</strong> Drive to Mokowe (~6hrs from Nairobi via Garissa or Marsabit), then take a boat to Lamu (~1.5hrs).</li>
<li><strong>By road all the way:</strong> The Lamu-Mpeketoni road now reaches the island's south side — a scenic but long drive.</li>
</ul>
<p>For seamless connections, <a href="/collections/services">Ubuntu Logistics</a> arranges road transfers to Mokowe/Mpeketoni with boat connections — or fly and we'll handle your airport pickup.</p>

<h2>Where to Stay</h2>
<ul>
<li><strong>Lamu Old Town:</strong> Heritage guesthouses and riads — atmospheric but no beach access.</li>
<li><strong>Lamu Island south:</strong> Beach lodges and resorts with pools and water sports.</li>
<li><strong>Manda Island:</strong> Exclusive private-island experiences — the height of luxury.</li>
<li><strong>Kiwayu Island:</strong> Eco-lodges and diving centres — quieter and more rustic.</li>
</ul>

<h2>Best Time to Visit</h2>
<p>October–March for the best beach weather (hot, dry, calm seas). November for the Cultural Festival. April–June can be windy with occasional rain — still beautiful but choppier seas.</p>

<h2>Plan Your Lamu Trip</h2>
<p>Combine Lamu with a safari for the ultimate Kenya experience — fly Nairobi → Lamu, or road-trip up the coast from Mombasa. <a href="/collections/destinations">Browse our destinations</a> or <a href="/collections/services">request a custom itinerary</a> including Lamu, the coast and the safari circuit.</p>
    `,
  },
  {
    title: "The Great Migration in Kenya: When & Where to See the Wildebeest Crossing",
    slug: "great-migration-kenya-guide",
    excerpt:
      "Over a million wildebeest, zebra and gazelle — where to be, when to go, and how to see the dramatic Mara River crossings.",
    featuredImage: img("photo-1547471080-7cc2caa01a7e"),
    category: "safari-guides",
    tags: ["great migration", "wildebeest", "maasai mara", "safari", "kenya"],
    keywords: ["great migration kenya", "wildebeest migration", "maasai mara migration", "when to see migration"],
    readTime: "10 min read",
    metaTitle: "Great Migration Kenya: When & Where to See It | Ubuntu Logistics",
    metaDescription:
      "Complete guide to the Great Migration in Kenya — best times, Mara River crossings, where to stay and how to see the spectacle.",
    content: `
<p>The Great Migration is the greatest wildlife spectacle on Earth — over a million wildebeest, zebra and gazelle moving in a continuous circle between Tanzania's Serengeti and Kenya's Maasai Mara. It's not a single event but a year-round journey, and knowing where the herds are at any given time is the key to seeing it properly.</p>

<h2>What Is the Great Migration?</h2>
<p>Each year, roughly 1.5 million wildebeest, 200,000 zebra and 300,000 gazelle follow the rains in a clockwise loop across the Mara-Serengeti ecosystem. They move in search of fresh grazing, pursued by Africa's highest concentration of predators — lion, leopard, cheetah, hyena and wild dog.</p>
<p>The migration is driven by rainfall patterns, not a fixed calendar — but the general pattern is remarkably consistent year to year.</p>

<h2>The Migration Calendar</h2>
<h3>January–March: Calving Season (Serengeti side)</h3>
<p>The herds are in the southern Serengeti (Tanzania) where short rains have produced lush grass. Over 500,000 calves are born in a 2–3 week window — and predators know it. This is the most dramatic predator-prey action of the year, but it's mostly on the Tanzanian side.</p>
<h3>April–May: Moving North</h3>
<p>The herds begin moving northwest through the Western Corridor and toward the Grumeti River. River crossings begin but aren't yet at peak.</p>
<h3>June–July: Entering Kenya</h3>
<p>The herds cross into the Maasai Mara from the northwest — the first Mara River crossings typically happen in July. The Mara's grass is at its best and predator numbers peak.</p>
<h3>August–October: Peak Mara Season</h3>
<p><strong>The spectacle.</strong> The herds are concentrated in the Mara, crossing the Mara River repeatedly — often in dramatic, chaotic scenes with crocodiles waiting below. This is the most famous and most photographed phase. Book 6–12 months ahead.</p>
<h3>November–December: Heading South</h3>
<p>Short rains trigger the return south — the herds cross back into the Serengeti and the cycle begins again.</p>

<h2>Where to See the Mara River Crossings</h2>
<p>The crossings happen at several points along the Mara River — the most famous are near <strong>Global Heritage Estate</strong>, <strong>Little Governors' Camp</strong>, and the northern Mara triangle. Your guide will know where the herds are concentrated on any given day — river crossings are unpredictable and you need local knowledge.</p>
<p>Tip: Crossings are most dramatic in the <strong>dry season (August–October)</strong> when the herds are concentrated and water is scarce. In wet years, the herds may spread out and crossings become less predictable.</p>

<h2>Where to Stay</h2>
<ul>
<li><strong>Mara reserve lodges:</strong> Inside the reserve — best for early morning drives to crossings.</li>
<li><strong>Mara conservancies:</strong> Adjacent private conservancies offer exclusivity and lower densities.</li>
<li><strong>Camp sites:</strong> Budget option — basic but authentic.</li>
</ul>
<p>For help choosing accommodation and planning transfers, <a href="/collections/destinations">browse our destinations</a> or <a href="/collections/services">contact our team</a>.</p>

<h2>Getting to the Mara</h2>
<ul>
<li><strong>Fly:</strong> Nairobi (Wilson) → Mara airstrips (Mara Serena, Keekorok, Ol Kiombo) — ~45 mins. Most convenient for peak season.</li>
<li><strong>Road:</strong> Nairobi → Mara is ~270km / 5–6 hours via Narok — scenic but long. Break the journey with a stop at a Rift Valley viewpoint.</li>
</ul>
<p><a href="/collections/services">Ubuntu Logistics</a> runs daily Nairobi–Mara transfers in comfortable 4x4 Land Cruisers with experienced driver-guides — the most reliable way to reach the Mara without the stress of self-driving.</p>

<h2>Maximising Your Chances</h2>
<ul>
<li><strong>Stay 3+ nights:</strong> Crossings are unpredictable — give yourself multiple mornings.</li>
<li><strong>Early starts:</strong> Crossings often happen early morning; be on the river by 6–7am.</li>
<li><strong>Patience:</strong> Herds can hover at the river for hours before crossing — it builds tension.</li>
<li><strong>Right guide:</strong> A good driver-guide reads animal behaviour and knows where herds are heading.</li>
</ul>

<h2>Beyond the Crossings</h2>
<p>The Mara isn't just about the migration — it's Kenya's best big-cat destination year-round. Even outside migration season, lion prides, cheetahs on the plains and leopards in the thickets make every drive worthwhile. For the full picture, read our <a href="/blogs/ultimate-kenya-safari-guide">complete Kenya safari guide</a> and <a href="/blogs/best-time-to-visit-kenya">seasonal timing guide</a>.</p>
    `,
  },
  {
    title: "What to Pack for a Kenya Safari: The Complete Checklist",
    slug: "what-to-pack-kenya-safari",
    excerpt:
      "Binoculars, neutral colours, layers and the 10 items everyone forgets — pack smart for your Kenya safari.",
    featuredImage: img("photo-1551632811-561732d1e306"),
    category: "travel-tips",
    tags: ["packing", "safari", "checklist", "kenya", "travel tips"],
    keywords: ["safari packing list", "what to pack kenya safari", "safari essentials", "kenya travel checklist"],
    readTime: "8 min read",
    metaTitle: "What to Pack for a Kenya Safari: Complete Checklist | Ubuntu Logistics",
    metaDescription:
      "The ultimate Kenya safari packing list — clothing, gear, documents and the 10 items everyone forgets. Pack light, pack right.",
    content: `
<p>Packing for a Kenya safari is different from any other trip. You're not going to the beach or the city — you're going into the bush, where dust, sun, bumpy roads and early mornings are the norm. Pack too much and you're lugging bags between airstrips; pack too little and you're buying essentials at tourist prices in Nairobi. Here's the checklist that gets it right.</p>

<h2>Clothing: The Safari Rule</h2>
<p><strong>Neutral colours only</strong> — khaki, olive, beige, brown. Avoid bright colours and especially blue/black near tsetse fly areas (they're attracted to dark colours).</p>
<ul>
<li><strong>2–3 long-sleeve shirts</strong> — sun protection + insect repellent</li>
<li><strong>2–3 pairs of trousers/shorts</strong> — quick-dry fabric preferred</li>
<li><strong>1 light jacket or fleece</strong> — early morning drives are cold, especially at altitude</li>
<li><strong>Wide-brimmed hat</strong> — non-negotiable for sun protection</li>
<li><strong>Sturdy closed-toe shoes</strong> — for walks and uneven terrain</li>
<li><strong>Socks</strong> — bring extra; dust gets everywhere</li>
<li><strong>Swimwear</strong> — if your lodge has a pool</li>
</ul>

<h2>Essential Gear</h2>
<ul>
<li><strong>Binoculars (8x42 or 10x42)</strong> — THE most important item. You will use them constantly.</li>
<li><strong>Camera + extra batteries/SD cards</strong> — dust is brutal on equipment; bring a blower brush.</li>
<li><strong>Power bank</strong> — charging opportunities are limited in remote areas.</li>
<li><strong>Headlamp/torch</strong> — for night walks and power cuts.</li>
<li><strong>Sunscreen SPF 50+</strong> — equatorial sun is intense.</li>
<li><strong>Insect repellent (DEET-based)</strong> — for mosquitoes and tsetse.</li>
<li><strong>Sunglasses (polarized)</strong> — reduces glare and improves game viewing.</li>
<li><strong>Reusable water bottle</strong> — stay hydrated; most lodges provide refill stations.</li>
</ul>

<h2>Documents &amp; Money</h2>
<ul>
<li><strong>Passport</strong> — valid 6+ months beyond travel dates</li>
<li><strong>Kenya eTA</strong> — apply online at <a href="https://www.etakenya.go.ke" target="_blank" rel="noopener">eTA Kenya</a> before departure</li>
<li><strong>Yellow fever certificate</strong> — if arriving from endemic countries</li>
<li><strong>Travel insurance</strong> — comprehensive coverage including medical evacuation</li>
<li><strong>Cash (KES and USD)</strong> — for tips, small purchases; ATMs available in towns</li>
<li><strong>Credit cards</strong> — Visa/MC widely accepted in cities and lodges</li>
</ul>

<h2>Health &amp; Medication</h2>
<ul>
<li><strong>Malaria prophylaxis</strong> — consult a travel clinic; most safari areas are endemic zones</li>
<li><strong>Prescription medications</strong> — bring enough for the whole trip + extras</li>
<li><strong>First-aid kit</strong> — plasters, antiseptic, anti-diarrhoeal, rehydration salts</li>
<li><strong>Personal prescriptions</strong> — in original packaging with doctor's letter</li>
</ul>

<h2>The 10 Items Everyone Forgets</h2>
<ol>
<li><strong>Earplugs</strong> — for light sleepers in tented camps</li>
<li><strong>Ziplock bags</strong> — for electronics in dusty conditions</li>
<li><strong>Notebook and pen</strong> — for journaling and bird lists</li>
<li><strong>Swedish bath towel or sarong</strong> — some lodges don't provide them</li>
<li><strong>Neutral-coloured scarf/buff</strong> — dust protection + sun coverage</li>
<li><strong>Small daypack</strong> — for game drives (lodge provides but bring your own)</li>
<li><strong>Travel adapter</strong> — Kenya uses British 3-pin plugs (230V)</li>
<li><strong>Copies of documents</strong> — passport, insurance, eTA printed and digital</li>
<li><strong>Gratuities cash</strong> — tips for guides, drivers, lodge staff (USD or KES)</li>
<li><strong>Patience and sense of humour</strong> — the most important "items" of all</li>
</ol>

<h2>What NOT to Pack</h2>
<ul>
<li>Hair dryers and high-wattage appliances (most camps have limited power)</li>
<li>Excessive luggage — bush flights have strict weight limits (usually 15kg soft bags)</li>
<li>Brightly coloured clothing</li>
<li>Drones — banned in national parks without permits</li>
<li>Plastic bags — banned in Kenya (use reusable bags)</li>
</ul>

<h2>Ready for Your Safari?</h2>
<p>Packing is just the start — the right vehicle, guide and route make the difference. <a href="/collections/fleet">Browse our safari fleet</a>, check <a href="/collections/destinations">destinations</a>, or <a href="/collections/services">plan your trip</a> with our team.</p>
    `,
  },
  {
    title: "Nairobi National Park: A Safari Just Minutes from the City",
    slug: "nairobi-national-park-guide",
    excerpt:
      "Lions, rhinos and giraffes with the city skyline behind them — Kenya's most unique national park.",
    featuredImage: img("photo-1547471080-7cc2caa01a7e"),
    category: "destinations",
    tags: ["nairobi national park", "nairobi", "safari", "rhino", "day trip"],
    keywords: ["nairobi national park", "nairobi safari", "nairobi day trip", "kenya capital safari"],
    readTime: "7 min read",
    metaTitle: "Nairobi National Park Guide: City Safari | Ubuntu Logistics",
    metaDescription:
      "Explore Nairobi National Park — lions, rhinos, giraffes minutes from the city. Best time to visit, how to get there, what to see.",
    content: `
<p>Nairobi National Park is one of the most remarkable conservation areas on Earth — a genuine national park with lions, rhinos, giraffes and buffalo, located just 7km from the centre of a major African capital. Nowhere else can you watch a lion hunt with a skyline of skyscrapers in the background.</p>

<h2>Why Nairobi National Park Is Unique</h2>
<ul>
<li><strong>Location:</strong> Only 7km south of Nairobi's CBD — you can be in the park within 15 minutes of your hotel.</li>
<li><strong>Real wildlife:</strong> Lions, leopards, hyenas, rhinos, giraffes, buffalo, zebra, wildebeest, baboons and 400+ bird species.</li>
<li><strong>City backdrop:</strong> The Nairobi skyline forms a dramatic boundary along the park's northern edge.</li>
<li><strong>Year-round game viewing:</strong> Unlike migratory parks, wildlife is resident here all year.</li>
<li><strong>Black rhino sanctuary:</strong> One of the best places in Kenya to see the critically endangered black rhino.</li>
</ul>

<h2>What to See</h2>
<h3>Lions</h3>
<p>The park has a resident lion population — one of the few places you can reliably see lions on a short safari. prides are often spotted near the dam or along the Mbagathi River.</p>
<h3>Black Rhinos</h3>
<p>Nairobi NP is a key rhino sanctuary — the park's rhinos are well-protected and regularly seen, especially near the Ivory Burning Site monument.</p>
<h3>Giraffes &amp; Buffalo</h3>
<p>Common and easily spotted — herds of Rothschild's giraffe and Cape buffalo are frequently seen on the open plains.</p>
<h3>Birdlife</h3>
<p>Over 400 species recorded — the park is a birder's paradise with secretary birds, kori bustards, ostriches and many raptors.</p>

<h2>Best Time to Visit</h2>
<p>Nairobi NP is good year-round, but:</p>
<ul>
<li><strong>July–October (dry season):</strong> Best game viewing — animals concentrate around water.</li>
<li><strong>November–June:</strong> Green season — beautiful landscapes, more bird activity, but taller grass can hide animals.</li>
</ul>

<h2>How to Get There</h2>
<p>The park is on Langata Road, south of Nairobi — about 15–20 minutes from the CBD. Options:</p>
<ul>
<li><strong>Private vehicle:</strong> Most convenient — enter through the main gate on Langata Road.</li>
<li><strong>Safari van tour:</strong> Many operators offer half-day or full-day tours with guide.</li>
<li><strong>Matatu:</strong> Take a matatu from town to the Langata gate (infrequent but cheap).</li>
</ul>
<p>For a seamless experience, <a href="/collections/services">Ubuntu Logistics</a> can arrange a private vehicle with driver-guide for the day — pick-up from your hotel, park fees handled, and expert commentary.</p>

<h2>Practical Tips</h2>
<ul>
<li><strong>Entry fees:</strong> ~KES 500/adult for residents, higher for non-residents (verify at KWS).</li>
<li><strong>Game drives only:</strong> You must stay in your vehicle inside the park.</li>
<li><strong>Best viewing times:</strong> Early morning (6–9am) and late afternoon (3–6pm) when animals are most active.</li>
<li><strong>Picnic sites:</strong> Several designated areas for lunch breaks.</li>
<li><strong>Combine with:</strong> Nairobi's other attractions — Giraffe Centre, David Sheldrick Elephant Orphanage, Karen Blixen Museum.</li>
</ul>

<h2>Make It Part of Your Trip</h2>
<p>Nairobi National Park is the perfect start or end to a Kenya safari — do a morning game drive, then head to JKIA or Wilson Airport for your onward journey. <a href="/collections/destinations">Browse our destinations</a> or <a href="/collections/services">book a transfer</a> to combine the park with your safari itinerary.</p>
    `,
  },
  {
    title: "Corporate Events &amp; Team Building in Kenya: Logistics Guide",
    slug: "corporate-events-team-building-kenya",
    excerpt:
      "Safaris, conferences and team experiences — how to plan corporate events in Kenya that actually work.",
    featuredImage: img("photo-1517457373958-b7bdd4587205"),
    category: "corporate-travel",
    tags: ["corporate events", "team building", "safari", "nairobi", "logistics"],
    keywords: ["corporate events kenya", "team building safari", "corporate safari", "nairobi events", "business travel kenya"],
    readTime: "8 min read",
    metaTitle: "Corporate Events & Team Building in Kenya | Ubuntu Logistics",
    metaDescription:
      "Plan corporate events and team building in Kenya — safaris, conferences, logistics and transport. A business travel guide.",
    content: `
<p>Kenya is an extraordinary place for corporate events — world-class safari experiences, modern conference facilities, stunning venues, and a workforce that understands hospitality. Whether you're planning a board retreat, sales conference, or team-building safari, here's how to get it right.</p>

<h2>Why Kenya for Corporate Events?</h2>
<ul>
<li><strong>Unique experiences:</strong> A safari game drive or hot-air balloon ride over the Mara is unforgettable team bonding.</li>
<li><strong>World-class venues:</strong> From luxury lodges to modern convention centres in Nairobi.</li>
<li><strong>Accessibility:</strong> Direct flights from Europe, Asia and the Middle East to JKIA.</li>
<li><strong>Value:</strong> High-quality experiences at competitive prices vs other safari destinations.</li>
<li><strong>Language:</strong> English is the official language — seamless communication.</li>
</ul>

<h2>Popular Corporate Event Formats</h2>
<h3>Safari Team Building</h3>
<p>2–4 day safari itineraries combining game drives with structured team activities — problem-solving challenges, leadership exercises, and debrief sessions around campfires. The Mara and Amboseli are the most popular circuits.</p>
<h3>Conference + Safari Combo</h3>
<p>Conference in Nairobi (2–3 days) followed by a safari extension (3–5 days). Perfect for companies wanting both business and leisure.</p>
<h3>Day Trip Experiences</h3>
<p>For shorter engagements: Hell's Gate cycling, Nairobi National Park morning safari, or a hot-air balloon ride over the Mara at sunrise.</p>
<h3>Coastal Incentives</h3>
<p>Beach-based rewards trips to Diani, Watamu or Lamu — combine relaxation with team activities like snorkelling, dhow cruises and beach Olympics.</p>

<h2>Logistics: What Actually Matters</h2>
<h3>Transport</h3>
<p>Getting a group of 10–50 people to and from safari destinations requires coordination:</p>
<ul>
<li><strong>Airport transfers:</strong> Meet-and-greet for all attendees, luggage handling, direct routing.</li>
<li><strong>Inter-park transfers:</strong> Comfortable 4x4 vehicles or minibuses with professional drivers.</li>
<li><strong>On-site transport:</strong> Safari vehicles for game drives, plus support vehicles for logistics.</li>
</ul>
<p><a href="/collections/fleet">Ubuntu Logistics</a> provides dedicated corporate transport — from airport pickups to multi-day safari logistics. Our fleet includes minibuses, coaches and 4x4 Land Cruisers ready for group deployments.</p>
<h3>Accommodation</h3>
<p>Group-friendly lodges and camps offer:</p>
<ul>
<li>Exclusive-use lodges for complete privacy</li>
<li>Block bookings with meeting spaces</li>
<li>All-inclusive packages (meals, activities, park fees)</li>
</ul>
<h3>Meetings &amp; Events</h3>
<p>Nairobi has world-class conference facilities — from the <a href="https://www.kicc.co.ke" target="_blank" rel="noopener">KICC</a> to luxury hotel ballrooms. For safari locations, many lodges have conference rooms or outdoor venues.</p>

<h2>Sample Itinerary: 5-Day Mara Team Safari</h2>
<ul>
<li><strong>Day 1:</strong> Airport pickup, Nairobi hotel, welcome dinner</li>
<li><strong>Day 2:</strong> Fly/drive to Mara, afternoon game drive, bush dinner</li>
<li><strong>Day 3:</strong> Full-day safari with team activities, sundowner, star-gazing</li>
<li><strong>Day 4:</strong> Morning game drive, team workshop, departure</li>
<li><strong>Day 5:</strong> Return to Nairobi, airport transfer</li>
</ul>

<h2>Budget Considerations</h2>
<p>Corporate safari packages typically range from <strong>KES 40,000–120,000 per person</strong> for 3–5 day itineraries, depending on accommodation level, group size and activities. Volume discounts apply for larger groups. Contact us for a custom quote tailored to your team size and objectives.</p>

<h2>Plan Your Corporate Event</h2>
<p>From airport transfers to full safari logistics, <a href="/collections/services">Ubuntu Logistics</a> handles the details so you can focus on your team. We've moved corporate groups across Kenya since 2018 — <a href="/collections/services">request a quote</a> and let's design your event.</p>
    `,
  },
  {
    title: "Kenya's Coastal Paradise: Diani, Watamu &amp; Beyond",
    slug: "kenya-coastal-paradise-guide",
    excerpt:
      "Powder-white beaches, coral reefs and Swahili culture — Kenya's coast has far more to offer than most travellers realise.",
    featuredImage: img("photo-1507525428034-b723cf961d3e"),
    category: "destinations",
    tags: ["coast", "beach", "diani", "watamu", "kenya"],
    keywords: ["kenya beaches", "diani beach", "watamu", "kenya coast", "indian ocean kenya"],
    readTime: "9 min read",
    metaTitle: "Kenya's Coastal Paradise: Diani, Watamu & More | Ubuntu Logistics",
    metaDescription:
      "Discover Kenya's coast — Diani, Watamu, Lamu and more. Best beaches, when to visit, and how to combine with safari.",
    content: `
<p>After the safari, Kenya's coast is the perfect exhale — 500km of Indian Ocean shoreline with some of the best beaches in Africa, warm turquoise water, and a Swahili culture that's been trading for over a thousand years. Here's where to go and how to make the most of it.</p>

<h2>Diani Beach: Kenya's Beach Capital</h2>
<p>30km south of Mombasa, Diani is Kenya's most famous beach — and for good reason. Powder-white sand, crystal-clear water, coral reefs teeming with marine life, and a beach town that has everything from beach bars to fine dining.</p>
<p><strong>Best for:</strong> Families, honeymooners, first-time beach-goers. The reef is sheltered and safe for swimming.</p>
<p><strong>Activities:</strong> Snorkelling, diving, kitesurfing, dolphin watching, deep-sea fishing, beach sports.</p>

<h2>Watamu: The Quiet Alternative</h2>
<p>North of Mombasa, Watamu is Diani's laid-back cousin — fewer crowds, more eco-lodges, and the spectacular Watamu Marine National Park with its turtles, reefs and the famous "sea turtle" nesting beaches.</p>
<p><strong>Best for:</strong> Couples, eco-travellers, those seeking quiet.</p>
<p><strong>Activities:</strong> Snorkelling, glass-bottom boat tours, local village visits.</p>

<h2>Lamu: The Cultural Gem</h2>
<p>Further north, Lamu Island offers something completely different — a UNESCO World Heritage site of Swahili architecture, car-free streets, dhows and pristine beaches. Our <a href="/blogs/lamu-island-guide">full Lamu guide</a> covers it in detail.</p>

<h2>Other Coastal Gems</h2>
<ul>
<li><strong>Malindi &amp; Watamu Marine Park:</strong> Coral gardens and whale shark sightings (Nov–March).</li>
<li><strong>Tiwi Beach:</strong> Just south of Diani — local vibe, fresh seafood, fewer tourists.</li>
<li><strong>Kiwayu Island:</strong> Eco-lodges and diving — the coast's best-kept secret.</li>
<li><strong>Shimoni:</strong> Historic slave-trading site turned diving destination.</li>
</ul>

<h2>When to Visit the Coast</h2>
<ul>
<li><strong>January–March:</strong> Hottest and driest — perfect beach weather, calm seas.</li>
<li><strong>July–October:</strong> Cool and dry — great for combining with safari.</li>
<li><strong>April–June:</strong> Long rains — beaches are empty and cheap but seas can be choppy.</li>
<li><strong>November–December:</strong> Short rains — brief showers, then great weather.</li>
</ul>

<h2>Getting to the Coast</h2>
<ul>
<li><strong>Fly:</strong> Nairobi (JKIA or Wilson) → Mombasa (MBA) or Malindi (MYD) — ~1 hour.</li>
<li><strong>Road:</strong> Nairobi → Mombasa is ~485km / 6–8 hours via the Mombasa Road — scenic but long. Break it with stops at Tsavo or Voi.</li>
<li><strong>Train:</strong> The Madaraka Express runs Nairobi → Mombasa in ~4.5 hours — comfortable and scenic.</li>
</ul>
<p>For seamless safari-to-coast transfers, <a href="/collections/services">Ubuntu Logistics</a> runs direct road transfers — or fly and we'll handle your airport pickup. We also arrange combined itineraries that link the coast with the safari circuit.</p>

<h2>The Ultimate Combo: Safari + Beach</h2>
<p>The classic Kenya itinerary: 4–5 days safari in the Mara or Amboseli, then 3–4 days on the coast. Fly Nairobi → Mara, safari, fly Mara → Mombasa/Diani, beach, fly home. Or road-trip the whole way for a more adventurous journey. <a href="/collections/destinations">Browse our destinations</a> to plan your combo.</p>
    `,
  },
];

export const seedBlogPosts = mutation({
  handler: async (ctx) => {
    // 1. Categories (get-or-create by slug)
    let categoriesCreated = 0;
    for (const cat of CATEGORIES) {
      const existing = await ctx.db
        .query("blogCategories")
        .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
        .first();
      if (!existing) {
        await ctx.db.insert("blogCategories", cat);
        categoriesCreated++;
      }
    }

    // 2. Posts (skip existing slugs)
    let created = 0;
    let skipped = 0;
    for (const post of POSTS) {
      const existing = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug", (q) => q.eq("slug", post.slug))
        .first();
      if (existing) {
        skipped++;
        continue;
      }

      await ctx.db.insert("blogPosts", {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        category: post.category,
        tags: post.tags,
        keywords: post.keywords,
        author: AUTHOR,
        readTime: post.readTime,
        publishedAt: Date.now(),
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        ogImage: post.featuredImage,
        twitterCard: "summary_large_image",
        robots: "index, follow",
        status: "published",
      });
      created++;
    }

    return { created, skipped, categoriesCreated };
  },
});
