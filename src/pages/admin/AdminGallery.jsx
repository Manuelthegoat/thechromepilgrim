import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import imageCompression from "browser-image-compression";
import "./AdminGallery.css";
import toast from "react-hot-toast";

const BLANK_ITEM = {
  title: "",
  images: [],
  year: "",
  medium: "",
  description: "",
  active: true,
};

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1600,
  useWebWorker: true,
};

function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK_ITEM);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setItems(data);
    setLoading(false);
  }
  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const compressedFile = await imageCompression(file, {
        ...COMPRESSION_OPTIONS,
        onProgress: (percent) => {
          // Compression accounts for roughly the first half of the bar
          setUploadProgress(Math.round(percent * 0.5));
        },
      });

      setUploadProgress(50);

      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, compressedFile);

      if (uploadError) {
        toast.error("Image upload failed: " + uploadError.message);
        setUploading(false);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(100);

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      setForm((f) => ({ ...f, images: [...f.images, data.publicUrl] }));
    } catch (compressionError) {
      toast.error("Image compression failed: " + compressionError.message);
    }

    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
    }, 400); // brief pause so the 100% state is visible before resetting
  }
  function startEdit(item) {
    setForm(item);
    setEditingId(item.id);
  }

  function resetForm() {
    setForm(BLANK_ITEM);
    setEditingId(null);
  }

  function removeImage(url) {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = editingId
      ? await supabase.from("gallery_items").update(form).eq("id", editingId)
      : await supabase.from("gallery_items").insert(form);

    if (error) {
      alert("Save failed: " + error.message);
      return;
    }

    resetForm();
    fetchItems();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this piece?")) return;
    await supabase.from("gallery_items").delete().eq("id", id);
    fetchItems();
  }

  return (
    <div className="admin-gallery">
      <h1>Gallery</h1>

      <form className="admin-gallery__form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit piece" : "Add piece"}</h2>

        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Year"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
        />
        <input
          type="text"
          placeholder="Medium (e.g. Mixed media on canvas)"
          value={form.medium}
          onChange={(e) => setForm({ ...form, medium: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />

        <div className="admin-gallery__images">
          <div className="admin-gallery__label">Images</div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploading && (
            <div className="admin-products__progress">
              <div
                className="admin-products__progress-bar"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          <div className="admin-gallery__image-list">
            {form.images.map((url) => (
              <div key={url} className="admin-gallery__image-thumb">
                <img src={url} alt="" />
                <button type="button" onClick={() => removeImage(url)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <label className="admin-gallery__active">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active (visible on site)
        </label>

        <div className="admin-gallery__form-actions">
          <button type="submit">
            {editingId ? "Save changes" : "Add piece"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-gallery__list">
        {loading ? (
          <p>Loading…</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="admin-gallery__row">
              {item.images?.[0] && (
                <img
                  src={item.images[0]}
                  alt=""
                  className="admin-gallery__row-img"
                />
              )}
              <div className="admin-gallery__row-info">
                <div>{item.title}</div>
                <div className="admin-gallery__sub">
                  {item.year} {!item.active && "(hidden)"}
                </div>
              </div>
              <div className="admin-gallery__row-actions">
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

export default AdminGallery;
