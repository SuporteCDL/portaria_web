import { criarDataISO, formatarTempo } from '@/lib/functions'
import { useEffect, useState } from 'react'

type Props = {
  data: string
  entrada: string
}

export function TempoPermanencia({ data, entrada }: Props) {
  const [segundos, setSegundos] = useState(0)
  
  useEffect(() => {
    const entradaDate = criarDataISO(data, entrada)

    const timer = setInterval(() => {
      const agora = new Date()
      const diff = agora.getTime() - entradaDate.getTime()

      if (diff >= 0) {
        setSegundos(Math.floor(diff / 1000))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [data, entrada])

  return <span>{formatarTempo(segundos)}</span>
}