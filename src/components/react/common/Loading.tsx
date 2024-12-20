import { BounceLoader } from 'react-spinners'

interface Props {
  text: string
}

export const Loading: React.FC<Props> = ({ text }) => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <BounceLoader color="#2f2f33" />
      <p className="text-xl">{text}</p>
    </div>
  )
}
