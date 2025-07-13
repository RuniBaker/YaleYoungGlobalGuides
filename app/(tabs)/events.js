import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
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
  { latitude: 41.308823, longitude: -72.925301 },
  { latitude: 41.309490, longitude: -72.926974 },
  { latitude: 41.307281, longitude: -72.928678 },
  { latitude: 41.308934, longitude: -72.933456 },
  { latitude: 41.311342, longitude: -72.931799 },
  { latitude: 41.312403, longitude: -72.931549 },
  { latitude: 41.312508, longitude: -72.931728 },
  { latitude: 41.314170, longitude: -72.931272 },
  { latitude: 41.313508, longitude: -72.930612 },
  { latitude: 41.311824, longitude: -72.930407 },
  { latitude: 41.311286, longitude: -72.929953 },
  { latitude: 41.312539, longitude: -72.928803 },
  { latitude: 41.311922, longitude: -72.925465 },
  { latitude: 41.313885, longitude: -72.924921 },
  { latitude: 41.313629, longitude: -72.923704 },
  { latitude: 41.31292669941359, longitude: -72.92264676378392 },
  { latitude: 41.312276, longitude: -72.922980 },
  { latitude: 41.312748, longitude: -72.923944 },
  { latitude: 41.311398, longitude: -72.924538 },
  { latitude: 41.311084, longitude: -72.923882 },
  { latitude: 41.310145, longitude: -72.924585 },
  { latitude: 41.309831, longitude: -72.923918 },
  { latitude: 41.310247, longitude: -72.923520 },
  { latitude: 41.309782, longitude: -72.923771 },
  { latitude: 41.309574, longitude: -72.923304 },
  { latitude: 41.309971, longitude: -72.924468 },
];

const EventsScreen = ({ userName = "Andria" }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isWithinBounds, setIsWithinBounds] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    time: '',
  });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);


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

  // Hardcoded events
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Study Group - Economics",
      description: "Join me for an economics study session! We'll be going over microeconomics concepts.",
      time: "Today, 7:00 PM",
      coordinate: { latitude: 41.311228176705, longitude: -72.92828504317357 },
      type: "study",
      attendees: 12,
      maxAttendees: 20,
      creator: "Andria Adeishvili",
      isJoined: false,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "Basketball Pickup Game",
      description: "Casual basketball game at the outdoor courts. All skill levels welcome!",
      time: "Tomorrow, 4:00 PM",
      coordinate: { latitude: 41.3086203059563, longitude: -72.9308587966994 },
      type: "sports",
      attendees: 8,
      maxAttendees: 10,
      creator: "Rishi Salvi",
      isJoined: true,
      createdAt: new Date(),
    },
    {
      id: 3,
      name: "Coffee & Chat",
      description: "Informal meetup for international students. Come practice English and make friends!",
      time: "Friday, 2:00 PM",
      coordinate: { latitude: 41.30782034143576, longitude: -72.9302510526084 },
      type: "social",
      attendees: 6,
      maxAttendees: 15,
      creator: "Diana Xiao",
      isJoined: false,
      createdAt: new Date(),
    },
    {
      id: 4,
      name: "Movie Night - Harry Potter and the Sorcerer's Stone",
      description: "Outdoor movie screening in the courtyard. Bring blankets and snacks!",
      time: "Saturday, 8:00 PM",
      coordinate: { latitude: 41.309311656456636, longitude: -72.92823126863237 },
      type: "entertainment",
      attendees: 25,
      maxAttendees: 50,
      creator: "Runi Baker",
      isJoined: false,
      createdAt: new Date(),
    },
  ]);

  useEffect(() => {
    setupLocationTracking();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  
  useEffect(() => {
    if (userLocation && mapRef.current && mapReady) {
      // Small delay to ensure map is fully rendered
      setTimeout(() => {
        mapRef.current.animateToRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        }, 1500); // Smooth animation over 1.5 seconds
      }, 500);
    }
  }, [userLocation, mapReady]);

 
  useEffect(() => {
    if (mapRef.current && mapReady) {
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
  }, [mapReady]);

  const setupLocationTracking = async () => {
    try {
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        console.log('Notification permission not granted');
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission Required', 'This app needs location access to work properly.');
        const defaultLocation = { latitude: 41.3141, longitude: -72.9202 };
        setUserLocation(defaultLocation);
        checkGeofencing(defaultLocation);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const userCoord = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoord);
      checkGeofencing(userCoord);

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const newUserCoord = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };
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
      console.error('Error setting up location tracking:', error);
      const defaultLocation = { latitude: 41.3141, longitude: -72.9202 };
      setUserLocation(defaultLocation);
      checkGeofencing(defaultLocation);
    }
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

  const checkGeofencing = (userCoord) => {
    if (YALE_BOUNDARY.length === 0) {
      setIsWithinBounds(true);
      return;
    }

    const inBounds = isPointInPolygon(userCoord, YALE_BOUNDARY);
    setIsWithinBounds(inBounds);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'study':
        return '📚';
      case 'sports':
        return '⚽';
      case 'social':
        return '☕';
      case 'entertainment':
        return '🎬';
      default:
        return '📅';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'study':
        return '#4ECDC4';
      case 'sports':
        return '#FF6B35';
      case 'social':
        return '#FF6B9D';
      case 'entertainment':
        return '#9B59B6';
      default:
        return '#95A5A6';
    }
  };

  const handleEventPress = (event) => {
    setSelectedEvent(event);
  };

  const handleJoinEvent = (eventId) => {
    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === eventId) {
          const newIsJoined = !event.isJoined;
          return {
            ...event,
            isJoined: newIsJoined,
            attendees: newIsJoined ? event.attendees + 1 : event.attendees - 1,
          };
        }
        return event;
      })
    );

    // Update selected event if it's the one being joined
    if (selectedEvent && selectedEvent.id === eventId) {
      const updatedEvent = events.find(e => e.id === eventId);
      if (updatedEvent) {
        setSelectedEvent({
          ...updatedEvent,
          isJoined: !updatedEvent.isJoined,
          attendees: !updatedEvent.isJoined ? updatedEvent.attendees + 1 : updatedEvent.attendees - 1,
        });
      }
    }
  };

  const handleDeleteEvent = (eventId) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
            setSelectedEvent(null);
            Alert.alert('Event Deleted', 'Your event has been removed.');
          },
        },
      ]
    );
  };

  const handleCreateEvent = () => {
    setShowCreateModal(true);
    setEventForm({ name: '', description: '', time: '' });
  };

  const handleSubmitEvent = () => {
    if (!eventForm.name.trim() || !eventForm.description.trim() || !eventForm.time.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    if (!userLocation) {
      Alert.alert('Location Required', 'We need your location to create the event.');
      return;
    }

    const newEvent = {
      id: events.length + 1,
      name: eventForm.name.trim(),
      description: eventForm.description.trim(),
      time: eventForm.time.trim(),
      coordinate: { ...userLocation },
      type: 'social', // Default type for user-created events
      attendees: 1, // Creator automatically joins
      maxAttendees: 20,
      creator: userName,
      isJoined: true,
      createdAt: new Date(),
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
    setShowCreateModal(false);
    setEventForm({ name: '', description: '', time: '' });
    
    Alert.alert('Event Created!', 'Your event has been published and is now live!');
  };

  // Calculate the boundary center
  const boundaryCenter = calculateBoundaryCenter(YALE_BOUNDARY);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Campus Events</Text>
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isWithinBounds ? '#4ECDC4' : '#FF6B6B' }]} />
            <Text style={styles.statusText}>
              {isWithinBounds ? 'On Campus' : 'Off Campus'}
            </Text>
          </View>
        </View>
      </View>

      {/* Map - Now takes full space */}
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
      >
        {/* Yale Campus Boundary */}
        {YALE_BOUNDARY.length > 0 && (
          <Polygon
            coordinates={YALE_BOUNDARY}
            strokeColor="#EF4444"
            strokeWidth={4}
            fillColor="rgba(239, 68, 68, 0.05)"
            lineDashPattern={[0]}
          />
        )}

        {/* Event Markers */}
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={event.coordinate}
            onPress={() => handleEventPress(event)}
          >
            <View style={[styles.eventMarker, { backgroundColor: getEventColor(event.type) }]}>
              <Text style={styles.markerText}>{getEventIcon(event.type)}</Text>
              <View style={styles.attendeesBadge}>
                <Text style={styles.attendeesText}>{event.attendees}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Floating Publish Button - Overlay on Map */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleCreateEvent}
      >
        <Text style={styles.floatingButtonText}>📢 Publish Event</Text>
      </TouchableOpacity>

      {/* Event Details Card */}
      {selectedEvent && (
        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{selectedEvent.name}</Text>
              <Text style={styles.eventTime}>{selectedEvent.time}</Text>
              <Text style={styles.eventCreator}>by {selectedEvent.creator}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setSelectedEvent(null)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.eventDescription}>{selectedEvent.description}</Text>
          
          <View style={styles.eventStats}>
            <Text style={styles.attendeesInfo}>
              {selectedEvent.attendees}/{selectedEvent.maxAttendees} attendees
            </Text>
            <View style={styles.attendeesBar}>
              <View 
                style={[
                  styles.attendeesProgress,
                  { width: `${(selectedEvent.attendees / selectedEvent.maxAttendees) * 100}%` }
                ]}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.joinButton,
              { backgroundColor: selectedEvent.isJoined ? '#FF6B6B' : '#4ECDC4' }
            ]}
            onPress={() => handleJoinEvent(selectedEvent.id)}
          >
            <Text style={styles.joinButtonText}>
              {selectedEvent.isJoined ? 'Leave Event' : 'Join Event'}
            </Text>
          </TouchableOpacity>

          {/* Delete Button - only show for events created by current user */}
          {selectedEvent.creator === userName && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => handleDeleteEvent(selectedEvent.id)}
            >
              <Text style={styles.deleteButtonText}>🗑️ Delete Event</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Create Event Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[
            styles.modalContent,
            {
              marginTop: isKeyboardVisible ? 50 : 0,
              maxHeight: isKeyboardVisible ? height * 0.6 : height * 0.8,
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publish Event</Text>
              <TouchableOpacity 
                onPress={() => setShowCreateModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.formLabel}>Event Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter event name..."
                value={eventForm.name}
                onChangeText={(text) => setEventForm({...eventForm, name: text})}
              />

              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Describe your event..."
                value={eventForm.description}
                onChangeText={(text) => setEventForm({...eventForm, description: text})}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.formLabel}>Time</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Today 7:00 PM, Tomorrow 3:00 PM"
                value={eventForm.time}
                onChangeText={(text) => setEventForm({...eventForm, time: text})}
              />

              <Text style={styles.locationNote}>
                📍 Event location will be set to your current position
              </Text>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleSubmitEvent}
              >
                <Text style={styles.createButtonText}>Publish</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  map: {
    flex: 1,
    marginBottom: 85,
  },
  // Floating button overlay on map
  floatingButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 120, // Position below header
    left: 20,
    right: 20,
    backgroundColor: '#1E3A8A', // Yale dark blue
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000, // Ensure it appears above map
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    fontSize: 20,
  },
  attendeesBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  attendeesText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 2,
  },
  eventCreator: {
    fontSize: 12,
    color: '#7F8C8D',
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
  eventDescription: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 20,
    marginBottom: 16,
  },
  eventStats: {
    marginBottom: 16,
  },
  attendeesInfo: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  attendeesBar: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  attendeesProgress: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 3,
  },
  joinButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: width - 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalForm: {
    maxHeight: 300,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginTop: 16,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  locationNote: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventsScreen;