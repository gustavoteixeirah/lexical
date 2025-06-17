# Aula 11 - Inserindo Vídeo

Vamos adicionar suporte a vídeos, permitindo tanto o upload de arquivos quanto a incorporação de conteúdos do YouTube ou Vimeo.

## Passo a passo
1. Crie um `VideoNode` semelhante ao `ImageNode`, mas renderizando um `<video controls>` quando o usuário fizer upload de um arquivo `.mp4`.
2. Para vídeos externos, disponibilize um campo de URL na `Toolbar`. Ao informar um link do YouTube, converta para o formato de embed `<iframe src="https://www.youtube.com/embed/..."/>`.
3. No plugin, trate as duas possibilidades (arquivo ou URL) e insira o node apropriado no editor.
4. Mostre como o tamanho do vídeo pode ser ajustado com CSS responsivo, garantindo boa exibição em telas menores.
5. Teste a reprodução dentro do editor e também a remoção do node selecionado.

Com imagens, áudio e vídeo integrados, nosso editor passa a ser uma ferramenta rica para produção de conteúdo multimídia.
