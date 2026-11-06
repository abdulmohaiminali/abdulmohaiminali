export const countWords = value => value.trim() ? value.trim().split(/\s+/u).length : 0;

// Bind only the contact forms; animation code and dependencies remain separate.
export function connectContactForms(root = document, send = fetch) {
  root.querySelectorAll('[data-email-form]').forEach(form => {
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('[type="submit"]');
    const fields = [...form.querySelectorAll('input:not([type="hidden"]), textarea')];
    const note = form.querySelector('[name="note"]');
    const counter = form.querySelector('.word-count');
    let pending = false;

    function validate() {
      fields.forEach(field => {
        const words = countWords(field.value);
        field.setCustomValidity(field.required && !field.value.trim()
          ? 'Please fill in this field.'
          : field === note && words > 100 ? 'Please keep your note to 100 words or fewer.' : '');
      });
      if (counter) counter.textContent = `${countWords(note.value)} / 100 words`;
    }
    fields.forEach(field => field.addEventListener('input', validate));

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (pending) return;
      validate();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const label = button.textContent;
      const disabled = fields.map(field => field.disabled);
      pending = true;
      button.disabled = true;
      fields.forEach(field => { field.disabled = true; });
      form.setAttribute('aria-busy', 'true');
      button.textContent = 'Sending…';
      status.textContent = 'Sending your message…';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await send(form.action, {
          method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || result?.ok !== true) {
          const detail = result?.errors?.map(error => error.message).filter(Boolean).join(' ');
          throw new Error(response.status === 429
            ? 'Sending is temporarily unavailable. Please try again later.'
            : detail || 'Your message could not be sent. Please try again.');
        }
        form.reset();
        validate();
        status.textContent = note ? 'Thank you! Your note was submitted.' : 'Thank you! Your inquiry was submitted.';
      } catch (error) {
        status.textContent = error.name === 'AbortError'
          ? 'Sending took too long to confirm. Your text is saved here; please wait before retrying.'
          : error instanceof TypeError
            ? 'Could not confirm sending. Check your connection before retrying. Your text is saved here.'
            : error.message;
      } finally {
        clearTimeout(timeout);
        pending = false;
        button.disabled = false;
        button.textContent = label;
        fields.forEach((field, index) => { field.disabled = disabled[index]; });
        form.removeAttribute('aria-busy');
      }
    });
  });
}
