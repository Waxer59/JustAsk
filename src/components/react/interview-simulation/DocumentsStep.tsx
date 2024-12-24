import { useInterviewStore } from '@store/interview'
import { useUiStore } from '@/store/ui'
import { documentToText } from '@/helpers/documentToText'
import { toast } from 'sonner'
import { FileUploader } from '../common/FileUploader'
import { useState } from 'react'
import { getUiTranslations } from '@/i18n/utils'

const { t } = getUiTranslations()

export const DocumentsStep = () => {
  const [isUploading, setIsUploading] = useState(false)
  const setDisableControlButtons = useUiStore(
    (state) => state.setDisableControlButtons
  )
  const documentsContent = useInterviewStore((state) => state.documentsContent)
  const addDocumentContent = useInterviewStore(
    (state) => state.addDocumentContent
  )
  const removeDocumentContentById = useInterviewStore(
    (state) => state.removeDocumentContentById
  )

  const removeFile = async (file: any) => {
    const deletedFileId = file.id
    removeDocumentContentById(deletedFileId)
    toast.success(t('fileRemove.success'))
  }

  const addFile = async (file: any) => {
    const uploadedFileId = file.id
    const uploadedFile = file.file
    setIsUploading(true)
    setDisableControlButtons(true)

    toast.promise(documentToText(uploadedFile), {
      loading: t('fileUpload.loading'),
      success: (text) => {
        addDocumentContent({
          id: uploadedFileId,
          content: text,
          file: file.file
        })
        setDisableControlButtons(false)
        setIsUploading(false)
        return t('fileUpload.success')
      },
      error: () => {
        setDisableControlButtons(false)
        setIsUploading(false)
        return t('fileUpload.error')
      }
    })
  }

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      <h2 className="text-4xl font-semibold italic">{t('step2.title')}</h2>
      <FileUploader
        addFile={addFile}
        removeFile={removeFile}
        isDisabled={isUploading}
        defaultFiles={documentsContent.map(({ file }) => file)}
      />
    </div>
  )
}
