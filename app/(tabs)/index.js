import React, { useState, useEffect, useRef } from 'react';
import dianaAvatar from '../../assets/images/diana.jpg';
import runiAvatar from '../../assets/images/runi.jpg';
import rishiAvatar from '../../assets/images/rishi.jpg';
import andriaAvatar from '../../assets/images/andria.jpg';
import antonyAvatar from '../../assets/images/antony.jpg';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

const { width, height } = Dimensions.get('window');

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Yale campus boundary coordinates 
const YALE_BOUNDARY = [
  // Starting point
  { latitude: 41.308823, longitude: -72.925301 },
  // Line 1 endpoint
  { latitude: 41.309490, longitude: -72.926974 },
  // Line 2 endpoint
  { latitude: 41.307281, longitude: -72.928678 },
  // Line 3 endpoint
  { latitude: 41.308934, longitude: -72.933456 },
  // Line 4 endpoint
  { latitude: 41.311342, longitude: -72.931799 },
  // Line 5 endpoint
  { latitude: 41.312403, longitude: -72.931549 },
  // Line 6 endpoint
  { latitude: 41.312508, longitude: -72.931728 },
  // Line 7 endpoint
  { latitude: 41.314170, longitude: -72.931272 },
  // Line 8 endpoint
  { latitude: 41.313508, longitude: -72.930612 },
  // Line 9 endpoint
  { latitude: 41.311824, longitude: -72.930407 },
  // Line 10 endpoint
  { latitude: 41.311286, longitude: -72.929953 },
  // Line 11 endpoint
  { latitude: 41.312539, longitude: -72.928803 },
  // Line 12 endpoint
  { latitude: 41.311922, longitude: -72.925465 },
  // Line 13 endpoint
  { latitude: 41.313885, longitude: -72.924921 },
  // Line 14 endpoint
  { latitude: 41.313629, longitude: -72.923704 },
  // Line 15 endpoint
  { latitude: 41.31292669941359, longitude: -72.92264676378392 },
  // Line 16 endpoint
  { latitude: 41.312276, longitude: -72.922980 },
  // Line 17 endpoint
  { latitude: 41.312748, longitude: -72.923944 },
  // Line 18 endpoint
  { latitude: 41.311398, longitude: -72.924538 },
  // Line 19 endpoint
  { latitude: 41.311084, longitude: -72.923882 },
  // Line 20 endpoint
  { latitude: 41.310145, longitude: -72.924585 },
  // Line 21 endpoint
  { latitude: 41.309831, longitude: -72.923918 },
  // Line 22 endpoint
  { latitude: 41.310247, longitude: -72.923520 },
  // Line 23 endpoint
  { latitude: 41.309782, longitude: -72.923771 },
  // Line 24 endpoint
  { latitude: 41.309574, longitude: -72.923304 },
  // Line 25 endpoint
  { latitude: 41.309971, longitude: -72.924468 },
  // Line 26 connects back to starting point: 41.308289, -72.924102
];

// All YYGS and non-YYGS locations with coordinates INSIDE the border
const LOCATIONS = [
  // YYGS Buildings
  {
    id: 1,
    name: "Davenport College",
    type: 'yygs',
    coordinate: { latitude: 41.31033350138456, longitude: -72.93165048057507 },
    address: "248 York St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Runi Baker",
      studentImage: runiAvatar,
      text: "Its spacious courtyard and gothic architecture make it a perfect place to relax and almost make up for the lack of AC.",
      rating: 5
    }
  },
  {
    id: 2,
    name: "Pierson College",
    type: 'yygs',
    coordinate: { latitude: 41.30991609169399, longitude: -72.93264191759437 },
    address: "261 Park St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Rishi Salvi",
      studentImage: rishiAvatar,
      text: "Vibrant community with a great dining hall and buttery. Always full of people and activities!",
      rating: 5
    }
  },
  {
    id: 3,
    name: "Jonathan Edwards College",
    type: 'yygs',
    coordinate: { latitude: 41.30911022524428, longitude: -72.93036416765145 },
    address: "68 High St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Diana Xiao",
      studentImage: dianaAvatar,
      text: "JE has great dorms and a cozy common room. Love the dining hall food. Go Spiders!",
      rating: 4
    }
  },
  {
    id: 4,
    name: "Davies Auditorium",
    type: 'yygs',
    coordinate: { latitude: 41.3126245068552, longitude: -72.92498925576845 },
    address: "15 Prospect St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Andria Adeishvili",
      studentImage: andriaAvatar,
      text: "Very spacious auditorium with upper seating and great acoustics. Very good for lectures and speaker series.",
      rating: 4
    }
  },
  {
    id: 5,
    name: "Linsly-Chittenden Hall",
    type: 'yygs',
    coordinate: { latitude: 41.30857673845382, longitude: -72.92956239058107 },
    address: "63 High St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Rishi Salvi",
      studentImage: rishiAvatar,
      text: "All my lectures are in this room. Love how spacious the lecture halls are.",
      rating: 5
    }
  },
  {
    id: 6,
    name: "Loria Center",
    type: 'yygs',
    coordinate: { latitude: 41.30905221653587, longitude: -72.93162139541775 },
    address: "190 York St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Runi Baker",
      studentImage: runiAvatar,
      text: "Very nice and modern building. Enjoyed going there for lectures. Located right next to a wonderful cafe!",
      rating: 4
    }
  },
  // Study Places
  {
    id: 7,
    name: "Sterling Memorial Library",
    type: 'study',
    coordinate: { latitude: 41.311228176705, longitude: -72.92828504317357 },
    address: "120 High St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Diana Xiao",
      studentImage: dianaAvatar,
      text: "Beautiful library with a wonderful collection of books. I think you would need 3 lifetimes to read all the books!",
      rating: 5
    }
  },
  {
    id: 8,
    name: "Bass Library",
    type: 'study',
    coordinate: { latitude: 41.31079362094868, longitude: -72.92726967683372 },
    address: "110 Wall St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Andria Adeishvili",
      studentImage: andriaAvatar,
      text: "Library connected to Sterling, but lot less crowded. Rooms for individual as well as group studies are always available",
      rating: 5
    }
  },
  
  // Sightseeing Places
  {
    id: 10,
    name: "Beinecke Rare Book and Manuscript Library",
    type: 'sightseeing',
    coordinate: { latitude: 41.3114708118431, longitude: -72.92739352758754 },
    address: "121 Wall St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Antony Choi",
      studentImage: antonyAvatar,
      text: "Once in a lifetime kind of building. Floors upon floors of books. Must see for anyone interested in literature or history.",
      rating: 5
    }
  },
  {
    id: 11,
    name: "Harkness Tower",
    type: 'sightseeing',
    coordinate: { latitude: 41.309601491391064, longitude: -72.92938911109634 },
    address: "149 Elm St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Diana Xiao",
      studentImage: dianaAvatar,
      text: "This clock tower is one of Yale's most iconic sports. The view from the top is quite breathtaking.",
      rating: 5
    }
  },
  {
    id: 12,
    name: "Yale University Art Gallery",
    type: 'sightseeing',
    coordinate: { latitude: 41.3086203059563, longitude: -72.9308587966994 },
    address: "1111 Chapel St, New Haven, CT 06510",
    cardAccess: true,
    review: {
      studentName: "Rishi Salvi",
      studentImage: rishiAvatar,
      text: "This public gallery contains pristine pieces from across the world and throughout the ages. The building is just as beautiful!",
      rating: 5
    }
  },
  {
    id: 13,
    name: "Yale Repertory Theater",
    type: 'sightseeing',
    coordinate: { latitude: 41.30834414788797, longitude: -72.93144709731139 },
    address: "1120 Chapel St, New Haven, CT 06510",
    cardAccess: false,
    review: {
      studentName: "Diana Xiao",
      studentImage: dianaAvatar,
      text: "Great theater with fantastic acoustics and performances. Highly recommend viewing a show here!",
      rating: 5
    }
  },
  {
    id: 14,
    name: "Woolsey Hall",
    type: 'sightseeing',
    coordinate: { latitude: 41.31141119921458, longitude: -72.92604820526208 },
    address: "500 College St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Runi Baker",
      studentImage: runiAvatar,
      text: "This 120+ year old theater has plently of functions and musical events.",
      rating: 5
    }
  },
  {
    id: 15,
    name: "Old Campus",
    type: 'sightseeing',
    coordinate: { latitude: 41.309311656456636, longitude: -72.92823126863237 },
    address: "344 College St, New Haven, CT 06511",
    cardAccess: true,
    review: {
      studentName: "Andria Aldeishvili",
      studentImage: andriaAvatar,
      text: "Plenty of history and gothic architecture. A great place to explore for prospective Yale students.",
      rating: 5
    }
  },
  // Food Places
  {
    id: 17,
    name: "Starbucks",
    type: 'food',
    coordinate: { latitude: 41.30782034143576, longitude: -72.9302510526084 },
    address: "1068-1070 Chapel St, New Haven, CT 06510",
    cardAccess: false,
    review: {
      studentName: "Runi Baker",
      studentImage: runiAvatar,
      text: "It is Starbucks, what more is there to say.",
      rating: 3
    }
  },
  {
    id: 18,
    name: "Panera Bread",
    type: 'food',
    coordinate: { latitude: 41.307787, longitude: -72.930112 },
    address: "1060 Chapel St, New Haven, CT 06511",
    cardAccess: false,
    review: {
      studentName: "Rishi Salvi",
      studentImage: rishiAvatar,
      text: "Get the You Pick Two with a soup/mac and sandwich. Great for studying and getting a quick meal.",
      rating: 4
    }
  },
  {
    id: 20,
    name: "Ashley's Ice Cream",
    type: 'food',
    coordinate: { latitude: 41.31124184778089, longitude: -72.92978039296989 },
    address: "280 York St, New Haven, CT 06511",
    cardAccess: false,
    review: {
      studentName: "Diana Xiao",
      studentImage: dianaAvatar,
      text: "Checkout Ashley's Ice cream, my favourite flavour is chocolate oreo!!",
      rating: 5
    }
  },
  {
    id: 23,
    name: "Shah's Halal Food",
    type: 'food',
    coordinate: { latitude: 41.31145357982092, longitude: -72.9301036273389},
    address: "286 York St, New Haven, CT 06511",
    cardAccess: false,
    review: {
      studentName: "Andria Aldeishvili",
      studentImage: andriaAvatar,
      text: "Great place to go if you need quarters. The food is also pretty fire.",
      rating: 5
    }
  },
  {
    id: 24,
    name: "Tomatillo",
    type: 'food',
    coordinate: { latitude: 41.3111928860258, longitude: -72.93172573468185 },
    address: "320 Elm St, New Haven, CT 06511",
    cardAccess: false,
    review: {
      studentName: "Runi Baker",
      studentImage: runiAvatar,
      text: "Great food and portion sizes. The stuff is always very fresh and tasty.",
      rating: 4
    }
  },
  {
    id: 25,
    name: "Shake Shack",
    type: 'food',
    coordinate: { latitude: 41.30707000616658, longitude: -72.92786541735364 },
    address: "986 Chapel St, New Haven, CT 06510",
    cardAccess: false,
    review: {
      studentName: "Antony Choi",
      studentImage: antonyAvatar,
      text: "I love Shake Shack!!! I have been doing daily Shake Shack every day!!!",
      rating: 5
    }
  },
];

const MapScreen = ({ userName = "Andria" }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isWithinBounds, setIsWithinBounds] = useState(true);
  const [distanceToBorder, setDistanceToBorder] = useState(null);
  const [lastWarningTime, setLastWarningTime] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const [hasInitiallyFocused, setHasInitiallyFocused] = useState(false);
  const mapRef = useRef(null);

  // Add this function to calculate boundary center
  const calculateBoundaryCenter = (boundary) => {
    if (boundary.length === 0) return { latitude: 41.3120, longitude: -72.9230 };
    
    let totalLat = 0;
    let totalLng = 0;
    
    boundary.forEach(point => {
      totalLat += point.latitude;
      totalLng += point.longitude;
    });
    
    return {
      latitude: totalLat / boundary.length,
      longitude: totalLng / boundary.length
    };
  };

  useEffect(() => {
    setupLocationTracking();
  }, []);

  // Only focus on user location ONCE when first available
  useEffect(() => {
    if (userLocation && mapRef.current && mapReady && !hasInitiallyFocused) {
      // Small delay to ensure map is fully rendered
      setTimeout(() => {
        mapRef.current.animateToRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }, 1500); // Smooth animation over 1.5 seconds
        setHasInitiallyFocused(true); 
      }, 500);
    }
  }, [userLocation, mapReady, hasInitiallyFocused]);

  // Center on Yale campus when app launches
  useEffect(() => {
    if (mapRef.current && mapReady && !userLocation) {
      const boundaryCenter = calculateBoundaryCenter(YALE_BOUNDARY);
      setTimeout(() => {
        mapRef.current.animateToRegion({
          latitude: boundaryCenter.latitude,
          longitude: boundaryCenter.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }, 1000);
      }, 300);
    }
  }, [mapReady, userLocation]);

  // IMPROVED GEOFENCING FUNCTIONS
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Calculate distance from a point to a line segment
  const distancePointToLineSegment = (point, lineStart, lineEnd) => {
    const A = point.latitude - lineStart.latitude;
    const B = point.longitude - lineStart.longitude;
    const C = lineEnd.latitude - lineStart.latitude;
    const D = lineEnd.longitude - lineStart.longitude;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) {
      
      return calculateDistance(point.latitude, point.longitude, lineStart.latitude, lineStart.longitude);
    }
    
    let param = dot / lenSq;
    
    let closestPoint;
    if (param < 0) {
      closestPoint = lineStart;
    } else if (param > 1) {
      closestPoint = lineEnd;
    } else {
      closestPoint = {
        latitude: lineStart.latitude + param * C,
        longitude: lineStart.longitude + param * D
      };
    }
    
    return calculateDistance(point.latitude, point.longitude, closestPoint.latitude, closestPoint.longitude);
  };

  
  const calculateDistanceToPolygonBoundary = (point, polygon) => {
    if (polygon.length < 3) return Infinity;
    
    let minDistance = Infinity;
    
    // Calculate distance to each edge of the polygon
    for (let i = 0; i < polygon.length; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % polygon.length];
      
      const distance = distancePointToLineSegment(point, p1, p2);
      minDistance = Math.min(minDistance, distance);
    }
    
    return minDistance;
  };

  const isPointInPolygon = (point, polygon) => {
    const x = point.latitude;
    const y = point.longitude;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].latitude;
      const yi = polygon[i].longitude;
      const xj = polygon[j].latitude;
      const yj = polygon[j].longitude;

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  };

 
  const triggerApproachingWarning = async () => {
    console.log('🟡 Triggering approaching warning - within 30m of boundary');
    
    // Try notification first
    try {
      const { status } = await Notifications.getPermissionsAsync();
      console.log('Notification permission status:', status);
      
      if (status === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Approaching Campus Border! ⚠️',
            body: `You are close to the Yale campus boundary.`,
            sound: true,
            priority: 'high',
          },
          trigger: null,
        });
        console.log('✅ Approaching notification sent');
      }
    } catch (error) {
      console.log('❌ Notification failed:', error);
    }

    // Always show alert as backup
    Alert.alert(
      'Approaching Campus Border ⚠️',
      `You are close to the Yale campus boundary. Please be careful!`,
      [{ text: 'OK', onPress: () => console.log('User acknowledged approaching warning') }]
    );
  };

  const triggerBorderWarning = async () => {
    console.log('🔴 Triggering border warning - outside campus');
    
    
    try {
      const { status } = await Notifications.getPermissionsAsync();
      console.log('Notification permission status:', status);
      
      if (status === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Campus Boundary Warning! 🚨',
            body: `You are ${distanceToBorder?.toFixed(0)}m outside Yale campus. Please return to campus grounds for your safety.`,
            sound: true,
            priority: 'high',
          },
          trigger: null,
        });
        console.log('✅ Border warning notification sent');
      }
    } catch (error) {
      console.log('❌ Notification failed:', error);
    }

    // Always show alert as backup
    Alert.alert(
      'Campus Boundary Warning 🚨',
      `You are ${distanceToBorder?.toFixed(0)}m outside the Yale campus boundary. Please return to campus grounds for your safety.`,
      [{ text: 'OK', onPress: () => console.log('User acknowledged border warning') }],
      { cancelable: false }
    );
  };

  
  const checkGeofencing = (userCoord) => {
    if (YALE_BOUNDARY.length === 0) {
      setIsWithinBounds(true);
      setDistanceToBorder(null);
      return;
    }

    const inBounds = isPointInPolygon(userCoord, YALE_BOUNDARY);
    const distanceToBorderCalc = calculateDistanceToPolygonBoundary(userCoord, YALE_BOUNDARY);
    
    setIsWithinBounds(inBounds);
    setDistanceToBorder(distanceToBorderCalc);

    // Update debug info
    setDebugInfo(`Lat: ${userCoord.latitude.toFixed(6)}, Lng: ${userCoord.longitude.toFixed(6)}, Distance: ${distanceToBorderCalc.toFixed(1)}m, InBounds: ${inBounds}`);

    const currentTime = Date.now();
    const timeSinceLastWarning = currentTime - lastWarningTime;
    
    // Reduced time threshold to 10 seconds for testing
    if (timeSinceLastWarning > 10000) {
      // Trigger warning when within 30 meters of boundary (whether inside or outside)
      if (distanceToBorderCalc <= 30) {
        if (inBounds) {
          triggerApproachingWarning();
        } else {
          triggerBorderWarning();
        }
        setLastWarningTime(currentTime);
      }
    }
  };

  // Enhanced setupLocationTracking
  const setupLocationTracking = async () => {
    try {
      // Request notification permissions with more explicit handling
      console.log('📱 Requesting notification permissions...');
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: false,
        },
      });
      
      console.log('Notification permission result:', notificationStatus);
      
      if (notificationStatus !== 'granted') {
        console.log('⚠️ Notification permission not granted');
        Alert.alert(
          'Notification Permission', 
          'Please enable notifications in Settings to receive campus boundary alerts.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() }
          ]
        );
      }

      // Request location permissions
      console.log('📍 Requesting location permissions...');
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Location Permission Required', 'This app needs location access to work properly.');
        const defaultLocation = { latitude: 41.3141, longitude: -72.9202 };
        setUserLocation(defaultLocation);
        checkGeofencing(defaultLocation);
        return;
      }

      console.log('✅ Location permission granted');

      // Get initial location
      console.log('📍 Getting initial location...');
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const userCoord = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      console.log('📍 Initial location:', userCoord);
      setUserLocation(userCoord);
      checkGeofencing(userCoord);

      // Start continuous location watching
      console.log('📍 Starting location tracking...');
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // Update every 2 seconds for better testing
          distanceInterval: 5, // Update every 5 meters
        },
        (newLocation) => {
          const newUserCoord = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
          console.log('📍 Location update:', newUserCoord);
          setUserLocation(newUserCoord);
          checkGeofencing(newUserCoord);
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    } catch (error) {
      console.error('❌ Error setting up location tracking:', error);
      Alert.alert('Location Error', 'Could not access your location. Using default Yale location.');
      const defaultLocation = { latitude: 41.3141, longitude: -72.9202 };
      setUserLocation(defaultLocation);
      checkGeofencing(defaultLocation);
    }
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'yygs':
        return '#1E3A8A'; // Blue for YYGS buildings
      case 'food':
        return '#FF6B35'; // Orange for food
      case 'study':
        return '#4ECDC4'; // Teal for study places
      case 'sightseeing':
        return '#FF6B9D'; // Pink for sightseeing
      default:
        return '#95A5A6';
    }
  };

  const getMarkerIcon = (type) => {
    switch (type) {
      case 'yygs':
        return '🏫';
      case 'food':
        return '🍽️';
      case 'study':
        return '📚';
      case 'sightseeing':
        return '🏛️';
      default:
        return '📍';
    }
  };


  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
  };

  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000); // Animate over 1 second
    } else if (!userLocation) {
      Alert.alert('Location Not Available', 'Your location is not currently available.');
    }
  };

  const openDirections = (destination) => {
    const { latitude, longitude } = destination.coordinate;
    
    if (userLocation) {
      // Use current location as starting point
      const { latitude: startLat, longitude: startLng } = userLocation;
      
      const url = Platform.select({
        ios: `maps://app?saddr=${startLat},${startLng}&daddr=${latitude},${longitude}&dirflg=w`,
        android: `google.navigation:q=${latitude},${longitude}&mode=w`,
      });
      
      const webUrl = `https://www.google.com/maps/dir/${startLat},${startLng}/${latitude},${longitude}/@${latitude},${longitude},17z/data=!3m1!4b1!4m2!4m1!3e2`;
      
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(webUrl);
        }
      }).catch(() => {
        Linking.openURL(webUrl);
      });
    } else {
      // Fallback if no user location
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking`;
      Linking.openURL(webUrl);
    }
  };

  // Calculate the boundary center
  const boundaryCenter = calculateBoundaryCenter(YALE_BOUNDARY);

  return (
    <View style={styles.container}>
    

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome {userName}!</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isWithinBounds ? '#4ECDC4' : '#FF6B6B' }]} />
            <Text style={styles.statusText}>
              {isWithinBounds ? 'On Campus' : 'Off Campus'}
            </Text>
          </View>
          {distanceToBorder !== null && (
            <Text style={styles.distanceText}>
              {distanceToBorder.toFixed(0)}m from border
            </Text>
          )}
        </View>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: boundaryCenter.latitude,
          longitude: boundaryCenter.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        onMapReady={() => setMapReady(true)}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="standard"
        toolbarEnabled={false}
        showsCompass={false}
        // Move the built-in location button up
        myLocationButtonStyle={{
          bottom: 400,
          right: 20,
        }}
      >
        {/* Yale Campus Boundary - single thick red line */}
        {YALE_BOUNDARY.length > 0 && (
          <Polygon
            coordinates={YALE_BOUNDARY}
            strokeColor="#EF4444"
            strokeWidth={4}
            fillColor="rgba(239, 68, 68, 0.05)"
            lineDashPattern={[0]}
          />
        )}

        {/* Location Markers */}
        {LOCATIONS.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinate}
            onPress={() => handleMarkerPress(location)}
          >
            <View style={[styles.customMarker, { backgroundColor: getMarkerColor(location.type) }]}>
              <Text style={styles.markerText}>{getMarkerIcon(location.type)}</Text>
              {!location.cardAccess && (
                <View style={styles.paymentBadge}>
                  <Text style={styles.paymentText}>$</Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Review Card */}
      {selectedLocation && (
        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{selectedLocation.name}</Text>
              <Text style={styles.locationAddress}>{selectedLocation.address}</Text>
              <Text style={[styles.accessText, { color: selectedLocation.cardAccess ? '#4ECDC4' : '#FF6B6B' }]}>
                {selectedLocation.cardAccess ? '🎓 Card Access' : '💳 Payment Required'}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setSelectedLocation(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewContent}>
            <View style={styles.studentInfo}>
              <Image
  source={
    typeof selectedLocation.review.studentImage === 'string' 
      ? { uri: selectedLocation.review.studentImage }  // For URL strings
      : selectedLocation.review.studentImage           // For imported images
  }
  style={styles.studentImage}
/>
              <View style={styles.studentDetails}>
                <Text style={styles.studentName}>{selectedLocation.review.studentName}</Text>
                <Text style={styles.rating}>{renderStars(selectedLocation.review.rating)}</Text>
              </View>
            </View>
            <Text style={styles.reviewText}>{selectedLocation.review.text}</Text>
            
            {/* Directions Button */}
            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={() => openDirections(selectedLocation)}
            >
              <Text style={styles.directionsText}>🧭 Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🗺️</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>📍</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  distanceText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  map: {
    flex: 1,
    marginBottom: 15,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    fontSize: 18,
  },
  paymentBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  paymentText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationButton: {
    position: 'absolute',
    bottom: 150, // Moved up from the default position
    right: 20,
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  locationButtonIcon: {
    fontSize: 20,
  },
  reviewCard: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
    marginRight: 12,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  accessText: {
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  reviewContent: {
    paddingTop: 8,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  rating: {
    fontSize: 14,
    marginTop: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1E3A8A',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 24,
    color: 'white',
  },
  directionsButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  directionsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Debug styles
  debugContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 8,
    zIndex: 1000,
  },
  debugText: {
    color: 'white',
    fontSize: 11,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  testButton: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MapScreen;