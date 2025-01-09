import { getUiTranslations } from '@/i18n/utils'
import { Button } from '@/ui/button'
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/ui/dialog'
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

const { t } = getUiTranslations()

export const CategoryCreationInput: React.FC<Props> = ({ onChange }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

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

    setIsDialogOpen(false)
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsDialogOpen(true)}
        className="w-full inline-flex justify-center items-center">
        <PlusIcon />{' '}
        <span>{t('dashboard.createSurvey.categorization.category.add')}</span>
      </Button>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('dashboard.createSurvey.categorization.category.add')}
            </DialogTitle>
            <DialogDescription>
              {t(
                'dashboard.createSurvey.categorization.category.add.description'
              )}
            </DialogDescription>
          </DialogHeader>
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
                {t(
                  'dashboard.createSurvey.categorization.category.description'
                )}
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setName('')
                setDescription('')
              }}>
              {t('cancel')}
            </Button>
            <Button
              onClick={handleAddCategory}
              disabled={!description || !name}>
              {t('dashboard.createSurvey.categorization.category.add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
