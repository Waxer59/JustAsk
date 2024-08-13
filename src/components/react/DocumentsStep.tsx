import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginFileEncode
)

export const DocumentsStep = () => {
  return (
    <div className="flex flex-col gap-8 items-center w-full">
      <h2 className="text-4xl font-semibold italic">Opcional</h2>
      <FilePond
        allowMultiple={true}
        maxFiles={10}
        credits={false}
        acceptedFileTypes={['image/*', 'application/pdf']}
        maxTotalFileSize="50MB"
      />
    </div>
  )
}
