export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-bold transition ' +
    'disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    // Orange is reserved for primary calls to action only, per brand guidance.
    primary: 'bg-orange text-white hover:bg-orange-darker shadow-lg shadow-orange/25',
    secondary: 'bg-navy-subtle/60 text-navy hover:bg-navy-subtle',
    ghost: 'text-navy hover:bg-navy-subtle/40 font-semibold',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
