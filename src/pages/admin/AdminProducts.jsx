import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import './AdminProducts.css';

const BLANK_PRODUCT = {
  name: '',
  price: '',
  category: 'shop',
  sizes: ['S', 'M', 'L', 'XL'],
  stock: { S: 0, M: 0, L: 0, XL: 0 },
  images: [],
  active: true,
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK_PRODUCT);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data);
    setLoading(false);
  }

  function startEdit(product) {
    setForm(product);
    setEditingId(product.id);
  }

  function resetForm() {
    setForm(BLANK_PRODUCT);
    setEditingId(null);
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) {
      alert('Image upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm((f) => ({ ...f, images: [...f.images, data.publicUrl] }));
    setUploading(false);
  }

  function removeImage(url) {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }));
  }

  function updateStock(size, value) {
    setForm((f) => ({ ...f, stock: { ...f.stock, [size]: Number(value) } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
    } else {
      await supabase.from('products').insert(payload);
    }

    resetForm();
    fetchProducts();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  return (
    <div className="admin-products">
      <h1>Products</h1>

      <form className="admin-products__form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit product' : 'Add product'}</h2>

        <input
          type="text"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price (₦)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="shop">Shop</option>
          <option value="gallery">Gallery</option>
        </select>

        <div className="admin-products__stock">
          <div className="admin-products__label">Stock per size</div>
          {form.sizes.map((size) => (
            <div key={size} className="admin-products__stock-row">
              <span>{size}</span>
              <input
                type="number"
                min="0"
                value={form.stock[size] || 0}
                onChange={(e) => updateStock(size, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="admin-products__images">
          <div className="admin-products__label">Images</div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          <div className="admin-products__image-list">
            {form.images.map((url) => (
              <div key={url} className="admin-products__image-thumb">
                <img src={url} alt="" />
                <button type="button" onClick={() => removeImage(url)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <label className="admin-products__active">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active (visible on storefront)
        </label>

        <div className="admin-products__form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Add product'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="admin-products__list">
        {loading ? (
          <p>Loading…</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="admin-products__row">
              {product.images?.[0] && <img src={product.images[0]} alt="" className="admin-products__row-img" />}
              <div className="admin-products__row-info">
                <div>{product.name}</div>
                <div className="admin-products__sub">₦{Number(product.price).toLocaleString()} — {product.category} {!product.active && '(hidden)'}</div>
              </div>
              <div className="admin-products__row-actions">
                <button onClick={() => startEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminProducts;