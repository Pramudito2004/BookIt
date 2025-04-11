// app/organizer/create-event/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

// Use the same validation schema from the backend
const EventSchema = z.object({
  nama_event: z.string().min(1, "Nama event diperlukan"),
  deskripsi: z.string().optional(),
  lokasi: z.string().min(1, "Lokasi diperlukan"),
  tanggal_mulai: z.string().min(1, "Tanggal mulai diperlukan").transform((val) => new Date(val).toISOString()),
  tanggal_selesai: z.string().min(1, "Tanggal selesai diperlukan").transform((val) => new Date(val).toISOString()),
  foto_event: z.string().optional(),
  kategori_event: z.string().min(1, "Kategori event diperlukan"),
  creator_id: z.string().min(1, "Creator ID diperlukan"),
  tipe_tikets: z.array(z.object({
    nama: z.string().min(1, "Nama tipe tiket diperlukan"),
    harga: z.number().positive("Harga harus positif"),
    jumlah_tersedia: z.number().int().positive("Jumlah tiket harus positif")
  })).optional()
});

// Step-specific validation schemas
const Step1Schema = EventSchema.pick({
  nama_event: true,
  kategori_event: true,
  deskripsi: true,
  foto_event: true
});

const Step2Schema = EventSchema.pick({
  tanggal_mulai: true,
  tanggal_selesai: true,
  lokasi: true
});

const Step3Schema = z.object({
  tipe_tikets: z.array(z.object({
    nama: z.string().min(1, "Nama tipe tiket diperlukan"),
    harga: z.number().positive("Harga harus positif"),
    jumlah_tersedia: z.number().int().positive("Jumlah tiket harus positif")
  })).min(1, "Minimal satu tipe tiket diperlukan")
});

// Pre-defined event categories
const eventCategories = [
  "Konser", "Workshop", "Seminar", "Pameran", 
  "Festival", "Networking", "Olahraga", "Hiburan", 
  "Amal", "Lainnya"
];

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_event: '',
    deskripsi: '',
    lokasi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    foto_event: '',
    kategori_event: '',
    creator_id: '550e8400-e29b-41d4-a716-446655440000',
    tipe_tikets: [{ nama: '', harga: 0, jumlah_tersedia: 0 }]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTicketChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedTickets = [...formData.tipe_tikets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [name]: name === 'harga' || name === 'jumlah_tersedia' ? Number(value) : value
    };
    setFormData(prev => ({
      ...prev,
      tipe_tikets: updatedTickets
    }));
    
    // Clear ticket-related errors
    if (errors[`tipe_tikets.${index}.${name}`]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[`tipe_tikets.${index}.${name}`];
        return newErrors;
      });
    }
  };

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      tipe_tikets: [
        ...prev.tipe_tikets,
        { nama: '', harga: 0, jumlah_tersedia: 0 }
      ]
    }));
  };

  const removeTicketType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tipe_tikets: prev.tipe_tikets.filter((_, i) => i !== index)
    }));
  };

  // Function to validate a specific step
  const validateStep = (step: number): boolean => {
    try {
      let isValid = false;
      
      switch (step) {
        case 1:
          Step1Schema.parse(formData);
          isValid = true;
          break;
        case 2:
          // Additional validation for dates
          if (new Date(formData.tanggal_mulai) >= new Date(formData.tanggal_selesai)) {
            setErrors(prev => ({
              ...prev,
              tanggal_selesai: "Tanggal selesai harus setelah tanggal mulai"
            }));
            isValid = false;
          } else {
            Step2Schema.parse(formData);
            isValid = true;
          }
          break;
        case 3:
          // Validate at least one valid ticket type
          if (formData.tipe_tikets.length === 0) {
            setErrors(prev => ({
              ...prev,
              tipe_tikets: "Minimal satu tipe tiket diperlukan"
            }));
            isValid = false;
          } else {
            Step3Schema.parse(formData);
            isValid = true;
          }
          break;
      }
      
      return isValid;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errorMap[path] = err.message;
        });
        setErrors(errorMap);
        
        // Scroll to first error
        setTimeout(() => {
          const firstErrorField = document.querySelector('.error-field');
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
      return false;
    }
  };

  const moveToStep = (step: number) => {
    // If moving forward, validate current step
    if (step > activeStep) {
      const isValid = validateStep(activeStep);
      if (!isValid) return;
    }
    
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current step before submission
    const isValid = validateStep(activeStep);
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      const parsedData = EventSchema.parse(formData);
      
      // Validate entire form
      if (formData.tipe_tikets.some(ticket => !ticket.nama || ticket.harga <= 0 || ticket.jumlah_tersedia <= 0)) {
        throw new Error("Semua tipe tiket harus diisi dengan lengkap");
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedData)
      });      

      if (response.ok) {
        // Redirect to events list
        router.push('/organizer');
      } else {
        // Handle error
        const errorData = await response.json();
        console.error('Error creating event:', errorData);
        alert('Gagal membuat event. Silakan periksa formulir dan coba lagi.');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errorMap[path] = err.message;
        });
        setErrors(errorMap);
        
        // Scroll to first error
        const firstErrorField = document.querySelector('.error-field');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error('Unexpected error:', error);
        alert('Terjadi kesalahan yang tidak diharapkan. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to determine if a field has error
  const hasError = (fieldName: string) => {
    return errors[fieldName] ? 'border-red-500 bg-red-50 error-field' : 'border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-500">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Buat Event Baru</h1>
          <button
            type="button"
            onClick={() => router.push('/organizer')}
            className="bg-white bg-opacity-20 text-black px-4 py-2 rounded-full hover:bg-opacity-30 transition-colors"
          >
            Batal
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto">
          {/* Progress steps */}
          <div className="border-b pb-6 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${activeStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-bold`}>1</div>
                <span className={`text-sm font-medium mt-1 ${activeStep >= 1 ? 'text-purple-600' : 'text-gray-600'}`}>Info Dasar</span>
              </div>
              <div className={`h-1 w-1/4 ${activeStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${activeStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-bold`}>2</div>
                <span className={`text-sm font-medium mt-1 ${activeStep >= 2 ? 'text-purple-600' : 'text-gray-600'}`}>Tanggal & Lokasi</span>
              </div>
              <div className={`h-1 w-1/4 ${activeStep >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${activeStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center font-bold`}>3</div>
                <span className={`text-sm font-medium mt-1 ${activeStep >= 3 ? 'text-purple-600' : 'text-gray-600'}`}>Tiket</span>
              </div>
            </div>
          </div>

          {/* Section: Basic Event Details */}
          {activeStep === 1 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Detail Event</h2>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="nama_event">
                  Nama Event <span className="text-red-500">*</span>
                </label>
                <input
                  id="nama_event"
                  type="text"
                  name="nama_event"
                  value={formData.nama_event}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${hasError('nama_event')}`}
                  placeholder="Masukkan nama event"
                  required
                />
                {errors.nama_event && (
                  <p className="text-red-500 text-sm mt-1">{errors.nama_event}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="deskripsi">
                  Deskripsi
                </label>
                <textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${hasError('deskripsi')}`}
                  rows={4}
                  placeholder="Jelaskan detail event yang akan diselenggarakan..."
                />
                {errors.deskripsi && (
                  <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="kategori_event">
                  Kategori Event <span className="text-red-500">*</span>
                </label>
                <select
                  id="kategori_event"
                  name="kategori_event"
                  value={formData.kategori_event}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${hasError('kategori_event')}`}
                  required
                >
                  <option value="" disabled>Pilih kategori</option>
                  {eventCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.kategori_event && (
                  <p className="text-red-500 text-sm mt-1">{errors.kategori_event}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="foto_event">
                  URL Foto Event (opsional)
                </label>
                <div className="flex">
                  <input
                    id="foto_event"
                    type="text"
                    name="foto_event"
                    value={formData.foto_event}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${hasError('foto_event')}`}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <p className="text-gray-500 text-sm mt-1">Tambahkan URL ke gambar yang akan mewakili event Anda</p>
                {errors.foto_event && (
                  <p className="text-red-500 text-sm mt-1">{errors.foto_event}</p>
                )}
              </div>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => moveToStep(2)}
                  className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors font-medium"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {/* Section: Date and Location */}
          {activeStep === 2 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Tanggal & Lokasi</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="tanggal_mulai">
                    Tanggal & Waktu Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="tanggal_mulai"
                    type="datetime-local"
                    name="tanggal_mulai"
                    value={formData.tanggal_mulai}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${hasError('tanggal_mulai')}`}
                    required
                  />
                  {errors.tanggal_mulai && (
                    <p className="text-red-500 text-sm mt-1">{errors.tanggal_mulai}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="tanggal_selesai">
                    Tanggal & Waktu Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="tanggal_selesai"
                    type="datetime-local"
                    name="tanggal_selesai"
                    value={formData.tanggal_selesai}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${hasError('tanggal_selesai')}`}
                    required
                  />
                  {errors.tanggal_selesai && (
                    <p className="text-red-500 text-sm mt-1">{errors.tanggal_selesai}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">Tanggal selesai harus setelah tanggal mulai</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="lokasi">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  id="lokasi"
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${hasError('lokasi')}`}
                  placeholder="Nama venue atau alamat event"
                  required
                />
                {errors.lokasi && (
                  <p className="text-red-500 text-sm mt-1">{errors.lokasi}</p>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => moveToStep(1)}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-300 transition-colors font-medium"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => moveToStep(3)}
                  className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors font-medium"
                >
                  Lanjut
                </button>
              </div>
            </div>
          )}

          {/* Section: Ticket Types */}
          {activeStep === 3 && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Tipe Tiket</h2>
                <button
                  type="button"
                  onClick={addTicketType}
                  className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Tambah Tipe Tiket
                </button>
              </div>
              
              {errors.tipe_tikets && (
                <p className="text-red-500 text-sm mb-4">{errors.tipe_tikets}</p>
              )}

              {formData.tipe_tikets.map((ticket, index) => (
                <div 
                  key={index} 
                  className="mb-6 p-6 border rounded-lg bg-gray-50 hover:bg-white transition-colors"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-800">Tipe Tiket #{index + 1}</h3>
                    {formData.tipe_tikets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicketType(index)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Hapus
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Nama Tiket <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={ticket.nama}
                        onChange={(e) => handleTicketChange(index, e)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${hasError(`tipe_tikets.${index}.nama`)}`}
                        placeholder="Contoh: Standard, VIP, Early Bird"
                        required
                      />
                      {errors[`tipe_tikets.${index}.nama`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`tipe_tikets.${index}.nama`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Harga (IDR) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">Rp</span>
                        </div>
                        <input
                          type="number"
                          name="harga"
                          value={ticket.harga}
                          onChange={(e) => handleTicketChange(index, e)}
                          className={`w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${hasError(`tipe_tikets.${index}.harga`)}`}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                      {errors[`tipe_tikets.${index}.harga`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`tipe_tikets.${index}.harga`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Jumlah Tiket Tersedia <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="jumlah_tersedia"
                        value={ticket.jumlah_tersedia}
                        onChange={(e) => handleTicketChange(index, e)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${hasError(`tipe_tikets.${index}.jumlah_tersedia`)}`}
                        placeholder="0"
                        min="1"
                        required
                      />
                      {errors[`tipe_tikets.${index}.jumlah_tersedia`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`tipe_tikets.${index}.jumlah_tersedia`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => moveToStep(2)}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-300 transition-colors font-medium"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
                  } text-white px-8 py-3 rounded-full transition-colors font-medium flex items-center`}
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSubmitting ? 'Membuat Event...' : 'Buat Event'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}