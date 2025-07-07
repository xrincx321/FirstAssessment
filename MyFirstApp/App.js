import React, { useState, useRef, useMemo, useCallback, memo, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, FlatList, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
// Note: expo-av is deprecated but still works. For production, consider using expo-video

// Create navigation components
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Memoized Post Component for better performance
const PostItem = memo(({ post, followStatus, onToggleFollow, onToggleVideo, playingVideos, setVideoRef, isVisible, isWeb }) => {
  const handleToggleFollow = useCallback(() => {
    onToggleFollow(post.id);
  }, [post.id, onToggleFollow]);

  const handleToggleVideo = useCallback(() => {
    onToggleVideo(post.id);
  }, [post.id, onToggleVideo]);

  const handleSetVideoRef = useCallback((ref) => {
    setVideoRef(post.id, ref);
  }, [post.id, setVideoRef]);

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: post.userAvatar }} 
            style={styles.userAvatar} 
          />
          <Text style={styles.userName}>{post.userName}</Text>
        </View>
        <TouchableOpacity onPress={handleToggleFollow}>
          <Text style={followStatus[post.id] ? styles.followingButton : styles.followButton}>
            {followStatus[post.id] ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.postContent}>
        {post.mediaType === 'video' ? (
          <View style={styles.videoContainer}>
            {isVisible && (
              <Video
                ref={handleSetVideoRef}
                source={{ uri: post.mediaUrl }}
                style={styles.postVideo}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isLooping={false}
                isMuted={isWeb} // Mute videos on web for better performance
                useNativeControls={false} // Disable native controls on web
                onPlaybackStatusUpdate={(status) => {
                  if (status.isPlaying !== playingVideos[post.id]) {
                    // This will be handled by parent component
                  }
                }}
              />
            )}
            <View style={styles.videoOverlay}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={handleToggleVideo}
              >
                <Ionicons 
                  name={playingVideos[post.id] ? "pause" : "play"} 
                  size={32} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
            <View style={styles.mediaControls}>
              <TouchableOpacity style={styles.mediaButton}>
                <Ionicons name="play-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton}>
                <Ionicons name="play-forward" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.volumeControl}>
              <Ionicons name="volume-medium" size={20} color="white" />
            </View>
            <View style={styles.mediaTypeIndicator}>
              <Ionicons name="videocam" size={16} color="white" />
            </View>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: post.mediaUrl }} 
              style={styles.postImage} 
              resizeMode="cover"
            />
            <View style={styles.mediaTypeIndicator}>
              <Ionicons name="image" size={16} color="white" />
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.postMeta}>
        <Text style={styles.postDate}>{post.date}</Text>
        <Text style={styles.postLocation}>{post.location}</Text>
        <Text style={styles.postViews}>{post.views.toLocaleString()} Views</Text>
      </View>
      
      <Text style={styles.postCaption}>
        {post.caption} <Text style={styles.moreText}>more</Text>
      </Text>
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

// Memoized Filter Modal Component
const FilterModal = memo(({ 
  showFilterModal, 
  setShowFilterModal, 
  selectedFilter, 
  setSelectedFilter, 
  selectedMediaType, 
  setSelectedMediaType, 
  sortBy, 
  setSortBy, 
  setSearchQuery 
}) => {
  const handleClearAll = useCallback(() => {
    setSelectedFilter('all');
    setSelectedMediaType('all');
    setSortBy('date');
    setSearchQuery('');
  }, [setSelectedFilter, setSelectedMediaType, setSortBy, setSearchQuery]);

  const handleApply = useCallback(() => {
    setShowFilterModal(false);
  }, [setShowFilterModal]);

  if (!showFilterModal) return null;

  return (
    <View style={styles.filterModal}>
      <View style={styles.filterContent}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter & Sort</Text>
          <TouchableOpacity onPress={() => setShowFilterModal(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
            {['all', 'news', 'art', 'sports', 'food', 'travel', 'tech', 'lifestyle'].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterOption,
                  selectedFilter === category && styles.filterOptionSelected
                ]}
                onPress={() => setSelectedFilter(category)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter === category && styles.filterOptionTextSelected
                ]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Media Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
            {['all', 'image', 'video'].map((mediaType) => (
              <TouchableOpacity
                key={mediaType}
                style={[
                  styles.filterOption,
                  selectedMediaType === mediaType && styles.filterOptionSelected
                ]}
                onPress={() => setSelectedMediaType(mediaType)}
              >
                <Ionicons 
                  name={mediaType === 'all' ? 'grid' : mediaType === 'image' ? 'image' : 'videocam'} 
                  size={16} 
                  color={selectedMediaType === mediaType ? '#fff' : '#666'} 
                  style={{ marginRight: 4 }}
                />
                <Text style={[
                  styles.filterOptionText,
                  selectedMediaType === mediaType && styles.filterOptionTextSelected
                ]}>
                  {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterSection}>
          <Text style={styles.filterSectionTitle}>Sort By</Text>
          <View style={styles.sortOptions}>
            {[
              { key: 'date', label: 'Date' },
              { key: 'views', label: 'Views' },
              { key: 'name', label: 'Name' }
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  sortBy === option.key && styles.sortOptionSelected
                ]}
                onPress={() => setSortBy(option.key)}
              >
                <Text style={[
                  styles.sortOptionText,
                  sortBy === option.key && styles.sortOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.filterActions}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearAll}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

// Feed Screen Component
function FeedScreen() {
  // State to track follow status for each post
  const [followStatus, setFollowStatus] = useState({
    post1: false,
    post2: true,
    post3: false,
    post4: true,
    post5: false,
    post6: true,
    post7: false,
    post8: true,
    post9: false,
    post10: true
  });
  
  // State for search and filter functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample posts data with both images and videos
  const [posts] = useState([
    {
      id: 'post1',
      userName: 'Amit Saxena',
      userAvatar: 'https://randomuser.me/api/portraits/men/43.jpg',
      mediaType: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
      date: '7th July',
      location: 'Sec-15, Noida',
      views: 253,
      caption: 'Kerala journalist Siddique Kappan\'s mother passes away at 90...',
      category: 'news'
    },
    {
      id: 'post2',
      userName: 'Nidhi Gupta',
      userAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '10th July',
      location: 'Mumbai, India',
      views: 487,
      caption: 'The new art exhibition at the National Gallery is absolutely stunning!',
      category: 'art'
    },
    {
      id: 'post3',
      userName: 'Rahul Sharma',
      userAvatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      mediaType: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '12th July',
      location: 'Bangalore, India',
      views: 1253,
      caption: 'Just finished my first marathon! What an incredible experience running through the city.',
      category: 'sports'
    },
    {
      id: 'post4',
      userName: 'Priya Patel',
      userAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '14th July',
      location: 'Delhi, India',
      views: 876,
      caption: 'My homemade chocolate cake recipe is finally perfected! Check out this delicious dessert.',
      category: 'food'
    },
    {
      id: 'post5',
      userName: 'Vikram Singh',
      userAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      mediaType: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '18th July',
      location: 'Shimla, India',
      views: 1200,
      caption: 'Mountain hiking trip with friends. The view was absolutely breathtaking!',
      category: 'travel'
    },
    {
      id: 'post6',
      userName: 'Meera Kapoor',
      userAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '20th July',
      location: 'Goa, India',
      views: 3500,
      caption: 'Beach day with my besties! Perfect weather and amazing sunset.',
      category: 'travel'
    },
    {
      id: 'post7',
      userName: 'Arjun Reddy',
      userAvatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      mediaType: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '22nd July',
      location: 'Bangalore, India',
      views: 945,
      caption: 'Healthy lunch prep for the week. Eating clean and staying fit!',
      category: 'food'
    },
    {
      id: 'post8',
      userName: 'Ananya Desai',
      userAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '24th July',
      location: 'Mumbai, India',
      views: 2300,
      caption: 'My new art studio is finally set up! Can\'t wait to start creating again.',
      category: 'art'
    },
    {
      id: 'post9',
      userName: 'Karan Malhotra',
      userAvatar: 'https://randomuser.me/api/portraits/men/92.jpg',
      mediaType: 'video',
      mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '25th July',
      location: 'Pune, India',
      views: 1700,
      caption: 'Just finished my first React Native app! Learning to code has been an amazing journey.',
      category: 'tech'
    },
    {
      id: 'post10',
      userName: 'Divya Sharma',
      userAvatar: 'https://randomuser.me/api/portraits/women/54.jpg',
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      date: '27th July',
      location: 'Jaipur, India',
      views: 3100,
      caption: 'Morning yoga session at my favorite spot. Starting the day with positive energy!',
      category: 'lifestyle'
    }
  ]);
  
  // Function to toggle follow status - memoized with useCallback
  const toggleFollow = useCallback((postId) => {
    setFollowStatus(prevStatus => ({
      ...prevStatus,
      [postId]: !prevStatus[postId]
    }));
  }, []);
  
  // Memoized filtered and sorted posts
  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(post => 
        post.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(post => post.category === selectedFilter);
    }
    
    // Filter by media type
    if (selectedMediaType !== 'all') {
      filtered = filtered.filter(post => post.mediaType === selectedMediaType);
    }
    
    // Sort posts
    switch (sortBy) {
      case 'date':
        filtered = [...filtered].sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
        break;
      case 'views':
        filtered = [...filtered].sort((a, b) => b.views - a.views);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.userName.localeCompare(b.userName));
        break;
      default:
        break;
    }
    
    return filtered;
  }, [posts, searchQuery, selectedFilter, selectedMediaType, sortBy]);
  
  // Video control states
  const [playingVideos, setPlayingVideos] = useState({});
  const [videoRefs, setVideoRefs] = useState({});
  const [visibleVideos, setVisibleVideos] = useState(new Set());
  
  // Refs for stable access in callbacks
  const playingVideosRef = useRef(playingVideos);
  const videoRefsRef = useRef(videoRefs);

  useEffect(() => {
    playingVideosRef.current = playingVideos;
  }, [playingVideos]);
  useEffect(() => {
    videoRefsRef.current = videoRefs;
  }, [videoRefs]);

  // Function to handle video play/pause - memoized
  const toggleVideo = useCallback(async (postId) => {
    if (videoRefsRef.current[postId]) {
      const status = await videoRefsRef.current[postId].getStatusAsync();
      if (status.isPlaying) {
        await videoRefsRef.current[postId].pauseAsync();
        setPlayingVideos(prev => ({ ...prev, [postId]: false }));
      } else {
        await videoRefsRef.current[postId].playAsync();
        setPlayingVideos(prev => ({ ...prev, [postId]: true }));
      }
    }
  }, []);
  
  // Function to handle video ref - memoized
  const setVideoRef = useCallback((postId, ref) => {
    if (ref) {
      setVideoRefs(prev => ({ ...prev, [postId]: ref }));
    }
  }, []);

  // Stable onViewableItemsChanged
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const visibleIds = new Set(viewableItems.map(item => item.item.id));
    setVisibleVideos(visibleIds);
    
    // Pause videos that are no longer visible
    Object.keys(playingVideosRef.current).forEach(postId => {
      if (playingVideosRef.current[postId] && !visibleIds.has(postId)) {
        if (videoRefsRef.current[postId]) {
          videoRefsRef.current[postId].pauseAsync();
          setPlayingVideos(prev => ({ ...prev, [postId]: false }));
        }
      }
    });
  }).current;

  // Memoized render item function for FlatList
  const renderItem = useCallback(({ item, index }) => {
    // Check if this video is currently visible in viewport
    const isVisible = visibleVideos.has(item.id) || index < 3;
    
    return (
      <PostItem
        post={item}
        followStatus={followStatus}
        onToggleFollow={toggleFollow}
        onToggleVideo={toggleVideo}
        playingVideos={playingVideos}
        setVideoRef={setVideoRef}
        isVisible={isVisible}
        isWeb={Platform.OS === 'web'}
      />
    );
  }, [followStatus, toggleFollow, toggleVideo, playingVideos, setVideoRef, visibleVideos]);

  // Memoized key extractor
  const keyExtractor = useCallback((item) => item.id, []);

  // Memoized empty component
  const EmptyComponent = useMemo(() => (
    <View style={styles.noResultsContainer}>
      <Ionicons name="search-outline" size={48} color="#ccc" />
      <Text style={styles.noResultsText}>No posts found</Text>
      <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
    </View>
  ), []);

  // Memoized loading component
  const LoadingComponent = useMemo(() => (
    <View style={styles.loadingContainer}>
      <Ionicons name="refresh" size={32} color="#0a84ff" />
      <Text style={styles.loadingText}>Loading posts...</Text>
    </View>
  ), []);

  // Initialize visible videos and loading state
  useEffect(() => {
    const initialVisibleIds = new Set(filteredPosts.slice(0, 3).map(post => post.id));
    setVisibleVideos(initialVisibleIds);
    setIsLoading(false);
  }, [filteredPosts]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TextInput 
          style={styles.searchBar}
          placeholder="Search posts, users, or locations..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="options-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Filter Modal */}
      <FilterModal
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedMediaType={selectedMediaType}
        setSelectedMediaType={setSelectedMediaType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setSearchQuery={setSearchQuery}
      />
      
      {isLoading ? (
        LoadingComponent
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS !== 'web'}
          maxToRenderPerBatch={3}
          windowSize={5}
          initialNumToRender={3}
          updateCellsBatchingPeriod={50}
          onEndReachedThreshold={0.5}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            minimumViewTime: 100,
          }}
          ListEmptyComponent={EmptyComponent}
        />
      )}
    </SafeAreaView>
  );
}

// Memoized Profile Screen Component
const ProfileScreen = memo(() => {
  // Add state for profile image
  const [profileImage, setProfileImage] = useState({ uri: 'https://randomuser.me/api/portraits/men/1.jpg' });

  // Function to pick image - memoized with useCallback
  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8, // Reduced quality for better performance
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage({ uri: result.assets[0].uri });
    }
  }, []);

  // Memoized form data
  const formData = useMemo(() => ({
    name: "Prince Kumar",
    gender: "Male",
    location: "Ludhiana, Punjab",
    profession: "Software Developer",
    bio: "Passionate software developer with expertise in React Native and modern JavaScript frameworks. Building innovative mobile solutions that solve real-world problems. Always learning and growing in the tech ecosystem."
  }), []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.profileHeader}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Account</Text>
      </View>
      
      <ScrollView 
        style={styles.profileContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
      >
        <View style={styles.profileImageContainer}>
          <Image 
            source={profileImage} 
            style={styles.profileImage} 
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <Ionicons name="camera" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput 
            style={styles.formInput}
            value={formData.name}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender</Text>
          <TextInput 
            style={styles.formInput}
            value={formData.gender}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput 
            style={styles.formInput}
            value={formData.location}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Profession</Text>
          <TextInput 
            style={styles.formInput}
            value={formData.profession}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput 
            style={[styles.formInput, styles.bioInput]}
            multiline
            numberOfLines={4}
            value={formData.bio}
          />
          <Text style={styles.charCount}>(160 characters)</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

// Memoized Tab Navigator
const TabNavigator = memo(() => {
  // Memoized screen options
  const screenOptions = useCallback(({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Create') {
            iconName = 'add-circle';
            return <Ionicons name={iconName} size={30} color={color} />;
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0a84ff',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        headerShown: false,
    lazy: true, // Enable lazy loading for better performance
  }), []);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Discover" component={FeedScreen} />
      <Tab.Screen name="Create" component={FeedScreen} />
      <Tab.Screen name="Notifications" component={FeedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
});

// Main App Component - Memoized for better performance
const App = memo(() => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
});

export default App;

// Optimized Styles - Using StyleSheet.create for better performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    height: 36,
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  iconButton: {
    padding: 5,
  },
  feedContainer: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: '600',
    fontSize: 16,
  },
  followButton: {
    color: '#0a84ff',
    fontWeight: '600',
    fontSize: 14,
  },
  followingButton: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  postContent: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 240,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  postVideo: {
    width: '100%',
    height: 240,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  mediaTypeIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  postOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mediaControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaButton: {
    marginRight: 15,
  },
  volumeControl: {
    padding: 5,
  },
  postMeta: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postDate: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  postLocation: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  postViews: {
    fontSize: 12,
    color: '#666',
  },
  postCaption: {
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  moreText: {
    color: '#666',
  },
  postActions: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    marginRight: 20,
  },
  // Profile styles
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  profileContainer: {
    flex: 1,
    padding: 15,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    right: '35%',
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#888',
    marginTop: 5,
    fontSize: 12,
  },
  // Filter Modal Styles
  filterModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  filterContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  filterSection: {
    marginBottom: 25,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterOptionSelected: {
    backgroundColor: '#0a84ff',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    alignItems: 'center',
  },
  sortOptionSelected: {
    backgroundColor: '#0a84ff',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#666',
  },
  sortOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#0a84ff',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});
