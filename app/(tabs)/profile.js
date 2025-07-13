import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';

const ProfileScreen = ({ userName = "Diana" }) => {
  const profileData = {
    name: "Andria Adeishvili",
    track: "IST II",
    dining: "PC Shift 1",
    family: "Family 5",
    college: "Pierson College",
  
    profileImage: require('../../assets/images/andria.jpg'),
  };


  console.log('Profile image source:', profileData.profileImage);

  const handleProfilePicturePress = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Profile</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Profile Picture Section */}
        <TouchableOpacity 
          style={styles.profilePictureContainer}
          onPress={handleProfilePicturePress}
          activeOpacity={0.7}
        >
          {profileData.profileImage ? (
            <Image 
              source={profileData.profileImage}
              style={styles.profileImage}
              resizeMode="cover"
              onError={(error) => {
                console.log('Image load error:', error);
                Alert.alert('Image Error', 'Failed to load profile image');
              }}
              onLoad={() => {
                console.log('Image loaded successfully');
              }}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>Add your{'\n'}Profile Picture</Text>
              <View style={styles.cameraIcon}>
                <Text style={styles.cameraIconText}>📷</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        

        {/* Profile Information Card */}
        <View style={styles.profileCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{profileData.name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Track:</Text>
            <Text style={styles.infoValue}>{profileData.track}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dining:</Text>
            <Text style={styles.infoValue}>{profileData.dining}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Family:</Text>
            <Text style={styles.infoValue}>{profileData.family}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>College:</Text>
            <Text style={styles.infoValue}>{profileData.college}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Settings', 'Settings page coming soon!')}>
            <Text style={styles.actionButtonIcon}>⚙️</Text>
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Help', 'Help & Support coming soon!')}>
            <Text style={styles.actionButtonIcon}>❓</Text>
            <Text style={styles.actionButtonText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out') }
          ])}>
            <Text style={styles.actionButtonIcon}>🚪</Text>
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* YYGS Branding */}
        <View style={styles.brandingSection}>
          <Text style={styles.brandingText}>Yale Young Global Scholars</Text>
          <Text style={styles.brandingSubtext}>Class of 2024</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 130,
  },
  profilePictureContainer: {
    alignSelf: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#1E3A8A',
  },
  profilePlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E8E8E8',
    borderWidth: 4,
    borderColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profilePlaceholderText: {
    fontSize: 16,
    color: '#1E3A8A',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#1E3A8A',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cameraIconText: {
    fontSize: 16,
  },
  // Debug styles - remove after fixing
  debugInfo: {
    backgroundColor: '#FFE6E6',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#D32F2F',
    marginBottom: 2,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#2C3E50',
    flex: 1,
    fontWeight: '500',
  },
  actionButtons: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  brandingSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  brandingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  brandingSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
});

export default ProfileScreen;