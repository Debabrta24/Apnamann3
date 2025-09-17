export interface RandomNameOptions {
  style?: 'animal' | 'nature' | 'cosmic' | 'friendly' | 'all';
  includeNumbers?: boolean;
}

const animalNames = [
  'PandaBear', 'WiseOwl', 'PlayfulDolphin', 'CalmTurtle', 'GentleDeer',
  'BraveWolf', 'SwiftFox', 'SereneWhale', 'HappyOtter', 'CuriousCat',
  'CheerfulBird', 'PeacefulDove', 'FriendlyBear', 'CleverRaven', 'SweetBee',
  'GracefulSwan', 'LoyalDog', 'AdorableRabbit', 'MightyEagle', 'QuietMouse',
  'StrongLion', 'WarmPenguin', 'JoyfulButterfly', 'KindElephant', 'SmartOwl'
];

const natureNames = [
  'MorningDew', 'SunnyMeadow', 'GentleBreeze', 'CalmRiver', 'BloomingRose',
  'QuietForest', 'WarmSunlight', 'SoftRain', 'PeacefulLake', 'WildFlower',
  'GoldenSunset', 'CrystalStream', 'GreenValley', 'SilverMoon', 'WispyCloud',
  'StarryNight', 'FreshSpring', 'CozyAutumn', 'SnowySummit', 'TranquilBeach',
  'MysticMist', 'DancingLeaves', 'WhisperingWind', 'HiddenGarden', 'SerenePath'
];

const cosmicNames = [
  'StarDreamer', 'MoonWalker', 'CometRider', 'GalaxyExplorer', 'NebulaWanderer',
  'SolarFlare', 'CosmicVoyager', 'StarlightSeeker', 'PlanetHopper', 'AuroraChaser',
  'SpaceWhisper', 'StellarMind', 'UniversalSoul', 'CelestialBeing', 'OrbitDancer',
  'MeteorGlider', 'VoidWalker', 'InfinitySeeker', 'GravityDefier', 'TimeWeaver',
  'DimensionJumper', 'QuantumDreamer', 'EtherealSpirit', 'CosmicHeart', 'StardustSoul'
];

const friendlyNames = [
  'KindHeart', 'WarmSmile', 'GentleFriend', 'CheerfulSoul', 'SweetSpirit',
  'CalmMind', 'BrightLight', 'HappyThoughts', 'PeacefulVibes', 'LovingNature',
  'SerenePresence', 'JoyfulEnergy', 'CompassionateSoul', 'OptimisticView', 'TenderCare',
  'WisdomSeeker', 'HeartfulConnection', 'MindfulBeing', 'BlissfulMoment', 'GratefulHeart',
  'PositiveAura', 'HealingTouch', 'InnerPeace', 'SoulfulJourney', 'LightBearer'
];

const adjectives = [
  'Serene', 'Gentle', 'Wise', 'Brave', 'Kind', 'Peaceful', 'Joyful', 
  'Bright', 'Calm', 'Sweet', 'Strong', 'Graceful', 'Curious', 'Happy',
  'Quiet', 'Warm', 'Free', 'Pure', 'Noble', 'Dreamy'
];

const nouns = [
  'Soul', 'Spirit', 'Heart', 'Mind', 'Being', 'Dreamer', 'Seeker', 
  'Wanderer', 'Explorer', 'Guardian', 'Helper', 'Friend', 'Light',
  'Voice', 'Path', 'Journey', 'Hope', 'Peace', 'Joy', 'Wonder'
];

/**
 * Generates a random anonymous username for users
 */
export function generateRandomName(options: RandomNameOptions = {}): string {
  const { style = 'all', includeNumbers = true } = options;
  
  let namePool: string[] = [];
  
  switch (style) {
    case 'animal':
      namePool = animalNames;
      break;
    case 'nature':
      namePool = natureNames;
      break;
    case 'cosmic':
      namePool = cosmicNames;
      break;
    case 'friendly':
      namePool = friendlyNames;
      break;
    case 'all':
    default:
      namePool = [...animalNames, ...natureNames, ...cosmicNames, ...friendlyNames];
      break;
  }
  
  // Sometimes generate compound names
  const useCompound = Math.random() < 0.3;
  let baseName: string;
  
  if (useCompound) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    baseName = adjective + noun;
  } else {
    baseName = namePool[Math.floor(Math.random() * namePool.length)];
  }
  
  // Add random numbers for uniqueness if requested
  if (includeNumbers) {
    const numberSuffix = Math.floor(Math.random() * 9999) + 1;
    return `${baseName}${numberSuffix}`;
  }
  
  return baseName;
}

/**
 * Generates multiple unique random names
 */
export function generateUniqueRandomNames(count: number, options: RandomNameOptions = {}): string[] {
  const names = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 10; // Prevent infinite loops
  
  while (names.size < count && attempts < maxAttempts) {
    names.add(generateRandomName(options));
    attempts++;
  }
  
  return Array.from(names);
}

/**
 * Gets a user-friendly display name that's anonymous
 */
export function getAnonymousDisplayName(user: { firstName?: string; lastName?: string; anonymousName?: string; id?: string }): string {
  if (user.anonymousName) {
    return user.anonymousName;
  }
  
  // Deterministic fallback using user data hash
  if (user.firstName && user.lastName) {
    // Simple deterministic hash based on name initials and user data
    const seed = `${user.firstName}${user.lastName}${user.id || 'default'}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const number = Math.abs(hash) % 999 + 1;
    return `${user.firstName[0]}${user.lastName[0]}User${number}`;
  }
  
  return 'AnonymousUser';
}