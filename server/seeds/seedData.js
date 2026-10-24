export const initialUsers = [
  {
    _id: '65f000000000000000000001',
    name: 'Admin Cinema Manager',
    email: 'admin@imovies.com',
    password: 'adminpassword123', // will be hashed
    role: 'admin',
    phone: '+1 555-0199',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date(),
  },
  {
    _id: '65f000000000000000000002',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'userpassword123', // will be hashed
    role: 'user',
    phone: '+1 555-0144',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date(),
  },
];

export const initialTheatres = [
  {
    _id: '65f100000000000000000001',
    name: 'IMAX Regal Grand Plex',
    location: 'Downtown Boulevard',
    city: 'New York',
    address: '742 Evergreen Terrace, Sector 4, Manhattan',
    screensCount: 6,
    facilities: ['Dolby Atmos Sound', 'IMAX Laser 4K', 'Luxury Recliners', 'Gourmet Lounge', 'Wheelchair Access'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000002',
    name: 'Cinepolis Starlight Multiplex',
    location: 'West End Galleria',
    city: 'New York',
    address: '108 West 42nd St, Times Square Precinct',
    screensCount: 5,
    facilities: ['4DX Motion Seats', 'Dolby 7.1', 'VIP Butler Service', 'Cafeteria & Bar'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(),
  },
  {
    _id: '65f100000000000000000003',
    name: 'PVR Director\'s Cut',
    location: 'Uptown Promenade',
    city: 'Brooklyn',
    address: '45 Atlantic Ave, Brooklyn Heights',
    screensCount: 4,
    facilities: ['Leather Recliner Pods', 'Dolby Atmos', 'Signature Chef Menu', 'Valet Parking'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date(),
  },
];

export const initialMovies = [
  {
    _id: '65f200000000000000000001',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    genre: ['Sci-Fi', 'Adventure', 'Action', 'Drama'],
    language: ['English', 'Spanish', 'French'],
    duration: 166,
    releaseDate: '2026-03-01',
    rating: 8.9,
    certification: 'PG-13',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    formats: ['IMAX 3D', '2D', '4DX'],
    status: 'now_showing',
    featured: true,
    createdAt: new Date(),
  },
  {
    _id: '65f200000000000000000002',
    title: 'Interstellar: 10th Anniversary IMAX',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    language: ['English'],
    duration: 169,
    releaseDate: '2026-02-15',
    rating: 9.1,
    certification: 'PG-13',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    formats: ['IMAX 3D', '70mm IMAX', '2D'],
    status: 'now_showing',
    featured: true,
  },
  {
    _id: '65f200000000000000000003',
    title: 'Cyberpunk: Neon Horizon',
    description: 'In the year 2088, an undercover memory broker discovers an encrypted neural core capable of rewriting synthetic consciousness, sparking a high-octane hunt through neon skyscraper spires.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    genre: ['Cyberpunk', 'Action', 'Thriller'],
    language: ['English', 'Japanese'],
    duration: 142,
    releaseDate: '2026-04-10',
    rating: 8.6,
    certification: 'R',
    director: 'Alex Garland',
    cast: ['Karl Urban', 'Ana de Armas', 'Hiroyuki Sanada'],
    formats: ['3D', '2D', 'Dolby Atmos'],
    status: 'now_showing',
    featured: true,
  },
  {
    _id: '65f200000000000000000004',
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    genre: ['Biography', 'Drama', 'History'],
    language: ['English', 'German'],
    duration: 180,
    releaseDate: '2026-01-20',
    rating: 8.8,
    certification: 'R',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    formats: ['IMAX 3D', '2D'],
    status: 'now_showing',
    featured: false,
  },
  {
    _id: '65f200000000000000000005',
    title: 'Spider-Man: Beyond the Multiverse',
    description: 'Miles Morales traverses kaleidoscopic parallel dimensions to unite a rogue coalition of web-slingers against an omnipresent reality-collapsing threat.',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=shW9i6k8cB0',
    genre: ['Animation', 'Action', 'Sci-Fi'],
    language: ['English', 'Spanish'],
    duration: 140,
    releaseDate: '2026-11-20',
    rating: 9.2,
    certification: 'PG',
    director: 'Joaquim Dos Santos',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    formats: ['3D', 'IMAX 3D', '2D'],
    status: 'coming_soon',
    featured: true,
  },
  {
    _id: '65f200000000000000000006',
    title: 'Avatar: Fire and Ash',
    description: 'Jake Sully and Neytiri journey to the volatile volcanic regions of Pandora to confront the fiery Ash People, testing tribal bonds like never before.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    genre: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    language: ['English'],
    duration: 190,
    releaseDate: '2026-12-18',
    rating: 8.7,
    certification: 'PG-13',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver'],
    formats: ['IMAX 3D', 'RealD 3D', 'HFR 3D'],
    status: 'coming_soon',
    featured: true,
  },
];

// Helper to generate dates for today, tomorrow, and day after
const getTodayStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const generateInitialShows = () => {
  const today = getTodayStr(0);
  const tomorrow = getTodayStr(1);
  const dayAfter = getTodayStr(2);

  return [
    {
      _id: '65f300000000000000000001',
      movie: '65f200000000000000000001', // Dune 2
      theatre: '65f100000000000000000001', // IMAX Regal Grand
      screenName: 'Screen 1 - Grand IMAX Laser',
      showDate: today,
      showTime: '10:30 AM',
      language: 'English',
      format: 'IMAX 3D',
      pricing: { vip: 450, premium: 320, standard: 220 },
      totalSeats: 60,
      availableSeats: 54,
    },
    {
      _id: '65f300000000000000000002',
      movie: '65f200000000000000000001', // Dune 2
      theatre: '65f100000000000000000001',
      screenName: 'Screen 1 - Grand IMAX Laser',
      showDate: today,
      showTime: '02:45 PM',
      language: 'English',
      format: 'IMAX 3D',
      pricing: { vip: 450, premium: 320, standard: 220 },
      totalSeats: 60,
      availableSeats: 50,
    },
    {
      _id: '65f300000000000000000003',
      movie: '65f200000000000000000001', // Dune 2
      theatre: '65f100000000000000000002', // Cinepolis
      screenName: 'Screen 3 - 4DX Atmos',
      showDate: today,
      showTime: '07:00 PM',
      language: 'English',
      format: '2D',
      pricing: { vip: 400, premium: 280, standard: 190 },
      totalSeats: 60,
      availableSeats: 48,
    },
    {
      _id: '65f300000000000000000004',
      movie: '65f200000000000000000002', // Interstellar
      theatre: '65f100000000000000000001', // IMAX Regal Grand
      screenName: 'Screen 2 - 70mm Special',
      showDate: today,
      showTime: '06:15 PM',
      language: 'English',
      format: 'IMAX 3D',
      pricing: { vip: 500, premium: 350, standard: 250 },
      totalSeats: 60,
      availableSeats: 52,
    },
    {
      _id: '65f300000000000000000005',
      movie: '65f200000000000000000002', // Interstellar
      theatre: '65f100000000000000000003', // PVR Directors Cut
      screenName: 'Recliner Screen A',
      showDate: tomorrow,
      showTime: '08:30 PM',
      language: 'English',
      format: '2D',
      pricing: { vip: 550, premium: 400, standard: 300 },
      totalSeats: 60,
      availableSeats: 56,
    },
    {
      _id: '65f300000000000000000006',
      movie: '65f200000000000000000003', // Cyberpunk
      theatre: '65f100000000000000000002',
      screenName: 'Screen 2 - Atmos Neon',
      showDate: today,
      showTime: '09:30 PM',
      language: 'English',
      format: '3D',
      pricing: { vip: 380, premium: 270, standard: 180 },
      totalSeats: 60,
      availableSeats: 58,
    },
    {
      _id: '65f300000000000000000007',
      movie: '65f200000000000000000004', // Oppenheimer
      theatre: '65f100000000000000000001',
      screenName: 'Screen 4 - 4K Precision',
      showDate: tomorrow,
      showTime: '04:00 PM',
      language: 'English',
      format: '2D',
      pricing: { vip: 360, premium: 250, standard: 180 },
      totalSeats: 60,
      availableSeats: 54,
    },
    {
      _id: '65f300000000000000000008',
      movie: '65f200000000000000000001', // Dune 2
      theatre: '65f100000000000000000003',
      screenName: 'Screen 1 - Royal',
      showDate: dayAfter,
      showTime: '05:30 PM',
      language: 'English',
      format: 'IMAX 3D',
      pricing: { vip: 450, premium: 320, standard: 220 },
      totalSeats: 60,
      availableSeats: 60,
    },
  ];
};

// Generates 60 standard theatre seats (Rows A to F, 10 seats each)
// Row A, B: VIP (Recliners)
// Row C, D: Premium
// Row E, F: Standard
export const generateSeatsForShow = (showId, pricing = { vip: 400, premium: 280, standard: 180 }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats = [];

  rows.forEach((rowLetter) => {
    let tier = 'standard';
    let price = pricing.standard || 180;

    if (rowLetter === 'A' || rowLetter === 'B') {
      tier = 'vip';
      price = pricing.vip || 400;
    } else if (rowLetter === 'C' || rowLetter === 'D') {
      tier = 'premium';
      price = pricing.premium || 280;
    }

    for (let col = 1; col <= 10; col++) {
      const seatNumber = `${rowLetter}${col}`;
      // randomly mark a couple seats as booked for realism
      const isPreBooked = (showId === '65f300000000000000000001' && ['A4', 'A5', 'C5', 'C6', 'D5', 'D6'].includes(seatNumber));

      seats.push({
        _id: `seat_${showId}_${seatNumber}`,
        show: showId,
        seatNumber,
        row: rowLetter,
        col,
        tier,
        price,
        status: isPreBooked ? 'booked' : 'available',
        lockedBy: null,
        lockedAt: null,
        bookedBy: isPreBooked ? '65f000000000000000000002' : null,
      });
    }
  });

  return seats;
};
