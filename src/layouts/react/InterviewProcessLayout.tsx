interface Props {
  header: React.ReactNode
  children: React.ReactNode
  shouldLockScreen?: boolean
}

export const InterviewProcessLayout: React.FC<Props> = ({
  header,
  children,
  shouldLockScreen = true
}) => {
  return (
    <div className={`${shouldLockScreen ? 'h-screen' : ''} flex flex-col`}>
      <header className="pt-28 flex flex-col gap-10">{header}</header>
      <main className="max-w-3xl mx-auto w-full mt-28 flex flex-col gap-10 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
