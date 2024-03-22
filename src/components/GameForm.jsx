import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchQuestion } from '@/store/questions'

import styles from './GameForm.module.css'

const handleSchema = (categories) => {
  const schema = z.object({
    amount: z.number().min(1).max(15),
    category: z.enum(['', ...categories]),
    difficulty: z.enum(['', 'easy', 'medium', 'hard']),
    type: z.enum(['', 'multiple', 'boolean'])
  })
  return schema
}

export default function GameForm() {
  const [categories, setCategories] = useState([])
  const [formSchema, setFormSchema] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(formSchema) })

  // Get categories
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('https://opentdb.com/api_category.php')
      const results = await response.json()
      setCategories(results.trivia_categories)
    }
    fetchCategories()
  }, [])

  // Insert categories in schema zod
  useEffect(() => {
    const categoriesId = categories.map((category) => category.id.toString())
    setFormSchema(handleSchema(categoriesId))
  }, [categories])

  // Submit form
  const onSubmit = (data) => {
    fetchQuestion(data)
  }

  return (
    <div>
      <h2 className={styles.title}>
        Test your <br /> knowledge
      </h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <FormLabel label='Amount'>
          <input
            type='number'
            defaultValue={10}
            {...register('amount', {
              setValueAs: (value) => Number(value)
            })}
          />
          {errors.amount && <p>Invalid value received.</p>}
        </FormLabel>
        <FormLabel label='Category'>
          <select {...register('category')}>
            <option value=''>Any category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p>Invalid value received.</p>}
        </FormLabel>
        <FormLabel label='Difficulty'>
          <select {...register('difficulty')}>
            <option value=''>Any difficulty</option>
            <option value='easy'>Easy</option>
            <option value='medium'>Medium</option>
            <option value='hard'>Hard</option>
          </select>
          {errors.difficulty && <p>Invalid value received.</p>}
        </FormLabel>
        <FormLabel label='Type'>
          <select {...register('type')}>
            <option value=''>Any type</option>
            <option value='multiple'>Multipy Choice</option>
            <option value='boolean'>True/False</option>
          </select>
          {errors.type && <p>Invalid value received.</p>}
        </FormLabel>
        <button type='submit' className='btn-primary'>
          Start Game
        </button>
      </form>
    </div>
  )
}

function FormLabel({ label, children }) {
  return (
    <div className={styles.form_field}>
      <label>{label}</label>
      {children}
    </div>
  )
}
