

export default function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
    return (
        <div className={`my-3 p-2 text-sm ${role}`}>
            <div className="message-content">{content}</div>
        </div>

    )
}
