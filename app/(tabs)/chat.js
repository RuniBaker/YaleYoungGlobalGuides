import React, { useState, useEffect } from 'react';
import dianaAvatar from '../../assets/images/diana.jpg';
import tarikAvatar from '../../assets/images/tarik.jpg';
import runiAvatar from '../../assets/images/runi.jpg';
import rishiAvatar from '../../assets/images/rishi.jpg';
import anaAvatar from '../../assets/images/ana.jpg';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  SafeAreaView,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';

const ChatScreen = ({ userName = "Andria" }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Diana Xiao",
      lastMessage: "When is our next lecture?",
      time: "2m",
      unread: 2,
      avatar: dianaAvatar,
      online: true,
      messages: [
        { id: 1, text: "Hey! Do you know what was our homework for tomorrow?", sender: "them", time: "10:30 AM" },
        { id: 2, text: "Yeah, you need to research LLMs", sender: "me", time: "10:32 AM" },
        { id: 3, text: "Oh yeah, thank you!!!", sender: "them", time: "10:33 AM" },
        { id: 4, text: "Want to grab ice cream at Ashley's later?", sender: "them", time: "10:35 AM" },
        { id: 5, text: "Yes! I've been wanting to try that place", sender: "me", time: "10:36 AM" },
        { id: 6, text: "Perfect! Meet you there at 1 PM?", sender: "them", time: "10:37 AM" },
        { id: 7, text: "Sounds great! See you then", sender: "me", time: "10:38 AM" },
        { id: 8, text: "When is our next lecture?", sender: "them", time: "2:15 PM" },
      ]
    },
    {
      id: 2,
      name: " Biology Capstone",
      lastMessage: "Who wants to work together tonight?",
      time: "15m",
      unread: 5,
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&crop=center",
      online: false,
      isGroup: true,
      messages: [
        { id: 1, text: "Hey everyone! How's the first week going?", sender: "Marcus", time: "8:00 AM" },
        { id: 2, text: "Great! Though the readings are intense 📚", sender: "me", time: "8:02 AM" },
        { id: 3, text: "Tell me about it! Prof Johnson's assignment is due tomorrow", sender: "Sarah", time: "8:05 AM" },
        { id: 4, text: "Anyone figure out question 3 on the problem set?", sender: "David", time: "8:30 AM" },
        { id: 5, text: "I think it's about the economic implications", sender: "me", time: "8:32 AM" },
        { id: 6, text: "Yes! I can help explain it later", sender: "Marcus", time: "8:35 AM" },
        { id: 7, text: "That would be amazing, thanks!", sender: "Sarah", time: "8:36 AM" },
        { id: 8, text: "Who wants to study together tonight?", sender: "David", time: "12:45 PM" },
      ]
    },
    {
      id: 3,
      name: "Runi Baker",
      lastMessage: "I'm really sleepy...",
      time: "1h",
      unread: 0,
      avatar: runiAvatar,
      online: false
    },
    {
      id: 4,
      name: "Rishi Salvi",
      lastMessage: "Can you send me the notes from today?",
      time: "3h",
      unread: 0,
      avatar: rishiAvatar,
      online: true
    },
    {
      id: 5,
      name: "YYGS Family",
      lastMessage: "Anyone down to go shopping tmrw?",
      time: "5h",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop&crop=center",
      online: false,
      isGroup: true
    },
    {
      id: 6,
      name: "Ana Jordanovska",
      lastMessage: "The dining hall food is actually pretty good!",
      time: "1d",
      unread: 0,
      avatar: anaAvatar,
      online: false
    },
    {
      id: 7,
      name: "Tarik Fazlić",
      lastMessage: "Thank you so much!",
      time: "2d",
      unread: 0,
      avatar: tarikAvatar,
      online: true
    }
  ]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const handleChatPress = (chat) => {
    if (chat.id <= 2) { // Only first two chats are openable
      setSelectedChat(chat);
      
     
      setChats(prevChats => 
        prevChats.map(c => 
          c.id === chat.id ? { ...c, unread: 0 } : c
        )
      );
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChat) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        text: messageText.trim(),
        sender: "me",
        time: getCurrentTime()
      };

      
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
        lastMessage: messageText.trim(),
        time: "now"
      };

      
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat.id ? updatedChat : chat
        )
      );

      
      setSelectedChat(updatedChat);
      
      // Clear the input
      setMessageText('');
    }
  };

  const renderChatItem = (chat) => (
  <TouchableOpacity 
    key={chat.id} 
    style={styles.chatItem}
    onPress={() => handleChatPress(chat)}
    activeOpacity={chat.id <= 2 ? 0.7 : 1}
  >
    <View style={styles.avatarContainer}>
      <Image 
        source={
          typeof chat.avatar === 'string' 
            ? { uri: chat.avatar }  // For URL strings
            : chat.avatar           // For imported images
        } 
        style={styles.avatar} 
      />
      {chat.online && <View style={styles.onlineDot} />}
    </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>
            {chat.name}
            {chat.isGroup && " 👥"}
          </Text>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.lastMessage, 
              chat.unread > 0 && styles.unreadMessage
            ]}
            numberOfLines={1}
          >
            {chat.lastMessage}
          </Text>
          {chat.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = (message, index, chat) => {
    const isMe = message.sender === "me";
    const showSender = chat.isGroup && !isMe;
    
    return (
      <View 
        key={message.id} 
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.theirMessage
        ]}
      >
        {showSender && (
          <Text style={styles.senderName}>{message.sender}</Text>
        )}
        <View style={[
          styles.messageBubble,
          isMe ? styles.myBubble : styles.theirBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.theirMessageText
          ]}>
            {message.text}
          </Text>
        </View>
        <Text style={styles.messageTime}>{message.time}</Text>
      </View>
    );
  };

  if (selectedChat) {
    // Chat conversation view
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" translucent={false} />
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Chat Header */}
          <View style={styles.chatHeaderContainer}>
            <TouchableOpacity 
              onPress={() => setSelectedChat(null)}
              style={styles.backButton}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.chatHeaderInfo}>
              <Image 
  source={
    typeof selectedChat.avatar === 'string' 
      ? { uri: selectedChat.avatar }
      : selectedChat.avatar
  } 
  style={styles.headerAvatar} 
/>
              <View>
                <Text style={styles.headerName}>{selectedChat.name}</Text>
                {selectedChat.online && !selectedChat.isGroup && (
                  <Text style={styles.headerStatus}>Active now</Text>
                )}
                {selectedChat.isGroup && (
                  <Text style={styles.headerStatus}>4 members</Text>
                )}
              </View>
            </View>
          </View>

          {/* Messages */}
          <ScrollView 
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            ref={ref => {
              if (ref) {
                ref.scrollToEnd({ animated: true });
              }
            }}
          >
            {selectedChat.messages.map((message, index) => 
              renderMessage(message, index, selectedChat)
            )}
          </ScrollView>

          {/* Message Input */}
          <View style={[
            styles.inputContainer,
            {
              paddingBottom: Platform.OS === 'ios' 
                ? (isKeyboardVisible ? 20 : 100) 
                : (isKeyboardVisible ? 8 : 3),
              marginBottom: Platform.OS === 'ios' 
                ? 0 
                : (isKeyboardVisible ? 0 : 80)
            }
          ]}>
            <TextInput
              style={styles.messageInput}
              placeholder="Message..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity 
              style={[styles.sendButton, { opacity: messageText.trim() ? 1 : 0.5 }]}
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // Chat list view
  return (
    <View style={styles.containerWithTabBar}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" translucent={false} />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Chats</Text>
        <View style={styles.headerActions}>
          
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor="#8E8E93"
        />
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {chats.map(renderChatItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  containerWithTabBar: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 80,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
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
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 18,
    color: 'white',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  chatList: {
    flex: 1,
    backgroundColor: 'white',
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: 'white',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  chatTime: {
    fontSize: 14,
    color: '#8E8E93',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  unreadMessage: {
    color: '#000',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Chat conversation styles
  chatHeaderContainer: {
    backgroundColor: '#1E3A8A',
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
    marginLeft: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: '#1E3A8A',
  },
  theirBubble: {
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: 'white',
  },
  theirMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    marginHorizontal: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ChatScreen;