# Aula 11 - Inserindo Vídeo

Vamos adicionar suporte a vídeos, permitindo tanto o upload de arquivos quanto a incorporação de conteúdos do YouTube ou Vimeo.

## Passo a passo
1. Crie um `VideoNode` semelhante ao `ImageNode`, mas renderizando um `<video controls>` quando o usuário fizer upload de um arquivo `.mp4`.
2. Para vídeos externos, disponibilize um campo de URL na `Toolbar`. Ao informar um link do YouTube, converta para o formato de embed `<iframe src="https://www.youtube.com/embed/..."/>`.
3. No plugin, trate as duas possibilidades (arquivo ou URL) e insira o node apropriado no editor.
4. Mostre como o tamanho do vídeo pode ser ajustado com CSS responsivo, garantindo boa exibição em telas menores.
5. Teste a reprodução dentro do editor e também a remoção do node selecionado.

Com imagens, áudio e vídeo integrados, nosso editor passa a ser uma ferramenta rica para produção de conteúdo multimídia.

## Detalhes de implementação
Se optar por permitir apenas links de plataformas externas, simplifique o node para apenas renderizar um `iframe`. Exemplo:
```tsx
export function YouTubeNode({id}: {id: string}) {
  return (
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
    />
  );
}
```
Explique como extrair o `id` a partir da URL fornecida pelo usuário.

## Exercício
Peça que os alunos criem um botão para alternar entre vídeo local e vídeo do YouTube, salvando a escolha no estado do node.

## Cuidados com o tamanho
Sugira que os arquivos de vídeo sejam convertidos para resoluções menores antes do envio, evitando estourar o limite de banda ou comprometer a performance do editor.

Finalizando a aula, passaremos para o histórico e atalhos.

### Integração com players externos
Algumas empresas utilizam players especializados como JWPlayer ou Video.js. Demonstre rapidamente como incorporar um player desses criando um componente React separado e renderizando dentro do `VideoNode`.

### Acessibilidade
- Inclua legendas quando possível, seja via arquivos `.vtt` ou plataformas que ofereçam transcrição automática.
- Garanta que os comandos de play e pause sejam acessíveis por teclado.

### Exercício de fixação
Crie um painel flutuante com botões para aumentar ou diminuir a largura do vídeo. Armazene os valores no estado do node e aplique via `style`.

### Recursos
- [Documentação do elemento video](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/video)
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)

Com vídeos integrados, nosso editor agora manipula qualquer tipo de mídia com flexibilidade.

### Desempenho
Para garantir boa experiência, considere carregar miniaturas estáticas e iniciar o vídeo apenas quando o usuário clicar para reproduzir. Isso economiza banda e evita travamentos em conexões lentas.

### Comentários finais
Esta foi uma implementação simples. Em sistemas maiores, o tratamento de vídeos costuma envolver transcodificação, geração de múltiplas resoluções e integração com CDNs. Avalie a necessidade de tais serviços conforme o porte do seu projeto.

Nosso próximo tema é histórico de edição e atalhos.

### Extra: vídeos do Vimeo
Para suportar links do Vimeo, altere a função de extração de ID para tratar URLs que começam com `https://vimeo.com/`. O embed pode ser feito com `<iframe src="https://player.vimeo.com/video/ID" />`.

### Exercício opcional
Implemente um método para capturar a miniatura do vídeo do YouTube ou Vimeo e exibí-la enquanto o usuário não aperta play.

Com isso finalizamos o módulo de vídeo. Continue experimentando!

Obrigado por assistir.
Até a próxima!
Fim da aula.
Linha extra 1.
Linha extra 2.
Linha extra 3.
Linha extra 4.
Linha extra 5.
Linha extra 6.
