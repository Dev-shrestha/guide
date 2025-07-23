import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const initialDestinations = [
  {
    id: 1,
    name: 'Everest Base Camp',
    description: 'Trek to the base of the world\'s highest mountain',
    image: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg',
    category: 'trekking',
    difficulty: 'challenging'
  },
  {
    id: 2,
    name: 'Pokhara',
    description: 'Beautiful lakeside city with stunning mountain views',
    image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg',
    category: 'culture',
    difficulty: 'easy'
  },
  {
    id: 3,
    name: 'Chitwan National Park',
    description: 'Wildlife safari and jungle adventures',
    image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
    category: 'adventure',
    difficulty: 'moderate'
  },
  {
    id: 4,
    name: 'Kathmandu Valley',
    description: 'Historic temples and cultural heritage sites',
    image: 'https://images.pexels.com/photos/1829980/pexels-photo-1829980.jpeg',
    category: 'culture',
    difficulty: 'easy'
  },
  {
    id: 5,
    name: 'Annapurna Circuit',
    description: 'Classic trek through diverse landscapes',
    image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg',
    category: 'trekking',
    difficulty: 'moderate'
  },
  {
    id: 6,
    name: 'Lumbini',
    description: 'Birthplace of Buddha - spiritual journey',
    image: 'https://images.pexels.com/photos/8847840/pexels-photo-8847840.jpeg',
    category: 'spiritual',
    difficulty: 'easy'
  }
];

const initialGuides = [
  {
    id: 1,
    name: 'Pemba Sherpa',
    specialties: ['trekking', 'mountaineering'],
    languages: ['English', 'Nepali', 'Tibetan'],
    experience: '8 years',
    rating: 4.9,
    available: true,
    location: 'Everest Region',
    phone: '+977-9841234567',
    email: 'pemba.sherpa@guide.com',
    bio: 'Experienced mountain guide with extensive knowledge of Everest region. Certified mountaineering instructor.',
    completedTrips: 156,
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  },
  {
    id: 2,
    name: 'Sita Gurung',
    specialties: ['culture', 'photography'],
    languages: ['English', 'Nepali', 'German'],
    experience: '5 years',
    rating: 4.8,
    available: true,
    location: 'Pokhara',
    phone: '+977-9851234568',
    email: 'sita.gurung@guide.com',
    bio: 'Cultural heritage specialist and photography guide. Expert in Nepali traditions and customs.',
    completedTrips: 89,
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
  },
  {
    id: 3,
    name: 'Raj Thapa',
    specialties: ['wildlife', 'adventure'],
    languages: ['English', 'Nepali', 'Hindi'],
    experience: '6 years',
    rating: 4.7,
    available: false,
    location: 'Chitwan',
    phone: '+977-9861234569',
    email: 'raj.thapa@guide.com',
    bio: 'Wildlife expert and adventure guide specializing in jungle safaris and nature photography.',
    completedTrips: 112,
    profileImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
  },
  {
    id: 4,
    name: 'Maya Tamang',
    specialties: ['spiritual', 'culture', 'meditation'],
    languages: ['English', 'Nepali', 'Tibetan', 'Hindi'],
    experience: '7 years',
    rating: 4.9,
    available: true,
    location: 'Kathmandu Valley',
    phone: '+977-9871234570',
    email: 'maya.tamang@guide.com',
    bio: 'Spiritual guide and meditation teacher with deep knowledge of Buddhist and Hindu traditions.',
    completedTrips: 134,
    profileImage: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg'
  },
  {
    id: 5,
    name: 'Karma Lama',
    specialties: ['trekking', 'adventure', 'photography'],
    languages: ['English', 'Nepali', 'Tibetan', 'Chinese'],
    experience: '9 years',
    rating: 4.8,
    available: true,
    location: 'Annapurna Region',
    phone: '+977-9881234571',
    email: 'karma.lama@guide.com',
    bio: 'High-altitude trekking specialist with expertise in Annapurna and Manaslu circuits.',
    completedTrips: 178,
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  }
];

export const DataProvider = ({ children }) => {
  const [destinations] = useState(initialDestinations);
  const [guides, setGuides] = useState(() => {
    const stored = localStorage.getItem('nepal_guide_guides');
    return stored ? JSON.parse(stored) : initialGuides;
  });
  const [requests, setRequests] = useState(() => {
    const stored = localStorage.getItem('nepal_guide_requests');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('nepal_guide_guides', JSON.stringify(guides));
  }, [guides]);

  useEffect(() => {
    localStorage.setItem('nepal_guide_requests', JSON.stringify(requests));
  }, [requests]);

  const submitRequest = (requestData) => {
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      assignedGuide: null,
      destinationNames: requestData.selectedDestinations.map(id => {
        const dest = destinations.find(d => d.id === id);
        return { id, name: dest ? dest.name : `Destination ${id}` };
      })
    };
    
    setRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  const assignGuide = (requestId, guideId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'assigned', assignedGuide: guideId, assignedAt: new Date().toISOString() }
        : req
    ));
    
    // Don't automatically mark guide as unavailable - they can handle multiple assignments
    
    // In a real application, this would send notifications
    const request = requests.find(r => r.id === requestId);
    const guide = guides.find(g => g.id === guideId);
    console.log(`✅ Guide Assignment: ${guide?.name} has been assigned to ${request?.touristName}'s ${request?.tourType} tour`);
  };

  const updateRequestStatus = (requestId, status) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status, updatedAt: new Date().toISOString() }
        : req
    ));
    
    if (status === 'completed') {
      // Mark guide as available again when trip is completed
      const request = requests.find(r => r.id === requestId);
      if (request?.assignedGuide) {
        setGuides(prev => prev.map(guide => 
          guide.id === request.assignedGuide 
            ? { ...guide, available: true, completedTrips: (guide.completedTrips || 0) + 1 }
            : guide
        ));
      }
    }
  };

  const updateGuide = (guideId, updates) => {
    setGuides(prev => prev.map(guide => 
      guide.id === guideId 
        ? { ...guide, ...updates }
        : guide
    ));
  };

  const value = {
    destinations,
    guides,
    requests,
    submitRequest,
    assignGuide,
    updateRequestStatus,
    updateGuide
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};