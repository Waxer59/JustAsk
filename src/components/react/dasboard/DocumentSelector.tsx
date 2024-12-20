import { DEFAULT_DOUMENTS } from '@/constants'
import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import type { Document } from '@/types'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
  DialogDescription
} from '@/ui/dialog'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Textarea } from '@/ui/textarea'
import { DialogTitle } from '@radix-ui/react-dialog'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

interface Props {
  onChange?: (documents: Document[]) => void
}

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

export const DocumentSelector: React.FC<Props> = ({ onChange }) => {
  const [documents, setDocuments] = useState<Document[]>([
    ...DEFAULT_DOUMENTS[lang]
  ])
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const [customDocument, setCustomDocument] = useState({
    name: '',
    description: ''
  })

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    const newDocuments = documents.map((document) =>
      document.id === id ? { ...document, isChecked } : document
    )

    setDocuments(newDocuments)

    onChange?.(documents)
  }

  const handleAddCustomDocument = () => {
    if (!customDocument.name || !customDocument.description) {
      return
    }

    const newDocument: Document = {
      id: crypto.randomUUID(),
      name: customDocument.name,
      description: customDocument.description,
      isCustom: true,
      isChecked: true
    }

    setDocuments((prev) => [...prev, newDocument])
    setCustomDocument({ name: '', description: '' })
    setCustomDialogOpen(false)
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <ul className="flex flex-col gap-4">
          {documents.map(({ id, name, description, isCustom }) => (
            <li className="flex items-center gap-2" key={id}>
              <Checkbox
                id="cv"
                name="cv"
                className="self-start"
                defaultChecked={isCustom}
                onCheckedChange={(checked: boolean) =>
                  handleCheckboxChange(id, checked)
                }
              />
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="cv"
                  className="text-sm font-medium leading-none">
                  {name}
                </Label>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="secondary"
          className="w-full inline-flex justify-center"
          onClick={() => setCustomDialogOpen(true)}>
          <PlusIcon /> <span>{t('dashboard.createSurvey.documents.add')}</span>
        </Button>
      </div>
      <Dialog open={customDialogOpen} onOpenChange={setCustomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('dashboard.createSurvey.documents.add')}
            </DialogTitle>
            <DialogDescription>
              {t('dashboard.createSurvey.documents.add.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('dashboard.createSurvey.documents.add.modal.name')}
              </Label>
              <Input
                id="name"
                value={customDocument.name}
                onChange={(e) =>
                  setCustomDocument((prev) => ({
                    ...prev,
                    name: e.target.value
                  }))
                }
                placeholder={t(
                  'dashboard.createSurvey.documents.add.modal.name.placeholder'
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                {t('dashboard.createSurvey.documents.add.modal.description')}
              </Label>
              <Textarea
                id="description"
                value={customDocument.description}
                onChange={(e) =>
                  setCustomDocument((prev) => ({
                    ...prev,
                    description: e.target.value
                  }))
                }
                placeholder={t(
                  'dashboard.createSurvey.documents.add.modal.description.placeholder'
                )}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCustomDialogOpen(false)
                setCustomDocument({ name: '', description: '' })
              }}>
              {t('dashboard.createSurvey.documents.add.modal.cancel')}
            </Button>
            <Button
              onClick={handleAddCustomDocument}
              disabled={!customDocument.name || !customDocument.description}>
              {t('dashboard.createSurvey.documents.add.modal.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
