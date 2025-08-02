import React, { useState, useEffect, useCallback } from 'react';

// --- CONFIG ---
const FORM_COUNT = 10;
const STORAGE_KEY = 'multiFormDrafts';

const createEmptyForm = () => ({
    fields: {
        name: '',
        email: '',
        // extend with your actual fields
    },
    status: 'idle', // 'idle' | 'dirty' | 'submitted' | 'error'
});

// --- hook ---
function useMultiForms() {
    const initialAll = Array.from({ length: FORM_COUNT }, () => createEmptyForm());

    const [forms, setForms] = useState(() => {
        if (typeof window !== 'undefined' && sessionStorage.getItem('suppressRestore')) {
            sessionStorage.removeItem('suppressRestore');
            return initialAll;
        }
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.warn('Failed to parse saved forms:', e);
        }
        return initialAll;
    });

    // Debounced autosave
    useEffect(() => {
        const id = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
            } catch (e) {
                console.warn('Failed to save forms:', e);
            }
        }, 250);
        return () => clearTimeout(id);
    }, [forms]);

    const updateField = useCallback((formIndex, field, value) => {
        setForms(prev => {
            const next = [...prev];
            next[formIndex] = {
                ...next[formIndex],
                fields: { ...next[formIndex].fields, [field]: value },
                status: 'dirty',
            };
            return next;
        });
    }, []);

    const clearForm = useCallback(formIndex => {
        setForms(prev => {
            const next = [...prev];
            next[formIndex] = createEmptyForm();
            return next;
        });
    }, []);

    const clearAll = useCallback(() => {
        setForms(Array.from({ length: FORM_COUNT }, () => createEmptyForm()));
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const markSubmitted = useCallback(formIndex => {
        setForms(prev => {
            const next = [...prev];
            next[formIndex] = { ...next[formIndex], status: 'submitted' };
            return next;
        });
    }, []);

    const discardAndReload = useCallback(() => {
        sessionStorage.setItem('suppressRestore', '1');
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }, []);

    return {
        forms,
        updateField,
        clearForm,
        clearAll,
        markSubmitted,
        discardAndReload,
    };
}

// --- component ---
const PDF_preview = () => {
    const {
        forms,
        updateField,
        clearForm,
        clearAll,
        markSubmitted,
        discardAndReload,
    } = useMultiForms();

    const handleSubmit = async i => {
        const payload = forms[i].fields;
        try {
            // Replace with your real API call
            await new Promise(res => setTimeout(res, 500));

            markSubmitted(i);
            clearForm(i); // or keep it depending on UX
        } catch (err) {
            console.error('Submit failed for form', i, err);
            // you could set status to 'error' here if desired
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
            <div className="flex gap-3 mb-4">
                <button
                    onClick={clearAll}
                    className="px-4 py-2 border rounded shadow-sm hover:bg-gray-100"
                >
                    Clear All Forms
                </button>
                <button
                    onClick={discardAndReload}
                    className="px-4 py-2 border rounded shadow-sm hover:bg-gray-100"
                >
                    Discard & Reload
                </button>
            </div>

            {forms.map((form, i) => (
                <div
                    key={i}
                    className="border rounded-lg p-4 shadow-sm bg-white"
                    aria-label={`Form ${i + 1}`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Form #{i + 1}</h3>
                        <div className="text-sm">
                            Status:{' '}
                            <span
                                style={{
                                    color:
                                        form.status === 'submitted'
                                            ? 'green'
                                            : form.status === 'dirty'
                                                ? 'orange'
                                                : form.status === 'error'
                                                    ? 'red'
                                                    : 'gray',
                                }}
                            >
                                {form.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={form.fields.name}
                                onChange={e => updateField(i, 'name', e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Enter name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={form.fields.email}
                                onChange={e => updateField(i, 'email', e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Enter email"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => handleSubmit(i)}
                            className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm"
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => clearForm(i)}
                            className="px-4 py-2 border rounded shadow-sm"
                        >
                            Clear This
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PDF_preview;
