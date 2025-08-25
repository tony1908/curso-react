import { useState, useEffect, useRef } from 'react'
import './ChatPage.css'

interface Message {
    id: string;
    type: string;
    text: string;
    timestamp: Date;
}

function ChatPage() {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [userId, setUserId] = useState('');
    const [roomName, setRoomName] = useState('');
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const messageEndRef = useRef<HTMLDivElement>(null);

    const connectToWebSocket = () => {
        const userIdValue = userId.trim();
        if (!userIdValue) {
            alert('Please enter a user ID');
            return;
        }

        if (ws) return;

        const webSocket = new WebSocket('ws://localhost:8080/websocket/');

        webSocket.onopen = () => {
            setIsConnected(true);
            const room = roomName.trim();
            setCurrentRoom(room);
            webSocket.send(`USER:${userIdValue}:${room}`)
        }

        webSocket.onmessage = (event) => {
            const message = event.data;

            if (message.includes('Welcome') && !isRegistered) {
                setIsRegistered(true);
                addMessage(message, 'system');
            }
        }

        webSocket.onclose = (event) => {
            setIsConnected(false);
            setIsRegistered(false);
            setCurrentRoom(null);
            setWs(null);
            addMessage('Connection closed: ' + event.code + ' ' + event.reason  , 'system');
        }

        setWs(webSocket);
    }

    const disconnect = () => {
        if (ws) {
            ws.close();

        }
    } 

    const addMessage = (text: string, type: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            type,
            text,
            timestamp: new Date(),
        }

        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    const sendMessage = () => {
        const message = messageInput.trim();
        if (ws) {
            ws.send(message);
            setMessageInput('');
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>Chat</h1>
                <div className="user-setup">
                    <input 
                        type="text" 
                        value={userId} 
                        onChange={(e) => setUserId(e.target.value)} 
                        placeholder='User ID' 
                        disabled={isConnected} 
                        className='user-id-input' 
                    />
                    <input 
                        type="text" 
                        value={roomName} 
                        onChange={(e) => setRoomName(e.target.value)} 
                        placeholder='Room Name' 
                        disabled={isConnected} 
                        className='room-input' 
                    />
                    <button onClick={connectToWebSocket} disabled={isConnected} className='connect-btn'>Connect</button>
                    <button onClick={disconnect} disabled={!isConnected} className='disconnect-btn'>Disconnect</button>
                    <span className="status">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
            </div>

            <div className="input-container">
                <input 
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder='Type your message...'
                    disabled={!isRegistered}
                    className='message-input'
                />
                <button onClick={sendMessage} disabled={!isRegistered || !messageInput} className='send-btn'>Send</button>
            </div>

            <div className="messages-container">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.type}`}> 
                        <div className="message-content">{message.text}</div>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default ChatPage;