import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Loader2, Send, Plus, LogOut, User, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  // Rediriger vers la landing page si non authentifié
  if (!loading && !isAuthenticated) {
    window.location.href = "/";
    return null;
  }
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: conversations, refetch: refetchConversations } = trpc.conversation.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: messages, refetch: refetchMessages } = trpc.conversation.getMessages.useQuery(
    { conversationId: currentConversationId! },
    { enabled: currentConversationId !== null }
  );

  // Mutations
  const createConversation = trpc.conversation.create.useMutation({
    onSuccess: (data) => {
      setCurrentConversationId(data.id);
      refetchConversations();
      toast.success("Nouvelle conversation créée");
    },
  });

  const sendMessage = trpc.conversation.sendMessage.useMutation({
    onSuccess: () => {
      refetchMessages();
      setMessage("");
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi du message: " + error.message);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Create first conversation if none exists
  useEffect(() => {
    if (isAuthenticated && conversations && conversations.length === 0 && !createConversation.isPending) {
      createConversation.mutate({ title: "Première conversation" });
    } else if (conversations && conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [isAuthenticated, conversations, currentConversationId]);

  const handleSendMessage = () => {
    if (!message.trim() || !currentConversationId) return;
    
    sendMessage.mutate({
      conversationId: currentConversationId,
      content: message.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    createConversation.mutate({ title: "Nouvelle conversation" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="flex justify-center">
            <img src="/logo.png" alt={APP_TITLE} className="h-20 w-20" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{APP_TITLE}</h1>
          <p className="text-gray-600">
            UNIALIST - Votre assistant universel qui vous éclaire et vous élève.
          </p>
          <Button
            onClick={() => window.location.href = getLoginUrl()}
            size="lg"
            className="w-full"
          >
            Se connecter
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{APP_TITLE}</h2>
          <button
            onClick={() => window.location.href = '/permissions'}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Paramètres des permissions"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <Button
            onClick={handleNewConversation}
            className="w-full"
            disabled={createConversation.isPending}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {conversations?.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setCurrentConversationId(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  currentConversationId === conv.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {conv.title || "Sans titre"}
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700 truncate">{user?.name || user?.email}</span>
          </div>
          <Button
            onClick={() => logout()}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {!messages || messages.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Bonjour ! 👋
                </h3>
                <p className="text-gray-600">
                  Je suis votre compagnon IA personnel. Comment puis-je vous aider aujourd'hui ?
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}

            {sendMessage.isPending && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl px-4 py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre message..."
              className="flex-1"
              disabled={!currentConversationId || sendMessage.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || !currentConversationId || sendMessage.isPending}
              size="icon"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

