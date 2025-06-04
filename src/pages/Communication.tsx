import React, { useState, useEffect } from 'react';
import { Plus, Search, MessageSquare, User, Mail, Upload, Download, File } from 'lucide-react';
import { storageService, Message } from '../services/storageService';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

const Communication: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    content: '',
    channel: 'general'
  });

  useEffect(() => {
    setMessages(storageService.getMessages());
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newAttachment: FileAttachment = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        };
        setAttachedFiles(prev => [...prev, newAttachment]);
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendMessage = () => {
    if (formData.content.trim() || attachedFiles.length > 0) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'Current User',
        recipient: formData.recipient || 'Everyone',
        subject: formData.subject || 'No Subject',
        content: formData.content,
        timestamp: new Date().toISOString(),
        isRead: false,
        channel: formData.channel,
        attachments: attachedFiles
      };

      storageService.saveMessage(newMessage);
      setMessages(storageService.getMessages());
      setShowComposeModal(false);
      resetForm();
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      storageService.deleteMessage(id);
      setMessages(storageService.getMessages());
    }
  };

  const resetForm = () => {
    setFormData({
      recipient: '',
      subject: '',
      content: '',
      channel: 'general'
    });
    setAttachedFiles([]);
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = message.channel === selectedChannel || selectedChannel === 'all';
    return matchesSearch && matchesChannel;
  });

  const channels = [
    { id: 'general', name: 'General', icon: MessageSquare },
    { id: 'production', name: 'Production', icon: MessageSquare },
    { id: 'cast', name: 'Cast', icon: User },
    { id: 'crew', name: 'Crew', icon: User },
    { id: 'directors', name: 'Directors', icon: MessageSquare },
    { id: 'announcements', name: 'Announcements', icon: MessageSquare }
  ];

  const unreadCount = messages.filter(m => !m.isRead).length;
  const todaysMessages = messages.filter(m => 
    new Date(m.timestamp).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Center</h1>
          <p className="text-gray-600 mt-1">Team collaboration and messaging platform</p>
        </div>
        <button
          onClick={() => setShowComposeModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Message</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900">{messages.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Mail className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-3xl font-bold text-gray-900">{todaysMessages}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Channels</p>
              <p className="text-3xl font-bold text-gray-900">{channels.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Channels Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Channels</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedChannel('all')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  selectedChannel === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>All Messages</span>
              </button>
              {channels.map((channel) => {
                const Icon = channel.icon;
                const channelMessages = messages.filter(m => m.channel === channel.id);
                return (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedChannel === channel.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span>{channel.name}</span>
                    </div>
                    {channelMessages.length > 0 && (
                      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {channelMessages.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Messages List */}
            <div className="p-6">
              {filteredMessages.length > 0 ? (
                <div className="space-y-4">
                  {filteredMessages
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((message) => (
                    <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{message.subject}</h4>
                            <p className="text-sm text-gray-600">
                              From: {message.sender} → {message.recipient}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleDateString()} {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{message.content}</p>
                      
                      {/* File Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Attachments:</h5>
                          <div className="space-y-2">
                            {message.attachments.map((file) => (
                              <div key={file.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex items-center space-x-2">
                                  <File className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                                </div>
                                <a
                                  href={file.url}
                                  download={file.name}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          #{message.channel}
                        </span>
                        {!message.isRead && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                  <p className="text-gray-600 mb-6">Start a conversation with your team</p>
                  <button
                    onClick={() => setShowComposeModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compose Message Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowComposeModal(false)}></div>
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">Compose Message</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({...formData, channel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {channels.map(channel => (
                      <option key={channel.id} value={channel.id}>{channel.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter recipient (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your message..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload files</span>
                    </label>
                  </div>
                  
                  {/* Attached Files */}
                  {attachedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <File className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                          </div>
                          <button
                            onClick={() => removeAttachment(file.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowComposeModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;
