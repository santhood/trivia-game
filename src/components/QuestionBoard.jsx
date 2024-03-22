import { useRef, useState } from 'react'
import { useStore } from '@nanostores/react'
import { $questions, $showQuestions } from '@/store/questions'
import { $results } from '@/store/results'

import styles from './QuestionBoard.module.css'

export default function QuestionBoard() {
  const [questionIndex, setQuestionIndex] = useState(0)

  const [answerSelected, setAnswerSelected] = useState('')
  const questions = useStore($questions)
  const answersContainer = useRef(null)
  const results = useStore($results)

  const handleSelectedAnswer = (ev) => {
    Object.values(answersContainer.current.children).forEach((btnAnswer) => {
      btnAnswer.classList.remove(styles.selected)
    })

    ev.target.classList.add(styles.selected)
    setAnswerSelected(ev.target.value)
  }

  const handleNextQuestion = () => {
    const question = questions[questionIndex]
    if (answerSelected) {
      Object.values(answersContainer.current.children).forEach((btnAnswer) => {
        if (
          btnAnswer.classList.contains(styles.selected) &&
          btnAnswer.value !== question.correct_answer
        ) {
          btnAnswer.classList.add(styles.isIncorrect)
        }
        if (btnAnswer.value === question.correct_answer) {
          btnAnswer.classList.add(styles.isCorrect)
        }

        btnAnswer.style.pointerEvents = 'none'
      })
      setTimeout(() => {
        if (answerSelected === question.correct_answer) {
          $results.set(results + 1)
        }
        if (questionIndex < questions.length - 1) {
          Object.values(answersContainer.current.children).forEach(
            (btnAnswer) => {
              btnAnswer.classList.remove(styles.selected)
              btnAnswer.classList.remove(styles.isCorrect)
              btnAnswer.classList.remove(styles.isIncorrect)
              btnAnswer.style.pointerEvents = 'visible'
            }
          )

          setQuestionIndex((prev) => prev + 1)
        } else {
          $showQuestions.set(false)
        }
        setAnswerSelected('')
      }, 1000)
    }
  }

  return (
    <div>
      <div className={styles.top_info}>
        <span>
          {questionIndex + 1}/{questions.length}
        </span>
        <span
          dangerouslySetInnerHTML={{
            __html: questions[questionIndex].category
          }}
        />
      </div>
      <QuestionItem
        question={questions[questionIndex]}
        answersContainer={answersContainer}
        handleSelectedAnswer={handleSelectedAnswer}
      />
      <button
        type='button'
        className='btn-primary'
        onClick={handleNextQuestion}
      >
        {questionIndex < questions.length - 1
          ? 'Next Question'
          : 'View Results'}
      </button>
    </div>
  )
}

function QuestionItem({ question, answersContainer, handleSelectedAnswer }) {
  return (
    <div>
      <h2
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: question.question }}
      />
      <div className={styles.answers} ref={answersContainer}>
        {question.all_options.map((answer) => (
          <button
            key={answer}
            type='button'
            value={answer}
            className={styles.btn_answer}
            onClick={handleSelectedAnswer}
          >
            <i></i>
            <span dangerouslySetInnerHTML={{ __html: answer }}></span>
          </button>
        ))}
      </div>
    </div>
  )
}
