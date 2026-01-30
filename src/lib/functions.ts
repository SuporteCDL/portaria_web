
export function formatDate(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4}).*/, "$1");
}

// recebe data dd/mm/aaaa
export function formatDateDB(date: string) {
  const [day, month, year] = date.split('/')
  return `${year}-${month}-${day}`
}

// recebe data yyyy-mm-dd
export function formatDateBR(date: string) {
  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

//----------------------------------

export function calcularPermanencia(
  data: string,
  entrada: string,
  saida: string
): number {
  // Converte DD/MM/YYYY → YYYY-MM-DD
  const [dia, mes, ano] = data.split('/')
  const dataISO = `${ano}-${mes}-${dia}`

  const entradaDate = new Date(`${dataISO}T${entrada}`)
  const saidaDate = new Date(`${dataISO}T${saida}`)

  const diffMs = saidaDate.getTime() - entradaDate.getTime()

  if (diffMs < 0) {
    throw new Error('Hora de saída não pode ser menor que entrada')
  }

  return Math.floor(diffMs / 1000)
}

export function criarDataISO(data: string, hora: string): Date {
  const [dia, mes, ano] = data.split('/')
  return new Date(`${ano}-${mes}-${dia}T${hora}`)
}

export function formatarTempo(totalSegundos: number) {
  const horas = Math.floor(totalSegundos / 3600)
  const minutos = Math.floor((totalSegundos % 3600) / 60)
  const segundos = totalSegundos % 60

  return `${String(horas).padStart(2, '0')}:` +
         `${String(minutos).padStart(2, '0')}:` +
         `${String(segundos).padStart(2, '0')}`
}