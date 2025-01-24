interface Props {
  text?: string
}

export const HorizontalLine: React.FC<Props> = ({ text }) => {
  return (
    <div className="inline-flex items-center justify-center w-full">
      <hr className="w-full h-px my-8 bg-zinc-200 border-0 dark:bg-zinc-700" />
      <span className="absolute px-3 font-medium text-zinc-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-zinc-950">
        {text}
      </span>
    </div>
  )
}
