import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

interface Activity {
  id: number;
  time: string;
  title: string;
  cost: number;
  location: string;
}

interface ItineraryDay {
  id: number;
  dayNumber: number;
  title: string;
  activities: Activity[];
}

interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Trip {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budgetLimit: number;
  budgetSpent: number;
  currency: string;
  expenses: Expense[];
  itinerary: ItineraryDay[];
  collaborators?: SystemUser[];
}

// Admin / Organizer Interfaces
interface SystemUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface TravelPackage {
  id: number;
  title: string;
  destination: string;
  duration: number;
  price: number;
  image: string;
}

interface Booking {
  id: number;
  username: string;
  packageName: string;
  price: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  date: string;
}

interface Destination {
  id: number;
  name: string;
  location: string;
  desc: string;
  image: string;
  tag: string;
}

export const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  
  // Navigation View Switcher State (Defaults to 'welcome' as requested!)
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'itineraries' | 'expenses' | 'settings' | 'admin' | 'organizer' | 'search_results'>('welcome');
  
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [selectedPkgId, setSelectedPkgId] = useState<number | null>(null);
  const [showAddTripForm, setShowAddTripForm] = useState(false);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripDesc, setNewTripDesc] = useState('');
  const [newTripStart, setNewTripStart] = useState('');
  const [newTripEnd, setNewTripEnd] = useState('');
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'collaboration' | 'analytics'>('itinerary');
  const [adminSubTab, setAdminSubTab] = useState<'users' | 'catalogs'>('users');
  const [organizerSubTab, setOrganizerSubTab] = useState<'packages' | 'bookings'>('packages');
  const [newCollabUsername, setNewCollabUsername] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');

  // Weather & Map States
  const [weatherData, setWeatherData] = useState<any>(null);

  // Interactive State Lists
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [destList, setDestList] = useState<Destination[]>([]);
  const [userList, setUserList] = useState<SystemUser[]>([]);
  const [packageList, setPackageList] = useState<TravelPackage[]>([]);
  const [bookingList, setBookingList] = useState<Booking[]>([]);

  // Search Filter States
  const [destSearch, setDestSearch] = useState('');
  const [pkgSearch, setPkgSearch] = useState('');

  // Local Form States
  const [profileName, setProfileName] = useState(user?.username || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Natural tourist spots images carousel states
  const naturalPlaces = [
    { id: 101, name: "Evergreen Pine Forests", image: "/images/darjeeling.jpg", desc: "Explore dense, lush green woodlands stretching across peaceful valley floors.", tag: "Natural Trees" },
    { id: 102, name: "Gulmarg Snowy Range", image: "/images/srinagar.jpg", desc: "Experience towering glacial peaks and pristine white slopes in the Himalayas.", tag: "Ice Mountains" },
    { id: 103, name: "Western Ghats Peaks", image: "/images/munnar.jpg", desc: "Discover rolling green mountains, misty cliffs, and ancient tropical tree canopies.", tag: "Green Mountains" },
    { id: 104, name: "Rohtang Glacier Pass", image: "/images/ladakh.png", desc: "Adventure across snow-covered passes, icy slopes, and frosty pine valleys.", tag: "Ice Mountains" },
    { id: 105, name: "Misty Valley Forests", image: "/images/valley_of_flowers.jpg", desc: "Wander through tranquil mountain valleys with towering peaks and sparkling rivers.", tag: "Valleys & Trees" }
  ];
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [reviewSlideIdx, setReviewSlideIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % naturalPlaces.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [naturalPlaces.length]);

  // Feedback interface & state
  interface FeedbackItem {
    id: number;
    name: string;
    rating: number;
    comment: string;
    date: string;
    tag: string;
    helpfulCount: number;
  }
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([
    { id: 1, name: 'Kilaparthi Mohan', rating: 5, comment: 'This travel planner dashboard is fantastic! The interactive schedules helped me budget my Kerala trip flawlessly.', date: '2026-07-09', tag: 'Expert Planner', helpfulCount: 14 },
    { id: 2, name: 'Priya Sharma', rating: 4, comment: 'Excellent tour packages. Booking with the simulated organizer flow was extremely straightforward!', date: '2026-07-08', tag: 'Frequent Traveler', helpfulCount: 8 },
    { id: 3, name: 'Anish Raj', rating: 5, comment: 'The dark theme and cinematic visual design feel super premium. 10/10 experience!', date: '2026-07-07', tag: 'Nature Explorer', helpfulCount: 22 }
  ]);

  useEffect(() => {
    if (feedbackList.length === 0) return;
    const timer = setInterval(() => {
      setReviewSlideIdx((prev) => (prev + 1) % feedbackList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [feedbackList.length]);
  const [newFeedbackName, setNewFeedbackName] = useState('');
  const [newFeedbackRating, setNewFeedbackRating] = useState(5);
  const [newFeedbackComment, setNewFeedbackComment] = useState('');
  const [isBackendOffline, setIsBackendOffline] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  const setFormError = (msg: string | null) => {
    if (msg) {
      showToast(msg, 'error');
    } else {
      setToastMessage(null);
    }
  };

  const alert = (msg: string) => {
    if (!msg) return;
    const lower = msg.toLowerCase();
    const isError = lower.includes('fail') || lower.includes('error') || lower.includes('invalid') || lower.includes('check') || lower.includes('unreachable') || lower.includes('offline');
    showToast(msg, isError ? 'error' : 'success');
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  useEffect(() => {
    const handleDocumentClick = () => {
      setActiveDayDropdownId(null);
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackName.trim() || !newFeedbackComment.trim()) return;

    const newFeed: FeedbackItem = {
      id: Date.now(),
      name: newFeedbackName,
      rating: newFeedbackRating,
      comment: newFeedbackComment,
      date: new Date().toISOString().split('T')[0],
      tag: newFeedbackRating >= 5 ? 'Verified Guide' : 'Traveler',
      helpfulCount: 0
    };

    setFeedbackList((prev) => [newFeed, ...prev]);
    setNewFeedbackName('');
    setNewFeedbackRating(5);
    setNewFeedbackComment('');
    showToast('Thank you for your valuable feedback! It has been successfully posted on our testimonials wall.', 'success');
  };

  const handleLikeFeedback = (id: number) => {
    setFeedbackList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, helpfulCount: f.helpfulCount + 1 } : f))
    );
  };

  // New Expense Form States
  const [expenseTripId, setExpenseTripId] = useState<number>(1);
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenseCategory, setExpenseCategory] = useState<string>('ACCOMMODATION');
  const [expenseDesc, setExpenseDesc] = useState<string>('');
  const [expenseDate, setExpenseDate] = useState<string>('');

  // New Itinerary Day Form States
  const [itinTripId, setItinTripId] = useState<number>(1);
  const [newDayTitle, setNewDayTitle] = useState<string>('');

  // New Activity Form States
  const [itinDayId, setItinDayId] = useState<number>(0);
  const [actTripId, setActTripId] = useState<number>(0);
  const [actTitle, setActTitle] = useState<string>('');
  const [timeHour, setTimeHour] = useState<string>('09');
  const [timeMinute, setTimeMinute] = useState<string>('00');
  const [timePeriod, setTimePeriod] = useState<string>('AM');
  const [endTimeHour, setEndTimeHour] = useState<string>('10');
  const [endTimeMinute, setEndTimeMinute] = useState<string>('00');
  const [endTimePeriod, setEndTimePeriod] = useState<string>('AM');
  const [activeDayDropdownId, setActiveDayDropdownId] = useState<number | null>(null);
  const [actCost, setActCost] = useState<string>('');
  const [actLocation, setActLocation] = useState<string>('');

  // Admin: New User Form States
  const [newUsername, setNewUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('ROLE_USER');

  // Admin: New Destination Form States
  const [newDestName, setNewDestName] = useState('');
  const [newDestLocation, setNewDestLocation] = useState('');
  const [newDestDesc, setNewDestDesc] = useState('');
  const [newDestImage, setNewDestImage] = useState('/images/taj_mahal.png');
  const [newDestTag, setNewDestTag] = useState('Heritage');

  // Organizer: New Package Form States
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDest, setPkgDest] = useState('');
  const [pkgDuration, setPkgDuration] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgImage, setPkgImage] = useState('/images/jaipur.png');

  // Organizer: Booking Simulator States
  const [simClientName, setSimClientName] = useState('');
  const [simPkgId, setSimPkgId] = useState<number>(5001);

  // Helpers to format dates and times
  const formatTimeToAMPM = (dateStr: string) => {
    if (!dateStr) return '09:00 AM';
    try {
      const parts = dateStr.split('T');
      if (parts.length < 2) return '09:00 AM';
      const timeParts = parts[1].split(':');
      let hours = parseInt(timeParts[0]);
      const minutes = timeParts[1] || '00';
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      const hoursStr = hours < 10 ? '0' + hours : hours;
      return `${hoursStr}:${minutes} ${ampm}`;
    } catch (e) {
      return '09:00 AM';
    }
  };

  const convertTimeTo24h = (timeStr: string) => {
    try {
      const clean = timeStr.trim().toLowerCase();
      if (!clean.includes('am') && !clean.includes('pm')) {
        const parts = clean.split(':');
        let h = parseInt(parts[0]);
        let m = parseInt(parts[1] || '00');
        const hStr = h < 10 ? '0' + h : h.toString();
        const mStr = m < 10 ? '0' + m : m.toString();
        return `${hStr}:${mStr}`;
      }
      const parts = timeStr.trim().split(' ');
      const timeParts = parts[0].split(':');
      let hours = parseInt(timeParts[0]);
      const minutes = timeParts[1] || '00';
      const ampm = parts[1] ? parts[1].toUpperCase() : (hours >= 12 ? 'PM' : 'AM');
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      const hoursStr = hours < 10 ? '0' + hours : hours.toString();
      const minsVal = parseInt(minutes);
      const minsStr = minsVal < 10 ? '0' + minsVal : minsVal.toString();
      return `${hoursStr}:${minsStr}`;
    } catch (e) {
      return '09:00';
    }
  };

  const getMockImageForPlace = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('taj') || n.includes('agra')) return '/images/taj_mahal.png';
    if (n.includes('jaipur') || n.includes('pink')) return '/images/jaipur.png';
    if (n.includes('alleppey') || n.includes('backwater') || n.includes('kerala')) return '/images/kerala.png';
    if (n.includes('goa')) return '/images/goa.png';
    if (n.includes('ladakh')) return '/images/ladakh.png';
    if (n.includes('mumbai') || n.includes('gateway')) return '/images/mumbai.png';
    if (n.includes('hampi')) return '/images/hampi.jpg';
    if (n.includes('srinagar') || n.includes('dal')) return '/images/srinagar.jpg';
    if (n.includes('darjeeling') || n.includes('tea')) return '/images/darjeeling.jpg';
    if (n.includes('kutch') || n.includes('rann')) return '/images/kutch.jpg';
    if (n.includes('meenakshi') || n.includes('madurai')) return '/images/madurai.jpg';
    if (n.includes('flowers') || n.includes('valley')) return '/images/valley_of_flowers.jpg';
    if (n.includes('rishikonda') || n.includes('vizag')) return '/images/rishikonda.jpg';
    if (n.includes('kailasagiri')) return '/images/kailasagiri.jpg';
    if (n.includes('coffee') || n.includes('araku')) return '/images/araku_coffee.jpg';
    if (n.includes('caves') || n.includes('borra')) return '/images/borra_caves.jpg';
    if (n.includes('munnar')) return '/images/munnar.jpg';
    if (n.includes('varkala')) return '/images/varkala.jpg';
    if (n.includes('lalbagh') || n.includes('glass')) return '/images/lalbagh.jpg';
    if (n.includes('nandi') || n.includes('sunrise')) return '/images/nandi_hills.jpg';
    return '/images/taj_mahal.png';
  };

  const getMockTagForPlace = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('taj') || n.includes('hampi') || n.includes('temple')) return 'Heritage';
    if (n.includes('kerala') || n.includes('lake') || n.includes('valley') || n.includes('tea')) return 'Nature';
    if (n.includes('goa') || n.includes('beach') || n.includes('gardens')) return 'Leisure';
    if (n.includes('ladakh') || n.includes('nandi') || n.includes('caves')) return 'Adventure';
    if (n.includes('jaipur')) return 'Royal';
    return 'Nature';
  };

  // Sync state lists with backend DB
  const fetchTripsAndDestinations = async () => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;
    try {
      setIsBackendOffline(false);
      // Fetch destinations
      const destRes = await fetch('http://localhost:8010/api/destinations', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      
      if (destRes.status === 401 || destRes.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      let dests = await destRes.json();
      
      // Auto seed destinations if DB is empty or has old unsplash photos
      const hasOldPhotos = dests.some((d: any) => !d.image || d.image.includes('unsplash.com') || d.image.includes('photo-1564507592333'));
      if (dests.length < 20 || hasOldPhotos) {
        // Clear out any incomplete database destinations first
        for (const existing of dests) {
          await fetch(`http://localhost:8010/api/destinations/${existing.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${activeToken}` }
          });
        }
        
        const seedDests = [
          { name: 'Taj Mahal, Agra', location: 'Uttar Pradesh', description: 'A breathtaking monument of white marble built by Shah Jahan.', image: '/images/taj_mahal.png', tag: 'Heritage' },
          { name: 'Pink City, Jaipur', location: 'Rajasthan', description: 'Home to the magnificent Hawa Mahal, Amer Fort, and historic colorful bazaars.', image: '/images/jaipur.png', tag: 'Royal' },
          { name: 'Backwaters, Alleppey', location: 'Kerala', description: 'A serene network of lagoons and palm-fringed houseboats.', image: '/images/kerala.png', tag: 'Nature' },
          { name: 'Goa Beaches', location: 'Goa', description: 'Sun-kissed beaches, thrilling water sports, and relaxing coastal lifestyle.', image: '/images/goa.png', tag: 'Leisure' },
          { name: 'Ladakh Mountains', location: 'Jammu & Kashmir', description: 'Breathtaking mountain passes and crystal clear high-altitude lakes.', image: '/images/ladakh.png', tag: 'Adventure' },
          { name: 'Gateway of India', location: 'Mumbai', description: 'The iconic stone arch monument overlooking the Arabian Sea.', image: '/images/mumbai.png', tag: 'Metropolis' },
          { name: 'Hampi Ruins', location: 'Karnataka', description: 'Ancient stone temples and magnificent monuments from the Vijayanagara Empire.', image: '/images/hampi.jpg', tag: 'Heritage' },
          { name: 'Dal Lake, Srinagar', location: 'Jammu & Kashmir', description: 'Relax on cozy wooden Shikara boats surrounded by majestic misty mountains.', image: '/images/srinagar.jpg', tag: 'Nature' },
          { name: 'Tea Gardens, Darjeeling', location: 'West Bengal', description: 'Vast rolling green tea fields overlooking the Kanchenjunga mountains.', image: '/images/darjeeling.jpg', tag: 'Leisure' },
          { name: 'White Rann of Kutch', location: 'Gujarat', description: 'A vast, breathtaking white salt desert stretching as far as the eye can see.', image: '/images/kutch.jpg', tag: 'Adventure' },
          { name: 'Meenakshi Temple', location: 'Madurai', description: 'Historic temple complex with towering, colorful, intricate sculptured gateways.', image: '/images/madurai.jpg', tag: 'Heritage' },
          { name: 'Valley of Flowers', location: 'Uttarakhand', description: 'A stunning National Park carpeted in vibrant high-altitude alpine blooms.', image: '/images/valley_of_flowers.jpg', tag: 'Nature' },
          { name: 'Rishikonda Beach, Vizag', location: 'Andhra Pradesh', description: 'Beautiful golden sandy beach known for water sports and scenic hills.', image: '/images/rishikonda.jpg', tag: 'Leisure' },
          { name: 'Kailasagiri, Vizag', location: 'Andhra Pradesh', description: 'Scenic hilltop park offering spectacular panoramic views of the ocean.', image: '/images/kailasagiri.jpg', tag: 'Nature' },
          { name: 'Coffee Gardens, Araku', location: 'Andhra Pradesh', description: 'Vast organic coffee plantations nestled inside the beautiful valley.', image: '/images/araku_coffee.jpg', tag: 'Nature' },
          { name: 'Borra Caves, Araku', location: 'Andhra Pradesh', description: 'Deep limestone caves featuring unique, ancient stalactite formations.', image: '/images/borra_caves.jpg', tag: 'Adventure' },
          { name: 'Munnar Tea Hills', location: 'Kerala', description: 'Breathtaking rolling hills covered in lush, bright green tea plants.', image: '/images/munnar.jpg', tag: 'Nature' },
          { name: 'Varkala Cliff Beach', location: 'Kerala', description: 'Unique red-sandstone cliffs bordering the beautiful Arabian Sea.', image: '/images/varkala.jpg', tag: 'Leisure' },
          { name: 'Lalbagh Glass House', location: 'Bangalore', description: 'Historic 240-acre botanical garden containing a stunning glasshouse.', image: '/images/lalbagh.jpg', tag: 'Leisure' },
          { name: 'Nandi Hills Sunrise', location: 'Bangalore', description: 'Popular hilltop fortress known for stunning sunrises above the clouds.', image: '/images/nandi_hills.jpg', tag: 'Adventure' }
        ];

        for (const d of seedDests) {
          await fetch('http://localhost:8010/api/destinations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${activeToken}`
            },
            body: JSON.stringify({
              name: d.name,
              location: d.location,
              description: d.description,
              latitude: 12.97,
              longitude: 77.59,
              image: d.image,
              tag: d.tag
            })
          });
        }
        const refetchDest = await fetch('http://localhost:8010/api/destinations', {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        dests = await refetchDest.json();
      }

      // Filter duplicates on client side by name
      const uniqueDests: any[] = [];
      const seenNames = new Set<string>();
      for (const d of dests) {
        if (!seenNames.has(d.name)) {
          seenNames.add(d.name);
          uniqueDests.push(d);
        }
      }

      setDestList(uniqueDests.map((d: any) => ({
        id: d.id,
        name: d.name,
        location: d.location,
        desc: d.description,
        image: d.image || getMockImageForPlace(d.name),
        tag: d.tag || getMockTagForPlace(d.name)
      })));

      // Fetch trips
      const tripsRes = await fetch('http://localhost:8010/api/trips', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      let trips = await tripsRes.json();
      
      // Auto seed default trips if DB is empty
      if (trips.length === 0) {
        const seedTripRes = await fetch('http://localhost:8010/api/trips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify({
            title: "Agra & Jaipur Classic",
            description: "Discover the rich Mughal architecture of Agra and the royal palace forts of Rajasthan.",
            startDate: "2026-10-12",
            endDate: "2026-10-18"
          })
        });
        const seededTrip = await seedTripRes.json();
        
        const seedItinRes = await fetch(`http://localhost:8010/api/trips/${seededTrip.id}/itineraries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify({
            dayNumber: 1,
            date: "2026-10-12"
          })
        });
        const seededItin = await seedItinRes.json();
        
        await fetch(`http://localhost:8010/api/itineraries/${seededItin.id}/activities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify({
            title: "Taj Mahal Sunrise Visit",
            description: "Taj Mahal Complex",
            startTime: "2026-10-12T05:30:00",
            endTime: "2026-10-12T08:30:00",
            cost: 1300
          })
        });
        
        const refetchTrips = await fetch('http://localhost:8010/api/trips', {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        trips = await refetchTrips.json();
      }

      // Map backend trips to state arrays
      const mappedTrips: Trip[] = [];
      for (const t of trips) {
        const itinRes = await fetch(`http://localhost:8010/api/trips/${t.id}/itineraries`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        const itins = await itinRes.json();
        
        const mappedItin: ItineraryDay[] = [];
        for (const itin of itins) {
          const actRes = await fetch(`http://localhost:8010/api/itineraries/${itin.id}/activities`, {
            headers: { 'Authorization': `Bearer ${activeToken}` }
          });
          const acts = await actRes.json();
          mappedItin.push({
            id: itin.id,
            dayNumber: itin.dayNumber,
            title: itin.title || `Schedule for Day ${itin.dayNumber}`,
            activities: acts.map((a: any) => ({
              id: a.id,
              time: `${formatTimeToAMPM(a.startTime)} - ${formatTimeToAMPM(a.endTime || a.startTime)}`,
              title: a.title,
              cost: a.cost || 0,
              location: a.description || 'Location TBD'
            }))
          });
        }
        
        // Fetch budget limit from backend
        let budgetLimit = 85000;
        let currency = '₹';
        try {
          const budgetRes = await fetch(`http://localhost:8010/api/budgets/trip/${t.id}`, {
            headers: { 'Authorization': `Bearer ${activeToken}` }
          });
          if (budgetRes.ok) {
            const budgetData = await budgetRes.json();
            if (budgetData && budgetData.totalLimit != null) {
              budgetLimit = budgetData.totalLimit;
              currency = budgetData.currency === 'INR' ? '₹' : (budgetData.currency || '₹');
            }
          }
        } catch (err) {
          console.error("Error fetching budget:", err);
        }

        // Fetch expenses from backend
        let expensesList: Expense[] = [];
        try {
          const expRes = await fetch(`http://localhost:8010/api/expenses/trip/${t.id}`, {
            headers: { 'Authorization': `Bearer ${activeToken}` }
          });
          if (expRes.ok) {
            const expData = await expRes.json();
            expensesList = expData.map((e: any) => ({
              id: e.id,
              amount: e.amount,
              category: e.category,
              description: e.description,
              date: e.expenseDate
            }));
          }
        } catch (err) {
          console.error("Error fetching expenses:", err);
        }

        mappedTrips.push({
          id: t.id,
          title: t.title,
          description: t.description,
          startDate: t.startDate,
          endDate: t.endDate,
          budgetLimit, 
          budgetSpent: expensesList.reduce((sum, e) => sum + e.amount, 0),
          currency,
          expenses: expensesList, 
          itinerary: mappedItin,
          collaborators: t.collaborators || []
        });
      }
      setMyTrips(mappedTrips);
    } catch (err) {
      console.error(err);
      setIsBackendOffline(true);
    }
  };

  // Weather Loader Effect
  useEffect(() => {
    if (!selectedTripId) {
      setWeatherData(null);
      return;
    }
    const currentTrip = myTrips.find(t => t.id === selectedTripId);
    if (!currentTrip) return;

    const fetchWeather = async () => {
      try {
        const activeToken = token || localStorage.getItem('token');
        const res = await fetch(`http://localhost:8010/api/weather?city=${encodeURIComponent(currentTrip.title)}`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWeatherData(data);
        }
      } catch (err) {
        console.error('Failed to load weather:', err);
      }
    };
    fetchWeather();
  }, [selectedTripId, myTrips]);

  // Destination Details Weather Loader Effect
  const [destWeatherData, setDestWeatherData] = useState<any>(null);

  useEffect(() => {
    if (!selectedPkgId) {
      setDestWeatherData(null);
      return;
    }
    const dest = destList.find(d => d.id === selectedPkgId);
    if (!dest) return;

    const fetchDestWeather = async () => {
      try {
        const activeToken = token || localStorage.getItem('token');
        const city = dest.name.split(',')[1]?.trim() || dest.name;
        const res = await fetch(`http://localhost:8010/api/weather?city=${encodeURIComponent(city)}`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDestWeatherData(data);
        }
      } catch (err) {
        console.error('Failed to load destination weather:', err);
      }
    };
    fetchDestWeather();
  }, [selectedPkgId, destList]);

  // Active Trips Weather List State
  const [tripsWeather, setTripsWeather] = useState<{[key: number]: any}>({});

  useEffect(() => {
    if (myTrips.length === 0) return;

    const fetchAllTripsWeather = async () => {
      const activeToken = token || localStorage.getItem('token');
      const weatherMap: {[key: number]: any} = {};

      for (const trip of myTrips) {
        if (tripsWeather[trip.id]) continue;
        try {
          const res = await fetch(`http://localhost:8010/api/weather?city=${encodeURIComponent(trip.title)}`, {
            headers: { 'Authorization': `Bearer ${activeToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            weatherMap[trip.id] = data;
          }
        } catch (err) {
          console.error(`Failed to load weather for trip ${trip.id}:`, err);
        }
      }
      if (Object.keys(weatherMap).length > 0) {
        setTripsWeather(prev => ({ ...prev, ...weatherMap }));
      }
    };

    fetchAllTripsWeather();
  }, [myTrips, token]);

  // CSV Exporter Trigger
  const handleExportCsv = async (tripId: number) => {
    try {
      const res = await fetch(`http://localhost:8010/api/trips/${tripId}/export/csv`, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trip_report_${tripId}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Failed to generate CSV export.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // PDF Exporter Trigger
  const handleExportPdf = async (tripId: number) => {
    try {
      const res = await fetch(`http://localhost:8010/api/trips/${tripId}/export/pdf`, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trip_summary_${tripId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Failed to generate PDF export.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  const navigateView = (viewName: string) => {
    navigate(`/dashboard?view=${viewName}`);
  };

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      const searchParams = new URLSearchParams(location.search);
      const view = searchParams.get('view');
      const searchVal = searchParams.get('search');
      
      if (view) {
        setCurrentView(view as any);
        setDestSearch('');
      } else if (searchVal !== null) {
        setDestSearch(searchVal);
        setCurrentView('search_results');
      } else {
        setDestSearch('');
        setCurrentView('welcome');
      }
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const activeToken = token || localStorage.getItem('token');
    if (activeToken) {
      fetchTripsAndDestinations();
    }
    
    // Seed default system stats
    const defaultUsers: SystemUser[] = [
      { id: 1001, username: 'adminuser', email: 'admin@example.com', role: 'ROLE_ADMIN' },
      { id: 1002, username: 'organizeruser', email: 'organizer@example.com', role: 'ROLE_ORGANIZER' },
      { id: 1003, username: 'testuser', email: 'testuser@example.com', role: 'ROLE_USER' },
      { id: 1004, username: 'Mohan', email: 'kilaparthimohan93@gmail.com', role: 'ROLE_USER' }
    ];

    const defaultPackages: TravelPackage[] = [
      { id: 5001, title: 'Agra Heritage Expedition', destination: 'Agra', duration: 4, price: 18000, image: '/images/taj_mahal.png' },
      { id: 5002, title: 'Jaipur Forts Explorer', destination: 'Jaipur', duration: 5, price: 22000, image: '/images/jaipur.png' },
      { id: 5003, title: 'Alleppey Backwater Retreat', destination: 'Kerala', duration: 6, price: 32000, image: '/images/kerala.png' },
      { id: 5004, title: 'Varkala Cliff Escapade', destination: 'Kerala', duration: 4, price: 15000, image: '/images/varkala.jpg' }
    ];

    const defaultBookings: Booking[] = [
      { id: 6001, username: 'Mohan', packageName: 'Alleppey Backwater Retreat', price: 32000, status: 'Pending', date: '2026-07-09' },
      { id: 6002, username: 'testuser', packageName: 'Jaipur Forts Explorer', price: 22000, status: 'Confirmed', date: '2026-07-08' },
      { id: 6003, username: 'Mohan', packageName: 'Varkala Cliff Escapade', price: 15000, status: 'Cancelled', date: '2026-07-07' }
    ];

    const storedBookings = JSON.parse(localStorage.getItem('simulated_bookings') || '[]');
    setUserList(defaultUsers);
    setPackageList(defaultPackages);
    setBookingList([...storedBookings, ...defaultBookings]);

    setProfileName(user?.username || '');
    setProfileEmail(user?.email || '');
    
    const darkThemeActive = document.body.classList.contains('dark-theme');
    setIsDarkMode(darkThemeActive);
  }, [token, user]);

  useEffect(() => {
    if (myTrips.length > 0) {
      if (!myTrips.some(t => t.id === itinTripId)) {
        setItinTripId(myTrips[0].id);
      }
      if (!myTrips.some(t => t.id === expenseTripId)) {
        setExpenseTripId(myTrips[0].id);
      }
    }
  }, [myTrips, itinTripId, expenseTripId]);

  // Trip Image Mapping for vertical active trips
  const tripImages: { [key: number]: string } = {
    1: '/images/jaipur.png',
    2: '/images/kerala.png',
    3: '/images/goa.png',
    4: '/images/ladakh.png',
    5: '/images/mumbai.png',
    6: '/images/hampi.jpg'
  };

  const selectedTrip = myTrips.find((t) => t.id === selectedTripId) || null;
  const budgetPercent = selectedTrip ? Math.min(Math.round((selectedTrip.budgetSpent / selectedTrip.budgetLimit) * 100), 100) : 0;

  // Selected package lookup (combines destinations & packages catalog)
  const selectedPackageDest = destList.find((d) => d.id === selectedPkgId) || null;

  const getProgressBarColorClass = (percent: number) => {
    if (percent > 85) return 'bg-danger';
    if (percent > 60) return 'bg-warning';
    return 'bg-success';
  };

  // Interactive Form Handlers
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      showToast('Profile details updated successfully (simulated locally)!', 'success');
    }
  };

  const handleToggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  };

  const handleAddDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const trip = myTrips.find(t => t.id === itinTripId);
      if (!trip) return;
      const nextDayNum = trip.itinerary.length + 1;
      
      const targetDate = new Date(trip.startDate);
      targetDate.setDate(targetDate.getDate() + nextDayNum - 1);
      const dateString = targetDate.toISOString().split('T')[0];

      const res = await fetch(`http://localhost:8010/api/trips/${itinTripId}/itineraries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dayNumber: nextDayNum,
          date: dateString,
          title: newDayTitle || `Schedule for Day ${nextDayNum}`
        })
      });
      
      if (res.ok) {
        const newlyAddedDay = await res.json();
        await fetchTripsAndDestinations();
        setNewDayTitle('');
        setActTripId(itinTripId);
        setItinDayId(newlyAddedDay.id);
        showToast('New travel day successfully added to your itinerary!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      setFormError('Failed to append new itinerary travel day. The coordination API is currently unreachable.');
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itinDayId || !actTitle.trim() || !token) return;
    try {
      const costNum = parseFloat(actCost) || 0;
      const mockTimeStr = `${timeHour}:${timeMinute} ${timePeriod}`;
      const time24h = convertTimeTo24h(mockTimeStr);
      
      const endMockTimeStr = `${endTimeHour}:${endTimeMinute} ${endTimePeriod}`;
      const endTime24h = convertTimeTo24h(endMockTimeStr);
      
      const res = await fetch(`http://localhost:8010/api/itineraries/${itinDayId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: actTitle,
          description: actLocation || 'Location TBD',
          startTime: `2026-10-12T${time24h}:00`,
          endTime: `2026-10-12T${endTime24h}:00`,
          cost: costNum
        })
      });

      if (res.ok) {
        await fetchTripsAndDestinations();
        setActTitle('');
        setTimeHour('09');
        setTimeMinute('00');
        setTimePeriod('AM');
        setEndTimeHour('10');
        setEndTimeMinute('00');
        setEndTimePeriod('AM');
        setActCost('');
        setActLocation('');
        showToast('Activity successfully scheduled in itinerary day timeline!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      setFormError('Failed to log itinerary day activity. Please verify connection and cost parameters.');
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle.trim() || !newTripStart || !newTripEnd || !token) {
      showToast('Please fill in all fields with valid details.', 'error');
      return;
    }
    try {
      const res = await fetch('http://localhost:8010/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTripTitle,
          description: newTripDesc || 'Personal Vacation',
          startDate: newTripStart,
          endDate: newTripEnd
        })
      });
      if (res.ok) {
        await fetchTripsAndDestinations();
        setNewTripTitle('');
        setNewTripDesc('');
        setNewTripStart('');
        setNewTripEnd('');
        setShowAddTripForm(false);
        showToast('New travel trip created successfully!', 'success');
      }
    } catch (err: any) {
      console.error(err);
      setFormError('Could not register a new trip plan in the database. Please check date selections.');
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    if (!token) return;
    if (confirm('Are you sure you want to delete this trip plan and all its scheduled itineraries from the database?')) {
      try {
        const res = await fetch(`http://localhost:8010/api/trips/${tripId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          if (selectedTripId === tripId) setSelectedTripId(null);
          await fetchTripsAndDestinations();
          showToast('Trip plan successfully deleted from database.', 'success');
        }
      } catch (err: any) {
        console.error(err);
        setFormError('Failed to delete the trip plan from the database server.');
      }
    }
  };

  const handleLogExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeToken = token || localStorage.getItem('token');
    const amountNum = parseFloat(expenseAmount);
    if (isNaN(amountNum) || amountNum <= 0 || !expenseDesc.trim()) {
      showToast('Please provide a valid amount and description.', 'error');
      return;
    }
    if (!activeToken) return;

    try {
      const res = await fetch(`http://localhost:8010/api/expenses/trip/${expenseTripId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          amount: amountNum,
          category: expenseCategory,
          description: expenseDesc,
          expenseDate: expenseDate || new Date().toISOString().split('T')[0]
        })
      });
      if (res.ok) {
        await fetchTripsAndDestinations();
        setExpenseAmount('');
        setExpenseDesc('');
        setExpenseDate('');
        showToast('Expense successfully logged to database!', 'success');
      } else {
        showToast('Failed to log expense.', 'error');
      }
    } catch (err: any) {
      console.error(err);
      setFormError('Failed to log new expense bill. The financial service might be offline.');
    }
  };

  const handleDeleteExpense = async (_tripId: number, expId: number, _amount: number) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;
    if (confirm('Are you sure you want to delete this expense bill?')) {
      try {
        const res = await fetch(`http://localhost:8010/api/expenses/${expId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (res.ok) {
          await fetchTripsAndDestinations();
          showToast('Expense deleted successfully.', 'success');
        } else {
          showToast('Failed to delete expense.', 'error');
        }
      } catch (err: any) {
        console.error(err);
        setFormError('Failed to delete expense transaction item.');
      }
    }
  };

  const handleDeleteActivity = async (actId: number) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;
    if (confirm('Are you sure you want to delete this activity from the day timeline?')) {
      try {
        const res = await fetch(`http://localhost:8010/api/activities/${actId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (res.ok) {
          await fetchTripsAndDestinations();
          showToast('Activity deleted successfully from itinerary.', 'success');
        } else {
          setFormError('Failed to delete the activity from the server.');
        }
      } catch (err: any) {
        console.error(err);
        setFormError('Failed to delete activity. The itinerary API is currently unreachable.');
      }
    }
  };

  const handleDeleteDay = async (dayId: number) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;
    if (confirm('Are you sure you want to delete this travel day and ALL its logged activities? This action cannot be undone.')) {
      try {
        const res = await fetch(`http://localhost:8010/api/itineraries/${dayId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (res.ok) {
          if (itinDayId === dayId) setItinDayId(0);
          await fetchTripsAndDestinations();
          showToast('Travel day and scheduled activities successfully deleted.', 'success');
        } else {
          setFormError('Failed to delete the travel day from the server.');
        }
      } catch (err: any) {
        console.error(err);
        setFormError('Failed to delete day. The itinerary API is currently unreachable.');
      }
    }
  };

  const handleEditDay = async (dayId: number, currentTitle: string) => {
    const newTitle = prompt('Enter new title for this travel day:', currentTitle);
    if (newTitle === null) return;
    if (newTitle.trim() === '') {
      showToast('Day title cannot be empty.', 'error');
      return;
    }

    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;

    try {
      const res = await fetch(`http://localhost:8010/api/itineraries/${dayId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          title: newTitle.trim()
        })
      });

      if (res.ok) {
        await fetchTripsAndDestinations();
        showToast('Itinerary day title updated successfully.', 'success');
      } else {
        setFormError('Failed to update itinerary day title.');
      }
    } catch (err: any) {
      console.error(err);
      setFormError('Failed to edit day. The itinerary API is currently unreachable.');
    }
  };

  const handleUpdateBudgetLimit = async (tripId: number) => {
    const activeToken = token || localStorage.getItem('token');
    const limitNum = parseFloat(newBudgetLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      showToast('Please provide a valid positive budget limit.', 'error');
      return;
    }
    if (!activeToken) return;

    try {
      const res = await fetch(`http://localhost:8010/api/budgets/trip/${tripId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          totalLimit: limitNum,
          currency: 'INR'
        })
      });
      if (res.ok) {
        await fetchTripsAndDestinations();
        setNewBudgetLimit('');
        alert('Budget limit updated successfully!');
      } else {
        alert('Failed to update budget limit.');
      }
    } catch (err: any) {
      console.error(err);
      setFormError('Failed to update trip budget limit threshold.');
    }
  };

  const handleAddCollaborator = async (e: React.FormEvent, tripId: number) => {
    e.preventDefault();
    const activeToken = token || localStorage.getItem('token');
    if (!newCollabUsername.trim()) return;
    if (!activeToken) return;

    try {
      const res = await fetch(`http://localhost:8010/api/trips/${tripId}/collaborators?username=${newCollabUsername}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });
      if (res.ok) {
        await fetchTripsAndDestinations();
        setNewCollabUsername('');
        alert('Co-planner added successfully!');
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Failed to add co-planner.');
      }
    } catch (err: any) {
      console.error(err);
      setFormError('Failed to add co-planner collaborator. The target user might not exist in the database.');
    }
  };

  const handleRemoveCollaborator = async (tripId: number, userId: number) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;
    if (confirm('Are you sure you want to remove this co-planner?')) {
      try {
        const res = await fetch(`http://localhost:8010/api/trips/${tripId}/collaborators/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${activeToken}`
          }
        });
        if (res.ok) {
          await fetchTripsAndDestinations();
          alert('Co-planner removed successfully.');
        } else {
          alert('Failed to remove co-planner.');
        }
      } catch (err: any) {
        console.error(err);
        setFormError('Failed to remove co-planner collaborator from this trip.');
      }
    }
  };

  // ADMIN Handlers
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newUserEmail.trim()) return;

    const newUser: SystemUser = {
      id: Date.now(),
      username: newUsername,
      email: newUserEmail,
      role: newUserRole
    };

    setUserList((prev) => [...prev, newUser]);
    setNewUsername('');
    setNewUserEmail('');
    alert('New system user registered successfully!');
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to remove this user from the system registry?')) {
      setUserList((prev) => prev.filter((u) => u.id !== userId));
      alert('User deleted.');
    }
  };

  const handleToggleUserRole = (userId: number) => {
    setUserList((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          let nextRole = 'ROLE_USER';
          if (u.role === 'ROLE_USER') nextRole = 'ROLE_ORGANIZER';
          else if (u.role === 'ROLE_ORGANIZER') nextRole = 'ROLE_ADMIN';
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
    alert('User security role changed successfully!');
  };

  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeToken = token || localStorage.getItem('token');
    if (!newDestName.trim() || !newDestLocation.trim() || !newDestDesc.trim()) {
      alert("Please fill in all required destination fields.");
      return;
    }
    if (!activeToken) {
      alert("Authentication error: No session token found. Please log in again.");
      return;
    }
    try {
      const res = await fetch('http://localhost:8010/api/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          name: newDestName,
          location: newDestLocation,
          description: newDestDesc,
          latitude: 12.97,
          longitude: 77.59,
          image: newDestImage,
          tag: newDestTag
        })
      });
      if (res.ok) {
        await fetchTripsAndDestinations();
        setNewDestName('');
        setNewDestLocation('');
        setNewDestDesc('');
        alert('New destination successfully added to database!');
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to add destination: ${errData.message || 'Server error ' + res.status}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to the backend server. Please verify it is running on port 8010.");
    }
  };

  const handleDeleteDestination = async (destId: number) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) {
      alert("Authentication error: No session token found. Please log in again.");
      return;
    }
    if (confirm('Are you sure you want to delete this place from the database?')) {
      try {
        const res = await fetch(`http://localhost:8010/api/destinations/${destId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });
        if (res.ok) {
          await fetchTripsAndDestinations();
          alert('Destination deleted successfully.');
        } else {
          alert('Failed to delete destination from database.');
        }
      } catch (err) {
        console.error(err);
        alert("Failed to connect to the backend server.");
      }
    }
  };

  // ORGANIZER Handlers
  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const durationNum = parseInt(pkgDuration);
    const priceNum = parseFloat(pkgPrice);
    if (!pkgTitle.trim() || !pkgDest.trim() || isNaN(durationNum) || isNaN(priceNum)) {
      alert('Please fill out all fields with valid details.');
      return;
    }

    const newPkg: TravelPackage = {
      id: Date.now(),
      title: pkgTitle,
      destination: pkgDest,
      duration: durationNum,
      price: priceNum,
      image: pkgImage
    };

    setPackageList((prev) => [newPkg, ...prev]);
    setPkgTitle('');
    setPkgDest('');
    setPkgDuration('');
    setPkgPrice('');
    alert('Travel package created successfully!');
  };

  const handleDeletePackage = (pkgId: number) => {
    setPackageList((prev) => prev.filter((p) => p.id !== pkgId));
  };

  const handleSimulateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simClientName.trim()) return;

    const selectedPkg = packageList.find((p) => p.id === simPkgId);
    if (!selectedPkg) return;

    const newBooking: Booking = {
      id: Date.now(),
      username: simClientName,
      packageName: selectedPkg.title,
      price: selectedPkg.price,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setBookingList((prev) => [newBooking, ...prev]);
    setSimClientName('');
    alert('Simulated booking request logged successfully! Go to Bookings tab to review/confirm.');
  };

  const handleBookPackage = (pkg: Destination) => {
    window.open(`/checkout?package=${encodeURIComponent(pkg.name + ' Package Tour')}&price=22500`, '_blank');
  };

  const handleUpdateBookingStatus = (bookingId: number, nextStatus: 'Confirmed' | 'Cancelled') => {
    setBookingList((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
    alert(`Booking status changed to ${nextStatus}!`);
  };

  // Filters search lists
  const filteredDestinations = destList.filter(
    (d) =>
      d.name.toLowerCase().includes(destSearch.toLowerCase()) ||
      d.location.toLowerCase().includes(destSearch.toLowerCase()) ||
      d.tag.toLowerCase().includes(destSearch.toLowerCase())
  );

  const filteredPackages = packageList.filter(
    (p) =>
      p.title.toLowerCase().includes(pkgSearch.toLowerCase()) ||
      p.destination.toLowerCase().includes(pkgSearch.toLowerCase())
  );

  const isAdmin = user?.roles.includes('ROLE_ADMIN');
  const isOrganizer = user?.roles.includes('ROLE_ORGANIZER');
  const cleanRole = user?.roles[0]?.replace('ROLE_', '') || 'USER';

  return (
    <div className="dashboard-container animate-fade-in container-fluid px-4 py-4 position-relative">

      {isBackendOffline && (
        <div className="glasstic-premium p-5 rounded-4 mb-4 text-center animate-fade-in" 
             style={{ 
               background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
               backdropFilter: 'blur(30px)',
               border: '2px solid rgba(239, 68, 68, 0.25)',
               boxShadow: '0 30px 70px rgba(0, 0, 0, 0.6)'
             }}>
          <div className="animate-float-slow mb-4">
            <img 
              src="/images/server_offline.png" 
              alt="Server Offline" 
              className="img-fluid rounded-4 shadow-lg border border-white border-opacity-10" 
              style={{ maxWidth: '340px', transform: 'perspective(800px) rotateX(10deg)' }} 
            />
          </div>
          <h2 className="display-6 fw-bold text-white text-gradient-colorful mb-3">
            <i className="bi bi-wifi-off me-2 text-danger"></i>Connection Offline
          </h2>
          <p className="text-secondary text-sm mx-auto mb-4" style={{ maxWidth: '600px', color: 'var(--text-secondary)' }}>
            We're having trouble reaching the travel coordination servers right now. The server might be resting or under maintenance. We are working on it!
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-primary px-4 py-2.5 fw-bold text-xs" onClick={() => fetchTripsAndDestinations()} style={{ borderRadius: '10px' }}>
              <i className="bi bi-arrow-clockwise me-1.5 animate-spin"></i> Retry Connection
            </button>
            <button className="btn btn-outline-secondary px-4 py-2.5 fw-bold text-xs text-white" onClick={() => setIsBackendOffline(false)} style={{ borderRadius: '10px' }}>
              Dismiss & View Dashboard
            </button>
          </div>
        </div>
      )}

      {currentView === 'welcome' ? (
        <div className="row g-4 animate-fade-in">
          <div className="col-12">
            
            {/* Scenic Auto-playing Images Carousel (ONLY shown on welcome page now!) */}
            <div className="travel-hero position-relative overflow-hidden shadow-lg mb-4 rounded-4 border-0 d-flex align-items-center" style={{ height: '340px' }}>
              {naturalPlaces.map((place, idx) => (
                <div 
                  key={place.id}
                  className={`position-absolute w-100 h-100 transition-fade ${heroSlideIdx === idx ? 'active' : ''}`}
                  style={{
                    backgroundImage: `url(${place.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.52)'
                  }}
                />
              ))}
              
              {/* Colorful gradient overlays */}
              <div className="position-absolute top-0 left-0 w-100 h-100" style={{ background: 'linear-gradient(to right, rgba(79, 70, 229, 0.4) 0%, rgba(0, 0, 0, 0.75) 100%)', mixBlendMode: 'multiply' }} />
              <div className="cloud cloud-1" />
              <div className="cloud cloud-2" />

              {/* Carousel Content */}
              <div className="travel-hero-content text-white max-w-xl position-relative z-index-10 ms-5 animate-fade-in-up" key={heroSlideIdx}>
                <span className="badge bg-danger text-uppercase text-xxs mb-2 px-2.5 py-1.5 fw-bold">
                  📍 {naturalPlaces[heroSlideIdx].tag}
                </span>
                <h2 className="travel-hero-title display-6 fw-bold mb-2">{naturalPlaces[heroSlideIdx].name}</h2>
                <p className="travel-hero-subtitle opacity-90 text-sm mb-3">
                  {naturalPlaces[heroSlideIdx].desc}
                </p>
                <button className="btn btn-primary btn-sm px-3.5 py-2 text-xs d-flex align-items-center gap-2" onClick={() => navigateView('dashboard')} style={{ borderRadius: '8px' }}>
                  <i className="bi bi-compass-fill"></i>Explore Catalog Packages
                </button>
              </div>

              {/* Carousel Dot Indicators */}
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2" style={{ zIndex: 20 }}>
                {naturalPlaces.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`carousel-dot rounded-circle cursor-pointer ${heroSlideIdx === idx ? 'bg-white' : 'bg-white bg-opacity-40'}`}
                    style={{ width: '8px', height: '8px', transition: 'all 0.3s ease' }}
                    onClick={() => setHeroSlideIdx(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Elegant Cinematic Travel Intro Header */}
            <div className="p-4 p-md-5 rounded-4 mb-4 text-center border-0 shadow-lg text-white position-relative overflow-hidden animate-float-slow" 
                 style={{ 
                   backgroundImage: "linear-gradient(135deg, rgba(15, 23, 42, 0.35) 0%, rgba(30, 27, 75, 0.4) 100%), url('/images/scenic_footer_bg.jpg')",
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   boxShadow: '0 20px 50px rgba(99, 102, 241, 0.25)',
                   animationDelay: '0.5s'
                 }}>
              <div className="card-glow-overlay" style={{ opacity: 0.7 }} />
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle text-uppercase text-xxs mb-3 px-3 py-1.5 fw-bold position-relative z-index-1">
                ✈️ Premium Travel Coordination
              </span>
              <h2 className="display-6 fw-bold mb-3 text-white text-gradient-colorful position-relative z-index-1" style={{ letterSpacing: '-0.5px', textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}>
                Your Passport to Seamless Adventures
              </h2>
              <p className="text-white text-opacity-80 text-sm mx-auto mb-4 lh-base position-relative z-index-1" style={{ maxWidth: '680px', textShadow: '0 2px 8px rgba(0,0,0,0.85)' }}>
                Welcome to TravelPlanner. Structure your itineraries, keep bills and budget limits tracked, and share collaborated workspaces with co-planners—all in one gorgeous, integrated hub designed for modern travelers.
              </p>
              <div className="d-flex justify-content-center gap-3 position-relative z-index-1">
                <button className="btn btn-primary px-4 py-2.5 fw-bold text-xs" onClick={() => navigateView('dashboard')} style={{ borderRadius: '10px' }}>
                  <i className="bi bi-compass-fill me-1.5"></i> Launch Dashboard Workspace
                </button>
              </div>
            </div>

            {/* Features Showcase Container */}
            <div className="mb-5 mt-4">
              <h4 className="fw-bold mb-4 text-center text-xs text-uppercase text-muted" style={{ letterSpacing: '1.5px' }}>
                Core Capabilities & Features
              </h4>
              <div className="row g-4">
                <div className="col-12 col-md-6 col-lg-3">
                  <div className="welcome-feature-card animate-float-slow h-100 rounded-4 text-center d-flex flex-column" style={{ animationDelay: '0s', overflow: 'hidden' }}>
                    <div className="card-hd-thumbnail" style={{ backgroundImage: "url('/images/jaipur.png')" }}>
                      <div className="card-hd-overlay" />
                    </div>
                    <div className="card-glow-overlay" />
                    <div className="p-4 flex-grow-1 position-relative z-index-1">
                      <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3" style={{ width: '48px', height: '48px' }}>
                        <i className="bi bi-map-fill fs-5"></i>
                      </div>
                      <h5 className="fw-bold mb-2" style={{ fontSize: '0.95rem' }}>Itinerary Planner</h5>
                      <p className="text-xxs mb-0 lh-base">
                        Plan your travel days sequentially. Log sightseeing activities, schedule timings, and log location details.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <div className="welcome-feature-card animate-float-slow h-100 rounded-4 text-center d-flex flex-column" style={{ animationDelay: '0.15s', overflow: 'hidden' }}>
                    <div className="card-hd-thumbnail" style={{ backgroundImage: "url('/images/kerala.png')" }}>
                      <div className="card-hd-overlay" />
                    </div>
                    <div className="card-glow-overlay" />
                    <div className="p-4 flex-grow-1 position-relative z-index-1">
                      <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success rounded-circle mb-3" style={{ width: '48px', height: '48px' }}>
                        <i className="bi bi-cash-coin fs-5"></i>
                      </div>
                      <h5 className="fw-bold mb-2" style={{ fontSize: '0.95rem' }}>Budget Manager</h5>
                      <p className="text-xxs mb-0 lh-base">
                        Set maximum trip budget limits, log bills on-the-go, and keep track of your remaining balances in real-time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <div className="welcome-feature-card animate-float-slow h-100 rounded-4 text-center d-flex flex-column" style={{ animationDelay: '0.3s', overflow: 'hidden' }}>
                    <div className="card-hd-thumbnail" style={{ backgroundImage: "url('/images/goa.png')" }}>
                      <div className="card-hd-overlay" />
                    </div>
                    <div className="card-glow-overlay" />
                    <div className="p-4 flex-grow-1 position-relative z-index-1">
                      <div className="d-inline-flex align-items-center justify-content-center bg-info bg-opacity-10 text-info rounded-circle mb-3" style={{ width: '48px', height: '48px' }}>
                        <i className="bi bi-people-fill fs-5"></i>
                      </div>
                      <h5 className="fw-bold mb-2" style={{ fontSize: '0.95rem' }}>Trip Collaboration</h5>
                      <p className="text-xxs mb-0 lh-base">
                        Add friends and co-planners to your trip using their usernames, granting them collaborative editing access.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                  <div className="welcome-feature-card animate-float-slow h-100 rounded-4 text-center d-flex flex-column" style={{ animationDelay: '0.45s', overflow: 'hidden' }}>
                    <div className="card-hd-thumbnail" style={{ backgroundImage: "url('/images/taj_mahal.png')" }}>
                      <div className="card-hd-overlay" />
                    </div>
                    <div className="card-glow-overlay" />
                    <div className="p-4 flex-grow-1 position-relative z-index-1">
                      <div className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger rounded-circle mb-3" style={{ width: '48px', height: '48px' }}>
                        <i className="bi bi-gift-fill fs-5"></i>
                      </div>
                      <h5 className="fw-bold mb-2" style={{ fontSize: '0.95rem' }}>Curated Packages</h5>
                      <p className="text-xxs mb-0 lh-base">
                        Discover pre-built itineraries across beautiful destinations in India and book pre-packaged trips.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Testimonials & Feedback Form */}
            <div className="welcome-testimonials-card p-4 rounded-4 mb-4">
              <h4 className="fw-bold mb-4 text-sm d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <i className="bi bi-chat-left-heart-fill text-danger animate-pulse"></i>Traveler Testimonials & Reviews
              </h4>
              
              <div className="row g-4">
                {/* Left Side: Score Metric & Review Form */}
                <div className="col-12 col-lg-5">
                  <div className="card p-3 border mb-3 shadow-xs bg-primary bg-opacity-5 rounded-3 d-flex flex-column align-items-center text-center">
                    <div className="d-flex align-items-center gap-2 mb-1 justify-content-center">
                      <span className="fw-bold text-warning" style={{ fontSize: '2.5rem' }}>4.8</span>
                      <div className="text-start">
                        <div className="text-warning text-xs">★★★★★</div>
                        <span className="text-xxs text-muted">Based on {feedbackList.length} traveler reviews</span>
                      </div>
                    </div>
                    <div className="w-100 mt-2 px-2">
                      <div className="d-flex align-items-center gap-2 mb-1.5">
                        <span className="text-xxs text-muted" style={{ minWidth: '40px' }}>5 Star</span>
                        <div className="progress flex-grow-1" style={{ height: '6px', borderRadius: '3px' }}>
                          <div className="progress-bar bg-success" style={{ width: '85%' }} />
                        </div>
                        <span className="text-xxs text-muted" style={{ minWidth: '25px' }}>85%</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-xxs text-muted" style={{ minWidth: '40px' }}>4 Star</span>
                        <div className="progress flex-grow-1" style={{ height: '6px', borderRadius: '3px' }}>
                          <div className="progress-bar bg-primary" style={{ width: '15%' }} />
                        </div>
                        <span className="text-xxs text-muted" style={{ minWidth: '25px' }}>15%</span>
                      </div>
                    </div>
                  </div>

                  <div className="card p-3 border shadow-xs bg-primary bg-opacity-5 rounded-3">
                    <h5 className="fw-bold mb-2.5 text-xs" style={{ color: 'var(--text-primary)' }}>Submit Your Travel Review</h5>
                    <form onSubmit={handleAddFeedback}>
                      <div className="mb-2">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Your Name</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm text-xs" 
                          placeholder="e.g. Kilaparthi Mohan" 
                          value={newFeedbackName} 
                          onChange={(e) => setNewFeedbackName(e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div className="mb-2">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Rating Stars</label>
                        <select 
                          className="form-select form-select-sm text-xs" 
                          value={newFeedbackRating} 
                          onChange={(e) => setNewFeedbackRating(parseInt(e.target.value))}
                        >
                          <option value="5">⭐⭐⭐⭐⭐ (5 - Perfect)</option>
                          <option value="4">⭐⭐⭐⭐ (4 - Excellent)</option>
                          <option value="3">⭐⭐⭐ (3 - Good)</option>
                          <option value="2">⭐⭐ (2 - Average)</option>
                          <option value="1">⭐ (1 - Poor)</option>
                        </select>
                      </div>
                      
                      <div className="mb-2">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Your Experience / Review Comment</label>
                        <textarea 
                          className="form-control form-control-sm text-xs" 
                          rows={3} 
                          placeholder="Describe your itinerary, budget tracking experience..." 
                          value={newFeedbackComment} 
                          onChange={(e) => setNewFeedbackComment(e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <button type="submit" className="btn btn-primary btn-sm w-100 py-1.5 text-xs fw-semibold">
                        Submit Testimonial
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Side: Dynamic Reviews Wall Carousel */}
                <div className="col-12 col-lg-7">
                  <div className="position-relative overflow-hidden" style={{ minHeight: '180px' }}>
                    {feedbackList.map((feed, idx) => (
                      <div 
                        key={feed.id} 
                        className={`position-absolute w-100 transition-fade card p-2.5 border shadow-xs rounded-3 welcome-feature-card ${
                          reviewSlideIdx === idx ? 'active' : ''
                        }`}
                        style={{
                          opacity: reviewSlideIdx === idx ? 1 : 0,
                          pointerEvents: reviewSlideIdx === idx ? 'auto' : 'none',
                          transform: reviewSlideIdx === idx ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.97)',
                          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                          minHeight: '140px'
                        }}
                      >
                        <div className="card-glow-overlay" />
                        <div className="position-relative z-index-1 d-flex flex-column justify-content-between h-100" style={{ minHeight: '120px' }}>
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-1.5 flex-wrap gap-1">
                              <div className="d-flex align-items-center gap-2">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold text-xxs" style={{ width: '22px', height: '22px', fontSize: '9px' }}>
                                  {feed.name[0]?.toUpperCase()}
                                </div>
                                <div>
                                  <strong className="text-xxs d-block" style={{ fontSize: '0.72rem' }}>{feed.name}</strong>
                                  <span className="badge bg-indigo-subtle text-indigo border border-indigo-subtle" style={{ fontSize: '8px', padding: '0.15em 0.4em' }}>{feed.tag}</span>
                                </div>
                              </div>
                              <span className="text-xxxs text-muted">{feed.date}</span>
                            </div>
                            <div className="text-warning mb-1" style={{ fontSize: '9px' }}>
                              {'★'.repeat(feed.rating)}{'☆'.repeat(5 - feed.rating)}
                            </div>
                            <p className="text-xxs mb-1.5 lh-sm" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                              "{feed.comment}"
                            </p>
                          </div>
                          <div className="border-top pt-1.5 d-flex justify-content-between align-items-center mt-auto" style={{ fontSize: '9px' }}>
                            <button className="btn btn-xs btn-outline-primary border-0 text-xxxs d-inline-flex align-items-center gap-1 text-primary p-0 bg-transparent" onClick={() => handleLikeFeedback(feed.id)}>
                              <i className="bi bi-hand-thumbs-up-fill"></i> Helpful ({feed.helpfulCount})
                            </button>
                            <span className="text-xxxs text-success fw-bold"><i className="bi bi-patch-check-fill me-1"></i>Verified</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {feedbackList.length === 0 && (
                      <p className="text-muted text-center text-xs py-5 mb-0">No reviews submitted yet. Be the first to write a testimonial!</p>
                    )}
                  </div>
                  
                  {/* Reviews Carousel Dot Indicators */}
                  {feedbackList.length > 0 && (
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      {feedbackList.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`rounded-circle cursor-pointer ${reviewSlideIdx === idx ? 'bg-primary' : 'bg-secondary bg-opacity-35'}`}
                          style={{ width: '6px', height: '6px', transition: 'all 0.3s ease' }}
                          onClick={() => setReviewSlideIdx(idx)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Premium Travel Stats & Checklist Widget */}
                  <div className="row g-2.5 mt-3.5 animate-fade-in">
                    <div className="col-12 col-sm-6">
                      <div className="card p-2.5 border shadow-xxs rounded-3 welcome-feature-card text-center d-flex flex-column justify-content-center" style={{ minHeight: '110px' }}>
                        <h6 className="fw-bold mb-1.5 text-xxs text-uppercase text-muted" style={{ letterSpacing: '0.8px' }}>
                          <i className="bi bi-globe2 me-1 text-primary animate-spin-slow"></i>Platform Reach
                        </h6>
                        <div className="d-flex justify-content-around mt-1">
                          <div>
                            <span className="fw-bold text-indigo d-block" style={{ fontSize: '1.15rem' }}>14K+</span>
                            <span className="text-muted" style={{ fontSize: '9px' }}>Active Users</span>
                          </div>
                          <div className="border-start" style={{ height: '30px', borderColor: 'rgba(120,120,120,0.15)' }} />
                          <div>
                            <span className="fw-bold text-success d-block" style={{ fontSize: '1.15rem' }}>92K+</span>
                            <span className="text-muted" style={{ fontSize: '9px' }}>Trips Planned</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12 col-sm-6">
                      <div className="card p-2.5 border shadow-xxs rounded-3 welcome-feature-card d-flex flex-column justify-content-center" style={{ minHeight: '110px' }}>
                        <h6 className="fw-bold mb-2 text-xxs text-uppercase text-muted" style={{ letterSpacing: '0.8px' }}>
                          <i className="bi bi-patch-check-fill me-1 text-success"></i>Pre-Travel Checklist
                        </h6>
                        <div className="d-flex flex-column gap-1.5" style={{ fontSize: '9.5px' }}>
                          <label className="d-flex align-items-center gap-1.5 cursor-pointer m-0">
                            <input type="checkbox" defaultChecked className="form-check-input m-0 shadow-none" style={{ width: '11px', height: '11px' }} />
                            <span>Check Weather Reports</span>
                          </label>
                          <label className="d-flex align-items-center gap-1.5 cursor-pointer m-0">
                            <input type="checkbox" defaultChecked className="form-check-input m-0 shadow-none" style={{ width: '11px', height: '11px' }} />
                            <span>Confirm Itinerary Timeline</span>
                          </label>
                          <label className="d-flex align-items-center gap-1.5 cursor-pointer m-0">
                            <input type="checkbox" className="form-check-input m-0 shadow-none" style={{ width: '11px', height: '11px' }} />
                            <span>Validate Budget Limits</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div></div>
        </div>
      ) : (
        <div className="row g-4">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="col-12 col-xl-2 left-sidebar-col">
          <div className="glass-container sidebar-card p-3 mb-4">
            <div className="profile-widget text-center pb-3 border-bottom mb-3">
              <div className="profile-avatar mb-2 mx-auto d-flex align-items-center justify-content-center">
                <i className="bi bi-person-circle"></i>
              </div>
              <h5 className="profile-name mb-0 fw-bold">{user?.username}</h5>
              <span className="profile-email text-muted text-xs d-block mb-2">{user?.email}</span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle text-uppercase text-xs px-2 py-1">
                {cleanRole} Mode
              </span>
            </div>

            <div className="navigation-widget mb-3">
              <span className="sidebar-section-title text-uppercase text-muted fw-bold text-xs d-block mb-2">Navigation</span>
              <ul className="list-unstyled sidebar-menu">
                <li className={(currentView as string) === 'welcome' ? 'active' : ''} onClick={() => navigateView('welcome')}>
                  <i className="bi bi-house-door-fill"></i>Welcome Overview
                </li>
                <li className={currentView === 'dashboard' ? 'active' : ''} onClick={() => navigateView('dashboard')}>
                  <i className="bi bi-grid-1x2-fill"></i>Dashboard
                </li>
                <li className={currentView === 'itineraries' ? 'active' : ''} onClick={() => navigateView('itineraries')}>
                  <i className="bi bi-map"></i>My Itineraries
                </li>
                <li className={currentView === 'expenses' ? 'active' : ''} onClick={() => navigateView('expenses')}>
                  <i className="bi bi-piggy-bank"></i>Expenses
                </li>
                <li className={currentView === 'settings' ? 'active' : ''} onClick={() => navigateView('settings')}>
                  <i className="bi bi-gear"></i>Settings
                </li>
                
                {/* Admin and Organizer Sidebar Navigation links, visible ONLY to correct roles */}
                {isAdmin && (
                  <li className={currentView === 'admin' ? 'active' : ''} onClick={() => {
                    navigateView('admin');
                    setAdminSubTab('users');
                  }} style={{ borderLeft: '3px solid var(--bs-success)', paddingLeft: '8px' }}>
                    <i className="bi bi-shield-lock-fill text-success"></i>Admin Controls
                  </li>
                )}
                {isOrganizer && (
                  <li className={currentView === 'organizer' ? 'active' : ''} onClick={() => {
                    navigateView('organizer');
                    setOrganizerSubTab('packages');
                  }} style={{ borderLeft: '3px solid var(--bs-warning)', paddingLeft: '8px' }}>
                    <i className="bi bi-briefcase-fill text-warning"></i>Agent Controls
                  </li>
                )}
              </ul>
            </div>

            <div className="stats-widget border-top pt-3 mb-3">
              <span className="sidebar-section-title text-uppercase text-muted fw-bold text-xs d-block mb-2">Your Activity</span>
              <div className="d-flex justify-content-between text-sm mb-2">
                <span className="text-muted">Total Trips:</span>
                <span className="fw-bold">{myTrips.length}</span>
              </div>
              <div className="d-flex justify-content-between text-sm">
                <span className="text-muted">Active Plans:</span>
                <span className="fw-bold text-success">3</span>
              </div>
            </div>

            </div>
        </div>

        {/* ================= CENTER MAIN FEED ================= */}
        <div className="col-12 col-xl-10 center-feed-col">

          {/* Dedicated Search Results View */}
          {currentView === 'search_results' && (
            <div className="glasstic-premium p-4 p-md-5 rounded-4 animate-fade-in mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3 flex-wrap gap-2">
                <div>
                  <span className="role-badge badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 text-uppercase text-xs mb-1">
                    <i className="bi bi-search me-1"></i>Search Results Engine
                  </span>
                  <h3 className="h4 fw-bold mb-0 text-gradient-colorful">
                    Search Results for "{destSearch}"
                  </h3>
                </div>
                <button className="btn btn-outline-secondary btn-sm text-xs text-white d-flex align-items-center gap-1.5" onClick={() => { setDestSearch(''); navigateView('dashboard'); }}>
                  <i className="bi bi-arrow-left"></i> Back to Dashboard
                </button>
              </div>

              {/* SECTION 1: MATCHING TRAVEL DESTINATIONS */}
              <div className="mb-5">
                <h4 className="fw-bold mb-3.5 text-xs text-uppercase tracking-wider text-muted animate-pulse" style={{ letterSpacing: '0.5px' }}>
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>Matching Travel Spots ({filteredDestinations.length})
                </h4>
                
                <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-3">
                  {filteredDestinations.map((dest) => (
                    <div key={dest.id} className="col">
                      <div className="glass-container card-3d-tilt h-100 p-0 border overflow-hidden d-flex flex-column justify-content-between rounded-4 shadow-sm" style={{ transition: 'all 0.3s ease' }}>
                        <div className="card-glow-overlay" />
                        <div className="position-relative overflow-hidden" style={{ height: '150px' }}>
                          <img src={dest.image} className="w-100 h-100 object-fit-cover" alt={dest.name} />
                          <span className="badge bg-primary text-white position-absolute bottom-0 start-0 m-2 text-xxs">
                            <i className="bi bi-tag-fill me-1"></i>{dest.tag}
                          </span>
                        </div>
                        <div className="p-3.5 d-flex flex-column justify-content-between flex-grow-1 position-relative z-index-1">
                          <div>
                            <span className="text-uppercase fw-bold text-xxs d-block mb-1 text-indigo">📍 {dest.location}</span>
                            <h5 className="fw-bold mb-1.5 text-xs text-dark">{dest.name}</h5>
                            <p className="text-muted mb-3 text-xxs lh-sm" style={{ minHeight: '36px' }}>
                              {dest.desc}
                            </p>
                          </div>
                          <div className="d-flex gap-2 border-top pt-2.5">
                            <button 
                              onClick={() => {
                                setSelectedPkgId(dest.id);
                                setTimeout(() => {
                                  document.getElementById('package-workspace-details')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }}
                              className="btn btn-outline-primary btn-sm flex-grow-1 py-1.5 text-xs d-flex align-items-center justify-content-center gap-1"
                              style={{ borderRadius: '8px', border: '1.5px solid var(--accent-primary)' }}
                            >
                              <i className="bi bi-gift-fill"></i> Details
                            </button>
                            <button 
                              onClick={() => {
                                setNewTripTitle(`My Trip to ${dest.name.split(',')[0]}`);
                                setNewTripDesc(`Custom exploration of ${dest.name}`);
                                navigateView('itineraries');
                                setTimeout(() => {
                                  document.getElementById('add-trip-form-section')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }}
                              className="btn btn-primary btn-sm flex-grow-1 py-1.5 text-xs fw-bold d-flex align-items-center justify-content-center gap-1"
                              style={{ borderRadius: '8px' }}
                            >
                              <i className="bi bi-plus-circle-fill"></i> Plan Trip
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredDestinations.length === 0 && (
                    <div className="col-12 text-center py-4">
                      <div className="glasstic-premium p-4 max-w-md mx-auto rounded-3">
                        <img src="/images/server_offline.png" alt="No spots found" style={{ width: '120px' }} className="animate-float-slow mb-2" />
                        <h6 className="fw-bold text-xs mb-1">No Matching Locations</h6>
                        <p className="text-xxs text-muted mb-0">Our scouts haven't mapped this spot yet, but we are looking into it!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: AVAILABLE TOUR PACKAGES */}
              <div>
                <h4 className="fw-bold mb-3.5 text-xs text-uppercase tracking-wider text-muted" style={{ letterSpacing: '0.5px' }}>
                  <i className="bi bi-gift-fill text-warning me-1"></i>Linked Tour Packages ({filteredPackages.length})
                </h4>
                
                <div className="row g-4 row-cols-1 row-cols-md-2">
                  {filteredPackages.map((pkg) => (
                    <div key={pkg.id} className="col">
                      <div className="glass-container card-3d-tilt p-3 border rounded-4 d-flex align-items-center gap-3" style={{ transition: 'all 0.3s ease' }}>
                        <div className="card-glow-overlay" />
                        <img src={pkg.image} alt={pkg.title} className="rounded-3 object-fit-cover" style={{ width: '80px', height: '80px' }} />
                        <div className="flex-grow-1 position-relative z-index-1">
                          <span className="badge bg-warning text-dark fw-bold mb-1" style={{ fontSize: '0.65rem' }}>{pkg.duration} Days Tour</span>
                          <h5 className="fw-bold text-xs mb-0.5 text-dark">{pkg.title}</h5>
                          <span className="text-xxs text-muted d-block mb-2">Destination: {pkg.destination}</span>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-xs text-indigo">₹{pkg.price.toLocaleString('en-IN')}</span>
                            <button 
                              onClick={() => {
                                setSimPkgId(pkg.id);
                                setOrganizerSubTab('bookings');
                                navigateView('organizer');
                              }}
                              className="btn btn-xs btn-primary py-1 px-2.5 text-xxs fw-semibold"
                            >
                              Simulate Booking
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredPackages.length === 0 && (
                    <div className="col-12 text-center py-4">
                      <div className="glasstic-premium p-4 max-w-md mx-auto rounded-3">
                        <h6 className="fw-bold text-xs mb-1">No Active Packages</h6>
                        <p className="text-xxs text-muted mb-0">Check back later for seasonal discounts and adventure package listings!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Full Dashboard View */}
          {currentView === 'dashboard' && (
            <div className="animate-fade-in">
              {/* Role-Based Quick Access panels */}
              {(isAdmin || isOrganizer) && (
                <div className="row g-3 mb-4">
                  {isAdmin && (
                    <div className="col-12 col-md-6">
                      <div className="glass-container role-panel admin p-3 border-start border-4 border-success h-100 d-flex flex-column justify-content-between">
                        <div>
                          <span className="role-badge badge bg-success-subtle text-success border border-success-subtle mb-2 text-uppercase text-xs">
                            <i className="bi bi-shield-lock-fill me-1"></i>Admin Controls
                          </span>
                          <h6 className="fw-bold mb-1">System Controls</h6>
                          <p className="text-secondary text-xs mb-3">Manage registered user credentials or configure explorer catalogs.</p>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-xs btn-outline-success py-1.5 fw-semibold text-xs" onClick={() => {
                            setCurrentView('admin');
                            setAdminSubTab('users');
                          }}>
                            👥 Users
                          </button>
                          <button className="btn btn-xs btn-outline-success py-1.5 fw-semibold text-xs" onClick={() => {
                            setCurrentView('admin');
                            setAdminSubTab('catalogs');
                          }}>
                            🗺️ Catalogs
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isOrganizer && (
                    <div className="col-12 col-md-6">
                      <div className="glass-container role-panel organizer p-3 border-start border-4 border-warning h-100 d-flex flex-column justify-content-between">
                        <div>
                          <span className="role-badge badge bg-warning-subtle text-warning border border-warning-subtle mb-2 text-uppercase text-xs">
                            <i className="bi bi-briefcase-fill me-1"></i>Agent Controls
                          </span>
                          <h6 className="fw-bold mb-1">Package Coordinator</h6>
                          <p className="text-secondary text-xs mb-3">Build pre-packaged itineraries and confirm tourist bookings.</p>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-xs btn-outline-warning py-1.5 fw-semibold text-xs" onClick={() => {
                            setCurrentView('organizer');
                            setOrganizerSubTab('packages');
                          }}>
                            📦 Packages
                          </button>
                          <button className="btn btn-xs btn-outline-warning py-1.5 fw-semibold text-xs" onClick={() => {
                            setCurrentView('organizer');
                            setOrganizerSubTab('bookings');
                          }}>
                            📅 Bookings
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Active Trips Section - Exactly 3 cards in a row */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="section-title fw-bold mb-0 d-flex align-items-center gap-2" style={{ fontSize: '1.4rem' }}>
                    <i className="bi bi-airplane-engines text-primary"></i>My Active Trips
                  </h2>
                  <button 
                    className="btn btn-sm btn-primary d-flex align-items-center gap-1 text-xs px-2.5 py-1.5"
                    onClick={() => setShowAddTripForm(!showAddTripForm)}
                    style={{ borderRadius: '8px' }}
                  >
                    <i className={`bi ${showAddTripForm ? 'bi-dash-lg' : 'bi-plus-lg'}`}></i>
                    {showAddTripForm ? 'Close Form' : 'New Trip'}
                  </button>
                </div>

                {showAddTripForm && (
                  <div className="glass-container p-3 mb-4 rounded-4 animate-fade-in border-start border-4 border-primary">
                    <h6 className="fw-bold mb-3"><i className="bi bi-journal-plus me-1 text-primary"></i>Plan a New Trip</h6>
                    <form onSubmit={handleCreateTrip}>
                      <div className="row g-3">
                        <div className="col-12 col-md-3">
                          <label className="form-label text-xs fw-bold mb-1">Select Located Area</label>
                          <select 
                            className="form-select form-select-sm text-xs" 
                            onChange={(e) => {
                              const dest = destList.find(d => d.id === parseInt(e.target.value));
                              if (dest) {
                                setNewTripTitle(`Tour to ${dest.name.split(',')[0]}`);
                                setNewTripDesc(`Custom exploration of ${dest.name}. Category: ${dest.tag}. State: ${dest.location}.`);
                              }
                            }}
                          >
                            <option value="">-- Select Active Area --</option>
                            {destList.map(d => (
                              <option key={d.id} value={d.id}>{d.name} ({d.location})</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12 col-md-3">
                          <label className="form-label text-xs fw-bold mb-1">Trip Title</label>
                          <input 
                            type="text" 
                            className="form-control form-control-sm text-xs" 
                            placeholder="e.g. Kerala Beach Escape"
                            value={newTripTitle}
                            onChange={(e) => setNewTripTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-3">
                          <label className="form-label text-xs fw-bold mb-1">Start Date</label>
                          <input 
                            type="date" 
                            className="form-control form-control-sm text-xs"
                            value={newTripStart}
                            onChange={(e) => setNewTripStart(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12 col-md-3">
                          <label className="form-label text-xs fw-bold mb-1">End Date</label>
                          <input 
                            type="date" 
                            className="form-control form-control-sm text-xs"
                            value={newTripEnd}
                            onChange={(e) => setNewTripEnd(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-xs fw-bold mb-1">Short Description</label>
                          <textarea 
                            className="form-control form-control-sm text-xs" 
                            rows={2}
                            placeholder="Describe your trip goals, places to explore..."
                            value={newTripDesc}
                            onChange={(e) => setNewTripDesc(e.target.value)}
                          />
                        </div>
                        <div className="col-12 text-end">
                          <button type="submit" className="btn btn-primary btn-sm px-3.5 py-1.8 text-xs fw-semibold" style={{ borderRadius: '8px' }}>
                            Create Trip Plan
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}
                
                <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-3">
                  {myTrips.map((trip) => (
                    <div key={trip.id} className="col">
                      <div 
                        className={`glass-container trip-card-interactive h-100 p-0 border overflow-hidden d-flex flex-column justify-content-between rounded-4 ${selectedTripId === trip.id ? 'selected shadow-glow' : ''}`}
                        onClick={() => {
                          setSelectedTripId(trip.id);
                          setTimeout(() => {
                            document.getElementById('trip-workspace-details')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                      >
                        <div className="trip-card-image-wrapper position-relative overflow-hidden" style={{ height: '120px' }}>
                          <img src={tripImages[trip.id] || getMockImageForPlace(trip.title)} className="trip-card-image w-100 h-100 object-fit-cover" alt={trip.title} />
                          <span className="trip-date badge bg-dark bg-opacity-70 text-white position-absolute bottom-0 start-0 m-2">
                            <i className="bi bi-calendar3 me-1"></i>{trip.startDate}
                          </span>
                          
                          {tripsWeather[trip.id] && (
                            <span className="position-absolute bottom-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white d-flex align-items-center gap-1" style={{ fontSize: '0.65rem', zIndex: 5, padding: '0.35em 0.6em', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <span>
                                {tripsWeather[trip.id].weather?.[0]?.main === 'Rain' ? '🌧️' : 
                                 tripsWeather[trip.id].weather?.[0]?.main === 'Clear' ? '☀️' : 
                                 tripsWeather[trip.id].weather?.[0]?.main === 'Mist' ? '🌫️' : '⛅'}
                              </span>
                              <span className="fw-bold">{tripsWeather[trip.id].main?.temp}°C</span>
                            </span>
                          )}
                          
                          {/* Absolute Delete Button */}
                          <button 
                            className="btn btn-xs btn-danger bg-opacity-75 text-white border-0 position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '26px', height: '26px', zIndex: 10 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTrip(trip.id);
                            }}
                            title="Delete Trip"
                          >
                            <i className="bi bi-trash text-xs"></i>
                          </button>
                        </div>
                        
                        <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                          <div>
                            <h4 className="trip-title h6 fw-bold mb-1">{trip.title}</h4>
                            <p className="trip-desc text-muted mb-3 text-xs" style={{ minHeight: '36px', lineBreak: 'anywhere' }}>
                              {trip.description}
                            </p>
                          </div>
                          
                          <div>
                            <div className="trip-budget-info border-top pt-2 mb-2 text-xs d-flex justify-content-between fw-semibold">
                              <span className="text-muted">Limit: {trip.currency}{trip.budgetLimit.toLocaleString('en-IN')}</span>
                              <span className={trip.budgetSpent > trip.budgetLimit * 0.85 ? 'text-danger' : 'text-primary'}>
                                Spent: {trip.currency}{trip.budgetSpent.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTripId(trip.id);
                                setTimeout(() => {
                                  document.getElementById('trip-workspace-details')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }} 
                              className="btn btn-primary btn-sm w-100 py-1.5 text-xs d-flex align-items-center justify-content-center gap-1"
                            >
                              <i className="bi bi-search"></i> View Plan
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Trip Details Panel (BEAUTIFIED CINEMATIC DISPLAY) */}
              {selectedTrip && (
                <div id="trip-workspace-details" className="glass-container selected-trip-workspace animate-fade-in p-3 p-md-4 mb-4 rounded-4">
                  
                  {/* Cinematic landscape top banner header with overlay text */}
                  <div className="workspace-hero position-relative overflow-hidden mb-4 rounded-4" style={{ height: '180px' }}>
                    <img src={tripImages[selectedTrip.id] || '/images/taj_mahal.png'} className="w-100 h-100 object-fit-cover" alt={selectedTrip.title} style={{ filter: 'brightness(0.55)' }} />
                    <div className="position-absolute bottom-0 start-0 m-3 text-white z-index-10">
                      <span className="badge bg-primary text-uppercase text-xxs mb-1.5 px-2 py-1">
                        <i className="bi bi-layout-text-window-reverse me-1"></i>Active Travel Workspace
                      </span>
                      <h3 className="h4 fw-bold mb-1">{selectedTrip.title}</h3>
                      <p className="opacity-90 text-xxs mb-0">
                        <i className="bi bi-calendar3 me-1"></i>Travel Dates: {selectedTrip.startDate} to {selectedTrip.endDate}
                      </p>
                    </div>
                    
                    {/* WEATHER BADGE OVERLAY */}
                    {weatherData && (
                      <div className="position-absolute bottom-0 end-0 m-3 p-2 text-white z-index-10" style={{ background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontSize: '1.4rem', lineHeight: '1' }}>
                          {weatherData.weather?.[0]?.main === 'Rain' ? '🌧️' : 
                           weatherData.weather?.[0]?.main === 'Clear' ? '☀️' : 
                           weatherData.weather?.[0]?.main === 'Mist' ? '🌫️' : '⛅'}
                        </div>
                        <div>
                          <div className="fw-bold text-xxs" style={{ fontSize: '10px' }}>{weatherData.main?.temp}°C</div>
                          <div className="text-opacity-80 text-xxxs" style={{ fontSize: '8px', textTransform: 'capitalize' }}>{weatherData.weather?.[0]?.description}</div>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => setSelectedTripId(null)} 
                      className="btn btn-xs btn-light position-absolute top-0 end-0 m-3 z-index-10 d-flex align-items-center gap-1 py-1"
                      style={{ borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}
                    >
                      <i className="bi bi-x-lg"></i> Close Plan
                    </button>
                  </div>

                   <div className="d-flex gap-2 mb-3 flex-wrap">
                    <button 
                      onClick={() => setActiveTab('itinerary')} 
                      className={`btn px-3 py-1.5 text-xs d-flex align-items-center gap-1.5 ${activeTab === 'itinerary' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      <i className="bi bi-calendar-event"></i> Itinerary Schedule
                    </button>
                    <button 
                      onClick={() => setActiveTab('budget')} 
                      className={`btn px-3 py-1.5 text-xs d-flex align-items-center gap-1.5 ${activeTab === 'budget' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      <i className="bi bi-credit-card-2-front"></i> Financial Records
                    </button>
                    <button 
                      onClick={() => setActiveTab('collaboration')} 
                      className={`btn px-3 py-1.5 text-xs d-flex align-items-center gap-1.5 ${activeTab === 'collaboration' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      <i className="bi bi-people-fill"></i> Co-Planners
                    </button>
                    <button 
                      onClick={() => setActiveTab('analytics')} 
                      className={`btn px-3 py-1.5 text-xs d-flex align-items-center gap-1.5 ${activeTab === 'analytics' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      <i className="bi bi-bar-chart-fill"></i> Analytics & Reports
                    </button>
                  </div>

                  <div className="animate-fade-in pt-1">
                    {activeTab === 'itinerary' && (
                      <div>
                        <h5 className="fw-bold mb-3 text-sm d-flex align-items-center gap-1.5 text-indigo">
                          <i className="bi bi-calendar-check-fill"></i>Daily Activities Timelines
                        </h5>
                        
                        {/* Vertical Timeline connects day blocks */}
                        <div className="position-relative ps-2">
                          <div className="position-absolute start-0 h-100 border-start border-2 border-indigo-subtle ms-3" style={{ top: '10px', zIndex: 1 }} />
                          
                          <div className="d-flex flex-column gap-4">
                            {selectedTrip.itinerary.map((day) => (
                              <div key={day.id} className="position-relative ps-4" style={{ zIndex: 2 }}>
                                
                                {/* Round badge connector circle node */}
                                <div className="position-absolute start-0 translate-middle-x bg-white border border-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '18px', height: '18px', top: '5px', left: '8px' }}>
                                  <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }} />
                                </div>

                                <div className="day-card card p-3 border shadow-xxs rounded-3">
                                  <h6 className="fw-bold mb-2.5 text-indigo text-xs">
                                    Day {day.dayNumber}: {day.title}
                                  </h6>
                                  {day.activities.length === 0 ? (
                                    <span className="text-muted text-xxs italic">No activities scheduled yet. Go to "My Itineraries" tab to add.</span>
                                  ) : (
                                    <div className="d-flex flex-column gap-2">
                                      {day.activities.map((act) => (
                                        <div key={act.id} className="d-flex justify-content-between align-items-center border-bottom pb-1.5 text-xxs">
                                          <div>
                                            <span className="activity-time text-muted fw-semibold me-2">
                                              <i className="bi bi-clock me-1 text-primary"></i>{act.time}
                                            </span>
                                            <strong className="text-dark">{act.title}</strong>
                                            <span className="activity-location text-muted ms-2 text-xxxs">📍 {act.location}</span>
                                          </div>
                                          <div className="fw-bold text-indigo">
                                            {act.cost > 0 ? `${selectedTrip.currency} ${act.cost.toLocaleString('en-IN')}` : 'Free'}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Google Maps Embed Container */}
                        <div className="mt-4 pt-3 border-top">
                            <h6 className="fw-bold text-xs text-indigo mb-2.5 d-flex align-items-center gap-2">
                              <i className="bi bi-geo-alt-fill"></i>Destination Map Coordinates (Google Maps API)
                            </h6>
                            <div className="overflow-hidden rounded-3 border border-white border-opacity-10" style={{ height: '240px', background: 'rgba(0,0,0,0.15)' }}>
                              <iframe
                                title="Destination Map"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedTrip.title)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                    {activeTab === 'budget' && (
                      <div className="row g-3">
                        <div className="col-12 col-md-5">
                          <h5 className="fw-bold mb-2.5 text-sm text-success">
                            <i className="bi bi-cash-stack me-1.5"></i>Budget Consumption
                          </h5>
                          
                          <div className="card p-3 border shadow-xs bg-success bg-opacity-5">
                            <div className="d-flex justify-content-between text-xs fw-semibold mb-2">
                              <span>Spent: {selectedTrip.currency} {selectedTrip.budgetSpent.toLocaleString('en-IN')} / {selectedTrip.budgetLimit.toLocaleString('en-IN')}</span>
                              <span>{budgetPercent}%</span>
                            </div>
                            <div className="progress mb-2" style={{ height: '8px' }}>
                              <div 
                                className={`progress-bar progress-bar-striped progress-bar-animated ${getProgressBarColorClass(budgetPercent)}`}
                                role="progressbar"
                                style={{ width: `${budgetPercent}%` }}
                              />
                            </div>
                            <p className="text-secondary text-xxs mb-3 fw-semibold">
                              Remaining Balance: {selectedTrip.currency} {(selectedTrip.budgetLimit - selectedTrip.budgetSpent).toLocaleString('en-IN')}
                            </p>

                            <div className="pt-3 border-top">
                              <label className="text-xxs text-muted fw-bold d-block mb-1">Set New Budget Limit</label>
                              <div className="input-group input-group-sm">
                                <span className="input-group-text bg-light text-secondary border-0" style={{ fontSize: '0.75rem' }}>₹</span>
                                <input 
                                  type="number" 
                                  className="form-control form-control-sm border-0" 
                                  placeholder="e.g. 90000" 
                                  value={newBudgetLimit}
                                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                                  style={{ fontSize: '0.75rem' }}
                                />
                                <button 
                                  className="btn btn-sm btn-success text-white fw-bold px-2.5" 
                                  type="button" 
                                  onClick={() => handleUpdateBudgetLimit(selectedTrip.id)}
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-md-7">
                          <h5 className="fw-bold mb-2.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                            <i className="bi bi-receipt-cutoff me-1.5 text-primary"></i>Bills Itemized List
                          </h5>
                          <div className="list-group shadow-xs rounded-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {selectedTrip.expenses.map((expense) => (
                              <div key={expense.id} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3 border text-xxs">
                                <div>
                                  <span className="text-xxxs text-muted d-block">{expense.date}</span>
                                  <strong style={{ color: 'var(--text-primary)' }}>{expense.description}</strong>
                                </div>
                                <div className="text-end">
                                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle mb-1 text-xxxs px-1">
                                    {expense.category}
                                  </span>
                                  <span className="d-block fw-bold" style={{ color: 'var(--text-primary)' }}>
                                    -{selectedTrip.currency} {expense.amount.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {selectedTrip.expenses.length === 0 && (
                              <div className="list-group-item text-center text-muted py-3 text-xxs">No expenses logged.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'collaboration' && (
                      <div className="row g-3">
                        <div className="col-12 col-md-5">
                          <h5 className="fw-bold mb-2.5 text-sm text-primary">
                            <i className="bi bi-person-plus-fill me-1.5"></i>Add Co-Planner
                          </h5>
                          <div className="card p-3 border shadow-xs bg-primary bg-opacity-5">
                            <form onSubmit={(e) => handleAddCollaborator(e, selectedTrip.id)}>
                              <div className="mb-2">
                                <label className="text-xxs text-muted fw-bold d-block mb-1">Co-planner Username</label>
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm text-xs border-indigo-subtle" 
                                  placeholder="Type username..." 
                                  value={newCollabUsername}
                                  onChange={(e) => setNewCollabUsername(e.target.value)}
                                  required 
                                />
                              </div>
                              <button type="submit" className="btn btn-primary btn-sm w-100 py-1.5 text-xs fw-semibold">
                                Invite Co-Planner
                              </button>
                            </form>
                          </div>
                        </div>

                        <div className="col-12 col-md-7">
                          <h5 className="fw-bold mb-2.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                            <i className="bi bi-people-fill me-1.5 text-primary"></i>Co-Planners List
                          </h5>
                          <div className="list-group shadow-xs rounded-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {selectedTrip.collaborators && selectedTrip.collaborators.length > 0 ? (
                              selectedTrip.collaborators.map((c) => (
                                <div key={c.id} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3 border text-xxs">
                                  <div className="d-flex align-items-center gap-2">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold text-xxs" style={{ width: '24px', height: '24px' }}>
                                      {c.username[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                      <strong className="d-block" style={{ color: 'var(--text-primary)' }}>{c.username}</strong>
                                      <span className="text-muted text-xxs">{c.email}</span>
                                    </div>
                                  </div>
                                  <button 
                                    className="btn btn-xs text-danger border-0 p-0" 
                                    onClick={() => handleRemoveCollaborator(selectedTrip.id, c.id)}
                                    title="Remove Co-Planner"
                                  >
                                    <i className="bi bi-person-dash-fill" style={{ fontSize: '1rem' }}></i>
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="list-group-item text-center text-muted py-3 text-xxs">
                                No co-planners added to this trip yet. Invite others to plan together!
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'analytics' && (
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <h5 className="fw-bold mb-2.5 text-sm text-info">
                            <i className="bi bi-pie-chart-fill me-1.5"></i>Expense Categories Allocation
                          </h5>
                          
                          <div className="card p-3 border shadow-xs bg-white bg-opacity-5 rounded-3 d-flex flex-column align-items-center justify-content-center">
                            {selectedTrip.expenses && selectedTrip.expenses.length > 0 ? (
                              <>
                                {/* Donut Chart SVG */}
                                <svg width="150" height="150" viewBox="0 0 36 36" className="circular-chart text-info">
                                  <path className="circle-bg"
                                    stroke="rgba(255,255,255,0.08)"
                                    strokeWidth="3.5"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                  />
                                  
                                  {(() => {
                                    const cats = ['ACCOMMODATION', 'TRANSPORT', 'FOOD', 'FLIGHTS', 'ACTIVITIES', 'OTHER'];
                                    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#6b7280'];
                                    
                                    let accumulatedPercent = 0;
                                    return cats.map((cat, idx) => {
                                      const catSum = selectedTrip.expenses
                                        .filter(e => e.category === cat)
                                        .reduce((sum, e) => sum + e.amount, 0);
                                      const pct = selectedTrip.budgetSpent > 0 ? (catSum / selectedTrip.budgetSpent) * 100 : 0;
                                      
                                      if (pct === 0) return null;
                                      
                                      const strokeDash = `${pct} ${100 - pct}`;
                                      const strokeOffset = 100 - accumulatedPercent + 25;
                                      accumulatedPercent += pct;
                                      
                                      return (
                                        <path
                                          key={cat}
                                          className="circle"
                                          stroke={colors[idx]}
                                          strokeWidth="3.5"
                                          strokeDasharray={strokeDash}
                                          strokeDashoffset={strokeOffset.toString()}
                                          fill="none"
                                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                      );
                                    });
                                  })()}
                                </svg>
                                
                                <div className="w-100 mt-3" style={{ fontSize: '11px' }}>
                                  {['ACCOMMODATION', 'TRANSPORT', 'FOOD', 'FLIGHTS', 'ACTIVITIES', 'OTHER'].map((cat, idx) => {
                                    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#6b7280'];
                                    const catSum = selectedTrip.expenses
                                      .filter(e => e.category === cat)
                                      .reduce((sum, e) => sum + e.amount, 0);
                                    if (catSum === 0) return null;
                                    const pct = ((catSum / selectedTrip.budgetSpent) * 100).toFixed(1);
                                    return (
                                      <div key={cat} className="d-flex justify-content-between align-items-center mb-1 text-white text-opacity-80">
                                        <div className="d-flex align-items-center gap-1.5">
                                          <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', background: colors[idx] }}></span>
                                          <span style={{ fontSize: '9px', textTransform: 'capitalize' }}>{cat.toLowerCase()}</span>
                                        </div>
                                        <span className="fw-semibold">{selectedTrip.currency}{catSum.toLocaleString('en-IN')} ({pct}%)</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-muted py-4 text-xxs">No expenses logged to generate charts.</div>
                            )}
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <h5 className="fw-bold mb-2.5 text-sm text-info">
                            <i className="bi bi-file-earmark-arrow-down-fill me-1.5"></i>Reports & Data Exports
                          </h5>
                          <div className="card p-3 border shadow-xs bg-white bg-opacity-5 rounded-3">
                            <p className="text-xxs text-white text-opacity-70 mb-3 lh-base">
                              Download a complete summary report of your travel schedule, scheduled activities, and logged expenses. Choose your preferred format below:
                            </p>
                            
                            <div className="d-flex flex-column gap-2">
                              <button 
                                onClick={() => handleExportPdf(selectedTrip.id)}
                                className="btn btn-outline-info btn-sm d-flex align-items-center justify-content-center gap-2 fw-semibold"
                                style={{ borderRadius: '8px', fontSize: '0.75rem' }}
                              >
                                <i className="bi bi-file-pdf-fill fs-6"></i> Download PDF Trip Summary
                              </button>
                              
                              <button 
                                onClick={() => handleExportCsv(selectedTrip.id)}
                                className="btn btn-outline-info btn-sm d-flex align-items-center justify-content-center gap-2 fw-semibold"
                                style={{ borderRadius: '8px', fontSize: '0.75rem' }}
                              >
                                <i className="bi bi-filetype-csv fs-6"></i> Download CSV Spreadsheet
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* Explore India - 3 vertical cards per row (SAME STYLE AS MY ACTIVITIES) */}
              <div className="mb-4">
                <h3 className="section-title fw-bold mb-3 d-flex align-items-center gap-2" style={{ fontSize: '1.4rem' }}>
                  <i className="bi bi-geo-alt-fill text-danger"></i>Explore Beautiful India
                </h3>
                
                <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-3">
                  {filteredDestinations.map((dest) => (
                    <div key={dest.id} className="col">
                      <div className={`glass-container trip-card-interactive explorer-card-${dest.tag.toLowerCase()} h-100 p-0 border overflow-hidden d-flex flex-column justify-content-between rounded-4`}>
                        <div className="trip-card-image-wrapper position-relative overflow-hidden" style={{ height: '120px' }}>
                          <img src={dest.image} className="trip-card-image w-100 h-100 object-fit-cover" alt={dest.name} />
                          <span className="trip-date badge bg-primary text-white position-absolute bottom-0 start-0 m-2">
                            <i className="bi bi-tag-fill me-1"></i>{dest.tag}
                          </span>
                        </div>
                        
                        <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
                          <div>
                            <span className="destination-location text-uppercase fw-bold text-xxs d-block mb-1 text-indigo">📍 {dest.location}</span>
                            <h4 className="trip-title h6 fw-bold mb-1">{dest.name}</h4>
                            <p className="trip-desc text-muted mb-3 text-xs" style={{ minHeight: '36px', lineBreak: 'anywhere' }}>
                              {dest.desc}
                            </p>
                          </div>
                          
                          <div>
                            <button 
                              onClick={() => {
                                setSelectedPkgId(dest.id);
                                setTimeout(() => {
                                  document.getElementById('package-workspace-details')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                              }}
                              className="btn btn-primary btn-sm w-100 py-1.5 text-xs d-flex align-items-center justify-content-center gap-1"
                            >
                              <i className="bi bi-gift-fill"></i> View Packages
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredDestinations.length === 0 && (
                    <div className="col-12 text-center py-4">
                      <div className="glasstic-premium card-3d-tilt animate-float-slow p-5 mx-auto text-center" 
                           style={{ 
                             maxWidth: '520px', 
                             background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.5) 100%)',
                             boxShadow: '0 20px 45px rgba(99, 102, 241, 0.15)'
                           }}>
                        <div className="card-glow-overlay" />
                        <div className="position-relative z-index-1">
                          <img 
                            src="/images/server_offline.png" 
                            alt="Planning in Progress" 
                            className="img-fluid rounded-3 mb-3 shadow-sm border border-white border-opacity-10" 
                            style={{ maxWidth: '200px', transform: 'perspective(500px) rotateX(8deg)' }} 
                          />
                          <h4 className="fw-bold mb-2 h6" style={{ color: 'var(--text-primary)' }}>
                            <i className="bi bi-search-heart-fill text-warning me-1.5 animate-pulse"></i>Planning in Progress
                          </h4>
                          <p className="text-xxs text-secondary mb-3 lh-base">
                            We couldn't find any packages for "<strong>{destSearch}</strong>" in our current catalog. Our travel coordinators are working on it and scouting new itineraries!
                          </p>
                          <button className="btn btn-primary btn-xs px-3 py-1.5 fw-semibold" onClick={() => setDestSearch('')} style={{ borderRadius: '6px' }}>
                            Show All Destinations
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ITINERARIES VIEW WORKSPACE */}
          {currentView === 'itineraries' && (
            <div className="glass-container p-3 p-md-4 rounded-4 animate-fade-in">
              <span className="role-badge badge bg-indigo-subtle text-indigo border border-indigo-subtle text-uppercase mb-1 text-xs">
                <i className="bi bi-map-fill me-1"></i>Itinerary Manager
              </span>
              <h3 className="h5 fw-bold mb-3">Develop & Schedule Days</h3>

              {/* Form 1: Add New Itinerary Day */}
              <div className="card p-3 border mb-4 shadow-xs">
                <h6 className="fw-bold text-indigo mb-2 text-sm">Add New Travel Day</h6>
                <form onSubmit={handleAddDay} className="row g-2 align-items-end">
                  <div className="col-12 col-md-5">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Select Trip Target</label>
                    <select className="form-select form-select-sm text-xs" value={itinTripId} onChange={(e) => setItinTripId(parseInt(e.target.value))}>
                      {myTrips.map((t) => (
                        <option key={t.id} value={t.id}>{t.title} (📍 {t.description.split('.')[0]} | {t.startDate} to {t.endDate})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-5">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Day Heading / Focus</label>
                    <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. Backwaters Cruise, Fort Tour" value={newDayTitle} onChange={(e) => setNewDayTitle(e.target.value)} required />
                  </div>
                  <div className="col-12 col-md-2">
                    <button type="submit" className="btn btn-primary btn-sm w-100 py-1.5 text-xs">Add Day</button>
                  </div>
                </form>
              </div>

              {/* Form 2: Add Activity to a Day */}
              <div className="card p-3 border mb-4 shadow-xs">
                <h6 className="fw-bold text-indigo mb-2 text-sm">Log New Activity</h6>
                <form onSubmit={handleAddActivity} className="row g-3">
                  <div className="col-12 col-md-3">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">1. Choose Trip Target</label>
                    <select 
                      className="form-select form-select-sm text-xs" 
                      value={actTripId} 
                      onChange={(e) => {
                        const selectedTid = parseInt(e.target.value);
                        setActTripId(selectedTid);
                        const matchedTrip = myTrips.find(t => t.id === selectedTid);
                        if (matchedTrip && matchedTrip.itinerary.length > 0) {
                          setItinDayId(matchedTrip.itinerary[0].id);
                        } else {
                          setItinDayId(0);
                        }
                      }}
                      required
                    >
                      <option value="0">-- Select Trip --</option>
                      {myTrips.map((t) => (
                        <option key={t.id} value={t.id}>{t.title} ({t.startDate})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-3">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">2. Choose Target Day</label>
                    <select 
                      className="form-select form-select-sm text-xs" 
                      value={itinDayId} 
                      onChange={(e) => setItinDayId(parseInt(e.target.value))} 
                      required
                    >
                      <option value="0">-- Select Day --</option>
                      {myTrips.find(t => t.id === actTripId)?.itinerary.map((day) => (
                        <option key={day.id} value={day.id}>Day {day.dayNumber}: {day.title}</option>
                      ))}
                    </select>
                    {actTripId > 0 && (myTrips.find(t => t.id === actTripId)?.itinerary.length || 0) === 0 && (
                      <span className="text-danger text-xxs d-block mt-1">
                        ⚠️ No days exist. Use the form above to add a day first!
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Activity Name</label>
                    <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. Elephant Ride, Museum Entry" value={actTitle} onChange={(e) => setActTitle(e.target.value)} required />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Start Time</label>
                    <div className="d-flex gap-1">
                      <select 
                        className="form-select form-select-sm text-xs px-1" 
                        value={timeHour} 
                        onChange={(e) => setTimeHour(e.target.value)}
                        style={{ minWidth: '45px' }}
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <select 
                        className="form-select form-select-sm text-xs px-1" 
                        value={timeMinute} 
                        onChange={(e) => setTimeMinute(e.target.value)}
                        style={{ minWidth: '45px' }}
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select 
                        className="form-select form-select-sm text-xs px-1" 
                        value={timePeriod} 
                        onChange={(e) => setTimePeriod(e.target.value)}
                        style={{ minWidth: '50px' }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">End Time</label>
                    <div className="d-flex gap-1">
                      <select 
                        className="form-select form-select-sm text-xs px-1" 
                        value={endTimeHour} 
                        onChange={(e) => setEndTimeHour(e.target.value)}
                        style={{ minWidth: '45px' }}
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                      <select 
                        className="form-select form-select-sm text-xs px-1" 
                        value={endTimeMinute} 
                        onChange={(e) => setEndTimeMinute(e.target.value)}
                        style={{ minWidth: '45px' }}
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select 
                        className="form-select form-select-sm text-xs px-1" 
                        value={endTimePeriod} 
                        onChange={(e) => setEndTimePeriod(e.target.value)}
                        style={{ minWidth: '50px' }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Cost (INR ₹)</label>
                    <input type="number" className="form-control form-control-sm text-xs" placeholder="e.g. 500" value={actCost} onChange={(e) => setActCost(e.target.value)} />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Location Details</label>
                    <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. Amer Palace Fort" value={actLocation} onChange={(e) => setActLocation(e.target.value)} />
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-primary btn-sm px-4 py-1.5 text-xs">Add Activity</button>
                  </div>
                </form>
              </div>

              {/* View Timelines */}
              <h5 className="fw-bold mb-3 text-sm"><i className="bi bi-list-task text-primary me-1"></i>Active Itineraries</h5>
              <div className="d-flex flex-column gap-3">
                {myTrips.map((trip) => (
                  <div key={trip.id} className="card p-3 border shadow-xs">
                    <h6 className="fw-bold mb-2 text-dark text-sm border-bottom pb-1.5">{trip.title} Timeline</h6>
                    {trip.itinerary.length === 0 ? (
                      <p className="text-muted text-xs mb-0">No days logged for this itinerary yet.</p>
                    ) : (
                      <div className="d-flex flex-column gap-2.5">
                        {trip.itinerary.map((day) => (
                          <div key={day.id} className="ps-3 border-start border-2 border-indigo-subtle mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1.5">
                              <strong className="text-indigo text-xs">Day {day.dayNumber}: {day.title}</strong>
                              <div className="position-relative">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDayDropdownId(activeDayDropdownId === day.id ? null : day.id);
                                  }} 
                                  className="btn btn-link text-secondary p-0 border-0"
                                  style={{ lineHeight: 1, fontSize: '0.85rem' }}
                                  title="Actions"
                                >
                                  <i className="bi bi-three-dots-vertical"></i>
                                </button>
                                {activeDayDropdownId === day.id && (
                                  <div 
                                    className="position-absolute bg-dark border rounded shadow py-1 text-xs" 
                                    style={{ 
                                      right: 0, 
                                      top: '100%', 
                                      zIndex: 1000, 
                                      minWidth: '110px',
                                      border: '1px solid rgba(255,255,255,0.15)' 
                                    }}
                                  >
                                    <button 
                                      onClick={() => {
                                        setActiveDayDropdownId(null);
                                        handleEditDay(day.id, day.title);
                                      }}
                                      className="dropdown-item text-white text-xxs py-1.5 px-3 text-start w-100 btn btn-link"
                                      style={{ textDecoration: 'none' }}
                                    >
                                      <i className="bi bi-pencil me-1.5 text-info"></i> Edit Day
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setActiveDayDropdownId(null);
                                        handleDeleteDay(day.id);
                                      }}
                                      className="dropdown-item text-danger text-xxs py-1.5 px-3 text-start w-100 btn btn-link"
                                      style={{ textDecoration: 'none' }}
                                    >
                                      <i className="bi bi-trash3 me-1.5"></i> Delete Day
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            {day.activities.length === 0 ? (
                              <span className="text-muted text-xxs italic">No activities scheduled yet.</span>
                            ) : (
                              day.activities.map((act) => (
                                <div key={act.id} className="text-xxs text-secondary d-flex justify-content-between align-items-center border-bottom py-1.5">
                                  <span>⏰ {act.time} - <strong>{act.title}</strong> (📍 {act.location})</span>
                                  <div className="d-flex align-items-center gap-2">
                                    <span className="fw-semibold">+{trip.currency}{act.cost.toLocaleString('en-IN')}</span>
                                    <button 
                                      onClick={() => handleDeleteActivity(act.id)} 
                                      className="btn btn-link text-danger p-0 border-0"
                                      style={{ fontSize: '0.75rem', lineHeight: 1 }}
                                      title="Delete Activity"
                                    >
                                      <i className="bi bi-trash3-fill"></i>
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPENSES VIEW WORKSPACE */}
          {currentView === 'expenses' && (
            <div className="glass-container p-3 p-md-4 rounded-4 animate-fade-in">
              <span className="role-badge badge bg-success-subtle text-success border border-success-subtle text-uppercase mb-1 text-xs">
                <i className="bi bi-wallet2 me-1"></i>Expense Tracker
              </span>
              <h3 className="h5 fw-bold mb-3">Monitor Budgets & Logs</h3>

              {/* Form: Log New Expense */}
              <div className="card p-3 border mb-4 shadow-xs">
                <h6 className="fw-bold text-success mb-2 text-sm">Log New Expense</h6>
                <form onSubmit={handleLogExpense} className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Select Trip Target</label>
                    <select className="form-select form-select-sm text-xs" value={expenseTripId} onChange={(e) => setExpenseTripId(parseInt(e.target.value))}>
                      {myTrips.map((t) => (
                        <option key={t.id} value={t.id}>{t.title} (📍 {t.description.split('.')[0]} | {t.startDate} to {t.endDate})</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Amount (INR ₹)</label>
                    <input type="number" className="form-control form-control-sm text-xs" placeholder="e.g. 2500" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Category</label>
                    <select className="form-select form-select-sm text-xs" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)}>
                      <option value="ACCOMMODATION">Accommodation</option>
                      <option value="TRANSPORT">Transport</option>
                      <option value="FOOD">Food</option>
                      <option value="ACTIVITIES">Activities</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-8">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Description / Bill Name</label>
                    <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. Lunch at beach restaurant, Train ticket" value={expenseDesc} onChange={(e) => setExpenseDesc(e.target.value)} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Date</label>
                    <input type="date" className="form-control form-control-sm text-xs" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-success btn-sm px-4 py-1.5 text-xs text-white fw-bold">Log Bill</button>
                  </div>
                </form>
              </div>

              {/* View Budgets & Logs */}
              <h5 className="fw-bold mb-3 text-sm"><i className="bi bi-currency-exchange text-success me-1"></i>Budgets per Trip</h5>
              <div className="d-flex flex-column gap-3">
                {myTrips.map((trip) => {
                  const percent = Math.min(Math.round((trip.budgetSpent / trip.budgetLimit) * 100), 100);
                  return (
                    <div key={trip.id} className="card p-3 border shadow-xs">
                      <div className="d-flex justify-content-between text-xs fw-semibold mb-2">
                        <strong className="text-dark">{trip.title}</strong>
                        <span>Spent: {trip.currency}{trip.budgetSpent.toLocaleString('en-IN')} / {trip.budgetLimit.toLocaleString('en-IN')} ({percent}%)</span>
                      </div>
                      <div className="progress mb-3" style={{ height: '8px' }}>
                        <div 
                          className={`progress-bar progress-bar-striped progress-bar-animated ${getProgressBarColorClass(percent)}`}
                          role="progressbar"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Expenses List */}
                      <strong className="text-secondary text-xxs d-block mb-1 text-uppercase">Bills List</strong>
                      {trip.expenses.length === 0 ? (
                        <p className="text-muted text-xxs italic mb-0">No expenses logged for this trip yet.</p>
                      ) : (
                        <div className="list-group rounded-3 shadow-xs">
                          {trip.expenses.map((exp) => (
                            <div key={exp.id} className="list-group-item d-flex justify-content-between align-items-center py-2 px-3 border text-xxs">
                              <div>
                                <span className="text-muted d-block text-xxxs">{exp.date}</span>
                                <strong className="text-dark">{exp.description}</strong>
                                <span className="badge bg-secondary-subtle text-secondary ms-2 text-xxxs">{exp.category}</span>
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold text-danger">-{trip.currency}{exp.amount.toLocaleString('en-IN')}</span>
                                <button className="btn btn-xs text-danger border-0 p-0" onClick={() => handleDeleteExpense(trip.id, exp.id, exp.amount)}>
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SETTINGS VIEW WORKSPACE */}
          {currentView === 'settings' && (
            <div className="glass-container p-3 p-md-4 rounded-4 animate-fade-in">
              <span className="role-badge badge bg-secondary-subtle text-secondary border border-secondary-subtle text-uppercase mb-1 text-xs">
                <i className="bi bi-gear-fill me-1"></i>System Settings
              </span>
              <h3 className="h5 fw-bold mb-4">Workspace Preferences</h3>

              {/* Theme Settings */}
              <div className="card p-3 border mb-4 shadow-xs">
                <h6 className="fw-bold text-dark mb-3 text-sm">Theme Settings</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-xs text-dark d-block">Dark Theme Toggle</strong>
                    <span className="text-secondary text-xxs">Instantly switch between Light Mode and Dark Mode interface styles.</span>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" checked={isDarkMode} onChange={handleToggleTheme} style={{ cursor: 'pointer', scale: '1.2' }} />
                  </div>
                </div>
              </div>

              {/* Profile Details Settings */}
              <div className="card p-3 border mb-4 shadow-xs">
                <h6 className="fw-bold text-dark mb-3 text-sm">Profile Details</h6>
                <form onSubmit={handleUpdateProfile} className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Username</label>
                    <input type="text" className="form-control form-control-sm text-xs" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="text-xxs text-muted fw-bold d-block mb-1">Email Address</label>
                    <input type="email" className="form-control form-control-sm text-xs" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} required />
                  </div>
                  <div className="col-12 text-end">
                    <button type="submit" className="btn btn-primary btn-sm px-4 py-1.5 text-xs">Update Profile</button>
                  </div>
                </form>
              </div>

              {/* Reset Widget */}
              <div className="card p-3 border shadow-xs border-danger bg-danger bg-opacity-5">
                <h6 className="fw-bold text-danger mb-2 text-sm">Danger Zone</h6>
                <p className="text-secondary text-xxs mb-3">Resetting your travel logs will delete all added day timelines and expenses, restoring default values.</p>
                <button className="btn btn-outline-danger btn-sm text-xs" onClick={() => {
                  if (confirm('Are you sure you want to reset all trip itineraries and logged expenses?')) {
                    window.location.reload();
                  }
                }}>
                  Reset Workspaces Data
                </button>
              </div>
            </div>
          )}

          {/* DEDICATED FULL ADMIN DASHBOARD VIEW WITH USERS AND CATALOGS SUB-TABS */}
          {currentView === 'admin' && isAdmin && (
            <div className="glass-container p-3 p-md-4 rounded-4 animate-fade-in">
              <span className="role-badge badge bg-success-subtle text-success border border-success-subtle text-uppercase mb-1 text-xs">
                <i className="bi bi-shield-lock-fill me-1"></i>Systems Admin Panel
              </span>
              <h3 className="h5 fw-bold mb-3">Database Control Console</h3>

              {/* Sub-tab selection row */}
              <div className="d-flex gap-2 mb-3">
                <button 
                  onClick={() => setAdminSubTab('users')} 
                  className={`btn px-3 py-1.5 text-xs d-flex align-items-center gap-1.5 ${adminSubTab === 'users' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                >
                  <i className="bi bi-people-fill"></i> Users Management
                </button>
                <button 
                  onClick={() => setAdminSubTab('catalogs')} 
                  className={`btn px-3 py-1.5 text-xs d-flex align-items-center gap-1.5 ${adminSubTab === 'catalogs' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                >
                  <i className="bi bi-map-fill"></i> Catalogs Management
                </button>
              </div>

              {/* TAB 1: USERS MANAGEMENT */}
              {adminSubTab === 'users' && (
                <div className="animate-fade-in">
                  
                  {/* Create New User Form */}
                  <div className="card p-3 border mb-4 shadow-xs">
                    <h6 className="fw-bold text-success mb-2.5 text-sm">Create New System User Account</h6>
                    <form onSubmit={handleCreateUser} className="row g-3">
                      <div className="col-12 col-md-5">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Username</label>
                        <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. travelagent" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Email Address</label>
                        <input type="email" className="form-control form-control-sm text-xs" placeholder="agent@example.com" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
                      </div>
                      <div className="col-12 col-md-3">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Security Role</label>
                        <select className="form-select form-select-sm text-xs" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                          <option value="ROLE_USER">USER (Traveler)</option>
                          <option value="ROLE_ORGANIZER">ORGANIZER (Agent)</option>
                          <option value="ROLE_ADMIN">ADMIN (System)</option>
                        </select>
                      </div>
                      <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success btn-sm text-white fw-bold px-4 py-1.5 text-xs">Create User</button>
                      </div>
                    </form>
                  </div>

                  {/* Registered Users Table */}
                  <div className="card p-3 border shadow-xs">
                    <h6 className="fw-bold text-success mb-3 text-sm">Registered Accounts Registry</h6>
                    <div className="table-responsive">
                      <table className="table table-hover text-xs align-middle mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email Address</th>
                            <th>Assigned Security Role</th>
                            <th className="text-end">Controls</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userList.map((u) => (
                            <tr key={u.id}>
                              <td>{u.id}</td>
                              <td><strong>{u.username}</strong></td>
                              <td>{u.email}</td>
                              <td>
                                <span className={`badge text-xxs ${u.role === 'ROLE_ADMIN' ? 'bg-success' : u.role === 'ROLE_ORGANIZER' ? 'bg-warning' : 'bg-secondary'}`}>
                                  {u.role.replace('ROLE_', '')}
                                </span>
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end gap-1.5">
                                  <button className="btn btn-xs btn-outline-primary py-1 px-2 fw-semibold text-xxs" onClick={() => handleToggleUserRole(u.id)}>
                                    Toggle Role 🔄
                                  </button>
                                  <button className="btn btn-xs btn-outline-danger py-1 px-2 fw-semibold text-xxs" onClick={() => handleDeleteUser(u.id)}>
                                    Delete 🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: CATALOGS MANAGEMENT */}
              {adminSubTab === 'catalogs' && (
                <div className="animate-fade-in">
                  
                  {/* Form to Add Destinations */}
                  <div className="card p-3 border mb-4 shadow-xs">
                    <h6 className="fw-bold text-success mb-3 text-sm">Add New Destination to Explorer Registry</h6>
                    <form onSubmit={handleAddDestination} className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Destination Name</label>
                        <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. Hawa Mahal" value={newDestName} onChange={(e) => setNewDestName(e.target.value)} required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">State / Location</label>
                        <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. Jaipur, Rajasthan" value={newDestLocation} onChange={(e) => setNewDestLocation(e.target.value)} required />
                      </div>
                      <div className="col-12 col-md-4">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Category Tag</label>
                        <select className="form-select form-select-sm text-xs" value={newDestTag} onChange={(e) => setNewDestTag(e.target.value)}>
                          <option value="Heritage">Heritage</option>
                          <option value="Nature">Nature</option>
                          <option value="Leisure">Leisure</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Royal">Royal</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-8">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Local Image File</label>
                        <select className="form-select form-select-sm text-xs" value={newDestImage} onChange={(e) => setNewDestImage(e.target.value)}>
                          <option value="/images/taj_mahal.png">Agra / Taj Mahal Cover</option>
                          <option value="/images/jaipur.png">Jaipur / Pink City Cover</option>
                          <option value="/images/kerala.png">Kerala Backwaters Cover</option>
                          <option value="/images/goa.png">Goa Beaches Cover</option>
                          <option value="/images/ladakh.png">Ladakh Mountains Cover</option>
                          <option value="/images/mumbai.png">Mumbai Skyline Cover</option>
                          <option value="/images/hampi.jpg">Hampi Ruins Cover</option>
                          <option value="/images/srinagar.jpg">Srinagar Dal Lake Cover</option>
                          <option value="/images/munnar.jpg">Munnar Tea Hills Cover</option>
                          <option value="/images/rishikonda.jpg">Vizag Beach Cover</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Catalog Description</label>
                        <textarea className="form-control form-control-sm text-xs" rows={2} placeholder="A short description of this scenic place..." value={newDestDesc} onChange={(e) => setNewDestDesc(e.target.value)} required />
                      </div>
                      <div className="col-12 text-end">
                        <button type="submit" className="btn btn-success btn-sm text-white fw-bold px-4 py-1.5 text-xs">Add Destination</button>
                      </div>
                    </form>
                  </div>

                  {/* Active Explorer Catalog Table */}
                  <div className="card p-3 border shadow-xs">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                      <h6 className="fw-bold text-success mb-0 text-sm">Destinations Explorer Registry</h6>
                      
                      {/* Catalog Search Filter */}
                      <input 
                        type="text" 
                        className="form-control form-control-sm text-xs" 
                        placeholder="🔍 Search destinations, tags..." 
                        style={{ width: '220px' }} 
                        value={destSearch}
                        onChange={(e) => setDestSearch(e.target.value)}
                      />
                    </div>

                    <div className="table-responsive">
                      <table className="table table-hover text-xs align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Cover</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th className="text-end">Controls</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDestinations.map((d) => (
                            <tr key={d.id}>
                              <td>
                                <img src={d.image} alt={d.name} style={{ width: '40px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} />
                              </td>
                              <td><strong>{d.name}</strong></td>
                              <td>{d.location}</td>
                              <td>
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle text-xxs px-1.5">
                                  {d.tag}
                                </span>
                              </td>
                              <td className="text-secondary text-xxs" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {d.desc}
                              </td>
                              <td className="text-end">
                                <button className="btn btn-xs btn-outline-danger py-1 px-2 fw-semibold text-xxs" onClick={() => handleDeleteDestination(d.id)}>
                                  Delete 🗑️
                                </button>
                              </td>
                            </tr>
                          ))}
                          {filteredDestinations.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center text-muted py-3">No matching destinations found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* DEDICATED FULL ORGANIZER/AGENT DASHBOARD VIEW WITH PACKAGES AND BOOKINGS SUB-TABS */}
          {currentView === 'organizer' && isOrganizer && (
            <div className="glass-container p-3 p-md-4 rounded-4 animate-fade-in">
              <span className="role-badge badge bg-warning-subtle text-warning border border-warning-subtle text-uppercase mb-1 text-xs">
                <i className="bi bi-briefcase-fill me-1"></i>Agent Workspace Console
              </span>
              <h3 className="h5 fw-bold mb-4">Travel Package Coordinator</h3>

              {/* Sub-tab selection row */}
              <div className="d-flex gap-2 mb-3">
                <button 
                  onClick={() => setOrganizerSubTab('packages')} 
                  className={`btn px-3 py-1.5 text-xs d-flex align-items-center gap-1.5 ${organizerSubTab === 'packages' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                >
                  <i className="bi bi-gift-fill"></i> Tour Packages
                </button>
                <button 
                  onClick={() => setOrganizerSubTab('bookings')} 
                  className={`btn px-3 py-1.5 text-xs d-flex align-items-center gap-1.5 ${organizerSubTab === 'bookings' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                >
                  <i className="bi bi-calendar-check-fill"></i> Client Bookings
                </button>
              </div>

              {/* SUB-TAB 1: TOUR PACKAGES */}
              {organizerSubTab === 'packages' && (
                <div className="animate-fade-in">
                  
                  {/* Create Package Form */}
                  <div className="card p-3 border mb-4 shadow-xs">
                    <h6 className="fw-bold text-warning mb-3 text-sm">Create New Travel Package Tour</h6>
                    <form onSubmit={handleCreatePackage} className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Package Title</label>
                        <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. South Indian Coastal Tour" value={pkgTitle} onChange={(e) => setPkgTitle(e.target.value)} required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Destination Target</label>
                        <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. Munnar & Alleppey" value={pkgDest} onChange={(e) => setPkgDest(e.target.value)} required />
                      </div>
                      <div className="col-6 col-md-3">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Duration (Days)</label>
                        <input type="number" className="form-control form-control-sm text-xs" placeholder="e.g. 5" value={pkgDuration} onChange={(e) => setPkgDuration(e.target.value)} required />
                      </div>
                      <div className="col-6 col-md-3">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Price (INR ₹)</label>
                        <input type="number" className="form-control form-control-sm text-xs" placeholder="e.g. 29999" value={pkgPrice} onChange={(e) => setPkgPrice(e.target.value)} required />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Thumbnail Cover Image</label>
                        <select className="form-select form-select-sm text-xs" value={pkgImage} onChange={(e) => setPkgImage(e.target.value)}>
                          <option value="/images/jaipur.png">Jaipur / Pink City Cover</option>
                          <option value="/images/taj_mahal.png">Agra / Taj Mahal Cover</option>
                          <option value="/images/kerala.png">Kerala Backwaters Cover</option>
                          <option value="/images/goa.png">Goa Beaches Cover</option>
                          <option value="/images/mumbai.png">Mumbai City Cover</option>
                          <option value="/images/munnar.jpg">Munnar Tea Hills Cover</option>
                        </select>
                      </div>
                      <div className="col-12 text-end">
                        <button type="submit" className="btn btn-warning btn-sm text-dark fw-bold px-4 py-1.5 text-xs">Build Package</button>
                      </div>
                    </form>
                  </div>

                  {/* Active Packages grid */}
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h5 className="fw-bold mb-0 text-sm"><i className="bi bi-tag-fill text-warning me-1"></i>Active Packages Catalog</h5>
                    
                    {/* Packages Search Filter */}
                    <input 
                      type="text" 
                      className="form-control form-control-sm text-xs" 
                      placeholder="🔍 Search packages, destinations..." 
                      style={{ width: '220px' }} 
                      value={pkgSearch}
                      onChange={(e) => setPkgSearch(e.target.value)}
                    />
                  </div>

                  <div className="row g-3 row-cols-1 row-cols-md-2">
                    {filteredPackages.map((pkg) => (
                      <div key={pkg.id} className="col">
                        <div className="card p-0 border shadow-xs overflow-hidden h-100 d-flex flex-row">
                          <div style={{ width: '100px', height: '100px' }} className="flex-shrink-0">
                            <img src={pkg.image} alt={pkg.title} className="w-100 h-100 object-fit-cover" />
                          </div>
                          <div className="p-3 d-flex flex-column justify-content-between flex-grow-1 text-xs">
                            <div>
                              <strong className="d-block text-dark" style={{ fontSize: '0.85rem' }}>{pkg.title}</strong>
                              <span className="text-muted d-block mb-1">📍 {pkg.destination} ({pkg.duration} Days)</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold text-primary">₹{pkg.price.toLocaleString('en-IN')}</span>
                              <button className="btn btn-xs text-danger border-0 p-0" onClick={() => handleDeletePackage(pkg.id)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredPackages.length === 0 && (
                      <div className="col-12 text-center text-muted py-3">No matching packages found.</div>
                    )}
                  </div>

                </div>
              )}

              {/* SUB-TAB 2: CLIENT BOOKINGS & SIMULATOR */}
              {organizerSubTab === 'bookings' && (
                <div className="animate-fade-in">
                  
                  {/* Traveler Bookings Metrics Badges */}
                  <div className="row g-3 mb-4">
                    <div className="col-4">
                      <div className="card p-2 border text-center shadow-xxs">
                        <span className="text-muted text-xxs d-block">Total Requests</span>
                        <strong className="h6 fw-bold mb-0 text-dark">{bookingList.length}</strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="card p-2 border text-center shadow-xxs">
                        <span className="text-muted text-xxs d-block">Pending Confirmation</span>
                        <strong className="h6 fw-bold mb-0 text-warning">{bookingList.filter(b => b.status === 'Pending').length}</strong>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="card p-2 border text-center shadow-xxs">
                        <span className="text-muted text-xxs d-block">Confirmed Books</span>
                        <strong className="h6 fw-bold mb-0 text-success">{bookingList.filter(b => b.status === 'Confirmed').length}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Booking Simulator Form */}
                  <div className="card p-3 border mb-4 shadow-xs">
                    <h6 className="fw-bold text-warning mb-2 text-sm">Travel Bookings Simulator</h6>
                    <form onSubmit={handleSimulateBooking} className="row g-2 align-items-end">
                      <div className="col-12 col-md-5">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Tourist Client Name</label>
                        <input type="text" className="form-control form-control-sm text-xs" placeholder="e.g. Kilaparthi Mohan" value={simClientName} onChange={(e) => setSimClientName(e.target.value)} required />
                      </div>
                      <div className="col-12 col-md-5">
                        <label className="text-xxs text-muted fw-bold d-block mb-1">Select Chosen Package</label>
                        <select className="form-select form-select-sm text-xs" value={simPkgId} onChange={(e) => setSimPkgId(parseInt(e.target.value))}>
                          {packageList.map((p) => (
                            <option key={p.id} value={p.id}>{p.title} (₹{p.price.toLocaleString('en-IN')})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12 col-md-2">
                        <button type="submit" className="btn btn-warning btn-sm w-100 py-1.5 text-xs text-dark fw-bold">Simulate Book</button>
                      </div>
                    </form>
                  </div>

                  {/* Traveler Bookings Registry Table */}
                  <div className="card p-3 border shadow-xs">
                    <h6 className="fw-bold text-warning mb-3 text-sm">Client Bookings List</h6>
                    <div className="table-responsive">
                      <table className="table table-hover text-xs align-middle mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Chosen Tour Package</th>
                            <th>Price Logged</th>
                            <th>Date Requested</th>
                            <th>Status</th>
                            <th className="text-end">Controls</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingList.map((b) => (
                            <tr key={b.id}>
                              <td>{b.id}</td>
                              <td><strong>{b.username}</strong></td>
                              <td>{b.packageName}</td>
                              <td>₹{b.price.toLocaleString('en-IN')}</td>
                              <td>{b.date}</td>
                              <td>
                                <span className={`badge text-xxs ${b.status === 'Confirmed' ? 'bg-success' : b.status === 'Cancelled' ? 'bg-danger' : 'bg-warning'}`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end gap-1.5">
                                  {b.status === 'Pending' ? (
                                    <>
                                      <button className="btn btn-xs btn-success text-white py-1 px-1.5 text-xxs fw-bold" onClick={() => handleUpdateBookingStatus(b.id, 'Confirmed')}>
                                        Confirm ✔
                                      </button>
                                      <button className="btn btn-xs btn-outline-danger py-1 px-1.5 text-xxs fw-bold" onClick={() => handleUpdateBookingStatus(b.id, 'Cancelled')}>
                                        Cancel ✖
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-muted text-xxs italic">Logged</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

              {/* Selected Destination Package Details sheet (BEAUTIFIED CINEMATIC PANEL) */}
              {selectedPackageDest && (
                <div id="package-workspace-details" className="selected-package-workspace animate-fade-in p-3 p-md-4 mb-4 rounded-4 shadow-glow">
                  <div className="workspace-hero position-relative overflow-hidden mb-4 rounded-4" style={{ height: '220px' }}>
                    <img src={selectedPackageDest.image} className="w-100 h-100 object-fit-cover" alt={selectedPackageDest.name} style={{ filter: 'brightness(0.55)' }} />
                    <div className="position-absolute bottom-0 start-0 m-3 text-white z-index-10">
                      <span className="badge bg-danger text-uppercase text-xxs mb-1.5 px-2 py-1">
                        <i className="bi bi-stars me-1"></i>Special Package Deal
                      </span>
                      <h3 className="h3 fw-bold mb-0 text-white">{selectedPackageDest.name}</h3>
                      <p className="opacity-90 text-xs mb-0 text-white-50">
                        📍 State: {selectedPackageDest.location} | Category: {selectedPackageDest.tag}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedPkgId(null)} 
                      className="btn btn-xs btn-light position-absolute top-0 end-0 m-3 z-index-10"
                      style={{ borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}
                    >
                      <i className="bi bi-x-lg"></i> Close Details
                    </button>
                  </div>
                  
                  <div className="row g-4">
                    <div className="col-12 col-md-8">
                      <h5 className="fw-bold mb-2.5 text-indigo text-sm">Package Overview & Itinerary</h5>
                      <p className="package-overview-text text-xs mb-4 lh-base">
                        {selectedPackageDest.desc} Experience the absolute best of {selectedPackageDest.name}. Our premium package guarantees comfort, professional English-speaking guided tours, high-end private taxi transports, and entry passes to all historical monuments.
                      </p>
                      
                      <h6 className="package-plan-heading fw-bold text-xs mb-2.5"><i className="bi bi-list-stars me-1 text-primary"></i>Included Sample Plan (5 Days / 4 Nights)</h6>
                      <div className="d-flex flex-column gap-2.5">
                        <div className="ps-3 border-start border-2 border-primary-subtle text-xs package-day-item">
                          <strong className="package-day-title">Day 1: Arrival & Hotel Welcome</strong>
                          <span className="package-day-desc d-block text-xxs">Airport cab pick-up and check-in to a luxury boutique 4-star resort. Welcome drinks and resort dinner included.</span>
                        </div>
                        <div className="ps-3 border-start border-2 border-primary-subtle text-xs package-day-item">
                          <strong className="package-day-title">Day 2: Guided Sightseeing & Bazaars</strong>
                          <span className="package-day-desc d-block text-xxs">Explore the iconic landmarks, capture landscape photography, and experience traditional bazaar shopping with a guide.</span>
                        </div>
                        <div className="ps-3 border-start border-2 border-primary-subtle text-xs package-day-item">
                          <strong className="package-day-title">Day 3: Nature Trek & Scenic Sunset</strong>
                          <span className="package-day-desc d-block text-xxs">Visit the scenic backwaters or viewpoints. Sunset dinners overlooking the views.</span>
                        </div>
                      </div>

                      {destWeatherData && (
                        <div className="package-weather-card mt-3.5 p-3 rounded border animate-fade-in">
                          <span className="package-weather-title text-uppercase text-xxs fw-bold d-block mb-2">
                            <i className="bi bi-cloud-sun me-1"></i>Live Weather Forecast ({selectedPackageDest.name.split(',')[1]?.trim() || selectedPackageDest.name})
                          </span>
                          <div className="d-flex align-items-center gap-3">
                            <span className="fs-1 animate-float-slow">
                              {destWeatherData.weather?.[0]?.main === 'Rain' ? '🌧️' : 
                               destWeatherData.weather?.[0]?.main === 'Clear' ? '☀️' : 
                               destWeatherData.weather?.[0]?.main === 'Mist' ? '🌫️' : '⛅'}
                            </span>
                            <div>
                              <div className="fs-5 fw-bold">{destWeatherData.main?.temp}°C</div>
                              <div className="package-weather-desc text-xxs text-opacity-80 text-capitalize">{destWeatherData.weather?.[0]?.description}</div>
                            </div>
                            <div className="package-weather-details ms-auto text-end" style={{ fontSize: '10px' }}>
                              <div>
                                Humidity: <strong>{destWeatherData.main?.humidity}%</strong>
                              </div>
                              <div>
                                Wind Speed: <strong>{destWeatherData.wind?.speed} m/s</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="col-12 col-md-4">
                      <div className="card p-3 border shadow-xs h-100 d-flex flex-column justify-content-between rounded-3 package-pricing-card">
                        <div>
                          <span className="text-uppercase package-pricing-title text-xxs fw-bold d-block mb-1">Pricing Details</span>
                          <h4 className="fw-bold text-warning mb-1">₹22,500 <span className="package-pricing-sub" style={{ fontSize: '0.6rem' }}>/ traveler</span></h4>
                          <span className="badge bg-success text-white text-xxs mb-3">All Inclusive Price</span>
                          
                          <div className="d-flex flex-column gap-2 text-xxs package-pricing-bullets">
                            <span><i className="bi bi-check-circle-fill text-success me-1.5"></i>4 Nights in Premium 4-Star Resort</span>
                            <span><i className="bi bi-check-circle-fill text-success me-1.5"></i>All Meals Included (Veg/Non-Veg)</span>
                            <span><i className="bi bi-check-circle-fill text-success me-1.5"></i>Private SUV transport & Driver</span>
                            <span><i className="bi bi-check-circle-fill text-success me-1.5"></i>All Monument entry fees covered</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleBookPackage(selectedPackageDest)} 
                          className="btn btn-primary btn-sm w-100 py-2 text-xs fw-bold mt-4 d-flex align-items-center justify-content-center gap-1.5"
                          style={{ borderRadius: '8px' }}
                        >
                          <i className="bi bi-calendar-check-fill"></i> Book Package Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

        </div>
      </div>
      )}

      {toastMessage && (
        <div className={`premium-top-toast toast-type-${toastType}`}>
          <div className="toast-glow-slide" />
          <div className="toast-3d-content">
            <div className="d-flex align-items-center gap-3 mb-2">
              <img 
                src="/images/server_offline.png" 
                alt="Notification Illustration" 
                style={{ width: '48px', height: '48px', borderRadius: '12px', transform: 'translateZ(25px)', border: '2px solid rgba(255, 255, 255, 0.25)' }} 
                className="animate-float-slow bg-dark bg-opacity-25 p-1" 
              />
              <div>
                <h5 className="text-sm fw-bold mb-0.5 text-white" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.35)', letterSpacing: '0.2px' }}>
                  <i className={`bi me-2 ${
                    toastType === 'error' ? 'bi-exclamation-octagon-fill' : toastType === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill'
                  }`}></i>
                  {toastType === 'error' ? 'Operation Alert' : toastType === 'success' ? 'Action Completed Successfully' : 'Travel Assistant Alert'}
                </h5>
                <span className="text-xxs text-white text-opacity-70 d-block">
                  {toastType === 'error' ? 'Action failed' : toastType === 'success' ? 'Synchronized to server' : 'Status update received'}
                </span>
              </div>
              <button 
                className="btn-close btn-close-white ms-auto border border-white border-opacity-20" 
                onClick={() => setToastMessage(null)} 
                style={{ 
                  fontSize: '0.7rem', 
                  padding: '0.4rem', 
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }} 
                aria-label="Close" 
              />
            </div>
            <p className="text-xs mb-0 lh-base text-white fw-medium ps-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)', transform: 'translateZ(15px)' }}>
              {toastMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
