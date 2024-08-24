import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { useEffect } from 'react'
import { useInterviewStore } from '@store/interview'
import { getLangFromUrl, useTranslations } from '@/i18n/utils'
import { ALLOWED_FILE_MIME_TYPES } from '@/constants'

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileEncode
)

const url = new URL(window.location.href)
const lang = getLangFromUrl(url)

export const DocumentsStep = () => {
  const setDocuments = useInterviewStore((state) => state.setDocuments)
  const t = useTranslations(lang)

  const updateDocuments = (e: any) => {
    const filepond = e.detail.pond
    const files = filepond.getFiles()

    setDocuments(files.map((file: any) => file.getFileEncodeBase64String()))
  }

  useEffect(() => {
    document.addEventListener('FilePond:addfile', updateDocuments)

    document.addEventListener('FilePond:removefile', updateDocuments)

    return () => {
      document.removeEventListener('FilePond:addfile', updateDocuments)
      document.removeEventListener('FilePond:removefile', updateDocuments)
    }
  }, [])

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      <h2 className="text-4xl font-semibold italic">{t('step2.title')}</h2>
      <FilePond
        allowMultiple={true}
        maxFiles={10}
        credits={false}
        acceptedFileTypes={ALLOWED_FILE_MIME_TYPES}
        maxTotalFileSize="50MB"
      />
    </div>
  )
}
