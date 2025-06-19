# Aula 16 - Renderizando Equações com MathJax

Em alguns contextos o KaTeX não suporta toda a gama de comandos LaTeX desejados. Nesses casos podemos recorrer ao MathJax, que prioriza compatibilidade.

## Configuração
1. Instale `mathjax` via npm (`npm install mathjax-full`) ou inclua o script CDN no `index.html`.
2. Como o carregamento é assíncrono, crie um utilitário que aguarde `window.MathJax` estar disponível antes de renderizar.

## Adaptando o plugin de equações
1. Reaproveite o `EquationNode` criado na aula anterior, adicionando uma propriedade `engine` que pode ser `'katex'` ou `'mathjax'`.
2. No método `decorate`, se `engine === 'mathjax'`, utilize `window.MathJax.typesetPromise([element])` para processar a equação após inserir o HTML bruto.
3. No formulário do plugin, ofereça um seletor para escolher a biblioteca de renderização.

## Quando usar cada um
- **KaTeX** é mais rápido e leve, ideal para a maioria dos casos.
- **MathJax** suporta uma sintaxe mais ampla, sendo preferível em publicações acadêmicas complexas.

Mostre exemplos práticos no editor e compare a renderização das duas opções.
