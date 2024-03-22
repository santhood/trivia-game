import { atom } from 'nanostores'

export const $questions = atom([])
export const $showQuestions = atom(true)

export const fetchQuestion = async ({ amount, category, difficulty, type }) => {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=${type}`
  )
  const data = await response.json()
  const results = data.results.map((question) => {
    return {
      ...question,
      all_options: [
        question.correct_answer,
        ...question.incorrect_answers
      ].sort(() => Math.random() - 0.5)
    }
  })
  $questions.set(results)
}
