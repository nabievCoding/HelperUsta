import { useState, useEffect, useRef } from 'react';
import {
  Phone,
  MessageCircle,
  Search,
  Send,
  Mic,
  Play,
  Pause,
  User,
  Clock,
  Check,
  CheckCheck,
  ArrowLeft,
  Volume2,
  MoreVertical,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const CallCenter = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // Barcha chat roomlarni olish
  useEffect(() => {
    fetchChatRooms();
    
    // Real-time subscription for new messages
    const subscription = supabase
      .channel('admin-chats-all')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'admin_chats',
      }, (payload) => {
        console.log('New message received:', payload);
        handleNewMessage(payload.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Tanlangan chat uchun xabarlarni olish
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.user_id);
      markMessagesAsRead(selectedChat.user_id);
    }
  }, [selectedChat]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      
      if (!supabase) {
        // Mock data for development
        setChatRooms(getMockChatRooms());
        return;
      }

      // Get unique users with their latest message
      const { data, error } = await supabase
        .from('admin_chats')
        .select(`
          user_id,
          message_text,
          message_type,
          voice_duration,
          created_at,
          is_read,
          sender_type
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by user_id and get latest message for each
      const userChats = {};
      data?.forEach((msg) => {
        if (!userChats[msg.user_id]) {
          userChats[msg.user_id] = {
            user_id: msg.user_id,
            lastMessage: msg.message_text || (msg.message_type === 'voice' ? '🎤 Ovozli xabar' : ''),
            lastMessageTime: msg.created_at,
            unreadCount: 0,
            messageType: msg.message_type,
          };
        }
        if (!msg.is_read && msg.sender_type === 'user') {
          userChats[msg.user_id].unreadCount++;
        }
      });

      // Get user info for each chat
      const userIds = Object.keys(userChats);
      if (userIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, phone, avatar_url')
          .in('id', userIds);

        if (!usersError && users) {
          users.forEach((user) => {
            if (userChats[user.id]) {
              userChats[user.id].user = user;
            }
          });
        }
      }

      setChatRooms(Object.values(userChats).sort((a, b) => 
        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      ));
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      setChatRooms(getMockChatRooms());
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      if (!supabase) {
        setMessages(getMockMessages(userId));
        return;
      }

      const { data, error } = await supabase
        .from('admin_chats')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages(getMockMessages(userId));
    }
  };

  const markMessagesAsRead = async (userId) => {
    try {
      if (!supabase) return;

      await supabase
        .from('admin_chats')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('sender_type', 'user')
        .eq('is_read', false);

      // Update local state
      setChatRooms(prev => prev.map(room => 
        room.user_id === userId ? { ...room, unreadCount: 0 } : room
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleNewMessage = (message) => {
    // Update chat rooms list
    setChatRooms(prev => {
      const existingIndex = prev.findIndex(r => r.user_id === message.user_id);
      const updatedRoom = {
        user_id: message.user_id,
        lastMessage: message.message_text || (message.message_type === 'voice' ? '🎤 Ovozli xabar' : ''),
        lastMessageTime: message.created_at,
        unreadCount: message.sender_type === 'user' ? 1 : 0,
        messageType: message.message_type,
        user: existingIndex >= 0 ? prev[existingIndex].user : null,
      };

      if (existingIndex >= 0) {
        updatedRoom.unreadCount += prev[existingIndex].unreadCount;
        updatedRoom.user = prev[existingIndex].user;
        const newRooms = [...prev];
        newRooms.splice(existingIndex, 1);
        return [updatedRoom, ...newRooms];
      }
      return [updatedRoom, ...prev];
    });

    // Update current chat messages if this chat is selected
    if (selectedChat && selectedChat.user_id === message.user_id) {
      setMessages(prev => [...prev, message]);
      if (message.sender_type === 'user') {
        markMessagesAsRead(message.user_id);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      setSendingMessage(true);
      
      const messageData = {
        user_id: selectedChat.user_id,
        sender_type: 'admin',
        message_type: 'text',
        message_text: newMessage.trim(),
        is_read: false,
      };

      if (supabase) {
        const { error } = await supabase
          .from('admin_chats')
          .insert(messageData);

        if (error) throw error;
      } else {
        // Mock: Add to local state
        const mockMessage = {
          ...messageData,
          id: Date.now(),
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, mockMessage]);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Xabar yuborishda xatolik yuz berdi');
    } finally {
      setSendingMessage(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await sendVoiceMessage(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Mikrofonga ruxsat berilmadi');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingTimerRef.current);
    }
  };

  const sendVoiceMessage = async (blob) => {
    if (!selectedChat) return;

    try {
      setSendingMessage(true);
      const timestamp = Date.now();
      const fileName = `voice_admin_${selectedChat.user_id}_${timestamp}.webm`;

      if (supabase) {
        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('voice')
          .upload(fileName, blob, {
            contentType: 'audio/webm',
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('voice')
          .getPublicUrl(fileName);

        // Save to database
        const { error: dbError } = await supabase
          .from('admin_chats')
          .insert({
            user_id: selectedChat.user_id,
            sender_type: 'admin',
            message_type: 'voice',
            voice_url: urlData.publicUrl,
            voice_duration: recordingTime,
            is_read: false
          });

        if (dbError) throw dbError;
      } else {
        // Mock
        const mockMessage = {
          id: Date.now(),
          user_id: selectedChat.user_id,
          sender_type: 'admin',
          message_type: 'voice',
          voice_url: URL.createObjectURL(blob),
          voice_duration: recordingTime,
          is_read: false,
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, mockMessage]);
      }

      setRecordingTime(0);
    } catch (error) {
      console.error('Error sending voice message:', error);
      alert('Ovozli xabar yuborishda xatolik');
    } finally {
      setSendingMessage(false);
    }
  };

  const playAudio = (url, messageId) => {
    if (playingAudio === messageId) {
      audioRef.current?.pause();
      setPlayingAudio(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingAudio(messageId);
        audioRef.current.onended = () => setPlayingAudio(null);
      }
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Bugun';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Kecha';
    }
    return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredChatRooms = chatRooms.filter(room => {
    if (!searchQuery) return true;
    const userName = room.user?.full_name || room.user?.phone || '';
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Mock data
  const getMockChatRooms = () => [
    {
      user_id: '1',
      user: { id: '1', full_name: 'Aziz Karimov', phone: '+998901234567', avatar_url: null },
      lastMessage: 'Salom, yordam kerak edi',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 3,
      messageType: 'text',
    },
    {
      user_id: '2',
      user: { id: '2', full_name: 'Dilnoza Rahimova', phone: '+998909876543', avatar_url: null },
      lastMessage: '🎤 Ovozli xabar',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 1,
      messageType: 'voice',
    },
    {
      user_id: '3',
      user: { id: '3', full_name: 'Bobur Toshmatov', phone: '+998933334455', avatar_url: null },
      lastMessage: 'Rahmat, muammo hal bo\'ldi',
      lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
      unreadCount: 0,
      messageType: 'text',
    },
  ];

  const getMockMessages = (userId) => [
    {
      id: 1,
      user_id: userId,
      sender_type: 'user',
      message_type: 'text',
      message_text: 'Salom, yordam kerak edi',
      is_read: true,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      user_id: userId,
      sender_type: 'admin',
      message_type: 'text',
      message_text: 'Salom! Qanday yordam bera olaman?',
      is_read: true,
      created_at: new Date(Date.now() - 3500000).toISOString(),
    },
    {
      id: 3,
      user_id: userId,
      sender_type: 'user',
      message_type: 'voice',
      voice_url: '',
      voice_duration: 15,
      is_read: true,
      created_at: new Date(Date.now() - 3400000).toISOString(),
    },
    {
      id: 4,
      user_id: userId,
      sender_type: 'user',
      message_type: 'text',
      message_text: 'Buyurtma bilan muammo bor',
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex bg-gray-100 rounded-xl overflow-hidden shadow-lg">
      {/* Hidden audio element */}
      <audio ref={audioRef} className="hidden" />

      {/* Chat Rooms List */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col bg-white border-r`}>
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Phone className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Call Center</h2>
                <p className="text-blue-100 text-sm">Mijozlar bilan muloqot</p>
              </div>
            </div>
            <button 
              onClick={fetchChatRooms}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <RefreshCw className="text-white" size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
          </div>
        </div>

        {/* Chat Rooms */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredChatRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <MessageCircle size={48} className="mb-2 text-gray-300" />
              <p>Xabarlar yo'q</p>
            </div>
          ) : (
            filteredChatRooms.map((room) => (
              <div
                key={room.user_id}
                onClick={() => setSelectedChat(room)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${
                  selectedChat?.user_id === room.user_id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="relative">
                  {room.user?.avatar_url ? (
                    <img
                      src={room.user.avatar_url}
                      alt={room.user?.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                  )}
                  {room.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {room.user?.full_name || room.user?.phone || 'Noma\'lum'}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(room.lastMessageTime)}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${room.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {room.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-gray-50`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 bg-white border-b shadow-sm">
              <button
                onClick={() => setSelectedChat(null)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="relative">
                {selectedChat.user?.avatar_url ? (
                  <img
                    src={selectedChat.user.avatar_url}
                    alt={selectedChat.user?.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {selectedChat.user?.full_name || 'Noma\'lum'}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedChat.user?.phone || 'Telefon raqami yo\'q'}
                </p>
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isAdmin = message.sender_type === 'admin';
                const showDate = index === 0 || 
                  formatDate(message.created_at) !== formatDate(messages[index - 1].created_at);

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                          isAdmin
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md'
                        }`}
                      >
                        {message.message_type === 'voice' ? (
                          <div className="flex items-center gap-3 min-w-[180px]">
                            <button
                              onClick={() => playAudio(message.voice_url, message.id)}
                              className={`p-2 rounded-full ${
                                isAdmin ? 'bg-white/20 hover:bg-white/30' : 'bg-blue-100 hover:bg-blue-200'
                              } transition-colors`}
                            >
                              {playingAudio === message.id ? (
                                <Pause size={18} className={isAdmin ? 'text-white' : 'text-blue-600'} />
                              ) : (
                                <Play size={18} className={isAdmin ? 'text-white' : 'text-blue-600'} />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className={`h-1 rounded-full ${isAdmin ? 'bg-white/30' : 'bg-gray-200'}`}>
                                <div 
                                  className={`h-full rounded-full ${isAdmin ? 'bg-white' : 'bg-blue-500'}`}
                                  style={{ width: playingAudio === message.id ? '60%' : '0%' }}
                                ></div>
                              </div>
                            </div>
                            <span className={`text-xs ${isAdmin ? 'text-white/70' : 'text-gray-500'}`}>
                              {formatDuration(message.voice_duration || 0)}
                            </span>
                          </div>
                        ) : (
                          <p className="break-words">{message.message_text}</p>
                        )}
                        
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          isAdmin ? 'text-white/70' : 'text-gray-400'
                        }`}>
                          <span className="text-xs">{formatTime(message.created_at)}</span>
                          {isAdmin && (
                            message.is_read ? (
                              <CheckCheck size={14} className="text-blue-300" />
                            ) : (
                              <Check size={14} />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              {isRecording ? (
                <div className="flex items-center gap-4 px-4 py-3 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-red-600 font-medium">Yozilmoqda...</span>
                  </div>
                  <span className="text-red-600 font-mono">{formatDuration(recordingTime)}</span>
                  <div className="flex-1"></div>
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yuborish
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={startRecording}
                    className="p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Ovozli xabar"
                  >
                    <Mic size={22} />
                  </button>
                  
                  <input
                    type="text"
                    placeholder="Xabar yozing..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sendingMessage ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={48} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Call Center</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Mijozlar bilan muloqot qilish uchun chap tarafdan suhbatni tanlang
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallCenter;
