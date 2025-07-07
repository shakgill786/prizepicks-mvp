import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { getSports, getTemplates, createContest } from '../services/api';

export default function AdminContestForm() {
  const [sports, setSports] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [form, setForm] = useState({
    sportId: 0,
    templateId: 0,
    contestType: 'daily',
    startAt: '',
    endAt: '',
  });

  useEffect(() => {
    getSports().then(setSports);
    getTemplates().then(setTemplates);
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name.includes('Id') ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await createContest(form);
    alert('Contest created!');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label>Sport:</label>
        <select name="sportId" onChange={handleChange} required>
          <option value="">Select sport</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Template:</label>
        <select name="templateId" onChange={handleChange} required>
          <option value="">Select template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Type:</label>
        <select name="contestType" onChange={handleChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div>
        <label>Start At:</label>
        <input
          type="datetime-local"
          name="startAt"
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>End At:</label>
        <input
          type="datetime-local"
          name="endAt"
          onChange={handleChange}
          required
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create Contest
      </button>
    </form>
  );
}
