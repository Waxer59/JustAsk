import { useQuery } from '@tanstack/react-query'
import { BounceLoader } from 'react-spinners'

export const FinalStep = () => {
  const { isLoading } = useQuery({
    queryKey: ['interview'],
    queryFn: () => new Promise((resolve) => setTimeout(resolve, 0)) //! SIMULATE
  })

  return (
    <>
      {isLoading && <Loading />}
      {/* {!isLoading && (
        <Questions
          questions={[
            'Lorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeurLorem ipsum dolor, sit amet consequeur',
            'Lorem ipsum dolor, sit amet consequeur',
            'Lorem ipsum dolor, sit amet consequeur',
            'Lorem ipsum dolor, sit amet consequeur',
            'Lorem ipsum dolor, sit amet consequeur',
            'Lorem ipsum dolor, sit amet consequeur',
            'Lorem ipsum dolor, sit amet consequeur',
            'Lorem ipsum dolor, sit amet consequeur',
            'Lorem ipsum dolor, sit amet consequeur',
            'Lorem ipsum dolor, sit amet consequeur',
          ]}
        />
      )} */}
      {/* <InterviewChatFinal questions={[]} /> */}
    </>
  )
}

const Loading = () => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <BounceLoader color="#2f2f33" />
      <p className="text-xl">Estamos pensado las preguntas</p>
    </div>
  )
}
