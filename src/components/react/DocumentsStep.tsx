import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import { useEffect } from 'react'
import { useInterviewStore } from '@store/interview'

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileEncode
)

export const DocumentsStep = () => {
  const setDocuments = useInterviewStore((state) => state.setDocuments)

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
      <h2 className="text-4xl font-semibold italic">Opcional</h2>
      <FilePond
        allowMultiple={true}
        maxFiles={10}
        credits={false}
        acceptedFileTypes={[
          'image/bmp',
          'image/jpeg',
          'image/png',
          'image/pbm',
          'image/webp'
        ]}
        maxTotalFileSize="50MB"
      />
    </div>
  )
}
