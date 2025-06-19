# Aula 6 - Plugins e Extensibilidade no Lexical

Nesta aula vamos entender como o Lexical foi projetado para ser estendido através de plugins. Eles são componentes React que recebem o contexto do editor e podem registrar comportamentos ou adicionar elementos à interface.

## Como funcionam os plugins
1. **Ciclo de vida**: explique que um plugin nada mais é que um componente que utiliza `useLexicalComposerContext` para acessar o editor. Dentro do `useEffect` podemos registrar listeners (por exemplo, para teclas) e retornar uma função para limpeza quando o componente é desmontado.
2. **Comandos**: mostre como `editor.registerCommand` permite escutar atalhos e executar ações. Fale da prioridade dos comandos e como podemos bloquear o comportamento padrão caso necessário.
3. **Plugins existentes**: navegue rapidamente pela documentação e destaque alguns plugins oficiais como `HistoryPlugin`, `ListPlugin` e `AutoFocusPlugin`. Explique que a comunidade também fornece pacotes prontos, então vale sempre pesquisar antes de reinventar a roda.

## Exemplo simples
Crie um arquivo `MyShortcutPlugin.tsx` com o seguinte código:
```tsx
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';
import {COMMAND_PRIORITY_LOW} from 'lexical';

export default function MyShortcutPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      'CTRL+B',
      () => {
        console.log('Atalho CTRL+B acionado');
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);
  return null;
}
```
Inclua esse plugin no componente `Editor` e teste pressionando `Ctrl+B` para ver a mensagem no console.

Ao entender essa estrutura, estaremos prontos para criar plugins que realmente adicionem valor ao editor, como faremos a seguir.

## Registrando eventos de teclado
Uma prática comum é ouvir eventos de teclas específicas. O Lexical oferece o utilitário `KEY_MODIFIER_COMMAND` para capturar combinações como `Ctrl+B` ou `Cmd+B` de forma multiplataforma.

```tsx
import {KEY_MODIFIER_COMMAND} from 'lexical';

editor.registerCommand(KEY_MODIFIER_COMMAND, (payload) => {
  const event = payload as KeyboardEvent;
  if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
    console.log('Atalho para link');
    return true;
  }
  return false;
}, COMMAND_PRIORITY_LOW);
```

Mostre que retornamos `true` para indicar que tratamos o evento e impedimos que outros plugins com prioridade menor o executem.

## Escutando atualizações do editor
Além de atalhos, podemos reagir a atualizações com `editor.registerUpdateListener(({editorState}) => {...})`. Isso serve para sincronizar o conteúdo com um servidor, por exemplo. Demonstre salvando o JSON do estado em `localStorage`.

## Boas práticas
- Sempre remova listeners no retorno do `useEffect` para evitar vazamentos.
- Dê preferência a comandos fornecidos pelo Lexical em vez de manipular o DOM.
- Use `COMMAND_PRIORITY_EDITOR` para comandos críticos e `COMMAND_PRIORITY_LOW` para funcionalidades secundárias.

## Exercício prático
Crie um plugin de contagem de palavras. Ele deve registrar um update listener e exibir o número de palavras em um elemento fora do editor. Dica: utilize `editorState.read(() => $getRoot().getTextContent().trim().split(/\s+/).length)`.

Na próxima aula vamos aplicar esses conceitos para desenvolver um plugin de foco automático.

## Leitura recomendada
- [API de Plugins do Lexical](https://lexical.dev/docs/concepts/plugins)
- [Artigo: Estrutura de Comandos](https://lexical.dev/docs/concepts/commands)

### Dica extra
Quando seu plugin precisar manter estado próprio, crie um hook React personalizado e compartilhe-o entre componentes. Assim o código fica organizado e facilita testes.

Encerramos aqui nossa introdução aos plugins. Nas próximas aulas criaremos plugins específicos para melhorar o editor.

**Resumo**: compreendemos o ciclo de vida de um plugin, comandos e exemplos práticos.

Continue experimentando com diferentes tipos de plugins para ganhar confiança.
Na próxima aula criaremos um plugin para definir foco inicial.
Até mais!
