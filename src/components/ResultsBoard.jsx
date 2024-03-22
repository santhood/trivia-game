import { useEffect, useState } from 'react'
import { useStore } from '@nanostores/react'
import { $results } from '@/store/results'
import { $questions, $showQuestions } from '@/store/questions'

import styles from './ResultsBoard.module.css'

export default function ResultsBoard() {
  const results = useStore($results)
  const questions = useStore($questions)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    const calcPercentage = (results / questions.length) * 100
    setPercentage(calcPercentage.toFixed())
  }, [])

  const handleTryAgain = () => {
    $questions.set([])
    $showQuestions.set(true)
    $results.set(0)
    setPercentage(0)
  }

  return (
    <div>
      <h2 className={styles.result}>
        Your score <br /> <span>{percentage}%</span>
      </h2>
      <div className={styles.progress}>
        <div style={{ transform: `translateX(${percentage}%)` }}></div>
      </div>
      <button type='button' className='btn-primary' onClick={handleTryAgain}>
        Try again
      </button>
    </div>
  )
}
