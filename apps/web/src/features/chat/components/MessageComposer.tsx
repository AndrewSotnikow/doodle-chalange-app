export function MessageComposer() {
  return (
    <section className="composer-card" aria-labelledby="composer-title">
      <div>
        <p className="section-label">Submit boundary</p>
        <h3 id="composer-title">Composer placeholder</h3>
      </div>
      <div className="composer-grid">
        <label className="field">
          <span>Name</span>
          <input disabled placeholder="Author name will be wired next" type="text" />
        </label>
        <label className="field">
          <span>Message</span>
          <textarea
            disabled
            placeholder="Submission orchestration will move through hooks and the API layer."
            rows={4}
          />
        </label>
      </div>
      <button className="button" disabled type="button">
        Send message
      </button>
    </section>
  )
}
