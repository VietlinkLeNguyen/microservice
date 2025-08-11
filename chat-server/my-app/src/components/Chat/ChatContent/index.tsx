import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// Fake Data
import { getMessages, Message } from '@/api/chat';
import { IConversation } from '@/api/swr/chat';
import { useAuthContext } from '@/context/auth-context';
import {
  ArrowLeft,
  EllipsisVertical,
  ImagePlus,
  MessagesSquare,
  Paperclip,
  Phone,
  Plus,
  Send,
  Video
} from 'lucide-react';
// import { convo as conversations } from './data/convo';

export default function ChatContent({
  conversation
}: {
  conversation: IConversation | null;
}) {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [mobileSelectedUser, setMobileSelectedUser] = useState<Message | null>(
    null
  );
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false);

  const socket = io('http://localhost:85', {
    path: '/chat/socket.io'
  });
  socket.on('connect', () => {
    console.log(socket.id);
  });

  socket.on('disconnect', () => {
    console.log(socket.id);
  });
  socket.on('receiveMessage', (data) => {
    console.log('New message:', data);
  });

  useEffect(() => {
    const getData = async () => {
      if (conversation) {
        try {
          const data = await getMessages(conversation._id);
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };
    getData();
  }, [conversation]);
  const sendMessage = () => {
    if (conversation) {
      const message = {
        sender: 'You',
        message: 'Hello!',
        timestamp: new Date()
      };
      socket.emit('sendMessage', 'Send from client');
      console.log('Message sent:', message);
    }
  };

  const partner = conversation?.users.find((item) => item.id !== user?._id);

  return (
    <>
      {conversation ? (
        <div
          className={cn(
            'bg-primary-foreground absolute inset-0 h-full left-full z-50 hidden w-full flex-1 flex-col rounded-md border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex',
            mobileSelectedUser && 'left-0 flex'
          )}
        >
          {/* Top Part */}
          <div className="bg-secondary mb-1 flex flex-none justify-between rounded-t-md p-4 shadow-lg">
            {/* Left */}
            <div className="flex gap-3">
              <Button
                size="icon"
                variant="ghost"
                className="-ml-2 h-full sm:hidden"
                onClick={() => setMobileSelectedUser(null)}
              >
                <ArrowLeft />
              </Button>
              <div className="flex items-center gap-2 lg:gap-4">
                <Avatar className="size-9 lg:size-11">
                  <AvatarImage
                    src={'https://randomuser.me/api/portraits/men/32.jpg'}
                    alt={partner?.name}
                  />
                  <AvatarFallback>{partner?.name}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="col-start-2 row-span-2 text-sm font-medium lg:text-base">
                    {partner?.name}
                  </span>
                  <span className="text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm">
                    {partner?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="-mr-1 flex items-center gap-1 lg:gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
              >
                <Video size={22} className="stroke-muted-foreground" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
              >
                <Phone size={22} className="stroke-muted-foreground" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6"
              >
                <EllipsisVertical className="stroke-muted-foreground sm:size-5" />
              </Button>
            </div>
          </div>

          {/* Conversation */}
          <div className="flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4 ">
            <div className="flex size-full flex-1">
              <div className="chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden">
                <div className="chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pr-4 pb-4">
                  {messages.map((msg, index) => (
                    <div
                      key={`${msg.senderID}-${msg.createdAt}-${index}`}
                      className={cn(
                        'chat-box max-w-72 px-3 py-2 break-words shadow-lg',
                        msg.senderID === 'You'
                          ? 'bg-primary/85 text-primary-foreground/75 self-end rounded-[16px_16px_0_16px]'
                          : 'bg-secondary self-start rounded-[16px_16px_16px_0]'
                      )}
                    >
                      {msg.message}{' '}
                      <span
                        className={cn(
                          'text-muted-foreground mt-1 block text-xs font-light italic',
                          msg.senderID === 'You' && 'text-right'
                        )}
                      >
                        {format(msg.createdAt, 'h:mm a')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <form className="flex w-full flex-none gap-2">
              <div className="border-input focus-within:ring-ring flex flex-1 items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4">
                <div className="space-x-1">
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="h-8 rounded-md"
                  >
                    <Plus size={20} className="stroke-muted-foreground" />
                  </Button>
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="hidden h-8 rounded-md lg:inline-flex"
                  >
                    <ImagePlus size={20} className="stroke-muted-foreground" />
                  </Button>
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="hidden h-8 rounded-md lg:inline-flex"
                  >
                    <Paperclip size={20} className="stroke-muted-foreground" />
                  </Button>
                </div>
                <label className="flex-1">
                  <span className="sr-only">Chat Text Box</span>
                  <input
                    type="text"
                    placeholder="Type your messages..."
                    className="h-8 w-full bg-inherit focus-visible:outline-hidden"
                  />
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex"
                  onClick={sendMessage}
                >
                  <Send size={20} />
                </Button>
              </div>
              <Button className="h-full sm:hidden">
                <Send size={18} /> Send
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'bg-primary-foreground h-full absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex'
          )}
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="border-border flex size-16 items-center justify-center rounded-full border-2">
              <MessagesSquare className="size-8" />
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-xl font-semibold">Your messages</h1>
              <p className="text-muted-foreground text-sm">
                Send a message to start a chat.
              </p>
            </div>
            <Button
              className="bg-blue-500 px-6 text-white hover:bg-blue-600"
              onClick={() => setCreateConversationDialog(true)}
            >
              Send message
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
