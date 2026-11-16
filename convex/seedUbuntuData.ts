import { mutation } from "./_generated/server";

export const seedAllUbuntuData = mutation({
  handler: async (ctx) => {
    // 1. UPDATE ORGANIZATION SETTINGS
    const orgs = await ctx.db.query("organization").collect();
    const orgData = {
      name: "Ubuntu Logistics and Transport",
      email: "Ben@ubuntulogistics.co.ke",
      emailEnabled: true,
      phone: "+254 728 798589",
      phoneEnabled: true,
      address: "North Airport Road, Embakasi, Nairobi, Kenya",
      addressEnabled: true,
      website: "https://www.ubuntulogistics.co.ke",
      websiteEnabled: true,
      description: "Premier tours, wildlife safari transport, corporate staff commuter shuttles, and luxury vehicle hire services across Kenya and East Africa.",
      industry: "Tours, Travel & Transport Logistics",
      companySize: "50-100 Employees",
      foundedYear: "2018",
      defaultMetaTitle: "Ubuntu Logistics & Transport | Kenya Tours, Safaris & Corporate Shuttles",
      defaultMetaDescription: "Ubuntu Logistics and Transport provides NTSA-compliant 4x4 Safari Land Cruisers, corporate staff transport, airport transfers (JKIA/Wilson), and bespoke tours across Kenya.",
      defaultKeywords: ["tours", "travel", "transport", "safari", "Kenya", "Nairobi", "corporate shuttles", "airport transfers", "4x4 land cruiser"],
      areasOfOperation: ["Nairobi", "Kenya", "East Africa"],
      twitter: "https://x.com/ubuntulogistics",
      twitterEnabled: true,
      facebook: "https://facebook.com/ubuntulogisticske",
      facebookEnabled: true,
      instagram: "https://instagram.com/ubuntulogisticske",
      instagramEnabled: true,
      linkedin: "https://linkedin.com/company/ubuntu-logistics-transport",
      linkedinEnabled: true,
      whatsapp: "+254728798589",
      whatsappEnabled: true,
    };

    if (orgs.length > 0) {
      await ctx.db.patch(orgs[0]._id, orgData);
    } else {
      await ctx.db.insert("organization", orgData);
    }

    // Helper to get or create collection
    async function getOrCreateCollection(data: {
      name: string;
      slug: string;
      description: string;
      icon: string;
      cardLayout: "grid" | "list" | "masonry";
      cardColumns: number;
      metaTitle: string;
      metaDescription: string;
      published: boolean;
    }) {
      const existing = await ctx.db
        .query("collections")
        .withIndex("by_slug", (q) => q.eq("slug", data.slug))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...data,
          publishedAt: Date.now(),
        });
        // Remove old collection items to avoid duplicates
        const oldItems = await ctx.db
          .query("collectionItems")
          .withIndex("by_collection", (q) => q.eq("collectionId", existing._id))
          .collect();
        for (const item of oldItems) {
          await ctx.db.delete(item._id);
        }
        return existing._id;
      } else {
        return await ctx.db.insert("collections", {
          ...data,
          publishedAt: Date.now(),
        });
      }
    }

    // 2. CREATE COLLECTIONS
    const servicesCollectionId = await getOrCreateCollection({
      name: "Services",
      slug: "services",
      description: "End-to-end transport and logistics solutions: corporate staff shuttles, guided wildlife safaris, 24/7 airport transfers, VIP chauffeur car hire, and event fleet coordination.",
      icon: "💼",
      cardLayout: "grid",
      cardColumns: 3,
      metaTitle: "Our Services | Ubuntu Logistics and Transport Kenya",
      metaDescription: "Explore premier transport services by Ubuntu Logistics: corporate employee shuttles, Kenya safari transport, JKIA airport transfers, and executive car hire.",
      published: true,
    });

    const fleetCollectionId = await getOrCreateCollection({
      name: "Fleet",
      slug: "fleet",
      description: "Our modern, NTSA-certified fleet includes custom 4x4 Safari Land Cruisers with pop-up roofs, executive Mercedes-Benz VIP cars, luxury tourist minibuses, and commuter vans.",
      icon: "🚐",
      cardLayout: "grid",
      cardColumns: 3,
      metaTitle: "Our Vehicle Fleet | Ubuntu Logistics and Transport Kenya",
      metaDescription: "Browse Ubuntu Logistics' modern transport fleet: 4x4 Safari Land Cruisers, Toyota HiAce tour vans, executive Mercedes-Benz sedans, and 25-33 seater luxury minibuses.",
      published: true,
    });

    const destinationsCollectionId = await getOrCreateCollection({
      name: "Destinations",
      slug: "destinations",
      description: "Discover Kenya's premier national parks, wildlife conservancies, coastal beaches, and corporate retreat hubs managed in partnership with Kenya Wildlife Service (KWS).",
      icon: "🌍",
      cardLayout: "grid",
      cardColumns: 3,
      metaTitle: "Top Kenya Destinations | Ubuntu Logistics and Transport",
      metaDescription: "Travel to Kenya's top safari and corporate retreat destinations: Maasai Mara, Amboseli (KWS), Lake Nakuru, Hell's Gate Naivasha, Tsavo, and Diani Beach.",
      published: true,
    });

    // 3. SEED SERVICES ITEMS
    const servicesData = [
      {
        collectionId: servicesCollectionId,
        title: "Corporate & Staff Commuter Transport",
        slug: "corporate-staff-commuter-transport",
        description: "Reliable, safe, and punctual turnkey employee shuttle solutions and 24/7 shift transport for multinational corporations, BPOs, embassies, and schools across Nairobi and surrounding counties.",
        content: `### Reliable Turnkey Employee Commuter Solutions

Ubuntu Logistics and Transport partners with leading multinational organizations, call centers, BPOs, diplomatic missions, and educational institutions across the greater Nairobi metropolitan area to provide seamless, punctual employee transportation.

#### Why Choose Ubuntu for Corporate Staff Transport?
- **Punctuality & Reliability:** Strict schedule adherence to eliminate lost man-hours and optimize workforce shift changes.
- **Route Optimization & Real-Time Telematics:** Customized pickup routes designed using cutting-edge GPS navigation to bypass Nairobi traffic bottlenecks.
- **NTSA Certified & Insured:** All vehicles carry comprehensive commercial PSV insurance and valid National Transport and Safety Authority (NTSA) compliance badges.
- **Vetted, Professional Chauffeurs:** Defensive driving certified, background-checked, and customer-service trained drivers.
- **Flexible Contract Terms:** Tailored monthly, quarterly, and annual service level agreements (SLAs) with dedicated fleet account managers.`,
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        icon: "briefcase",
        tags: ["Corporate", "Staff Transport", "BPO Shuttles", "Nairobi", "Punctual"],
        gallery: [
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "Custom Monthly Corporate Contracts",
          duration: "Daily / 24/7 Shift Schedules",
          features: [
            "Real-time GPS Tracking",
            "NTSA Speed Governors (80 km/h)",
            "Vetted Professional Drivers",
            "Onboard First Aid Kits & Fire Extinguishers",
            "Dedicated Fleet Manager & Standby Backups"
          ],
          client: "Multinationals, BPOs, Schools & Embassies",
          location: "Nairobi, Kiambu, Machakos & Kajiado",
        },
        faq: [
          {
            question: "How do you handle emergency vehicle breakdowns during shifts?",
            answer: "We maintain a standby reserve fleet strategically positioned along major Nairobi transport corridors. In the rare event of a mechanical delay, a replacement vehicle is dispatched immediately."
          },
          {
            question: "Can you accommodate night shift transport for 24/7 call centers?",
            answer: "Yes, we specialize in 24/7 door-to-door night shift transport with enhanced security measures and live journey monitoring for employee peace of mind."
          }
        ],
        reviews: [
          {
            author: "Operations Director, Nairobi BPO Hub",
            rating: 5,
            comment: "Ubuntu Logistics transformed our staff punctuality. Their drivers are always on time, courteous, and the vehicles are spotless.",
            date: "2026-02-15"
          }
        ],
        metaTitle: "Corporate Staff Transport & Employee Shuttles Nairobi | Ubuntu Logistics",
        metaDescription: "Professional employee commuter shuttles and 24/7 shift transport services for companies, call centers, and organizations in Nairobi, Kenya.",
        published: true,
        order: 1,
      },
      {
        collectionId: servicesCollectionId,
        title: "Kenya Wildlife Safaris & Tour Expeditions",
        slug: "kenya-wildlife-safaris-tour-expeditions",
        description: "Bespoke overland safari transport across Kenya’s iconic national parks with custom 4x4 Land Cruisers, pop-up roofs, and bronze-certified KPSGA driver-guides.",
        content: `### Experience Kenya's Wild Splendor with Ubuntu Safaris

Experience the thrill of East Africa's breathtaking savannahs, Great Rift Valley lakes, and dramatic wildlife sanctuaries. Our custom overland safari vehicles are engineered to conquer rugged terrain while ensuring panoramic photographic views.

#### Safari Transport Highlights:
- **Custom 4x4 Safari Land Cruisers & Tour Vans:** Heavy-duty off-road suspension, high clearance, and dual spare tires.
- **Full Pop-Up Observation Roofs:** Unobstructed 360-degree views for wildlife photography and game spotting.
- **KPSGA-Certified Driver-Guides:** Knowledgeable drivers trained in animal tracking, ornithology, wildlife behavior, and local history.
- **Onboard Comforts:** Electric cool-box/fridge for chilled drinks, USB device charging ports, and high-frequency communication radios.
- **Tailored Bush Circuits:** Maasai Mara, Amboseli, Lake Nakuru, Samburu, Tsavo, and Ol Pejeta.`,
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
        icon: "trees",
        tags: ["Safaris", "4x4 Land Cruiser", "Maasai Mara", "Amboseli", "KPSGA Guide"],
        gallery: [
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "carousel" as const,
        metadata: {
          price: "From $180 / KES 24,000 per day",
          duration: "Custom Multi-Day Bush Safaris",
          features: [
            "Pop-Up Game Viewing Roof",
            "KPSGA Bronze/Silver Certified Guide",
            "Onboard 12V Inverter & USB Sockets",
            "Onboard Refrigerator / Electric Cooler",
            "Long-Range VHF Radio Communication"
          ],
          location: "Nationwide Kenya & East Africa",
        },
        faq: [
          {
            question: "Are fuel and park entry fees included in the daily vehicle rate?",
            answer: "Our standard vehicle hire includes vehicle, professional driver-guide, and unlimited game drive mileage within park regulations. Park fees and client lodge accommodation are quoted separately or bundled upon request."
          }
        ],
        reviews: [
          {
            author: "Sarah & David Jenkins, UK",
            rating: 5,
            comment: "Our 5-day Maasai Mara safari in Ubuntu's Land Cruiser was phenomenal! Our guide spotted the Big Five within 48 hours. Five stars!",
            date: "2026-01-20"
          }
        ],
        metaTitle: "Kenya Safari Transport & 4x4 Land Cruiser Hire | Ubuntu Logistics",
        metaDescription: "Book custom 4x4 Safari Land Cruisers and tour vans with expert KPSGA driver-guides for game drives in Maasai Mara, Amboseli, and Lake Nakuru.",
        published: true,
        order: 2,
      },
      {
        collectionId: servicesCollectionId,
        title: "24/7 Airport Transfers (JKIA & Wilson Airport)",
        slug: "airport-transfers-jkia-wilson",
        description: "Punctual, stress-free private airport pick-ups and drop-offs at Jomo Kenyatta International Airport (JKIA) and Wilson Airport with live flight tracking and meet-and-greet services.",
        content: `### Effortless Airport Transfers in Nairobi

Never worry about Nairobi traffic or flight delays. Ubuntu Logistics provides round-the-clock airport transfers between Jomo Kenyatta International Airport (JKIA), Wilson Airport, and hotels or residences across Kenya.

#### Highlights of Our Airport Service:
- **Live Flight Monitoring:** We track your incoming flight in real time so your chauffeur is ready when you touch down, even with delays.
- **Personalized Meet & Greet:** Your driver awaits you at the arrival terminal holding a personalized greeting sign.
- **Luggage Assistance:** Professional handling of your bags with ample trunk capacity for oversized gear.
- **Direct Terminal-to-Terminal Transfers:** Fast, coordinated transit between JKIA international arrivals and Wilson Airport bush flight departures.`,
        imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
        icon: "plane",
        tags: ["Airport Transfer", "JKIA", "Wilson Airport", "Meet & Greet", "24/7"],
        gallery: [
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From $30 / KES 4,000 per transfer",
          duration: "Point-to-Point / On-Demand 24/7",
          features: [
            "Live Flight Radar Tracking",
            "Personalized Nameboard Meet & Greet",
            "Complimentary Bottled Mineral Water",
            "Free Luggage Handling Assistance",
            "Air-Conditioned Comfort"
          ],
          location: "JKIA, Wilson Airport & Greater Nairobi",
        },
        faq: [
          {
            question: "What happens if my international flight arrives late?",
            answer: "We monitor your flight status live. If your flight is delayed or arrives early, your pickup time is automatically synchronized at no extra waiting fee."
          }
        ],
        reviews: [
          {
            author: "Markus Bauer, Frankfurt",
            rating: 5,
            comment: "Flawless transfer from JKIA to my Westlands hotel after midnight. Driver Ben was waiting right outside customs with a warm smile.",
            date: "2026-03-01"
          }
        ],
        metaTitle: "JKIA & Wilson Airport Transfers Nairobi | Ubuntu Logistics",
        metaDescription: "Reliable 24/7 private airport transfers for Jomo Kenyatta International Airport (JKIA) and Wilson Airport with meet-and-greet service.",
        published: true,
        order: 3,
      },
      {
        collectionId: servicesCollectionId,
        title: "Executive Chauffeur & VIP Diplomatic Transport",
        slug: "executive-chauffeur-vip-diplomatic-transport",
        description: "Discreet, high-level chauffeur services for visiting executives, dignitaries, delegations, and VIP guests in luxury Mercedes-Benz, Prado TX, and Land Cruiser V8 vehicles.",
        content: `### Prestigious Chauffeur Services for VIPs & Executives

For corporate leaders, high-level delegations, and international guests requiring unmatched comfort, privacy, and security, Ubuntu Logistics offers premium executive chauffeur services.

#### Executive Chauffeur Highlights:
- **Luxury Fleet:** Modern Mercedes-Benz E-Class sedans, Toyota Land Cruiser Prado TX, and Land Cruiser V8 models.
- **Immaculate Uniformed Drivers:** Professional chauffeurs trained in diplomatic protocol, privacy confidentiality, and defensive driving.
- **In-Cabin Executive Amenities:** High-speed Wi-Fi hotspots, climate control, phone charging, and daily international newspapers upon request.
- **Diplomatic & Embassy Familiarity:** Vast experience coordinating movements with embassies, UN agencies, and state conference centers (KICC).`,
        imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
        icon: "user-check",
        tags: ["VIP", "Executive", "Chauffeur", "Mercedes-Benz", "Diplomatic"],
        gallery: [
          "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From $120 / KES 16,000 per day",
          duration: "Half-Day / Full-Day / Retainer",
          features: [
            "Uniformed Executive Chauffeur",
            "Tinted Privacy Glass",
            "Complimentary 4G/5G Wi-Fi Hotspot",
            "Defensive Driving Certified Chauffeur",
            "NDA & Discretion Guaranteed"
          ],
          location: "Nairobi & Diplomatic Circuits",
        },
        faq: [
          {
            question: "Can we hire vehicles with armed escort or security detail?",
            answer: "Yes, through our licensed security partners, we can coordinate official police chase cars or close protection officers for visiting dignitaries."
          }
        ],
        reviews: [
          {
            author: "Embassy Protocol Officer, Nairobi",
            rating: 5,
            comment: "Ubuntu Logistics handled our ministerial delegation flawlessly during the Africa Climate Summit. Uncompromising punctuality.",
            date: "2026-02-10"
          }
        ],
        metaTitle: "Executive Chauffeur & VIP Car Hire Nairobi | Ubuntu Logistics",
        metaDescription: "Luxury chauffeur-driven car hire in Nairobi: Mercedes-Benz, Land Cruiser Prado TX, and V8 for corporate events, diplomats, and VIP delegations.",
        published: true,
        order: 4,
      },
      {
        collectionId: servicesCollectionId,
        title: "Conference, Event & Team Building Fleet Logistics",
        slug: "conference-event-team-building-logistics",
        description: "Comprehensive group transport logistics for corporate summits, AGM conventions, high-profile weddings, and out-of-town team building retreats across Kenya.",
        content: `### End-to-End Fleet Logistics for Large Groups

Managing transportation for dozens or hundreds of attendees requires precision, communication, and logistical mastery. Ubuntu Logistics delivers turnkey transport coordination for events of any scale.

#### Event Logistics Capabilities:
- **Dedicated On-Site Fleet Marshals:** Experienced coordinators on the ground to direct delegates, manage passenger manifests, and dispatch shuttles.
- **Versatile Vehicle Mix:** Seamless synchronization of 14-seater vans, 33-seater minibuses, and 51-seater executive coaches.
- **Top Team Building Destinations:** Daily and weekend shuttles to Naivasha, Nakuru, Machakos, Mt. Kenya, and coastal beach resorts.
- **Custom Branding & Signage:** Shuttle window identification and customized delegate welcome signage available.`,
        imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
        icon: "users",
        tags: ["Conferences", "Team Building", "Events", "Shuttles", "Group Transport"],
        gallery: [
          "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "Custom Event Package Proposals",
          duration: "Single Day to Multi-Day Summits",
          features: [
            "On-site Fleet Operations Marshal",
            "Multi-Vehicle Coordinated Dispatches",
            "Passenger Manifest Tracking",
            "Direct Resort & Hotel Drop-Offs",
            "Contingency Standby Vehicles"
          ],
          location: "Naivasha, Nakuru, Nairobi, Mombasa, Kisumu",
        },
        faq: [
          {
            question: "How many passengers can Ubuntu Logistics move simultaneously?",
            answer: "With our extensive fleet of executive coaches, minibuses, and vans, we have successfully managed conferences transporting over 1,000 delegates simultaneously."
          }
        ],
        reviews: [
          {
            author: "HR Manager, Commercial Bank of Africa",
            rating: 5,
            comment: "Ubuntu transported 350 staff members to Naivasha for our annual retreat. Everything ran on time without a single hitch.",
            date: "2026-01-12"
          }
        ],
        metaTitle: "Conference & Team Building Transport Kenya | Ubuntu Logistics",
        metaDescription: "Professional group passenger logistics for corporate summits, team building trips, and conventions in Naivasha, Nairobi, and coastal resorts.",
        published: true,
        order: 5,
      },
      {
        collectionId: servicesCollectionId,
        title: "Long-Term Corporate Fleet Leasing & Fleet Management",
        slug: "long-term-corporate-fleet-leasing",
        description: "Eliminate vehicle ownership, insurance, and maintenance headaches with flexible long-term vehicle leasing and turnkey fleet management for companies and NGOs.",
        content: `### Strategic Fleet Outsourcing for Forward-Thinking Enterprises

Free up working capital and reduce administrative overheads. Ubuntu Logistics provides custom-structured long-term operational leases for saloons, 4x4 SUVs, pickup trucks, and commercial vans.

#### Benefits of Ubuntu Fleet Leasing:
- **Zero Capital Expenditure:** Avoid tying up capital in depreciating automotive assets.
- **Predictable Fixed Monthly Cost:** Includes comprehensive insurance, routine servicing, tire replacement, and licensing.
- **Immediate Standby Replacement:** Never suffer project delays—we provide instant replacement vehicles during routine maintenance.
- **Telematics & Fuel Management:** Advanced tracking reports on vehicle utilization, driver behavior, and fuel efficiency.`,
        imageUrl: "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80",
        icon: "truck",
        tags: ["Fleet Leasing", "Corporate Outsourcing", "NGO Vehicles", "Long-Term", "Fleet Management"],
        gallery: [
          "https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "Custom Monthly Retainer Contracts",
          duration: "6 Months to 36 Months",
          features: [
            "Comprehensive Commercial Insurance Included",
            "Routine Servicing & Mechanical Maintenance",
            "Instant Free Replacement Cars on Service Days",
            "NTSA Inspections & Compliance Managed",
            "Optional Professional Chauffeur Staffing"
          ],
          location: "Kenya Countrywide",
        },
        faq: [
          {
            question: "Are drivers included with long-term leases?",
            answer: "We offer both self-drive leases for certified staff drivers and fully chauffeured corporate lease agreements with vetted, professional drivers."
          }
        ],
        reviews: [
          {
            author: "Country Director, International Health NGO",
            rating: 5,
            comment: "Outsourcing our field project vehicles to Ubuntu Logistics cut our transport overheads by 28% and eliminated maintenance downtime.",
            date: "2025-11-18"
          }
        ],
        metaTitle: "Corporate Fleet Leasing & Outsourcing Kenya | Ubuntu Logistics",
        metaDescription: "Cost-effective long-term vehicle leasing and full fleet management for corporations, NGOs, and government projects in Kenya.",
        published: true,
        order: 6,
      },
      {
        collectionId: servicesCollectionId,
        title: "Specialized Accessible Handicap Transport",
        slug: "specialized-accessible-handicap-transport",
        description: "Dignified, certified accessible mobility solutions featuring customized transport vans with hydraulic wheelchair lifts, safety lock harnesses, and trained support drivers.",
        content: `### Compassionate & Accessible Mobility for Everyone

At Ubuntu Logistics, we believe travel should be accessible to all. We provide specialized wheelchair-accessible transport vans equipped with hydraulic lifts and safety harness systems to ensure smooth, dignified travel.

#### Features of Accessible Transport:
- **Electro-Hydraulic Lifts & Low-Angle Ramps:** Smooth, effortless boarding without lifting or transferring from wheelchairs.
- **Q'Straint 4-Point Floor Anchoring:** Industry-leading wheelchair lock systems guaranteeing total stability during journeys.
- **Spacious High-Ceiling Cabins:** Comfortable headroom with companion seating immediately adjacent to the wheelchair space.
- **Trained & Compassionate Staff:** Drivers trained in assisted mobility, patient care, and emergency protocols.`,
        imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
        icon: "heart",
        tags: ["Accessible", "Wheelchair Van", "Special Needs", "Medical Transfers", "Disability Friendly"],
        gallery: [
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From KES 5,500 per trip / Custom Day Hire",
          duration: "Point-to-Point / Full Day Hire",
          features: [
            "Hydraulic Powered Wheelchair Lift",
            "4-Point Heavy-Duty Floor Tie-Downs",
            "High-Roof Easy Entry Access",
            "Companion Seating Adjacent",
            "Medically Aware & Patient Chauffeurs"
          ],
          location: "Nairobi & Major County Hospitals / Safaris",
        },
        faq: [
          {
            question: "Can the accessible van be booked for safari travel?",
            answer: "Yes, our accessible vans are modified to handle designated safari roads in national parks like Nairobi National Park and Lake Nakuru, allowing wheelchair users to enjoy game viewing comfortably."
          }
        ],
        reviews: [
          {
            author: "Grace Wanjiku, Nairobi",
            rating: 5,
            comment: "Transporting my elderly mother for her routine hospital visits used to be stressful until we found Ubuntu's wheelchair van. The driver is so gentle and patient.",
            date: "2026-02-28"
          }
        ],
        metaTitle: "Wheelchair Accessible Van Hire Nairobi | Ubuntu Logistics",
        metaDescription: "Hydraulic lift wheelchair accessible van hire in Nairobi, Kenya. Safe, dignified transport for disabled individuals, seniors, and medical checkups.",
        published: true,
        order: 7,
      },
      {
        collectionId: servicesCollectionId,
        title: "Inter-County & Cross-Border Group Transfers",
        slug: "inter-county-cross-border-transfers",
        description: "Reliable, comfortable long-distance shuttles connecting Nairobi with Mombasa, Kisumu, Eldoret, and East African cross-border destinations in Uganda and Tanzania.",
        content: `### Seamless Travel Across Kenya and East Africa

Whether traveling for business, family events, or cross-border trade, Ubuntu Logistics delivers comfortable, scheduled, and on-demand inter-county road transport.

#### Inter-County & Regional Highlights:
- **Full Coverage of 47 Counties:** Direct routes connecting Nairobi to Mombasa, Nakuru, Eldoret, Kisumu, Nyeri, and Meru.
- **Cross-Border Authorization:** Certified COMESA Yellow Card insurance and cross-border transport permits for Uganda (Kampala/Jinja) and Tanzania (Arusha/Moshi).
- **Dual Chauffeur Rotation:** Two professional drivers assigned on all journeys exceeding 6 hours for maximum highway safety.
- **Air-Conditioned Comfort:** Reclining seats, panoramic windows, and planned sanitary rest stops.`,
        imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
        icon: "map-pin",
        tags: ["Inter-County", "Cross-Border", "Mombasa", "Kisumu", "East Africa"],
        gallery: [
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From KES 15,000 per route / Custom Package",
          duration: "Inter-County Journeys",
          features: [
            "COMESA Yellow Card Cross-Border Permits",
            "Dual Driver Rotation for Long Hauls",
            "Spacious Luggage Compartments",
            "GPS Speed Monitoring (80 km/h max)",
            "NTSA Highway Compliance Certified"
          ],
          location: "Kenya, Uganda, Tanzania",
        },
        faq: [
          {
            question: "Do you arrange border customs clearance for group travel?",
            answer: "Yes, our cross-border logistics team prepares all vehicle documentation and assists group passengers with expedited border protocol at Namanga, Busia, or Malaba."
          }
        ],
        reviews: [
          {
            author: "Pastor Patrick Mwangi, Nairobi",
            rating: 5,
            comment: "Our church mission trip to Arusha, Tanzania was effortless. Ubuntu Logistics handled the cross-border documentation and the bus was super comfortable.",
            date: "2026-01-29"
          }
        ],
        metaTitle: "Inter-County & Cross-Border Bus Hire Kenya | Ubuntu Logistics",
        metaDescription: "Charter comfortable minibuses and coaches for inter-county journeys in Kenya and cross-border group trips to Uganda and Tanzania.",
        published: true,
        order: 8,
      },
    ];

    for (const item of servicesData) {
      await ctx.db.insert("collectionItems", {
        ...item,
        publishedAt: Date.now(),
      });
    }

    // 4. SEED FLEET ITEMS
    const fleetData = [
      {
        collectionId: fleetCollectionId,
        title: "Custom 4x4 Safari Land Cruiser (Pop-Up Roof)",
        slug: "custom-4x4-safari-land-cruiser",
        description: "The undisputed king of African safari transport. Heavy-duty 4WD chassis, full pop-up game-viewing roof, inverter power sockets, and onboard electric cool box.",
        content: `### The Ultimate Safari Vehicle for East African Terrain

Specially engineered for Kenya's most demanding safari trails in the Maasai Mara, Samburu, and Serengeti, our custom-built 4x4 Toyota Land Cruisers offer unmatched reliability, comfort, and photographic versatility.

#### Vehicle Specifications:
- **Chassis & Engine:** Heavy-duty Toyota Land Cruiser 70-Series with high-torque 1HZ diesel engine and snorkel air intake.
- **Pop-Up Roof Hatch:** Extra-wide canvas/steel pop-up roof allowing up to 7 passengers to stand simultaneously for unobstructed 360-degree photography.
- **Seating Configuration:** 7 to 8 individual high-comfort bucket seats with 3-point seatbelts, all positioned with dedicated opening windows.
- **Onboard Technology:** 220V/12V electrical inverter with multi-socket plugs for charging camera batteries and laptops on the move.
- **Cooler & Refreshments:** Integrated onboard electric mini-fridge keeping drinking water and sodas refreshingly chilled under the equatorial sun.
- **Emergency Preparedness:** Dual spare tires, heavy-duty hydraulic jack, sand ladders, tow ropes, comprehensive first aid kit, and long-range VHF two-way radio.`,
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
        icon: "truck",
        tags: ["4x4 Land Cruiser", "Safari Vehicle", "Pop-Up Roof", "Off-Road", "Big Five"],
        gallery: [
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "carousel" as const,
        metadata: {
          price: "From $180 / KES 24,000 per day",
          duration: "Daily / Safari Circuits",
          features: [
            "Seats 7-8 Passengers with Window Seats",
            "Pop-Up Photographic Roof Hatch",
            "Onboard 220V Power Inverter for Cameras",
            "Built-in Electric Drink Refrigerator",
            "Heavy-Duty Suspension & Dual Spare Tires",
            "VHF High-Frequency Radio Communication"
          ],
          sku: "FLEET-LC4X4",
          stock: 12,
        },
        faq: [
          {
            question: "How many passengers comfortably fit in this Safari Land Cruiser?",
            answer: "The vehicle comfortably seats 7 passengers in the rear cabin, each guaranteed a private window seat, plus 1 co-passenger seat beside the driver."
          },
          {
            question: "Is this vehicle suitable for rainy season safaris?",
            answer: "Yes, with full 4WD capability, diff-locks, all-terrain tires, and high ground clearance, our Land Cruiser easily traverses deep mud and riverbed crossings."
          }
        ],
        reviews: [
          {
            author: "Brian & Chloe O'Connor, Australia",
            rating: 5,
            comment: "Hands down the best safari vehicle we have ever traveled in. The pop-up roof gave us incredible photos of Mara lions, and charging camera batteries on board was a lifesaver.",
            date: "2026-02-12"
          }
        ],
        metaTitle: "4x4 Safari Land Cruiser Hire Kenya | Ubuntu Logistics & Transport",
        metaDescription: "Rent custom 4x4 Safari Land Cruisers with pop-up roofs, onboard fridge, and power inverter in Nairobi for Maasai Mara and Amboseli safaris.",
        published: true,
        order: 1,
      },
      {
        collectionId: fleetCollectionId,
        title: "4WD Safari HiAce Tour Van (Pop-Up Roof)",
        slug: "4wd-safari-hiace-tour-van",
        description: "The ideal balance of affordability and comfort. Features a pop-up photographic roof, full 4WD system, reclining seats, and high ground clearance for park tours.",
        content: `### Kenya's Favorite Budget-Friendly Safari Workhorse

Our customized Toyota HiAce Safari Vans offer incredible value for budget-conscious safari lovers, student groups, and family vacations without compromising on the safari experience.

#### Vehicle Highlights:
- **Full 4WD Transmission:** Enhanced all-wheel traction for navigating loose gravel and sandy reserve tracks.
- **Pop-Up Roof Structure:** Smooth manual pop-up mechanism providing panoramic game viewing and breeze circulation.
- **Comfortable Interior:** 7 to 8 individual reclining cloth seats with wide sliding glass windows.
- **Modern Amenities:** USB charging sockets at passenger rows, audio sound system, and spacious rear luggage compartment.`,
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        icon: "truck",
        tags: ["Safari Van", "Toyota HiAce", "Budget Safari", "Pop-Up Roof", "4WD"],
        gallery: [
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From $130 / KES 17,500 per day",
          duration: "Daily / Multi-Day Hire",
          features: [
            "Seats 7-8 Passengers with Window View",
            "Pop-Up Game Viewing Roof Hatch",
            "4WD Drive Capability",
            "USB Phone Charging Sockets",
            "High Ground Clearance Suspension"
          ],
          sku: "FLEET-HIACE-4WD",
          stock: 15,
        },
        faq: [
          {
            question: "How does the tour van compare to the Land Cruiser?",
            answer: "The HiAce Safari Van is more economical while still featuring a pop-up roof for wildlife viewing. The Land Cruiser provides higher ground clearance and rugged capability in extreme muddy terrains."
          }
        ],
        reviews: [
          {
            author: "Amina El-Sayed, Egypt",
            rating: 5,
            comment: "Excellent value for money! Our tour van was clean, spacious, and handled Lake Nakuru and Naivasha with ease.",
            date: "2026-01-18"
          }
        ],
        metaTitle: "Toyota Safari Tour Van Hire Nairobi | Ubuntu Logistics",
        metaDescription: "Rent affordable 4WD Toyota HiAce safari vans with pop-up roofs for budget Kenya safaris and wildlife excursions.",
        published: true,
        order: 2,
      },
      {
        collectionId: fleetCollectionId,
        title: "Executive VIP Saloon (Mercedes-Benz E-Class)",
        slug: "executive-vip-saloon-mercedes-benz",
        description: "The gold standard of corporate luxury, prestige, and whispering-quiet ride quality for visiting CEOs, dignitaries, diplomatic summits, and luxury weddings.",
        content: `### Executive Refinement for Discerning Executives

Experience first-class road travel across Nairobi. Our Mercedes-Benz E-Class sedans combine German engineering excellence with executive chauffeur service.

#### VIP Features:
- **Plush Leather Interior:** Ergonomically designed leather seats with multi-way electric adjustments and lumbar support.
- **Acoustic Glass Isolation:** Whisper-quiet cabin shielded from exterior city traffic noise.
- **Dual-Zone Automatic Climate Control:** Personalized cabin temperature management.
- **Executive Protocol Chauffeurs:** Suited, courteous, bilingual chauffeurs knowledgeable in corporate etiquette and defensive driving.`,
        imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
        icon: "shield",
        tags: ["Mercedes-Benz", "VIP Saloon", "Executive", "Chauffeur", "Luxury Car"],
        gallery: [
          "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From KES 18,000 / $140 per day",
          duration: "Hourly / Daily / Retainer",
          features: [
            "Seats 3-4 Passengers in Supreme Luxury",
            "Handcrafted Leather Upholstery",
            "Multi-Zone Climate Control",
            "Uniformed Suited Chauffeur",
            "Complimentary Wi-Fi & Bottled Water"
          ],
          sku: "FLEET-BENZ-E",
          stock: 6,
        },
        faq: [
          {
            question: "Is fuel included in the daily chauffeur rate?",
            answer: "We offer both dry rate (fuel paid by client) and wet rate (all-inclusive fuel within Nairobi metro) pricing to suit corporate expense policies."
          }
        ],
        reviews: [
          {
            author: "Chief Financial Officer, FinTech Corp",
            rating: 5,
            comment: "Rented Ubuntu's Mercedes E-Class for our board members visiting Nairobi. Superb cleanliness, flawless driving, and complete professionalism.",
            date: "2026-03-05"
          }
        ],
        metaTitle: "Mercedes-Benz E-Class Hire Nairobi | Ubuntu Logistics",
        metaDescription: "Hire luxury Mercedes-Benz E-Class with professional chauffeur in Nairobi for VIP airport transfers, corporate summits, and executive travel.",
        published: true,
        order: 3,
      },
      {
        collectionId: fleetCollectionId,
        title: "Executive 4x4 SUV (Toyota Land Cruiser Prado TX / V8)",
        slug: "executive-4x4-suv-prado-v8",
        description: "Commanding road presence, leather comfort, and high ground clearance suitable for corporate executive travel, NGO field assessments, and diplomatic motorcades.",
        content: `### High-Level Comfort Meets Rugged Versatility

The Toyota Prado TX and Land Cruiser V8 are Kenya's favorite executive 4x4s, perfectly suited for transitioning from upscale city boardrooms to unpaved upcountry project sites.

#### SUV Features:
- **Robust 4WD Capability:** Advanced traction control and high ground clearance for all weather and road conditions.
- **Elevated Cabin Seating:** Commanding elevated road visibility with tinted privacy windows.
- **Capacity:** Comfortably accommodates 4 to 6 passengers with flexible folding rear seats for extra luggage.
- **Executive Trim:** High-grade leather seating, premium sound system, multi-port USB chargers, and cool box.`,
        imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80",
        icon: "shield",
        tags: ["Prado TX", "Land Cruiser V8", "SUV", "Executive 4x4", "NGO Car Hire"],
        gallery: [
          "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From KES 15,000 / $120 per day",
          duration: "Daily / Weekly / Monthly Lease",
          features: [
            "Seats 4-6 Passengers with Luggage",
            "Full-Time 4-Wheel Drive",
            "High Ground Clearance for All Roads",
            "Tinted Privacy Windows",
            "Dual Air Conditioning System"
          ],
          sku: "FLEET-PRADO-TX",
          stock: 10,
        },
        faq: [
          {
            question: "Can this vehicle be hired for travel outside Nairobi?",
            answer: "Yes, our Prado SUVs are fully licensed and equipped for long-distance travel to any of Kenya's 47 counties."
          }
        ],
        reviews: [
          {
            author: "Senior Program Manager, UN Habitat",
            rating: 5,
            comment: "The Prado TX was perfect for our multi-county field mission in Rift Valley. Comfortable on the highway and capable on dirt roads.",
            date: "2026-02-22"
          }
        ],
        metaTitle: "Toyota Prado TX & V8 Hire Nairobi | Ubuntu Logistics",
        metaDescription: "Rent Toyota Prado TX and Land Cruiser V8 4x4 SUVs in Nairobi for executive corporate transit, diplomatic trips, and upcountry tours.",
        published: true,
        order: 4,
      },
      {
        collectionId: fleetCollectionId,
        title: "Executive 7-Seater Passenger Van (Toyota Noah / Voxy / Alphard)",
        slug: "executive-7-seater-van-noah-voxy-alphard",
        description: "Versatile, stylish, and comfortable 7-seater passenger MPV equipped with dual sliding doors, captain seats, and dual air conditioning for small group transfers.",
        content: `### Smooth, Efficient City & Airport Transit

Ideal for corporate delegations, family airport transfers, and private small group charters, our modern Toyota Noah, Voxy, and luxury Alphard vans offer exceptional ride comfort and space.

#### Vehicle Highlights:
- **Seating:** 7 comfortable seats including middle-row captain chairs that recline and slide.
- **Convenient Entry:** Dual electric power sliding doors for effortless passenger boarding.
- **Climate Control:** Independent front and rear dual-zone air conditioning vents.
- **Trunk Space:** Flexible fold-up rear row providing massive cargo space for airport luggage and golf bags.`,
        imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
        icon: "package",
        tags: ["Toyota Noah", "Toyota Voxy", "7 Seater", "Airport Van", "MPV"],
        gallery: [
          "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From KES 9,000 / $70 per day",
          duration: "Daily Hire / City Shuttles",
          features: [
            "Seats 7 Passengers Comfortably",
            "Dual Power Sliding Doors",
            "Reclining Middle Captain Seats",
            "Rear Air Conditioning Vents",
            "Spacious Luggage Boot"
          ],
          sku: "FLEET-NOAH-7",
          stock: 14,
        },
        faq: [
          {
            question: "How many suitcases can fit with 6 passengers on board?",
            answer: "With 6 passengers, it easily accommodates 4 large suitcases plus carry-on bags. With 4 passengers, the rear seats fold up to fit up to 8 full-sized suitcases."
          }
        ],
        reviews: [
          {
            author: "Dr. Evans Kiprop, Eldoret",
            rating: 5,
            comment: "Booked a Noah for our family holiday transfer from JKIA to Naivasha. Smooth ride, very clean, and driver was great with kids.",
            date: "2026-01-05"
          }
        ],
        metaTitle: "Toyota Noah & Voxy 7-Seater Van Hire Nairobi | Ubuntu Logistics",
        metaDescription: "Hire 7-seater Toyota Noah, Voxy, and Alphard passenger vans in Nairobi for family travel, corporate transfers, and airport pickups.",
        published: true,
        order: 5,
      },
      {
        collectionId: fleetCollectionId,
        title: "10–14 Seater Corporate Commuter Van (Toyota HiAce Shark)",
        slug: "10-14-seater-corporate-commuter-van",
        description: "The trusted backbone of corporate staff shuttles and airport crew transfers. Equipped with high-back fabric seats, 3-point seatbelts, speed governors, and GPS tracking.",
        content: `### Efficient Staff Transport & Group Transit

Built to withstand continuous commercial duty, our high-roof Toyota HiAce commuter vans are the premier choice for corporate employee shuttles, crew logistics, and airport transfers.

#### Safety & Compliance:
- **NTSA Speed Governors:** Regulated at 80 km/h in full compliance with Kenyan highway safety regulations.
- **Seatbelts on Every Seat:** Individual certified seatbelts for all passengers.
- **High-Roof Cabin:** Tall passenger cabin allowing adults to walk comfortably down the aisle without crouching.
- **Telematics & GPS:** Continuous 24/7 telemetry tracking speed, location, and driver performance.`,
        imageUrl: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1200&q=80",
        icon: "truck",
        tags: ["HiAce Shark", "14 Seater Van", "Staff Shuttle", "Corporate Shuttles", "NTSA Certified"],
        gallery: [
          "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From KES 12,000 / $90 per day / Route Contracts",
          duration: "Daily Shifts / Monthly Contracts",
          features: [
            "Seats 10-14 Passengers with Headrests",
            "Certified 80 km/h Speed Governor",
            "Real-Time Live GPS Telematics",
            "High-Roof Walk-Through Interior",
            "Dual Overhead Air Conditioning Blowers"
          ],
          sku: "FLEET-HIACE-14",
          stock: 20,
        },
        faq: [
          {
            question: "Can we hire these vans for multi-stop corporate employee routes?",
            answer: "Yes, our logistics software builds optimized multi-stop pickup manifests tailored to your employees' home addresses across Nairobi."
          }
        ],
        reviews: [
          {
            author: "Logistics Lead, Fintech Africa",
            rating: 5,
            comment: "We run 4 Ubuntu HiAce shuttles daily for our developers. Exceptional reliability and transparent billing.",
            date: "2026-02-18"
          }
        ],
        metaTitle: "14-Seater HiAce Van Hire Nairobi | Ubuntu Logistics",
        metaDescription: "Rent 10 to 14 seater Toyota HiAce commuter vans with driver in Nairobi for corporate staff transport, events, and group travel.",
        published: true,
        order: 6,
      },
      {
        collectionId: fleetCollectionId,
        title: "25–33 Seater Luxury Minibus (Toyota Coaster / Mitsubishi Rosa)",
        slug: "25-33-seater-luxury-minibus-coaster-rosa",
        description: "Premium mid-size touring minibus featuring ergonomic reclining fabric seats, full air conditioning, public address (PA) microphone, and generous luggage storage.",
        content: `### The Gold Standard for Team Building & Conference Transport

For medium-sized delegations, company team buildings, educational study tours, and wedding parties, our Toyota Coaster and Mitsubishi Rosa minibuses deliver unmatched comfort and group camaraderie.

#### Minibus Features:
- **Comfortable Seating:** 28 to 33 high-back reclining velvet fabric seats with armrests and cup holders.
- **Full Central Air Conditioning:** Powerful roof-mounted climate system keeping the entire bus refreshingly cool.
- **Audio & PA Microphone:** Built-in public address system ideal for tour guides, facilitators, and team building announcements.
- **Panoramic Tinted Windows:** Expansive UV-tinted windows offering scenic views of Kenya's countryside.
- **Ample Storage:** Rear luggage trunk and overhead passenger parcel racks for backpacks and laptops.`,
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        icon: "truck",
        tags: ["Toyota Coaster", "Mitsubishi Rosa", "33 Seater Bus", "Minibus Hire", "Team Building"],
        gallery: [
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From KES 22,000 / $170 per day",
          duration: "Day Hire / Multi-Day Events",
          features: [
            "Seats 28-33 Passengers in Reclining Seats",
            "Central Powerful Air Conditioning",
            "Built-in PA Sound System & Microphone",
            "Panoramic Tinted Windows",
            "Under-Chassis & Rear Luggage Compartment"
          ],
          sku: "FLEET-COASTER-33",
          stock: 8,
        },
        faq: [
          {
            question: "Is this bus suitable for travel upcountry to Naivasha or Nyeri?",
            answer: "Yes, our Toyota Coasters and Rosa buses are engineered for highway cruising and easily handle routes to Naivasha, Nakuru, Mount Kenya, and coastal highways."
          }
        ],
        reviews: [
          {
            author: "HR Manager, Regional FMCG Manufacturer",
            rating: 5,
            comment: "The Toyota Coaster was immaculate for our management retreat to Mount Kenya Safari Club. Reclining seats, great AC, and a superb driver.",
            date: "2026-03-02"
          }
        ],
        metaTitle: "Toyota Coaster & Rosa Bus Hire Nairobi (25-33 Seater) | Ubuntu Logistics",
        metaDescription: "Hire 28-33 seater luxury Toyota Coaster and Mitsubishi Rosa minibuses in Nairobi for corporate team building, weddings, and tours.",
        published: true,
        order: 7,
      },
      {
        collectionId: fleetCollectionId,
        title: "45–51 Seater Luxury Long-Distance Touring Coach",
        slug: "45-51-seater-luxury-touring-coach",
        description: "High-capacity luxury continental touring coach equipped with modern air suspension, overhead AC vents, charging sockets, and expansive underfloor cargo bays.",
        content: `### High-Capacity Luxury Coach Transport Across East Africa

When transporting large corporate teams, national sporting delegations, church conventions, or university academic trips, our 51-seater luxury coaches provide supreme highway stability and comfort.

#### Coach Highlights:
- **Capacity:** 45 to 51 comfortable high-back reclining coach seats with footrests.
- **Air-Ride Suspension:** Smooth air-cushioned chassis absorbing highway bumps and vibrations.
- **Expansive Luggage Bays:** Huge underbelly cargo compartments capable of carrying dozens of heavy suitcases and event equipment.
- **Onboard Entertainment:** Dual digital TV monitors, DVD/USB entertainment system, and PA microphone.
- **Highway Safety:** Dual seasoned long-distance drivers for trips exceeding 6 hours, speed-governed and GPS-monitored.`,
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        icon: "truck",
        tags: ["51 Seater Coach", "Luxury Bus", "Large Groups", "Conference Coach", "Long Distance"],
        gallery: [
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From KES 38,000 / $290 per day",
          duration: "Day Hire / Multi-Day Tours",
          features: [
            "Seats 45-51 Passengers with Reclining Seats",
            "Huge Underfloor Luggage Holds",
            "Individual Reading Lights & AC Vents",
            "Onboard Digital Video & Sound Entertainment",
            "Dual Professional Highway Captains"
          ],
          sku: "FLEET-COACH-51",
          stock: 5,
        },
        faq: [
          {
            question: "Can we hire the 51-seater bus for a round trip to Mombasa?",
            answer: "Yes, we regularly service the Nairobi-Mombasa highway corridor for corporate retreats, student groups, and family associations."
          }
        ],
        reviews: [
          {
            author: "Dean of Students, University of Nairobi",
            rating: 5,
            comment: "We chartered two 51-seater coaches for a symposium in Kisumu. The buses were clean, air-conditioned, and arrived ahead of schedule.",
            date: "2026-02-14"
          }
        ],
        metaTitle: "51-Seater Luxury Bus & Coach Hire Kenya | Ubuntu Logistics",
        metaDescription: "Charter luxury 45 to 51-seater touring coaches in Nairobi for large corporate conferences, sports teams, and nationwide group travel.",
        published: true,
        order: 8,
      },
      {
        collectionId: fleetCollectionId,
        title: "Specialized Wheelchair-Accessible Handicap Van",
        slug: "specialized-wheelchair-accessible-handicap-van",
        description: "Adapted transport van fitted with an automated electro-hydraulic wheelchair lift, Q'Straint floor anchors, and accommodating seating for accompanying family or nurses.",
        content: `### Empowering Mobility with Safety & Dignity

Our handicap-accessible vans are custom modified to provide effortless travel for individuals using manual or electric wheelchairs.

#### Accessibility Engineering:
- **Commercial Electro-Hydraulic Lift:** Heavy-duty motorized lift that lowers flush to the pavement and lifts smoothly into the vehicle cabin.
- **Q'Straint 4-Point Crash-Tested Tie-Downs:** Certified floor anchoring system securing the wheelchair firmly in place.
- **Accompanied Travel:** Up to 2 wheelchair positions alongside 4 companion seats so families and caregivers travel together.
- **Safety Equipment:** First aid supplies, fire extinguisher, non-slip flooring, and interior LED illumination.`,
        imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
        icon: "heart",
        tags: ["Wheelchair Van", "Hydraulic Lift", "Accessible Transport", "Special Needs", "Handicap Transit"],
        gallery: [
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "From KES 14,000 / $110 per day",
          duration: "Daily / Medical / Tours",
          features: [
            "Motorized Electro-Hydraulic Wheelchair Lift",
            "4-Point Q'Straint Crash-Tested Floor Restraints",
            "Fits 2 Wheelchairs + 4 Companion Seats",
            "Non-Slip Easy-Clean Flooring",
            "Trained Patient-Care Chauffeur"
          ],
          sku: "FLEET-ACCESSIBLE-VAN",
          stock: 4,
        },
        faq: [
          {
            question: "Does the lift support heavy motorized power wheelchairs?",
            answer: "Yes, our commercial hydraulic lifts support up to 350 kg (770 lbs), effortlessly lifting heavy electric power chairs and their occupants."
          }
        ],
        reviews: [
          {
            author: "Karanja Kimani, Karen",
            rating: 5,
            comment: "Took my paraplegic brother to our sister's wedding in Naivasha. The hydraulic lift worked like a dream. Thank you Ubuntu Logistics!",
            date: "2026-01-25"
          }
        ],
        metaTitle: "Accessible Wheelchair Van Hire with Lift Kenya | Ubuntu Logistics",
        metaDescription: "Rent specialized wheelchair accessible vans with hydraulic lifts and safety floor locks in Nairobi for medical, family, and leisure trips.",
        published: true,
        order: 9,
      },
    ];

    for (const item of fleetData) {
      await ctx.db.insert("collectionItems", {
        ...item,
        publishedAt: Date.now(),
      });
    }

    // 5. SEED DESTINATIONS ITEMS (Drawing from KWS & Top Kenya Tour Guidelines)
    const destinationsData = [
      {
        collectionId: destinationsCollectionId,
        title: "Maasai Mara National Reserve",
        slug: "maasai-mara-national-reserve",
        description: "The world's undisputed wildlife amphitheater. Famous for the legendary Great Wildebeest Migration, world-renowned big cat populations, and boundless savannah horizons.",
        content: `### The Jewel of African Wildlife Safaris

Located in southwestern Kenya along the border with Tanzania's Serengeti, the Maasai Mara National Reserve is globally revered as one of Africa's greatest wildlife reserves. Spanning over 1,510 square kilometers of golden rolling savannahs, acacia woodlands, and winding rivers, the Mara offers an unparalleled density of apex predators and grazing herbivores.

#### The Great Wildebeest Migration:
Between July and October each year, over two million wildebeest, zebras, and gazelles thunder across the crocodile-infested waters of the Mara River in search of lush green pastures. This natural spectacle is celebrated as the "Eighth Wonder of the World."

#### Key Wildlife Highlights:
- **The Big Five:** Healthy populations of lions, leopards, African elephants, Cape buffaloes, and endangered black rhinos.
- **Apex Predators:** Exceptional concentrations of cheetah coalitions, spotted hyenas, and Nile crocodiles.
- **Over 470 Bird Species:** Including martial eagles, secretary birds, lilac-breasted rollers, and ostriches.

#### Ubuntu Transport Logistics:
- **Distance from Nairobi:** Approximately 260 km (5 to 6 hours via Narok).
- **Recommended Fleet:** 4x4 Safari Land Cruiser with pop-up roof and heavy-duty suspension.
- **Flight Connections:** Airstrip drop-offs and game-drive pickups from Keekorok, Ol Kiombo, Musiara, and Mara Serena airstrips.`,
        imageUrl: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80",
        icon: "trees",
        tags: ["Maasai Mara", "Great Migration", "Big Five", "Top Safari", "UNESCO Biosphere"],
        gallery: [
          "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "carousel" as const,
        metadata: {
          price: "3-Day Safari Transport from $540 / KES 72,000",
          duration: "3 to 5 Days Recommended",
          features: [
            "Great Wildebeest Migration (July - Oct)",
            "Guaranteed Big Cat Encounters",
            "Hot Air Balloon Safari Logistics",
            "Maasai Cultural Village Visits",
            "Custom 4x4 Land Cruiser with Pop-Up Roof"
          ],
          location: "Narok County, South-Western Kenya",
        },
        faq: [
          {
            question: "When is the best time to visit Maasai Mara for the migration?",
            answer: "The Great Migration river crossings typically occur between late July and October. However, the Mara offers year-round resident big game and predator sightings."
          },
          {
            question: "Are park entry fees included in Ubuntu's transport package?",
            answer: "Vehicle rates cover fuel, 4x4 vehicle hire, and professional driver-guide. Park entry fees (managed by Narok County Government) are billed separately or included in turnkey custom packages."
          }
        ],
        reviews: [
          {
            author: "Emma Watson & Family, London",
            rating: 5,
            comment: "Our 4-day Mara expedition with Ubuntu Logistics was magical! We saw a Mara river crossing and watched a cheetah hunt. The Land Cruiser was super comfortable.",
            date: "2026-02-05"
          }
        ],
        metaTitle: "Maasai Mara Safari Transport & Tour Packages | Ubuntu Logistics",
        metaDescription: "Experience the Great Migration and Big Five in Maasai Mara with Ubuntu Logistics' custom 4x4 Safari Land Cruisers and expert driver-guides.",
        published: true,
        order: 1,
      },
      {
        collectionId: destinationsCollectionId,
        title: "Amboseli National Park (KWS)",
        slug: "amboseli-national-park-kws",
        description: "The 'Land of Giants.' Revered for massive herds of free-ranging elephants set against the awe-inspiring, snow-capped backdrop of Mount Kilimanjaro.",
        content: `### Land of Giants & Kilimanjaro's Crown

Amboseli National Park, managed by the Kenya Wildlife Service (KWS), is one of Kenya’s most scenic and photogenic sanctuaries. Situated in Kajiado County near the Tanzanian border, Amboseli provides postcard-perfect panoramas of Africa's highest mountain, Mount Kilimanjaro (5,895m).

#### Highlights of Amboseli National Park:
- **Legendary Elephant Herds:** Home to over 1,600 elephants, including some of Africa's most famous and long-studied tuskers.
- **Observation Hill (Noomotio):** A conical volcanic hill offering 360-degree views across the park, swamps, and Kilimanjaro's glaciers.
- **Enkongo Narok Swamps:** Lush subterranean springs fed by Kilimanjaro's snowmelt, drawing hippos, waterbucks, and pelicans.
- **Over 400 Bird Species:** Including crowned cranes, kingfishers, African fish eagles, and marabou storks.

#### Ubuntu Transport Logistics:
- **Distance from Nairobi:** Approximately 240 km (3.5 to 4 hours via Emali/Namanga).
- **Road Conditions:** Smooth tarmac up to the main park gates (Kimana, Iremito, Meshanani).
- **Ideal Fleet:** 4x4 Safari Land Cruiser or Safari Tour Van with pop-up roof.`,
        imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
        icon: "camera",
        tags: ["Amboseli", "KWS Park", "Mt Kilimanjaro", "Elephants", "Observation Hill"],
        gallery: [
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "carousel" as const,
        metadata: {
          price: "2-3 Day Tour Transport from $380 / KES 50,000",
          duration: "2 to 3 Days Recommended",
          features: [
            "Breathtaking Views of Snow-Capped Mt. Kilimanjaro",
            "Guaranteed Encounters with Giant Elephant Herds",
            "Panoramic Vistas from Observation Hill",
            "Bird Watching in Enkongo Narok Wetlands",
            "Smooth 3.5-Hour Drive from Nairobi"
          ],
          location: "Kajiado County, Southern Kenya (KWS Managed)",
        },
        faq: [
          {
            question: "When is Mount Kilimanjaro most visible in Amboseli?",
            answer: "Early mornings (6:00 AM - 9:00 AM) and late afternoons right before sunset offer the clearest views before clouds gather around the mountain summit."
          }
        ],
        reviews: [
          {
            author: "Claire & Thomas Dubois, France",
            rating: 5,
            comment: "Photographing an elephant herd walking beneath Kilimanjaro was on my bucket list for 20 years. Ubuntu's driver made it happen! Unforgettable.",
            date: "2026-01-28"
          }
        ],
        metaTitle: "Amboseli National Park Safari Transport | Ubuntu Logistics Kenya",
        metaDescription: "Visit Amboseli National Park with Ubuntu Logistics. Marvel at giant elephant herds with the snow-capped Mount Kilimanjaro as your backdrop.",
        published: true,
        order: 2,
      },
      {
        collectionId: destinationsCollectionId,
        title: "Lake Nakuru National Park (KWS)",
        slug: "lake-nakuru-national-park-kws",
        description: "A UNESCO World Heritage Site in the Great Rift Valley. Premier sanctuary for endangered black and white rhinos, Rothschild’s giraffes, and vibrant pink flamingos.",
        content: `### Rhino Haven on the Great Rift Valley Floor

Located just 160 kilometers northwest of Nairobi, Lake Nakuru National Park is an internationally protected wetland managed by Kenya Wildlife Service. Encircling the shallow alkaline waters of Lake Nakuru, this park is celebrated worldwide for its dramatic rhino sanctuary and avian biodiversity.

#### Wildlife Highlights:
- **Sanctuary for Endangered Rhinos:** Over 100 endangered black and white rhinos thrive within its perimeter fence.
- **Rothschild's Giraffes:** Introduced sanctuary preserving this rare, tall giraffe sub-species.
- **Pink Flamingo Fringes:** Flocks of Greater and Lesser flamingos feeding on blue-green spirulina algae.
- **Baboon Cliff & Out of Africa Lookouts:** Breathtaking cliff vantage points overlooking the entire shimmering lake.
- **Makalia Falls:** A picturesque waterfall picnic site tucked inside lush acacia woodlands.

#### Ubuntu Transport Logistics:
- **Distance from Nairobi:** 160 km (2.5 hours on smooth dual-carriageway highway).
- **Perfect For:** Corporate day excursions, weekend family getaways, and educational school tours.`,
        imageUrl: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?auto=format&fit=crop&w=1200&q=80",
        icon: "trees",
        tags: ["Lake Nakuru", "KWS Park", "Rhino Sanctuary", "Flamingos", "UNESCO Heritage"],
        gallery: [
          "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "Full Day Excursion from $180 / KES 24,000",
          duration: "1 to 2 Days",
          features: [
            "Sanctuary for Black and White Rhinos",
            "Spectacular Baboon Cliff Viewpoint",
            "Flamingos & 450+ Bird Species",
            "Makalia Waterfalls & Picnic Spots",
            "Only 2.5 Hours from Nairobi"
          ],
          location: "Nakuru County, Great Rift Valley (KWS Managed)",
        },
        faq: [
          {
            question: "Is Lake Nakuru suitable for a one-day trip from Nairobi?",
            answer: "Yes! Leaving Nairobi at 6:30 AM gets you into the park by 9:00 AM for a morning game drive, picnic lunch at Baboon Cliff, afternoon game drive, and return to Nairobi by 6:00 PM."
          }
        ],
        reviews: [
          {
            author: "Dr. James Mutua, Nairobi",
            rating: 5,
            comment: "Took my department on a day tour to Lake Nakuru with Ubuntu Logistics. We saw 7 rhinos, giraffes, and lions sleeping in a tree. Remarkable day!",
            date: "2026-02-19"
          }
        ],
        metaTitle: "Lake Nakuru National Park Day Tour Transport | Ubuntu Logistics",
        metaDescription: "Book day tours and weekend safaris to Lake Nakuru National Park with Ubuntu Logistics. See endangered rhinos, Rothschild giraffes, and flamingos.",
        published: true,
        order: 3,
      },
      {
        collectionId: destinationsCollectionId,
        title: "Lake Naivasha & Hell's Gate National Park (KWS)",
        slug: "lake-naivasha-hells-gate-national-park-kws",
        description: "Kenya’s premier corporate team building and adventure retreat. Cycle alongside zebras in dramatic gorges, soak in Olkaria natural geothermal spa, and take boat safaris on the lake.",
        content: `### Adventure, Geothermal Spas & Team Building Excellence

Just 90 minutes from Nairobi down the scenic Great Rift Valley escarpment, Lake Naivasha and Hell's Gate National Park constitute Kenya's most popular destination for corporate team buildings, executive strategy retreats, and adventure safaris.

#### Hell's Gate National Park (KWS Managed):
- **Bicycle Safaris:** The only national park in Kenya where visitors can cycle freely among grazing zebras, giraffes, gazelles, and warthogs.
- **Lower Gorge Exploration:** Guided hiking through dramatic water-carved slot canyons and subterranean hot springs.
- **Fischer's Tower Rock Climbing:** Ancient volcanic plug offering rock-climbing challenges for adventure seekers.
- **Olkaria Geothermal Natural Spa:** Heated mineral-rich turquoise waters powered by KenGen's geothermal energy.

#### Lake Naivasha & Crescent Island:
- **Freshwater Boat Safaris:** Glide past pods of resident hippos and swooping African fish eagles.
- **Crescent Island Game Sanctuary:** Guided walking safari on foot among wildebeest, waterbucks, and giraffes where 'Out of Africa' was filmed.
- **World-Class Conference Resorts:** Enashipai, Great Rift Valley Lodge, Sawela, and Lake Naivasha Sopa.`,
        imageUrl: "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80",
        icon: "compass",
        tags: ["Hell's Gate", "Lake Naivasha", "Team Building", "Olkaria Spa", "Cycling Safari"],
        gallery: [
          "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "Day Tour from KES 18,000 / $140 per vehicle",
          duration: "1 to 2 Days (Top Corporate Retreat Hub)",
          features: [
            "Bicycle Riding with Wildlife in Hell's Gate",
            "Olkaria Natural Geothermal Mineral Hot Spa",
            "Crescent Island Guided Walking Safari",
            "Lake Naivasha Boat Rides & Hippo Encounters",
            "Direct Shuttles to Top Conference Resorts"
          ],
          location: "Naivasha, Nakuru County (KWS Managed)",
        },
        faq: [
          {
            question: "Is it safe to walk and cycle in Hell's Gate National Park?",
            answer: "Yes! Hell's Gate has no free-roaming lions or dangerous predators, making cycling alongside zebras, buffaloes, and antelopes safe and exhilarating under KWS ranger guidelines."
          }
        ],
        reviews: [
          {
            author: "Team Lead, Safaricom Tech Department",
            rating: 5,
            comment: "Ubuntu Logistics transported 60 staff members in two Rosa buses to Naivasha for our Q1 team building. From bus rides to the Olkaria spa, everything was flawless.",
            date: "2026-03-08"
          }
        ],
        metaTitle: "Lake Naivasha & Hell's Gate Team Building Transport | Ubuntu Logistics",
        metaDescription: "Corporate team building shuttles and safari van hire to Hell's Gate National Park, Olkaria Geothermal Spa, and Lake Naivasha resorts.",
        published: true,
        order: 4,
      },
      {
        collectionId: destinationsCollectionId,
        title: "Nairobi National Park & City Safari Circuit (KWS)",
        slug: "nairobi-national-park-city-circuit-kws",
        description: "The world's only wildlife park within a capital city. Encounter lions, rhinos, and giraffes with the Nairobi modern skyscraper skyline as a dramatic backdrop.",
        content: `### The World's Only Wildlife Capital

Only 7 kilometers from Nairobi’s central business district, Nairobi National Park is a global marvel. Managed by KWS, this 117-square-kilometer sanctuary lets visitors experience a full African safari without ever leaving the city.

#### Wildlife Highlights:
- **Big Game with a City Backdrop:** Photograph lions, giraffes, and cheetahs with glass towers rising on the horizon.
- **Rhino Breeding Sanctuary:** One of Kenya's most successful black rhino sanctuaries, virtually guaranteeing rhino sightings.
- **Ivory Burning Site Monument:** Historic site where Kenya's presidents burned illegal ivory stockpiles to champion global anti-poaching.
- **Nairobi Safari Walk & Orphanage:** Elevated wooden boardwalk providing close-up education on indigenous flora and fauna.

#### Complementary Nairobi Day Circuit:
- **David Sheldrick Wildlife Trust:** World-famous orphan elephant rescue and rehabilitation project (11:00 AM - 12:00 PM).
- **The Giraffe Centre:** Hand-feed endangered Rothschild’s giraffes from elevated wooden viewing platforms.
- **Karen Blixen Museum & Kazuri Beads:** Cultural and historical excursions in leafy Karen suburb.`,
        imageUrl: "https://images.unsplash.com/photo-1547970810-dc1eac8161a2?auto=format&fit=crop&w=1200&q=80",
        icon: "map-pin",
        tags: ["Nairobi National Park", "KWS Capital Safari", "Rhinos", "City Safari", "David Sheldrick"],
        gallery: [
          "https://images.unsplash.com/photo-1547970810-dc1eac8161a2?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "Half-Day Safari from KES 10,000 / $75",
          duration: "Half-Day (4-6 Hours) / Full Day",
          features: [
            "Only 15 Minutes from Nairobi City Centre & JKIA",
            "Highest Density of Black Rhinos in Kenya",
            "Famous Lions, Leopards & Cheetahs",
            "Combined Tours with Giraffe Centre & Sheldrick",
            "Ideal for Layovers and Business Travelers"
          ],
          location: "Nairobi County (KWS Headquarters)",
        },
        faq: [
          {
            question: "I have a 6-hour layover at JKIA. Can I do a safari in Nairobi National Park?",
            answer: "Absolutely! We pick you up at JKIA terminal, drive 15 minutes to the KWS East Gate, conduct a 3-hour game drive, and return you comfortably in time for your onward flight."
          }
        ],
        reviews: [
          {
            author: "Elena Rostova, Transit Passenger from Zurich",
            rating: 5,
            comment: "I had an 8-hour flight layover in Nairobi. Ubuntu Logistics picked me up from JKIA, took me to Nairobi National Park where I saw 4 lions and 3 rhinos, and dropped me back. Best layover ever!",
            date: "2026-02-25"
          }
        ],
        metaTitle: "Nairobi National Park Safari & Layover Tours | Ubuntu Logistics",
        metaDescription: "Experience a half-day or full-day game drive in Nairobi National Park with Ubuntu Logistics. Convenient pickups from JKIA and city hotels.",
        published: true,
        order: 5,
      },
      {
        collectionId: destinationsCollectionId,
        title: "Tsavo East & Tsavo West National Parks (KWS)",
        slug: "tsavo-east-and-west-national-parks-kws",
        description: "The 'Theatre of the Wild.' Kenya’s largest protected wilderness expanse, celebrated for legendary red-dust elephants, Mzima Springs hippo observatory, and Shetani lava flows.",
        content: `### Untamed Wilderness Across Kenya's Historic Frontier

Together, Tsavo East and Tsavo West form one of the largest protected wildlife sanctuaries on Earth, covering nearly 22,000 square kilometers. Managed by Kenya Wildlife Service, Tsavo offers raw, rugged safari country steeped in legend.

#### Tsavo East (The Land of Red Dust):
- **Red Elephants of Tsavo:** Elephants rolling in the park’s rich red volcanic soil, giving them a distinctive crimson appearance.
- **Yatta Plateau:** The world’s longest lava flow, stretching over 300 kilometers.
- **Lugard Falls & Mudanda Rock:** Rushing rapids carved through granite rocks where hippos and crocodiles congregate.

#### Tsavo West (Scenic Volcanic Wonderland):
- **Mzima Springs:** Natural underground oasis producing 250 million liters of crystal-clear water daily with a submerged glass viewing chamber for hippos and fish.
- **Shetani Lava Flow:** Enormous black lava rock field formed just 200 years ago by volcanic eruptions.
- **Ngulia Rhino Sanctuary:** Dedicated safe haven for Tsavo's endangered black rhinos.

#### Ubuntu Transport Logistics:
- **Direct Link between Nairobi and Coastal Mombasa:** Perfect midway safari stopover for travelers heading to Diani, Mombasa, or Watamu beaches.`,
        imageUrl: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80",
        icon: "trees",
        tags: ["Tsavo East", "Tsavo West", "KWS Park", "Red Elephants", "Mzima Springs"],
        gallery: [
          "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "3-Day Circuit from $520 / KES 70,000",
          duration: "3 to 4 Days Recommended",
          features: [
            "Legendary Red Dust-Bathed Elephants",
            "Mzima Springs Submerged Underwater Hippo Viewing",
            "Shetani Black Lava Fields & Volcanic Caves",
            "World's Longest Yatta Plateau Lava Flow",
            "Ideal Bridge between Nairobi and Mombasa Beach"
          ],
          location: "Taita-Taveta & Makueni Counties (KWS Managed)",
        },
        faq: [
          {
            question: "Can we travel to Tsavo on the way to Diani Beach?",
            answer: "Yes, our popular 'Bush to Beach' circuit transports you from Nairobi to Tsavo for 2 nights of game viewing, then drops you directly at your Diani Beach resort."
          }
        ],
        reviews: [
          {
            author: "Hassan & Fatima Al-Maktoum, Dubai",
            rating: 5,
            comment: "The underwater hippo room at Mzima Springs was breathtaking. Our driver Ben drove smoothly and knew every track in Tsavo West.",
            date: "2026-01-30"
          }
        ],
        metaTitle: "Tsavo East & West Safari Transport Kenya | Ubuntu Logistics",
        metaDescription: "Safari transport to Tsavo East and Tsavo West National Parks with Ubuntu Logistics. See the famous red elephants and Mzima Springs.",
        published: true,
        order: 6,
      },
      {
        collectionId: destinationsCollectionId,
        title: "Ol Pejeta Conservancy & Mount Kenya National Park (KWS)",
        slug: "ol-pejeta-conservancy-mount-kenya-kws",
        description: "The greatest wildlife conservation success in East Africa. Home to the world’s last two Northern White Rhinos, chimpanzee sanctuary, and high-altitude Mount Kenya trekking.",
        content: `### High-Altitude Conservation & Alpine Grandeur

Nestled on the Laikipia Plateau between the foothills of the Aberdares and snow-draped Mount Kenya (5,199m), Ol Pejeta Conservancy and Mount Kenya National Park represent the pinnacle of wildlife conservation and alpine adventure.

#### Ol Pejeta Conservancy Highlights:
- **The World's Last Northern White Rhinos:** The final two surviving Northern White Rhinos on Earth (Najin and Fatu) reside under 24/7 armed protection.
- **Sweetwaters Chimpanzee Sanctuary:** The only place in Kenya where rescued, orphaned chimpanzees are rehabilitated.
- **Equator Crossing:** Official equator line crossing offering water vortex demonstration experiments.
- **Highest Predator Density in Laikipia:** Outstanding lion, leopard, cheetah, and African wild dog tracking.

#### Mount Kenya National Park (KWS / UNESCO Site):
- **Snow-Capped Equatorial Peaks:** Batian (5,199m), Nelion (5,188m), and Point Lenana (4,985m).
- **Pristine Mountain Vegetation:** Bamboo forests, Afro-alpine moorlands, giant lobelias, and crystal tarns.
- **Corporate Executive Leadership Treks:** Premier high-altitude team-building expeditions.`,
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        icon: "shield",
        tags: ["Ol Pejeta", "Mount Kenya", "KWS Park", "Northern White Rhino", "Chimpanzees"],
        gallery: [
          "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "2-3 Day Expedition from $420 / KES 56,000",
          duration: "2 to 3 Days Recommended",
          features: [
            "Sanctuary of the World's Last 2 Northern White Rhinos",
            "Jane Goodall Sweetwaters Chimpanzee Haven",
            "Official Equator Line Crossing & Demonstrations",
            "Highest Density of Black Rhinos in East Africa",
            "Stunning Alpine Panoramas of Mount Kenya"
          ],
          location: "Laikipia & Nyeri Counties (KWS & Private Conservancy)",
        },
        faq: [
          {
            question: "Can visitors see the Northern White Rhinos up close?",
            answer: "Yes, visitors can book an exclusive guided encounter to meet Najin and Fatu in their designated sanctuary enclosure alongside their dedicated armed caretakers."
          }
        ],
        reviews: [
          {
            author: "Dr. Linda Sterling, Wildlife Biologist",
            rating: 5,
            comment: "Visiting Ol Pejeta and standing a few meters from the last Northern White Rhinos was deeply moving. Ubuntu Logistics provided stellar service throughout our journey.",
            date: "2026-02-17"
          }
        ],
        metaTitle: "Ol Pejeta & Mount Kenya Safari Transport | Ubuntu Logistics",
        metaDescription: "Visit Ol Pejeta Conservancy and Mount Kenya National Park with Ubuntu Logistics. See the last Northern White Rhinos, chimpanzees, and alpine scenery.",
        published: true,
        order: 7,
      },
      {
        collectionId: destinationsCollectionId,
        title: "Diani Beach & Kisite Mpunguti Marine Park",
        slug: "diani-beach-kisite-mpunguti-marine-park",
        description: "Award-winning powdery white sand beaches on Kenya's South Coast. The ultimate destination for corporate end-of-year retreats, dhow sailing, and dolphin snorkeling.",
        content: `### Tropical Paradise & Marine Wonderland

Consistently voted Africa's Leading Beach Destination at the World Travel Awards, Diani Beach on Kenya's South Coast offers flawless powder-white sand, warm turquoise Indian Ocean waters, and swaying coconut palms.

#### Highlights of Diani & Kenya's South Coast:
- **Kisite Mpunguti Marine National Park (KWS):** An enchanted underwater paradise featuring vibrant coral reefs, green sea turtles, and wild spinner dolphins.
- **Traditional Wasini Island Dhow Safaris:** Sail aboard an authentic wooden Swahili dhow, snorkel the coral gardens, and enjoy a Swahili seafood feast.
- **Corporate Gala Retreats:** Premier beach resorts (Swahili Beach, Leopard Beach, Baobab) equipped with state-of-the-art conference facilities for corporate annual general meetings and retreats.
- **Shimba Hills National Reserve (KWS):** Located just 45 minutes inland, home to Kenya's only population of Sable Antelopes and Sheldrick Falls.

#### Ubuntu Coastal Transport Logistics:
- **SGR Train Station Transfers:** Private meet-and-greet shuttles at Mombasa Terminus (Miritini) and Emali stations.
- **Airport Transfers:** Direct pickups from Diani/Ukunda Airstrip and Moi International Airport Mombasa.`,
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        icon: "sun",
        tags: ["Diani Beach", "Kisite Mpunguti", "KWS Marine Park", "Coastal Retreat", "Dolphin Safari"],
        gallery: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "Corporate Group & Private Charter Packages",
          duration: "3 to 7 Days Coastal Holiday",
          features: [
            "Voted Africa's Leading Beach Destination",
            "Dolphin Snorkeling at Kisite Mpunguti KWS Marine Park",
            "Wasini Island Swahili Dhow Sailing & Seafood",
            "Mombasa SGR Train Station Transfers",
            "Shimba Hills Sable Antelope Day Excursions"
          ],
          location: "Kwale County, Kenya South Coast",
        },
        faq: [
          {
            question: "How do we get from the SGR train in Mombasa to our hotel in Diani?",
            answer: "Ubuntu Logistics provides private air-conditioned shuttle transfers from Mombasa Terminus (Miritini) directly to your Diani resort via the new Dongo Kundu bypass bypass, avoiding ferry delays entirely."
          }
        ],
        reviews: [
          {
            author: "Corporate Relations Lead, Equity Bank Group",
            rating: 5,
            comment: "Ubuntu managed the transport for our 120-person annual end-of-year retreat in Diani. Seamless SGR transfers and incredible Wasini Island dhow excursion!",
            date: "2026-01-10"
          }
        ],
        metaTitle: "Diani Beach & Coastal Retreat Transport Kenya | Ubuntu Logistics",
        metaDescription: "Charter comfortable shuttles from Mombasa SGR station or airport to Diani Beach resorts, Kisite Mpunguti Marine Park, and Shimba Hills with Ubuntu Logistics.",
        published: true,
        order: 8,
      },
      {
        collectionId: destinationsCollectionId,
        title: "Samburu & Buffalo Springs National Reserves",
        slug: "samburu-buffalo-springs-national-reserves",
        description: "A rugged, sun-bleached northern Kenya paradise along the Ewaso Nyiro River. Celebrated for its unique 'Samburu Special 5' wildlife and vibrant cultural heritage.",
        content: `### The Arid Northern Frontier & The Samburu Special 5

Set against dramatic granite mountains and severed by the palm-fringed lifeblood of the brown Ewaso Nyiro River, Samburu and Buffalo Springs National Reserves offer a wild, authentic safari experience unlike anywhere else in Kenya.

#### The "Samburu Special Five":
Samburu is famous for five rare animal species specially adapted to arid northern Kenya that are not found together in southern parks:
1. **Grevy's Zebra:** The world's largest and most endangered zebra with fine narrow stripes and rounded ears.
2. **Reticulated Giraffe:** Striking geometric polygonal coat pattern.
3. **Beisa Oryx:** Majestic long-horned desert antelope.
4. **Gerenuk (Giraffe Gazelle):** Slender antelope that stands tall on its hind legs to feed on high thorny branches.
5. **Somali Ostrich:** Distinctive blue-necked ostrich.

#### Highlights & Culture:
- **Ewaso Nyiro River Oasis:** Elephants and leopards quenching their thirst along the riverbanks.
- **Authentic Samburu Cultural Encounters:** Interact respectfully with traditional Samburu semi-nomadic pastoralists and warriors (Morans).
- **Dramatic Scenic Landscapes:** Mount Ololokwe (the sacred flat-topped mountain) and stark red-sand plains.`,
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
        icon: "sun",
        tags: ["Samburu", "Special Five", "Ewaso Nyiro", "Northern Kenya", "Cultural Safari"],
        gallery: [
          "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "3-4 Day Safari Transport from $580 / KES 78,000",
          duration: "3 to 4 Days Recommended",
          features: [
            "Exclusive 'Samburu Special 5' Rare Wildlife",
            "Lush Ewaso Nyiro River Predator Watching",
            "Dramatic Views of Sacred Mt. Ololokwe",
            "Authentic Samburu Traditional Village Visits",
            "Custom 4x4 Land Cruiser with Refrigerator"
          ],
          location: "Samburu & Isiolo Counties, Northern Kenya",
        },
        faq: [
          {
            question: "Why should I visit Samburu in addition to Maasai Mara?",
            answer: "Samburu offers completely different semi-arid desert scenery, significantly fewer tourist crowds, and unique wildlife species (the Samburu Special 5) that do not exist in the Mara."
          }
        ],
        reviews: [
          {
            author: "Jonathan & Mary Higgins, New York",
            rating: 5,
            comment: "Samburu was the highlight of our 2-week Kenya trip! The landscape is so dramatic and seeing the gerenuk standing on its hind legs was unreal. Ubuntu's Land Cruiser was top-notch.",
            date: "2026-02-02"
          }
        ],
        metaTitle: "Samburu Safari Transport & 4x4 Tour Packages | Ubuntu Logistics",
        metaDescription: "Explore northern Kenya's Samburu National Reserve with Ubuntu Logistics. Discover the unique Samburu Special Five and stunning Ewaso Nyiro riverbanks.",
        published: true,
        order: 9,
      },
      {
        collectionId: destinationsCollectionId,
        title: "Aberdare National Park (KWS)",
        slug: "aberdare-national-park-kws",
        description: "Enchanting misty mountain moorlands, deep ravines, and towering waterfalls (Karuru, Chania). Ideal for high-altitude game viewing from iconic tree-hotels and executive leadership retreats.",
        content: `### Misty Highland Forests & Towering Waterfalls

Part of the central highlands of Kenya, Aberdare National Park (managed by KWS) covers a dramatic mountain range with peaks soaring to 4,000 meters. The park features misty bamboo forests, alpine moorlands, plunging waterfalls, and crystal trout streams.

#### Highlights of Aberdare National Park:
- **Kenya's Highest Waterfalls:** Karuru Falls (cascading 273 meters in three tiers), Chania Falls, and Gura Falls.
- **Iconic Historic Tree-Hotels:** The Ark and Treetops (where Princess Elizabeth stayed when she ascended the throne as Queen Elizabeth II in 1952). Floodlit waterholes allow 24-hour game viewing from cozy viewing decks.
- **Rare Mountain Wildlife:** Giant forest hogs, rare melanistic black leopards, bongo antelopes, Colobus monkeys, and elephants adapted to high-altitude cold.
- **Executive Leadership Retreats:** Crisp, clean mountain air and secluded lodge environments ideal for C-suite executive focus and strategic planning.`,
        imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
        icon: "trees",
        tags: ["Aberdare", "KWS Park", "Karuru Falls", "The Ark", "Mountain Safaris"],
        gallery: [
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
        ],
        galleryType: "grid" as const,
        metadata: {
          price: "2-Day Highland Tour from $360 / KES 48,000",
          duration: "2 Days",
          features: [
            "Karuru Falls (Highest Waterfall in Kenya - 273m)",
            "Historic Treetops & The Ark Floodlit Waterhole Viewing",
            "Misty Mountain Afro-Alpine Moorlands",
            "Crisp Highland Climate for Executive Focus",
            "Trout Fishing & Moorland Hiking Trails"
          ],
          location: "Nyeri & Nyandarua Counties (KWS Managed)",
        },
        faq: [
          {
            question: "Is it cold in Aberdare National Park?",
            answer: "Yes, because of the high altitude (up to 3,000+ meters), temperatures drop significantly at night, often reaching 5°C - 10°C. Warm mountain fleece jackets and boots are recommended."
          }
        ],
        reviews: [
          {
            author: "Managing Director, East Africa Agribusiness",
            rating: 5,
            comment: "We held our executive leadership retreat at The Ark in Aberdare. Watching elephants and buffalos at the floodlit waterhole all night while discussing strategy was inspiring.",
            date: "2026-02-28"
          }
        ],
        metaTitle: "Aberdare National Park Tour & Retreat Transport | Ubuntu Logistics",
        metaDescription: "Visit Aberdare National Park with Ubuntu Logistics. Experience Karuru Falls, misty moorlands, and historic floodlit tree hotels in Kenya's highlands.",
        published: true,
        order: 10,
      },
    ];

    for (const item of destinationsData) {
      await ctx.db.insert("collectionItems", {
        ...item,
        publishedAt: Date.now(),
      });
    }

    // 6. POPULATE SERVICES TABLE FOR QUOTATIONS & BILLING
    const existingServices = await ctx.db.query("services").collect();
    for (const s of existingServices) {
      await ctx.db.delete(s._id);
    }

    const servicesTableEntries = [
      {
        name: "Corporate Staff Commuter Shuttle (14-Seater Van)",
        description: "Daily dedicated employee morning pickup and evening drop-off shuttle route in Nairobi metro with GPS tracking.",
        price: "120000",
        pricingType: "subscription" as const,
        category: "Corporate Transport",
        duration: "Monthly Retainer",
        features: [
          "NTSA Speed Governed & Insured",
          "Real-time GPS Route Tracking",
          "Dedicated Vetted Chauffeur",
          "Standby Replacement Backups"
        ],
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        icon: "truck",
        active: true,
        order: 1,
      },
      {
        name: "4x4 Safari Land Cruiser Day Hire (with Driver-Guide)",
        description: "Custom 4x4 Safari Land Cruiser with pop-up roof, electric fridge, and certified KPSGA driver-guide for Kenya game parks.",
        price: "24000",
        pricingType: "hourly" as const, // standard daily day-rate
        category: "Tours & Safaris",
        duration: "Full Day (8-10 Hours)",
        features: [
          "Pop-up Photographic Roof",
          "Bronze/Silver KPSGA Guide",
          "Onboard 220V Power Inverter",
          "Onboard Electric Cooler"
        ],
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
        icon: "truck",
        active: true,
        order: 2,
      },
      {
        name: "JKIA Airport One-Way Private Transfer (Sedan/SUV)",
        description: "Private meet-and-greet airport transfer between JKIA and Nairobi city hotels or residences with live flight delay monitoring.",
        price: "4000",
        pricingType: "project" as const,
        category: "Airport Transfers",
        duration: "One-Way Transfer",
        features: [
          "Live Flight Radar Tracking",
          "Terminal Meet & Greet with Nameboard",
          "Complimentary Bottled Water",
          "Luggage Assistance"
        ],
        imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
        icon: "plane",
        active: true,
        order: 3,
      },
      {
        name: "Executive Chauffeur Car Hire (Mercedes-Benz E-Class)",
        description: "Full-day luxury chauffeured VIP sedan for corporate meetings, dignitaries, and diplomatic summits in Nairobi.",
        price: "18000",
        pricingType: "hourly" as const,
        category: "VIP & Chauffeur",
        duration: "8-Hour City Hire",
        features: [
          "Suited Executive Chauffeur",
          "Leather Interior & Climate Control",
          "Wi-Fi Hotspot on Board",
          "Tinted Privacy Glass"
        ],
        imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
        icon: "shield",
        active: true,
        order: 4,
      },
      {
        name: "33-Seater Minibus Conference Hire (Toyota Coaster)",
        description: "Spacious 33-seater air-conditioned minibus with PA system and luggage boot for corporate team building in Naivasha or Nakuru.",
        price: "25000",
        pricingType: "hourly" as const,
        category: "Group & Event Shuttles",
        duration: "Full Day Hire",
        features: [
          "33 Reclining Velvet Seats",
          "Central Air Conditioning",
          "Built-in PA Sound System",
          "Generous Luggage Space"
        ],
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
        icon: "users",
        active: true,
        order: 5,
      },
      {
        name: "Accessible Wheelchair Van Day Hire (Hydraulic Lift)",
        description: "Custom modified transport van with motorized electro-hydraulic lift and 4-point Q'Straint tie-downs for medical checkups and tours.",
        price: "14000",
        pricingType: "hourly" as const,
        category: "Accessible Mobility",
        duration: "Full Day (8 Hours)",
        features: [
          "Motorized Hydraulic Lift",
          "4-Point Crash-Tested Floor Restraints",
          "Accommodates 2 Wheelchairs + 4 Passengers",
          "Medically Trained Chauffeur"
        ],
        imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
        icon: "heart",
        active: true,
        order: 6,
      },
    ];

    for (const service of servicesTableEntries) {
      await ctx.db.insert("services", service);
    }

    // 7. POPULATE CMS PAGES (services, fleet, destinations) WITH RICH BLOCKS
    const pagesToUpdate = [
      {
        slug: "services",
        title: "Our Services",
        metaTitle: "Transport & Logistics Services | Ubuntu Logistics Kenya",
        metaDescription: "Discover comprehensive transport services by Ubuntu Logistics: corporate commuter shuttles, wildlife safaris, airport transfers, and VIP car hire in Kenya.",
        blocks: [
          {
            id: "serv-hero-1",
            type: "HeroBlock",
            props: {
              variant: "split-content",
              title: "Comprehensive Transport & Safari Logistics",
              subtitle: "Punctual, safe, and premium transport solutions engineered for corporate staff, international tourists, government delegations, and private travelers across Kenya and East Africa.",
              badge: "Ubuntu Services",
              imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
              ctaText: "Browse All Collections",
              ctaLink: "/collections/services",
              features: [
                "NTSA-Compliant & Insured Fleet",
                "KPSGA-Certified Safari Guides",
                "24/7 Monitored Dispatch Center",
                "Corporate Invoicing & Tailored SLAs"
              ]
            }
          },
          {
            id: "serv-cards-1",
            type: "CardBlock",
            props: {
              variant: "image-cards",
              collectionSlug: "services",
              title: "Our Full Transport Solutions",
              subtitle: "Explore our specialized corporate shuttles, bush safari transport, and VIP services.",
              badge: "Services",
              columns: 3,
              limit: 6,
              showViewAll: true,
              viewAllText: "Browse All Services",
            }
          }
        ]
      },
      {
        slug: "fleet",
        title: "Our Fleet",
        metaTitle: "Our Modern Vehicle Fleet | Ubuntu Logistics Kenya",
        metaDescription: "Explore our modern fleet of 4x4 Safari Land Cruisers, Toyota HiAce tour vans, executive Mercedes-Benz sedans, and 25-33 seater luxury minibuses.",
        blocks: [
          {
            id: "fleet-hero-1",
            type: "HeroBlock",
            props: {
              variant: "split-content",
              title: "Modern, Reliable & NTSA-Certified Fleet",
              subtitle: "From rugged 4x4 Safari Land Cruisers equipped with pop-up game-viewing roofs to executive VIP Mercedes-Benz saloons and spacious commuter coaches.",
              badge: "Ubuntu Fleet",
              imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
              ctaText: "Browse Fleet Collection",
              ctaLink: "/collections/fleet",
              features: [
                "Pop-Up Roofs for Game Viewing",
                "Real-Time Telematics & Speed Governors",
                "Full Air Conditioning & Comfort Seating",
                "Regular NTSA Safety Inspections"
              ]
            }
          },
          {
            id: "fleet-cards-1",
            type: "CardBlock",
            props: {
              variant: "image-cards",
              collectionSlug: "fleet",
              title: "Explore Our Complete Fleet",
              subtitle: "Select the ideal vehicle for your upcoming safari, corporate commute, or VIP delegation.",
              badge: "Fleet Highlights",
              columns: 3,
              limit: 6,
              showViewAll: true,
              viewAllText: "Browse All Fleet Vehicles",
            }
          }
        ]
      },
      {
        slug: "destinations",
        title: "Destinations",
        metaTitle: "Popular Kenya Safari Destinations | Ubuntu Logistics",
        metaDescription: "Discover top Kenya destinations with Ubuntu Logistics: Maasai Mara, Amboseli (KWS), Lake Nakuru, Hell's Gate, and Diani Beach.",
        blocks: [
          {
            id: "dest-hero-1",
            type: "HeroBlock",
            props: {
              variant: "split-content",
              title: "Discover Kenya’s Most Iconic Destinations",
              subtitle: "From the thunderous wildebeest crossings of the Maasai Mara to the giant tuskers beneath Mount Kilimanjaro in Amboseli and the turquoise waters of Diani Beach.",
              badge: "KWS & Safari Circuits",
              imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
              ctaText: "Explore Destinations",
              ctaLink: "/collections/destinations",
              features: [
                "Authoritative Kenya Wildlife Service Parks",
                "Great Wildebeest Migration Circuits",
                "Corporate Team Building Hotspots",
                "Scenic Coastal Beach Gateways"
              ]
            }
          },
          {
            id: "dest-cards-1",
            type: "CardBlock",
            props: {
              variant: "image-cards",
              collectionSlug: "destinations",
              title: "Top Travel & Safari Destinations",
              subtitle: "Hand-picked natural reserves and retreat centers where we transport tourists and corporate teams.",
              badge: "Popular Locations",
              columns: 3,
              limit: 6,
              showViewAll: true,
              viewAllText: "Browse All Destinations",
            }
          }
        ]
      },
      {
        slug: "", // Home page
        title: "Home",
        metaTitle: "Ubuntu Logistics & Transport | Kenya Tours, Safaris & Corporate Shuttles",
        metaDescription: "Premier tours and travel transport company in Nairobi, Kenya. Offering 4x4 Safari Land Cruisers, corporate staff shuttles, airport transfers, and guided tours.",
        blocks: [
          {
            id: "home-hero",
            type: "HeroBlock",
            props: {
              variant: "split-content",
              title: "Tours & Travel Transport Company in Nairobi, Kenya",
              subtitle: "Punctual corporate staff shuttles, custom 4x4 safari circuits to Maasai Mara & Amboseli, 24/7 airport transfers, and executive car hire across East Africa.",
              badge: "Ubuntu Logistics & Transport",
              imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
              ctaText: "Explore Services",
              ctaLink: "/services",
              features: [
                "NTSA-Compliant & Insured Fleet",
                "4x4 Safari Land Cruisers with Pop-Up Roofs",
                "24/7 Monitored Dispatch & Airport Transfers",
                "KPSGA-Certified Expert Driver-Guides"
              ]
            }
          },
          {
            id: "home-services-cards",
            type: "CardBlock",
            props: {
              variant: "image-cards",
              collectionSlug: "services",
              title: "Our Core Transport Services",
              subtitle: "Tailored commuter shuttles, corporate outsourcing, wildlife safaris, and airport transfers.",
              badge: "Services Collection",
              columns: 3,
              limit: 3,
              showViewAll: true,
              viewAllText: "View All 8 Services",
            }
          },
          {
            id: "home-fleet-cards",
            type: "CardBlock",
            props: {
              variant: "image-cards",
              collectionSlug: "fleet",
              title: "Featured Fleet & Safari Vehicles",
              subtitle: "Meticulously maintained, customized 4x4s, executive VIP saloons, and group commuter buses.",
              badge: "Fleet Collection",
              columns: 3,
              limit: 3,
              showViewAll: true,
              viewAllText: "View All 9 Vehicles",
            }
          },
          {
            id: "home-destinations-cards",
            type: "CardBlock",
            props: {
              variant: "image-cards",
              collectionSlug: "destinations",
              title: "Top Travel & Safari Destinations",
              subtitle: "Experience Kenya's world-renowned national parks and reserves in partnership with Kenya Wildlife Service (KWS).",
              badge: "Destinations Collection",
              columns: 3,
              limit: 3,
              showViewAll: true,
              viewAllText: "View All 10 Destinations",
            }
          }
        ]
      }
    ];

    for (const page of pagesToUpdate) {
      const existingPage = await ctx.db
        .query("pages")
        .withIndex("by_slug", (q) => q.eq("slug", page.slug))
        .first();

      if (existingPage) {
        await ctx.db.patch(existingPage._id, {
          title: page.title,
          blocks: page.blocks,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          published: true,
          publishedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("pages", {
          slug: page.slug,
          title: page.title,
          blocks: page.blocks,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          published: true,
          publishedAt: Date.now(),
        });
      }
    }

    return {
      success: true,
      message: "Ubuntu Logistics & Transport collections (Services, Fleet, Destinations), services table, organization profile, and CMS pages seeded successfully!",
      collections: {
        services: servicesData.length,
        fleet: fleetData.length,
        destinations: destinationsData.length,
      }
    };
  },
});
