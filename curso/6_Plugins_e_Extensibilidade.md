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
