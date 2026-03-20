import logoUrl from '../assets/logo.svg'

export default function Logo({ className = '' }) {
  return (
    <img
      src={logoUrl}
      alt="Analisa Laboratorio Clínico"
      className={className}
    />
  )
}
