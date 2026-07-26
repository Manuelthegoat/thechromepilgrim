import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';
import './AdminDiscounts.css';

const BLANK_CODE = {
  code: '',
  type: 'percent',
  value: '',
  active: true,
};

function AdminDiscounts() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(BLANK_CODE);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCodes();
  }, []);

  async function fetchCodes() {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setCodes(data);
    setLoading(false);
  }

  function startEdit(code) {
    setForm(code);
    setEditingId(code.id);
  }

  function resetForm() {
    setForm(BLANK_CODE);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      active: form.active,
    };

    const { error } = editingId
      ? await supabase.from('discount_codes').update(payload).eq('id', editingId)
      : await supabase.from('discount_codes').insert(payload);

    if (error) {
      toast.error('Save failed: ' + error.message);
      return;
    }

    toast.success(editingId ? 'Code updated' : 'Code added');
    resetForm();
    fetchCodes();
  }

  async function toggleActive(code) {
    await supabase.from('discount_codes').update({ active: !code.active }).eq('id', code.id);
    fetchCodes();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this code?')) return;
    await supabase.from('discount_codes').delete().eq('id', id);
    toast.success('Code deleted');
    fetchCodes();
  }

  return (
    <div className="admin-discounts">
      <h1>Discount codes</h1>

      <form className="admin-discounts__form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit code' : 'Add code'}</h2>

        <input
          type="text"
          placeholder="Code (e.g. WELCOME10)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />

        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="percent">Percentage off</option>
          <option value="fixed">Fixed amount off (₦)</option>
        </select>

        <input
          type="number"
          placeholder={form.type === 'percent' ? 'e.g. 10 (for 10%)' : 'e.g. 2000'}
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
          required
        />

        <label className="admin-discounts__active">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active
        </label>

        <div className="admin-discounts__form-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Add code'}</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="admin-discounts__list">
        {loading ? (
          <p>Loading…</p>
        ) : codes.length === 0 ? (
          <p className="admin-discounts__empty">No discount codes yet.</p>
        ) : (
          codes.map((code) => (
            <div key={code.id} className="admin-discounts__row">
              <div className="admin-discounts__row-info">
                <div className="admin-discounts__code">{code.code}</div>
                <div className="admin-discounts__sub">
                  {code.type === 'percent' ? `${code.value}% off` : `₦${Number(code.value).toLocaleString()} off`}
                  {' — '}
                  {code.active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="admin-discounts__row-actions">
                <button onClick={() => toggleActive(code)}>
                  {code.active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => startEdit(code)}>Edit</button>
                <button onClick={() => handleDelete(code.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDiscounts;