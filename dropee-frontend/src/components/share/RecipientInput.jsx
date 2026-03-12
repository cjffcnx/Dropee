import React from 'react';

const COUNTRY_CODES = [
  { label: 'Nepal (+977)', value: '+977' },
  { label: 'India (+91)', value: '+91' },
  { label: 'United States (+1)', value: '+1' },
  { label: 'United Kingdom (+44)', value: '+44' },
  { label: 'Australia (+61)', value: '+61' },
  { label: 'UAE (+971)', value: '+971' },
];

const RecipientInput = ({
  shareTitle,
  onShareTitleChange,
  deliveryMode,
  onDeliveryModeChange,
  email,
  onEmailChange,
  emailError,
  countryCode,
  onCountryCodeChange,
  phoneNumber,
  onPhoneNumberChange,
}) => {
  return (
    <div className="mt-4 space-y-3">
      <input
        type="text"
        value={shareTitle}
        onChange={(e) => onShareTitleChange(e.target.value)}
        placeholder="Title for this share (optional)"
        className="input-field text-sm"
        maxLength={80}
      />

      <div className="grid grid-cols-3 gap-2 rounded-xl bg-bg-secondary p-1 border border-gray-700/60">
        {[
          { value: 'none', label: 'No notify' },
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onDeliveryModeChange(option.value)}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${deliveryMode === option.value
                ? 'bg-accent-primary text-white'
                : 'text-text-muted hover:text-white'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {deliveryMode === 'email' && (
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="recipient@example.com"
            className={`input-field text-sm ${emailError ? 'border border-red-500/70' : ''}`}
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-400">{emailError}</p>
          )}
        </div>
      )}

      {deliveryMode === 'phone' && (
        <div className="grid grid-cols-[160px_1fr] gap-3">
          <select
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="input-field text-sm"
          >
            {COUNTRY_CODES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="98XXXXXXXX"
            className="input-field text-sm"
            inputMode="numeric"
          />
        </div>
      )}
    </div>
  );
};

export default RecipientInput;
