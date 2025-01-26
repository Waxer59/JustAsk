export interface MessageProps {
  message: string
  isUser?: boolean
}

export const Message: React.FC<MessageProps> = ({ message, isUser }) => {
  return (
    <li
      className={`flex ${isUser ? 'justify-end pl-4' : 'justify-start pr-4'}`}>
      <p
        className={`p-3 rounded-t-lg w-[50%] text-pretty ${isUser ? 'bg-secondary text-white rounded-bl-lg' : 'bg-primary text-gray-800 rounded-br-lg'}`}>
        {message}
      </p>
    </li>
  )
}
