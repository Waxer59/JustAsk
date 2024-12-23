import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import { Button } from '@/ui/button'
import { Textarea } from '@/ui/textarea'
import { FormItem, FormLabel, FormControl, FormMessage } from '@ui/form'
import { Input } from '@ui/input'
import { PlusIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export interface Category {
  id: string
  name: string
  description: string
}

interface Props {
  onChange?: (categories: Category[]) => void
}

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

export const CategoryCreationInput: React.FC<Props> = ({ onChange }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const handleRemoveCategory = (id: string) => {
    const filteredCategories = categories.filter(
      (category) => category.id !== id
    )

    setCategories(filteredCategories)

    onChange?.(filteredCategories)
  }

  const handleAddCategory = () => {
    if (name.trim().length === 0 || description.trim().length === 0) {
      toast.error('Please enter a name and description')
      return
    }

    const newCategory = {
      id: crypto.randomUUID(),
      name,
      description
    }

    const newCategories = [...categories, newCategory]

    setCategories(newCategories)
    setName('')
    setDescription('')

    if (onChange) {
      onChange(newCategories)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FormItem>
          <FormLabel>
            {t('dashboard.createSurvey.categorization.category.name')}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={t(
                'dashboard.createSurvey.categorization.category.name.placeholder'
              )}
              className="text-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>
            {t('dashboard.createSurvey.categorization.category.description')}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={t(
                'dashboard.createSurvey.categorization.category.description.placeholder'
              )}
              className="text-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button
          type="button"
          variant="secondary"
          onClick={handleAddCategory}
          className="w-full inline-flex justify-center items-center">
          <PlusIcon />{' '}
          <span>{t('dashboard.createSurvey.categorization.category.add')}</span>
        </Button>
      </div>
      <ul className="flex flex-col gap-4">
        {categories.map(({ id, name, description }) => (
          <li className="flex flex-col border p-2 rounded-md" key={id}>
            <div className="flex justify-between">
              <h3 className="text-lg font-bold">{name}</h3>
              <Button
                size="icon"
                variant="ghost"
                type="button"
                onClick={() => handleRemoveCategory(id)}>
                <XIcon />
              </Button>
            </div>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}