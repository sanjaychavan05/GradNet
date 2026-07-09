import React, { useState } from 'react';
import { Edit3, MessageSquare } from 'lucide-react';
import ConversationList from '/src/components/messages/ConversationList.jsx';
import ChatWindow from '/src/components/messages/ChatWindow.jsx';
import NewMessageModal from '/src/components/messages/NewMessageModal.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function MessagesPage() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.mentor){
            handleSelectUser(location.state.mentor);
        }
    }, [location.state]);

    const handleSelectUser = (user) => {
        setSelectedConversation({ id: `new-${user.id}`, other_participant: user });
    };

    return (
        <MainLayout>
            <div className="flex h-[calc(100vh-64px)] w-full max-w-6xl mx-auto sm:px-4 sm:py-4 overflow-hidden">
                <NewMessageModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSelectUser={handleSelectUser}
                />

                <div className="flex w-full bg-card sm:border border-border sm:rounded-2xl overflow-hidden shadow-sm">
                    <div className={`w-full md:w-80 flex flex-col border-r border-border ${selectedConversation ? 'hidden md:flex' : 'flex'
                        }`}>
                        <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
                            <h1 className="text-xl font-extrabold text-foreground tracking-tight">Messages</h1>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="p-2 hover:bg-primary/10 text-primary rounded-xl transition-colors"
                            >
                                <Edit3 size={20} />
                            </button>
                        </div>
                        <ConversationList
                            onSelectConversation={setSelectedConversation}
                            selectedId={selectedConversation?.id}
                        />
                    </div>

                    <div className={`flex-1 flex flex-col min-w-0 ${selectedConversation ? 'flex' : 'hidden md:flex'
                        }`}>
                        <ChatWindow
                            conversation={selectedConversation}
                            onBack={() => setSelectedConversation(null)}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default MessagesPage;