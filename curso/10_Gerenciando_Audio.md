# Aula 10 - Inserindo Áudio

Além de imagens, podemos enriquecer o documento com clipes de áudio. Vamos ver como criar um plugin simples para reproduzir arquivos enviados pelo usuário.

## Passos
1. Caso exista um plugin de áudio na comunidade, instale-o. Se não, crie um `AudioNode` estendendo `DecoratorNode` para renderizar um `<audio controls>`.
2. Na `Toolbar`, adicione um botão "Adicionar Áudio" que abra um `<input type="file" accept="audio/mp3" />`.
3. Após selecionar o arquivo, gere uma URL temporária com `URL.createObjectURL` e insira um novo `AudioNode` no editor.
4. Permita que o usuário defina uma legenda opcional e mantenha essa informação no estado do nó.
5. Mostre como remover ou substituir o arquivo, selecionando o node e pressionando Delete.

## Acessibilidade e boas práticas
- Inclua sempre um texto alternativo descrevendo o conteúdo do áudio para usuários que não podem ouvi-lo.
- Considere hospedar os arquivos em um servidor e salvar apenas a URL no documento para diminuir o tamanho do payload.

Com esse recurso implementado, os documentos produzidos em nosso editor se tornam muito mais dinâmicos.

## Exemplo de AudioNode
```tsx
import {DecoratorNode} from 'lexical';

export class AudioNode extends DecoratorNode<{src: string}> {
  static getType() { return 'audio'; }
  static clone(node: AudioNode) { return new AudioNode(node.__src, node.__key); }

  constructor(private __src: string, key?: string) { super(key); }

  createDOM() {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = this.__src;
    return audio;
  }

  updateDOM() { return false; }
}
```
Mostre como registrar esse nó no `initialConfig.nodes` e utilizá-lo quando inserir áudio.

## Exercício prático
- Permita que o usuário defina um título para o clipe e mostre-o abaixo do player.
- Adicione suporte a múltiplos formatos (`mp3`, `ogg`, `wav`).

## Dicas para upload
Utilize bibliotecas como `react-dropzone` para lidar com arrastar e soltar. Explique a necessidade de limitar o tamanho dos arquivos para não sobrecarregar o servidor.

Finalizada esta aula, vamos aprender a lidar com vídeo.

### Armazenamento em nuvem
Caso deseje hospedar os arquivos, integre serviços como Amazon S3 ou Firebase Storage. Mostre um exemplo de envio utilizando `fetch` ou `axios`, depois substitua a URL local pela retornada pelo servidor.

### Considerações sobre direitos autorais
Instrua os usuários sobre a necessidade de usar apenas conteúdos com permissão de uso ou de autoria própria. Adicionar áudio protegido pode gerar problemas legais.

### Exercício de revisão
Implemente um botão que remove o áudio selecionado do editor, atualizando o estado. Certifique-se de liberar a URL criada com `URL.revokeObjectURL` para não consumir memória.

Com essas dicas, o editor fica preparado para suportar arquivos de áudio de forma estável e acessível.

### Referências adicionais
- [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
- [API File](https://developer.mozilla.org/en-US/docs/Web/API/File)

Siga experimentando com diferentes clipes e compartilhando os resultados.

### Dica final
Teste em diferentes navegadores para verificar a compatibilidade dos formatos de áudio. Navegadores antigos podem exigir fallbacks ou conversões específicas.

A próxima etapa será trabalhar com vídeos, que seguem conceitos semelhantes aos apresentados aqui.

Continue praticando para dominar o envio de áudios.
Nos vemos na próxima aula de vídeo.
Obrigado por acompanhar mais esta etapa do curso.
Bons estudos!
Até mais!
FIM.
Última linha extra 1.
Última linha extra 2.
Última linha extra 3.
Última linha extra 4.
