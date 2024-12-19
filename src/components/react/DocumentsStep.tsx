import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { useInterviewStore } from '@store/interview'
import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import { ALLOWED_FILE_MIME_TYPES } from '@/constants'
import { useUiStore } from '@/store/ui'
import { documentToText } from '@/helpers/documentToText'
import { toast } from 'sonner'
import { useState } from 'react'

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
)

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)
const t = useTranslations(lang)

export const DocumentsStep = () => {
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false)
  const setDisableControlButtons = useUiStore(
    (state) => state.setDisableControlButtons
  )
  const addDocumentContent = useInterviewStore(
    (state) => state.addDocumentContent
  )
  const removeDocumentContentById = useInterviewStore(
    (state) => state.removeDocumentContentById
  )

  const removeFile = (file: any) => {
    const deletedFileId = file.id
    removeDocumentContentById(deletedFileId)
  }

  const addFile = async (file: any) => {
    const uploadedFileId = file.id
    const uploadedFile = file.file
    setDisableControlButtons(true)
    setIsUploadingFile(true)

    toast.promise(documentToText(uploadedFile), {
      loading: t('fileUpload.loading'),
      success: (text) => {
        addDocumentContent({
          id: uploadedFileId,
          content: text
        })
        setDisableControlButtons(false)
        setIsUploadingFile(false)
        return t('fileUpload.success')
      },
      error: () => {
        setDisableControlButtons(false)
        setIsUploadingFile(false)
        return t('fileUpload.error')
      }
    })
  }

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      <h2 className="text-4xl font-semibold italic">{t('step2.title')}</h2>
      <FilePond
        onaddfile={(_, file) => addFile(file)}
        onremovefile={(_, file) => removeFile(file)}
        disabled={isUploadingFile}
        allowMultiple={true}
        maxFiles={10}
        credits={false}
        acceptedFileTypes={ALLOWED_FILE_MIME_TYPES}
        maxTotalFileSize="50MB"
      />
    </div>
  )
}
