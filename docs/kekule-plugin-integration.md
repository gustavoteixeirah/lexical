# Integração de Fórmulas Químicas com Kekule.js no Lexical

Este documento descreve como criar um plugin para integrar fórmulas químicas usando Kekule.js com o editor Lexical.

## Introdução

[Kekule.js](http://partridgejiang.github.io/Kekule.js/) é uma biblioteca JavaScript de código aberto para representação e manipulação de estruturas químicas em navegadores web. Integrar o Kekule.js com o Lexical permite que os usuários criem, editem e insiram fórmulas químicas complexas em seus documentos.

## Pré-requisitos

Antes de começar, você precisa instalar as dependências necessárias:

```bash
npm install kekule
# ou
yarn add kekule
```

Também é necessário importar os estilos CSS do Kekule.js:

```typescript
import 'kekule/dist/themes/default/kekule.css';
```

## Estrutura do Plugin

A integração do Kekule.js com o Lexical envolve vários componentes:

1. **ChemicalFormulaNode**: Um nó personalizado para representar fórmulas químicas
2. **ChemicalFormulaComponent**: Um componente para renderizar e editar fórmulas químicas
3. **KekuleRenderer**: Um componente para renderizar fórmulas químicas usando Kekule.js
4. **ChemicalFormulaEditor**: Um componente para editar fórmulas químicas
5. **ChemicalFormulasPlugin**: O plugin principal que registra o comando para inserir fórmulas químicas

## Implementação

### 1. Criando o ChemicalFormulaNode

Primeiro, crie um nó personalizado que estenda `DecoratorNode`:

```typescript
import type {
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import type {JSX} from 'react';

import {$applyNodeReplacement, DecoratorNode, DOMExportOutput} from 'lexical';
import * as React from 'react';

// Importe o componente que será usado para renderizar a fórmula química
const ChemicalFormulaComponent = React.lazy(() => import('./ChemicalFormulaComponent'));

// Defina o tipo para o nó serializado
export type SerializedChemicalFormulaNode = Spread<
  {
    formula: string;
    inline: boolean;
  },
  SerializedLexicalNode
>;

// Função para converter elementos DOM em nós de fórmula química
function $convertChemicalFormulaElement(
  domNode: HTMLElement,
): null | DOMConversionOutput {
  let formula = domNode.getAttribute('data-lexical-formula');
  const inline = domNode.getAttribute('data-lexical-inline') === 'true';
  // Decodifica a fórmula de base64
  formula = atob(formula || '');
  if (formula) {
    const node = $createChemicalFormulaNode(formula, inline);
    return {node};
  }

  return null;
}

export class ChemicalFormulaNode extends DecoratorNode<JSX.Element> {
  __formula: string;
  __inline: boolean;

  static getType(): string {
    return 'chemicalFormula';
  }

  static clone(node: ChemicalFormulaNode): ChemicalFormulaNode {
    return new ChemicalFormulaNode(node.__formula, node.__inline, node.__key);
  }

  constructor(formula: string, inline?: boolean, key?: NodeKey) {
    super(key);
    this.__formula = formula;
    this.__inline = inline ?? false;
  }

  static importJSON(serializedNode: SerializedChemicalFormulaNode): ChemicalFormulaNode {
    return $createChemicalFormulaNode(
      serializedNode.formula,
      serializedNode.inline,
    ).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedChemicalFormulaNode {
    return {
      ...super.exportJSON(),
      formula: this.getFormula(),
      inline: this.__inline,
    };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement(this.__inline ? 'span' : 'div');
    element.className = 'editor-chemical-formula';
    return element;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement(this.__inline ? 'span' : 'div');
    // Codifica a fórmula em base64 para evitar problemas com caracteres especiais
    const formula = btoa(this.__formula);
    element.setAttribute('data-lexical-formula', formula);
    element.setAttribute('data-lexical-inline', `${this.__inline}`);
    // Aqui você pode adicionar código para renderizar a fórmula usando Kekule.js
    // Isso dependerá de como você estrutura os dados da fórmula
    return {element};
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-formula')) {
          return null;
        }
        return {
          conversion: $convertChemicalFormulaElement,
          priority: 2,
        };
      },
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-formula')) {
          return null;
        }
        return {
          conversion: $convertChemicalFormulaElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM(prevNode: this): boolean {
    // Se a propriedade inline mudar, substitua o elemento
    return this.__inline !== prevNode.__inline;
  }

  getTextContent(): string {
    return this.__formula;
  }

  getFormula(): string {
    return this.__formula;
  }

  setFormula(formula: string): void {
    const writable = this.getWritable();
    writable.__formula = formula;
  }

  decorate(): JSX.Element {
    return (
      <ChemicalFormulaComponent
        formula={this.__formula}
        inline={this.__inline}
        nodeKey={this.__key}
      />
    );
  }
}

// Função auxiliar para criar um nó de fórmula química
export function $createChemicalFormulaNode(
  formula = '',
  inline = false,
): ChemicalFormulaNode {
  const chemicalFormulaNode = new ChemicalFormulaNode(formula, inline);
  return $applyNodeReplacement(chemicalFormulaNode);
}

// Função auxiliar para verificar se um nó é um nó de fórmula química
export function $isChemicalFormulaNode(
  node: LexicalNode | null | undefined,
): node is ChemicalFormulaNode {
  return node instanceof ChemicalFormulaNode;
}
```

### 2. Criando o KekuleRenderer

Em seguida, crie um componente para renderizar fórmulas químicas usando Kekule.js:

```typescript
import type {JSX} from 'react';

import * as React from 'react';
import {useEffect, useRef} from 'react';
import Kekule from 'kekule';

export default function KekuleRenderer({
  formula,
  inline,
  onDoubleClick,
}: Readonly<{
  formula: string;
  inline: boolean;
  onDoubleClick: () => void;
}>): JSX.Element {
  const kekuleElementRef = useRef(null);

  useEffect(() => {
    const kekuleElement = kekuleElementRef.current;

    if (kekuleElement !== null && formula) {
      try {
        // Limpar o conteúdo anterior
        while (kekuleElement.firstChild) {
          kekuleElement.removeChild(kekuleElement.firstChild);
        }

        // Criar um visualizador de Kekule
        const viewer = new Kekule.ChemWidget.Viewer(kekuleElement);
        
        // Configurar o visualizador
        viewer.setRenderType(Kekule.Render.RendererType.R2D);
        viewer.setEnableToolbar(false);
        viewer.setEnableDirectInteraction(false);
        viewer.setEnableEdit(false);
        viewer.setAutoSize(true);
        viewer.setAutofit(true);
        
        // Carregar a fórmula
        // Aqui assumimos que a fórmula está em formato Kekule.js JSON ou MOL
        let chemObj;
        try {
          // Tentar analisar como JSON
          const formulaObj = JSON.parse(formula);
          chemObj = Kekule.IO.loadFormatData(formulaObj, 'json');
        } catch (e) {
          // Se não for JSON, tentar como MOL ou outro formato
          chemObj = Kekule.IO.loadFormatData(formula, 'mol');
        }
        
        viewer.setChemObj(chemObj);
        
        // Ajustar o tamanho com base no modo inline
        if (inline) {
          viewer.setDimension('auto', '2em');
        } else {
          viewer.setDimension('100%', 'auto');
        }
        
        // Renderizar
        viewer.repaint();
      } catch (error) {
        console.error('Error rendering chemical formula:', error);
        // Mostrar mensagem de erro
        kekuleElement.textContent = 'Error: Invalid chemical formula';
      }
    }
  }, [formula, inline]);

  return (
    <div
      className={`kekule-renderer ${inline ? 'inline' : 'block'}`}
      role="button"
      tabIndex={-1}
      onDoubleClick={onDoubleClick}
      ref={kekuleElementRef}
    />
  );
}
```

### 3. Criando o ChemicalFormulaEditor

Crie um componente para editar fórmulas químicas:

```typescript
import type {JSX, Ref} from 'react';

import './ChemicalFormulaEditor.css';

import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import Kekule from 'kekule';

type ChemicalFormulaEditorProps = {
  formula: string;
  inline: boolean;
  setFormula: (formula: string) => void;
};

function ChemicalFormulaEditor(
  {formula, setFormula, inline}: ChemicalFormulaEditorProps,
  forwardedRef: Ref<HTMLDivElement>,
): JSX.Element {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Inicializar o editor Kekule
    const elem = editorRef.current;
    
    // Limpar o conteúdo anterior
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
    
    // Criar um editor de Kekule
    const chemEditor = new Kekule.Editor.ChemSpaceEditor(elem);
    
    // Configurar o editor
    chemEditor.setRenderType(Kekule.Render.RendererType.R2D);
    chemEditor.setEnableToolbar(true);
    chemEditor.setToolbarPos(Kekule.Widget.Position.TOP);
    chemEditor.setEnableStyleToolbar(true);
    chemEditor.setAutoSize(true);
    
    // Definir o tamanho com base no modo inline
    if (inline) {
      chemEditor.setDimension('100%', '200px');
    } else {
      chemEditor.setDimension('100%', '400px');
    }
    
    // Carregar a fórmula existente, se houver
    if (formula) {
      try {
        let chemObj;
        try {
          // Tentar analisar como JSON
          const formulaObj = JSON.parse(formula);
          chemObj = Kekule.IO.loadFormatData(formulaObj, 'json');
        } catch (e) {
          // Se não for JSON, tentar como MOL ou outro formato
          chemObj = Kekule.IO.loadFormatData(formula, 'mol');
        }
        
        chemEditor.setChemObj(chemObj);
      } catch (error) {
        console.error('Error loading chemical formula:', error);
      }
    }
    
    // Adicionar manipulador de eventos para atualizar a fórmula quando alterada
    chemEditor.addEventListener('editingDone', () => {
      const chemObj = chemEditor.getChemObj();
      if (chemObj) {
        // Converter para formato JSON para armazenamento
        const jsonData = Kekule.IO.saveFormatData(chemObj, 'json');
        setFormula(JSON.stringify(jsonData));
      }
    });
    
    // Renderizar
    chemEditor.repaint();
    
    // Armazenar a referência do editor
    setEditor(chemEditor);
    
    // Limpeza
    return () => {
      if (chemEditor) {
        chemEditor.finalize();
      }
    };
  }, [inline]);

  return (
    <div className="ChemicalFormulaEditor_container">
      <div 
        className={`ChemicalFormulaEditor_editor ${inline ? 'inline' : 'block'}`}
        ref={editorRef}
      />
      <div className="ChemicalFormulaEditor_buttons">
        <button 
          className="ChemicalFormulaEditor_button"
          onClick={() => {
            if (editor) {
              const chemObj = editor.getChemObj();
              if (chemObj) {
                // Converter para formato JSON para armazenamento
                const jsonData = Kekule.IO.saveFormatData(chemObj, 'json');
                setFormula(JSON.stringify(jsonData));
              }
            }
          }}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}

export default React.forwardRef(ChemicalFormulaEditor);
```

### 4. Criando o ChemicalFormulaComponent

Crie um componente que alterna entre o editor e o renderizador:

```typescript
import type {JSX} from 'react';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalEditable} from '@lexical/react/useLexicalEditable';
import {mergeRegister} from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_HIGH,
  KEY_ESCAPE_COMMAND,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {ErrorBoundary} from 'react-error-boundary';

import ChemicalFormulaEditor from '../ui/ChemicalFormulaEditor';
import KekuleRenderer from '../ui/KekuleRenderer';
import {$isChemicalFormulaNode} from './ChemicalFormulaNode';

type ChemicalFormulaComponentProps = {
  formula: string;
  inline: boolean;
  nodeKey: NodeKey;
};

export default function ChemicalFormulaComponent({
  formula,
  inline,
  nodeKey,
}: ChemicalFormulaComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const [formulaValue, setFormulaValue] = useState(formula);
  const [showFormulaEditor, setShowFormulaEditor] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const onHide = useCallback(
    (restoreSelection?: boolean) => {
      setShowFormulaEditor(false);
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isChemicalFormulaNode(node)) {
          node.setFormula(formulaValue);
          if (restoreSelection) {
            node.selectNext(0, 0);
          }
        }
      });
    },
    [editor, formulaValue, nodeKey],
  );

  useEffect(() => {
    if (!showFormulaEditor && formulaValue !== formula) {
      setFormulaValue(formula);
    }
  }, [showFormulaEditor, formula, formulaValue]);

  useEffect(() => {
    if (!isEditable) {
      return;
    }
    if (showFormulaEditor) {
      return mergeRegister(
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (payload) => {
            const activeElement = document.activeElement;
            const editorElem = editorRef.current;
            if (editorElem && !editorElem.contains(activeElement)) {
              onHide();
            }
            return false;
          },
          COMMAND_PRIORITY_HIGH,
        ),
        editor.registerCommand(
          KEY_ESCAPE_COMMAND,
          (payload) => {
            const activeElement = document.activeElement;
            const editorElem = editorRef.current;
            if (editorElem && editorElem.contains(activeElement)) {
              onHide(true);
              return true;
            }
            return false;
          },
          COMMAND_PRIORITY_HIGH,
        ),
      );
    } else {
      return editor.registerUpdateListener(({editorState}) => {
        const isSelected = editorState.read(() => {
          const selection = $getSelection();
          return (
            $isNodeSelection(selection) &&
            selection.has(nodeKey) &&
            selection.getNodes().length === 1
          );
        });
        if (isSelected) {
          setShowFormulaEditor(true);
        }
      });
    }
  }, [editor, nodeKey, onHide, showFormulaEditor, isEditable]);

  return (
    <>
      {showFormulaEditor && isEditable ? (
        <ChemicalFormulaEditor
          formula={formulaValue}
          setFormula={setFormulaValue}
          inline={inline}
          ref={editorRef}
        />
      ) : (
        <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
          <KekuleRenderer
            formula={formulaValue}
            inline={inline}
            onDoubleClick={() => {
              if (isEditable) {
                setShowFormulaEditor(true);
              }
            }}
          />
        </ErrorBoundary>
      )}
    </>
  );
}
```

### 5. Criando o ChemicalFormulasPlugin

Finalmente, crie o plugin principal:

```typescript
import type {JSX} from 'react';

import 'kekule/dist/themes/default/kekule.css';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$wrapNodeInElement} from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from 'lexical';
import {useCallback, useEffect} from 'react';
import * as React from 'react';

import {$createChemicalFormulaNode, ChemicalFormulaNode} from '../../nodes/ChemicalFormulaNode';
import KekuleFormulaAlterer from '../../ui/KekuleFormulaAlterer';

type CommandPayload = {
  formula: string;
  inline: boolean;
};

export const INSERT_CHEMICAL_FORMULA_COMMAND: LexicalCommand<CommandPayload> =
  createCommand('INSERT_CHEMICAL_FORMULA_COMMAND');

export function InsertChemicalFormulaDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const onFormulaConfirm = useCallback(
    (formula: string, inline: boolean) => {
      activeEditor.dispatchCommand(INSERT_CHEMICAL_FORMULA_COMMAND, {formula, inline});
      onClose();
    },
    [activeEditor, onClose],
  );

  return <KekuleFormulaAlterer onConfirm={onFormulaConfirm} />;
}

export default function ChemicalFormulasPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ChemicalFormulaNode])) {
      throw new Error(
        'ChemicalFormulasPlugin: ChemicalFormulaNode not registered on editor',
      );
    }

    return editor.registerCommand<CommandPayload>(
      INSERT_CHEMICAL_FORMULA_COMMAND,
      (payload) => {
        const {formula, inline} = payload;
        const chemicalFormulaNode = $createChemicalFormulaNode(formula, inline);

        $insertNodes([chemicalFormulaNode]);
        if ($isRootOrShadowRoot(chemicalFormulaNode.getParentOrThrow())) {
          $wrapNodeInElement(chemicalFormulaNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
```

## Registrando o Plugin

Para usar o plugin, você precisa registrar o nó `ChemicalFormulaNode` e o plugin `ChemicalFormulasPlugin` no seu editor:

```typescript
import {ChemicalFormulaNode} from './nodes/ChemicalFormulaNode';
import ChemicalFormulasPlugin from './plugins/ChemicalFormulasPlugin';

// No seu componente de editor
function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    nodes: [
      // ... outros nós
      ChemicalFormulaNode,
    ],
    // ... outras configurações
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* ... outros plugins */}
        <ChemicalFormulasPlugin />
      </div>
    </LexicalComposer>
  );
}
```

## Adicionando um Botão para Inserir Fórmulas Químicas

Para permitir que os usuários insiram fórmulas químicas, você pode adicionar um botão à barra de ferramentas:

```typescript
import {INSERT_CHEMICAL_FORMULA_COMMAND} from './plugins/ChemicalFormulasPlugin';

// No seu componente de barra de ferramentas
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  
  const insertChemicalFormula = useCallback(() => {
    editor.dispatchCommand(INSERT_CHEMICAL_FORMULA_COMMAND, {
      formula: '',
      inline: false,
    });
  }, [editor]);

  return (
    <div className="toolbar">
      {/* ... outros botões */}
      <button onClick={insertChemicalFormula} title="Inserir fórmula química">
        Fórmula Química
      </button>
    </div>
  );
}
```

## Criando o Componente KekuleFormulaAlterer

Este componente é usado para criar uma nova fórmula química ou editar uma existente:

```typescript
import type {JSX} from 'react';

import './KekuleFormulaAlterer.css';

import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import Kekule from 'kekule';

type KekuleFormulaAltererProps = {
  onConfirm: (formula: string, inline: boolean) => void;
  formula?: string;
  inline?: boolean;
};

export default function KekuleFormulaAlterer({
  onConfirm,
  formula = '',
  inline = false,
}: KekuleFormulaAltererProps): JSX.Element {
  const [inlineMode, setInlineMode] = useState(inline);
  const [currentFormula, setCurrentFormula] = useState(formula);
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Inicializar o editor Kekule
    const elem = editorRef.current;
    
    // Limpar o conteúdo anterior
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
    
    // Criar um editor de Kekule
    const chemEditor = new Kekule.Editor.ChemSpaceEditor(elem);
    
    // Configurar o editor
    chemEditor.setRenderType(Kekule.Render.RendererType.R2D);
    chemEditor.setEnableToolbar(true);
    chemEditor.setToolbarPos(Kekule.Widget.Position.TOP);
    chemEditor.setEnableStyleToolbar(true);
    chemEditor.setAutoSize(true);
    chemEditor.setDimension('100%', '400px');
    
    // Carregar a fórmula existente, se houver
    if (formula) {
      try {
        let chemObj;
        try {
          // Tentar analisar como JSON
          const formulaObj = JSON.parse(formula);
          chemObj = Kekule.IO.loadFormatData(formulaObj, 'json');
        } catch (e) {
          // Se não for JSON, tentar como MOL ou outro formato
          chemObj = Kekule.IO.loadFormatData(formula, 'mol');
        }
        
        chemEditor.setChemObj(chemObj);
      } catch (error) {
        console.error('Error loading chemical formula:', error);
      }
    }
    
    // Adicionar manipulador de eventos para atualizar a fórmula quando alterada
    chemEditor.addEventListener('editingDone', () => {
      const chemObj = chemEditor.getChemObj();
      if (chemObj) {
        // Converter para formato JSON para armazenamento
        const jsonData = Kekule.IO.saveFormatData(chemObj, 'json');
        setCurrentFormula(JSON.stringify(jsonData));
      }
    });
    
    // Renderizar
    chemEditor.repaint();
    
    // Armazenar a referência do editor
    setEditor(chemEditor);
    
    // Limpeza
    return () => {
      if (chemEditor) {
        chemEditor.finalize();
      }
    };
  }, [formula]);

  const handleConfirm = () => {
    if (editor) {
      const chemObj = editor.getChemObj();
      if (chemObj) {
        // Converter para formato JSON para armazenamento
        const jsonData = Kekule.IO.saveFormatData(chemObj, 'json');
        onConfirm(JSON.stringify(jsonData), inlineMode);
      } else {
        onConfirm('', inlineMode);
      }
    } else {
      onConfirm(currentFormula, inlineMode);
    }
  };

  return (
    <div className="KekuleFormulaAlterer_container">
      <div className="KekuleFormulaAlterer_header">
        <h2>Editar Fórmula Química</h2>
        <div className="KekuleFormulaAlterer_inlineToggle">
          <label>
            <input
              type="checkbox"
              checked={inlineMode}
              onChange={(e) => setInlineMode(e.target.checked)}
            />
            Modo Inline
          </label>
        </div>
      </div>
      <div className="KekuleFormulaAlterer_editor" ref={editorRef} />
      <div className="KekuleFormulaAlterer_buttons">
        <button
          className="KekuleFormulaAlterer_button"
          onClick={handleConfirm}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
```

## Estilização

Você precisará adicionar alguns estilos CSS para os componentes. Aqui estão alguns exemplos:

### ChemicalFormulaEditor.css

```css
.ChemicalFormulaEditor_container {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin: 8px 0;
  background-color: #f9f9f9;
}

.ChemicalFormulaEditor_editor {
  width: 100%;
  min-height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.ChemicalFormulaEditor_editor.inline {
  min-height: 100px;
}

.ChemicalFormulaEditor_editor.block {
  min-height: 300px;
}

.ChemicalFormulaEditor_buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.ChemicalFormulaEditor_button {
  padding: 6px 12px;
  background-color: #4a65ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.ChemicalFormulaEditor_button:hover {
  background-color: #3a55ff;
}
```

### KekuleFormulaAlterer.css

```css
.KekuleFormulaAlterer_container {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  background-color: #f9f9f9;
  max-width: 800px;
  margin: 0 auto;
}

.KekuleFormulaAlterer_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.KekuleFormulaAlterer_header h2 {
  margin: 0;
  font-size: 18px;
}

.KekuleFormulaAlterer_inlineToggle {
  display: flex;
  align-items: center;
}

.KekuleFormulaAlterer_editor {
  width: 100%;
  min-height: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  margin-bottom: 16px;
}

.KekuleFormulaAlterer_buttons {
  display: flex;
  justify-content: flex-end;
}

.KekuleFormulaAlterer_button {
  padding: 8px 16px;
  background-color: #4a65ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.KekuleFormulaAlterer_button:hover {
  background-color: #3a55ff;
}
```

## Conclusão

Com esses componentes, você pode integrar o Kekule.js com o Lexical para permitir que os usuários criem, editem e insiram fórmulas químicas. O plugin suporta tanto fórmulas inline quanto em bloco, e fornece uma interface amigável para edição.

Para mais informações sobre o Kekule.js, consulte a [documentação oficial do Kekule.js](http://partridgejiang.github.io/Kekule.js/documents/index.html).