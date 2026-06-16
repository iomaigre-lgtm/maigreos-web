export function carrosselPrompt(opts: {
  tema: string
  slides: number
  clientName: string
}): string {
  return `Cria um carrossel para Instagram com ${opts.slides} slides sobre "${opts.tema}" para o cliente ${opts.clientName}.

Formato de resposta — usa exatamente este modelo para cada slide:

## Slide 1
**Título:** [título impactante, máx 8 palavras]
**Corpo:** [2-3 linhas de texto conciso]
**CTA:** [opcional, só no último slide]

Regras:
- Linguagem: português de Portugal, tu/teu
- Tom: direto, sem jargão, orientado ao resultado
- Slide 1 = gancho (problema ou promessa)
- Slides 2-${opts.slides - 1} = desenvolvimento
- Slide ${opts.slides} = CTA/conclusão`
}
