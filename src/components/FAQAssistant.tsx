import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
    role: 'assistant' | 'user';
    content: string;
}

export function FAQAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hi! I\'m your InterviewPrep assistant. How can I help you today?' }
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            console.log('Asking FAQ:', userMessage);
            const { data, error } = await supabase.functions.invoke('interview-ai', {
                body: {
                    action: 'ask-faq',
                    context: { question: userMessage }
                }
            });

            if (error) {
                console.error('Supabase function error:', error);
                throw error;
            }

            console.log('FAQ Response received:', data);

            if (data?.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: `Support Error: ${data.error}` }]);
                return;
            }

            const aiAnswer = data?.answer || "I'm sorry, I couldn't process that. Please try again or contact support.";
            setMessages(prev => [...prev, { role: 'assistant', content: aiAnswer }]);
        } catch (error: any) {
            console.error('FAQ Error:', error);
            const errorMessage = error?.message || 'Failed to get response';
            toast.error(errorMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: `Connection Error: ${errorMessage}. Please try again.` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] sm:w-[400px]"
                    >
                        <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-primary-foreground rounded-t-xl">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Bot className="h-5 w-5" />
                                    InterviewPrep Assistant
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px] p-4">
                                    <div className="space-y-4">
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${message.role === 'assistant'
                                                        ? 'bg-muted text-foreground rounded-tl-none'
                                                        : 'bg-primary text-primary-foreground rounded-tr-none'
                                                        }`}
                                                >
                                                    {message.content}
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                    <span className="text-xs text-muted-foreground italic">Thinking...</span>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={scrollRef} />
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="p-4 border-t">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSend();
                                    }}
                                    className="flex w-full items-center space-x-2"
                                >
                                    <Input
                                        placeholder="Ask a question..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="flex-1"
                                        disabled={isLoading}
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="lg"
                className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 p-0"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </Button>
        </div>
    );
}
