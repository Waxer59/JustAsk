import type { SurveyDocument as SurveyDocumentType } from '@/types'
import { FileUploader } from '../common/FileUploader'
import type { FilePondFile } from 'filepond'
import { useSurveyStore } from '@/store/survey'
import { toast } from 'sonner'
import { documentToText } from '@/helpers/documentToText'
import { getUiTranslations } from '@/i18n/utils'
import { useUiStore } from '@/store/ui'

interface Props {
  document: SurveyDocumentType
}

const { t } = getUiTranslations()

export const SurveyDocument: React.FC<Props> = ({ document }) => {
  const addFile = useSurveyStore((state) => state.addFile)
  const removeFile = useSurveyStore((state) => state.removeFile)
  const setDisableControlButtons = useUiStore(
    (state) => state.setDisableControlButtons
  )
  const files = useSurveyStore((state) => state.files)

  const existingFile = files.filter((file) => file.name === document.name)[0]

  const onAddFile = async (file: FilePondFile) => {
    const newFile = new File([file.file], file.filename, {
      type: file.file.type
    })

    toast.promise(documentToText(newFile), {
      loading: t('fileUpload.loading'),
      success: (text) => {
        addFile({
          name: document.name,
          description: document.description,
          content: text,
          file: newFile
        })
        setDisableControlButtons(false)
        return t('fileUpload.success')
      },
      error: () => {
        setDisableControlButtons(false)
        return t('fileUpload.error')
      }
    })
  }

  const onRemoveFile = async () => {
    removeFile(document.name)
    toast.success(t('fileRemove.success'))
  }

  const onFileAddStart = async () => {
    setDisableControlButtons(true)
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold">
          {document.name} {document.isOptional && '(' + t('optional') + ')'}
        </h2>
        <p>{document.description}</p>
      </div>
      <FileUploader
        key={document.name} // Specify the key to force re-render when the file changes
        addFile={onAddFile}
        removeFile={onRemoveFile}
        onAddingFile={onFileAddStart}
        maxFiles={1}
        defaultFiles={[existingFile?.file]}
      />
    </div>
  )
}
