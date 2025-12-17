import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, MessageSquare, User, UserCog, Send, Image as ImageIcon, MapPin, Clock, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function Chat() {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  const fetchChatRooms = async () => {
    try {
      // Fetch chat rooms
      const { data: rooms, error: roomsError } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (roomsError) {
        console.error('Chat rooms error:', roomsError);
        setChatRooms([]);
        setLoading(false);
        return;
      }

      console.log('Chat rooms:', rooms);

      // Fetch orders separately for each room
      if (rooms && rooms.length > 0) {
        const orderIds = rooms.map(room => room.order_id).filter(Boolean);

        if (orderIds.length > 0) {
          const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('id, order_number, service_name, client_name, master_name')
            .in('id', orderIds);

          if (!ordersError && orders) {
            // Map orders to rooms
            const roomsWithOrders = rooms.map(room => {
              const order = orders.find(o => o.id === room.order_id);
              return {
                ...room,
                orders: order || null
              };
            });

            console.log('Rooms with orders:', roomsWithOrders);
            setChatRooms(roomsWithOrders);
          } else {
            setChatRooms(rooms);
          }
        } else {
          setChatRooms(rooms);
        }
      } else {
        setChatRooms([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      setChatRooms([]);
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const filteredRooms = chatRooms.filter(room => {
    const searchLower = searchQuery.toLowerCase();
    return (
      room.user_id?.toLowerCase().includes(searchLower) ||
      room.master_id?.toLowerCase().includes(searchLower) ||
      room.last_message_text?.toLowerCase().includes(searchLower) ||
      room.orders?.order_number?.toLowerCase().includes(searchLower)
    );
  });

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return format(date, 'HH:mm');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kecha ' + format(date, 'HH:mm');
    } else {
      return format(date, 'dd.MM.yyyy HH:mm');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-600 mt-1">Jami {chatRooms.length} ta suhbat</p>
      </div>

      {/* Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 250px)' }}>
        {/* Chat Rooms List */}
        <div className="lg:col-span-1 card p-0 flex flex-col" style={{ height: '100%' }}>
          {/* Search */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Rooms List */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
            {filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="w-12 h-12 mb-2" />
                <p>Suhbatlar topilmadi</p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedRoom?.id === room.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0 relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-medium">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      {(room.user_unread_count > 0 || room.master_unread_count > 0) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">
                            {room.user_unread_count + room.master_unread_count}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-gray-900 text-sm">
                              {room.orders?.client_name || 'Mijoz'}
                            </span>
                          </div>
                          <span className="text-gray-400">↔</span>
                          <div className="flex items-center gap-1">
                            <UserCog className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-gray-900 text-sm">
                              {room.orders?.master_name || 'Usta'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Info */}
                      {room.orders && (
                        <p className="text-xs text-gray-500 mb-1">
                          #{room.orders.order_number} - {room.orders.service_name}
                        </p>
                      )}

                      {/* Last Message */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {room.last_message_sender_type === 'user' && (
                            <span className="text-blue-600 font-medium">
                              {room.orders?.client_name || 'Mijoz'}:
                            </span>
                          )}
                          {room.last_message_sender_type === 'master' && (
                            <span className="text-green-600 font-medium">
                              {room.orders?.master_name || 'Usta'}:
                            </span>
                          )}
                          {room.last_message_text || 'Hali xabar yo\'q'}
                        </p>
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {room.last_message_at
                            ? formatMessageTime(room.last_message_at)
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-2 card p-0 flex flex-col" style={{ height: '100%' }}>
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-gray-900">
                        {selectedRoom.orders?.client_name || 'Mijoz'}
                      </span>
                      <span className="text-gray-400">↔</span>
                      <UserCog className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-gray-900">
                        {selectedRoom.orders?.master_name || 'Usta'}
                      </span>
                    </div>
                    {selectedRoom.orders && (
                      <p className="text-sm text-gray-600">
                        Buyurtma: #{selectedRoom.orders.order_number} - {selectedRoom.orders.service_name}
                      </p>
                    )}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedRoom.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedRoom.is_active ? 'Faol' : 'Nofaol'}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100% - 140px)', scrollBehavior: 'smooth' }}>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare className="w-12 h-12 mb-2" />
                    <p>Xabarlar yo'q</p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isUser = message.sender_type === 'user';
                    const isMaster = message.sender_type === 'master';

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMaster ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] ${
                            isMaster
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-500 text-white'
                          } rounded-2xl px-4 py-2 shadow-md`}
                        >
                          {/* Sender Label */}
                          <div className="flex items-center gap-1 mb-1">
                            {isUser ? (
                              <User className="w-3 h-3" />
                            ) : (
                              <UserCog className="w-3 h-3" />
                            )}
                            <span className="text-xs font-medium opacity-90">
                              {isUser
                                ? (selectedRoom.orders?.client_name || 'Mijoz')
                                : (selectedRoom.orders?.master_name || 'Usta')
                              }
                            </span>
                          </div>

                          {/* Message Content */}
                          {message.message_type === 'text' && message.message_text && (
                            <p className="text-sm mb-1">{message.message_text}</p>
                          )}

                          {message.message_type === 'image' && (
                            <div className="mb-2">
                              <div className="w-48 h-48 bg-white/20 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-12 h-12" />
                              </div>
                              {message.message_text && (
                                <p className="text-sm mt-2">{message.message_text}</p>
                              )}
                            </div>
                          )}

                          {message.message_type === 'location' && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">Manzil yuborildi</span>
                              </div>
                              {message.location_address && (
                                <p className="text-xs opacity-90">{message.location_address}</p>
                              )}
                              {message.latitude && message.longitude && (
                                <p className="text-xs opacity-75">
                                  {message.latitude}, {message.longitude}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Time and Status */}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs opacity-75">
                              {message.created_at
                                ? format(new Date(message.created_at), 'HH:mm')
                                : ''}
                            </span>
                            {message.is_read ? (
                              <CheckCheck className="w-4 h-4 opacity-75" />
                            ) : (
                              <Check className="w-4 h-4 opacity-75" />
                            )}
                          </div>

                          {/* Deleted */}
                          {message.is_deleted && (
                            <p className="text-xs italic opacity-75 mt-1">
                              Bu xabar o'chirilgan
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Area (Read-only for admin) */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageSquare className="w-5 h-5" />
                  <p>Admin sifatida faqat ko'rish mumkin</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Suhbatni tanlang</p>
              <p className="text-sm">Xabarlarni ko'rish uchun chap tarafdan suhbatni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
