export function emailPrompt(opts: {
  destinatario: string
  objetivo: string
  clientName: string
}): string {
  return `Escreve um email profissional para ${opts.destinatario} com o objetivo: "${opts.objetivo}".
O email é enviado em nome do cliente ${opts.clientName}.

Formato:
**Assunto:** [assunto claro e direto]

[corpo do email]

Regras:
- Português de Portugal
- Tom profissional mas acessível
- Máx 200 palavras no corpo
- Sem clichés`
}
