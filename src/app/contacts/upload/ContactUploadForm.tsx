"use client";

import { useState } from "react";

export function ContactUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/contacts`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload contacts");
      }

      setFile(null);
      alert("Contacts uploaded successfully!");
    } catch (error) {
      console.error("Error uploading contacts:", error);
      alert("Failed to upload contacts. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="csvFile"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Upload Contacts CSV
          </label>
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-50 file:text-gray-700
              hover:file:bg-gray-100"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Please upload a CSV file with the following headers: firstName,
            lastName, email, phone, company, notes
          </p>
        </div>

        <div>
          <button
            type="submit"
            disabled={!file || isUploading}
            className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload Contacts"}
          </button>
        </div>
      </form>
    </div>
  );
}
