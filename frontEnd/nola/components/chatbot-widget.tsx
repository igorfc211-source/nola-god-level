// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { MessageCircle, X, Send, Loader2 } from "lucide-react"
// import { cn } from "@/lib/utils"

// export function ChatbotWidget() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [messages, setMessages] = useState([{ role: "assistant", content: "Olá! Como posso ajudar você hoje?" }])
//   const [input, setInput] = useState("")
//   const [isTyping, setIsTyping] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages, isTyping])

//   const handleSend = () => {
//     if (!input.trim()) return

//     setMessages([...messages, { role: "user", content: input }])
//     setInput("")
//     setIsTyping(true)

//     // Simulate bot response with typing delay
//     setTimeout(() => {
//       setIsTyping(false)
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: "Obrigado pela sua mensagem! Como posso ajudar com seus relatórios?",
//         },
//       ])
//     }, 1500)
//   }

//   return (
//     <>
//       {!isOpen && (
//         <Button
//           onClick={() => setIsOpen(true)}
//           size="lg"
//           className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg animate-pulse-glow hover:scale-110 smooth-transition"
//         >
//           <MessageCircle className="h-6 w-6" />
//         </Button>
//       )}

//       {/* Chat Widget */}
//       <div
//         className={cn(
//           "fixed bottom-6 right-6 w-[380px] transition-all duration-300 ease-out",
//           isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
//         )}
//       >
//         <Card className="shadow-2xl border-2 animate-slide-up">
//           <CardHeader className="flex flex-row items-center justify-between border-b bg-accent text-accent-foreground">
//             <div className="flex items-center gap-2">
//               <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
//               <CardTitle className="text-base">Assistente Virtual</CardTitle>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsOpen(false)}
//               className="h-8 w-8 p-0 hover:bg-accent-foreground/10 hover:rotate-90 smooth-transition"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="h-[320px] space-y-4 overflow-y-auto p-4 scroll-smooth">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={cn("flex animate-slide-in", message.role === "user" ? "justify-end" : "justify-start")}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                 >
//                   <div
//                     className={cn(
//                       "max-w-[80%] rounded-lg px-4 py-2 text-sm smooth-transition hover:scale-105",
//                       message.role === "user"
//                         ? "bg-accent text-accent-foreground shadow-md"
//                         : "bg-muted text-foreground shadow-sm",
//                     )}
//                   >
//                     {message.content}
//                   </div>
//                 </div>
//               ))}

//               {isTyping && (
//                 <div className="flex justify-start animate-slide-in">
//                   <div className="max-w-[80%] rounded-lg bg-muted px-4 py-3 text-sm">
//                     <div className="flex gap-1">
//                       <div
//                         className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
//                         style={{ animationDelay: "0s" }}
//                       />
//                       <div
//                         className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
//                         style={{ animationDelay: "0.2s" }}
//                       />
//                       <div
//                         className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
//                         style={{ animationDelay: "0.4s" }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="border-t p-4 bg-muted/30">
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Digite sua mensagem..."
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                   className="flex-1 focus:ring-2 focus:ring-accent smooth-transition"
//                   disabled={isTyping}
//                 />
//                 <Button
//                   size="sm"
//                   onClick={handleSend}
//                   disabled={!input.trim() || isTyping}
//                   className="hover:scale-110 smooth-transition"
//                 >
//                   {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </>
//   )
// }
