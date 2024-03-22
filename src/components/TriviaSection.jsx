import { useStore } from '@nanostores/react'
import { $questions, $showQuestions } from '@/store/questions'
import GameForm from './GameForm'
import QuestionBoard from './QuestionBoard'
import ResultsBoard from './ResultsBoard'

import styles from './TriviaSection.module.css'

export default function TriviaSection() {
  const questions = useStore($questions)
  const showQuestions = useStore($showQuestions)

  return (
    <section className={styles.trivia_section}>
      <div className={styles.trivia_section_wrapper}>
        {questions.length === 0 && <GameForm />}
        {questions.length > 0 && showQuestions && <QuestionBoard />}
        {!showQuestions && <ResultsBoard />}
      </div>
    </section>
  )
}
