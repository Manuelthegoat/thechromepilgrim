import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import './AdminObjects.css';

const BLANK_OBJECT = {
  title: '',
  price: '',
  images: [],
  description: '',
  sold: false,
  active: true,
};

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
};

function AdminObjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK_OBJECT);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setItems(data);
    setLoading(false);
  }

  function startEdit(item) {
    setForm(item);
    setEditingId(item.id);
  }

  function resetForm() {
    setForm(BLANK_OBJECT);
    setEditingId(null);
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);

      const fileName = `object-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, compressedFile);

      if (uploadError) {
        toast.error('Upload failed: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setForm((f) => ({ ...f, images: [...f.images, data.publicUrl] }));
    } catch (compressionError) {
      toast.error('Image compression failed: ' + compressionError.message);
    }

    setUploading(false);
  }

  function removeImage(url) {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };

    const { error } = editingId
      ? await supabase.from('objects').update(payload).eq('id', editingId)
      : await supabase.from('objects').insert(payload);

    if (error) {
      toast.error('Save failed: ' + error.message);
      return;
    }

    toast.success(editingId ? 'Object updated' : 'Object added');
    resetForm();
    fetchItems();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this piece?')) return;
    await supabase.from('objects').delete().eq('id', id);
    toast.success('Deleted');
    fetchItems();
  }

  return (
    <div className="admin-objects">
      <h1>Objects</h1>

      <form className="admin-objects__form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit piece' : 'Add piece'}</h2>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price (₦)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />

        <div className="admin-objects__images">
          <div className="admin-objects__label">Images</div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          <div className="admin-objects__image-list">
            {form.images.map((url) => (
              <div key={url} className="admin-objects__image-thumb">
                <img src={url} alt="" />
                <button type="button" onClick={() => removeImage(url)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <label className="admin-objects__checkbox">
          <input
            type="checkbox"
            checked={form.sold}
            onChange={(e) => setForm({ ...form, sold: e.target.checked })}
          />
          Sold
        </label>

        <label className="admin-objects__checkbox">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active (visible on site)
        </label>

        <div className="admin-objects__form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Add piece'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="admin-objects__list">
        {loading ? (
          <p>Loading…</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="admin-objects__row">
              {item.images?.[0] && <img src={item.images[0]} alt="" className="admin-objects__row-img" />}
              <div className="admin-objects__row-info">
                <div>{item.title}</div>
                <div className="admin-objects__sub">
                  ₦{Number(item.price).toLocaleString()}
                  {item.sold && ' — Sold'}
                  {!item.active && ' (hidden)'}
                </div>
              </div>
              <div className="admin-objects__row-actions">
                <button onClick={() => startEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminObjects;