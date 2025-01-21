import { ContactUploadForm } from "./ContactUploadForm";

export default function ContactUploadPage() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Upload Contacts
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Add new contacts manually or upload a CSV file.</p>
        </div>
        <div className="mt-5">
          <ContactUploadForm />
        </div>
      </div>
    </div>
  );
}
