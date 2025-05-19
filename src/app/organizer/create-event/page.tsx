// app/admin/events/create/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';

// Configure lowlight for syntax highlighting


// Use the same validation schema from the backend
const EventSchema = z.object({
  nama_event: z.string().min(1, "Event name is required"),
  deskripsi: z.string().optional(),
  lokasi: z.string().min(1, "Location is required"),
  tanggal_mulai: z.string().transform((val) => new Date(val).toISOString()),
  tanggal_selesai: z.string().transform((val) => new Date(val).toISOString()),
  foto_event: z.string().optional(),
  kategori_event: z.string().min(1, "Event category is required"),
  creator_id: z.string().min(1, "Creator ID is required"),
  tipe_tikets: z.array(z.object({
    nama: z.string().min(1, "Ticket type name is required"),
    harga: z.number().positive("Price must be positive"),
    jumlah_tersedia: z.number().int().positive("Available tickets must be positive")
  })).optional()
});

type FileWithPreview = {
  file: File;
  preview: string;
};

const Tiptap = ({ content, onChange }: { content: string; onChange: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Masukkan URL gambar:');

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Masukkan URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        editor?.chain().focus().setImage({ src: event.target.result.toString() }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  if (!editor) {
    return <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">Loading editor...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar yang selalu terlihat */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100 border-b">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
          title="Underline"
        >
          <u>U</u>
        </button>
        
        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
          title="Heading 2"
        >
          H2
        </button>
        
        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
          title="Numbered List"
        >
          1. List
        </button>
        
        {/* Colors */}
        <div className="flex items-center">
          <input
            type="color"
            onInput={(e: any) => editor.chain().focus().setColor(e.target.value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-8 h-8"
            title="Text Color"
          />
        </div>
        
        {/* Link */}
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-300' : ''}`}
          title="Link"
        >
          Link
        </button>
        
        {/* Image */}
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
          title="Insert Image"
        >
          🖼️
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="editor-image-upload"
        />
        <label
          htmlFor="editor-image-upload"
          className="p-2 rounded hover:bg-gray-200 cursor-pointer"
          title="Upload Image"
        >
          📤
        </label>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[200px] p-4" />
    </div>
  );
};

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nama_event: '',
    deskripsi: '',
    lokasi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    foto_event: '',
    kategori_event: '',
    creator_id: '',
    tipe_tikets: [{ nama: '', harga: 0, jumlah_tersedia: 0 }]
  });
  const [selectedImage, setSelectedImage] = useState<FileWithPreview | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchCreatorId = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/creator`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch creator information');
        }

        setFormData(prev => ({
          ...prev,
          creator_id: data.creator_id
        }));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching creator ID:', error);
        router.push('/organizer/profile');
      }
    };

    fetchCreatorId();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      deskripsi: content
    }));
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      const preview = URL.createObjectURL(file);
      setSelectedImage({ file, preview });
    }
  };

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = '';
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage.file);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      const eventData = {
        ...formData,
        foto_event: imageUrl
      };

      const parsedData = EventSchema.parse(eventData);

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(parsedData)
      });      

      if (response.ok) {
        router.push('/organizer/event-saya');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach(err => {
          errorMap[err.path[0]] = err.message;
        });
        setErrors(errorMap);
      } else {
        console.error('Error creating event:', error);
        alert(error instanceof Error ? error.message : 'Failed to create event');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Event</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        {/* Basic Event Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Event Name</label>
            <input
              type="text"
              name="nama_event"
              value={formData.nama_event}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.nama_event && <p className="text-red-500 text-sm">{errors.nama_event}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.lokasi && <p className="text-red-500 text-sm">{errors.lokasi}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Start Date</label>
            <input
              type="datetime-local"
              name="tanggal_mulai"
              value={formData.tanggal_mulai}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.tanggal_mulai && <p className="text-red-500 text-sm">{errors.tanggal_mulai}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">End Date</label>
            <input
              type="datetime-local"
              name="tanggal_selesai"
              value={formData.tanggal_selesai}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.tanggal_selesai && <p className="text-red-500 text-sm">{errors.tanggal_selesai}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Event Category</label>
            <input
              type="text"
              name="kategori_event"
              value={formData.kategori_event}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.kategori_event && <p className="text-red-500 text-sm">{errors.kategori_event}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Event Image</label>
            <div className="flex flex-col items-center space-y-4">
              {selectedImage && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={selectedImage.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="event-image"
              />
              <label
                htmlFor="event-image"
                className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                {selectedImage ? 'Change Image' : 'Upload Image'}
              </label>
              <p className="text-sm text-gray-500">Recommended size: 1500x500px, Max: 2MB</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <Tiptap 
            content={formData.deskripsi} 
            onChange={handleDescriptionChange} 
          />
        </div>

        {/* Ticket Types */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Ticket Types</h2>
            <button
              type="button"
              onClick={addTicketType}
              className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
            >
              Add Ticket Type
            </button>
          </div>

          {formData.tipe_tikets.map((ticket, index) => (
            <div key={index} className="grid md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Ticket Name</label>
                <input
                  type="text"
                  name="nama"
                  value={ticket.nama}
                  onChange={(e) => handleTicketChange(index, e)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Price (IDR)</label>
                <input
                  type="number"
                  name="harga"
                  value={ticket.harga}
                  onChange={(e) => handleTicketChange(index, e)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Available Tickets</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="jumlah_tersedia"
                    value={ticket.jumlah_tersedia}
                    onChange={(e) => handleTicketChange(index, e)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  {formData.tipe_tikets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-right">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}

function createLowlight(common: any) {
  throw new Error('Function not implemented.');
}
