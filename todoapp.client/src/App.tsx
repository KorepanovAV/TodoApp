/* eslint-disable @typescript-eslint/no-unused-vars */
import { Toolbar } from 'primereact/toolbar';

import { Tree, TreeProps } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { ScrollPanel } from 'primereact/scrollpanel';

import { PlusIcon } from 'primereact/icons/plus';
import { PencilIcon } from 'primereact/icons/pencil';

import block from 'bem-cn-lite';

import { useRef } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { MenuItem } from 'primereact/menuitem';

import './App.css';

const b = block('app');

let id = 0;

const createNode = (node: TreeNode): TreeNode => node;

const createNodes = (count: number, label: (index: number, key: number) => string, children?: (index: number) => TreeNode[]): TreeNode[] =>
    Array.from({ length: count }, (_, i) => createNode({
        key: id++,
        id: `#${id}`,
        label: label(i, id),
        children: children?.(i),
        icon: <PencilIcon />,
    }));

const treeNodes: TreeNode[] = createNodes(5, (i) => `#${i}`, (i) => createNodes(10, ii => `#${i}-${ii}`));

const popupMenu: MenuItem[] = [
    { label: 'alert', command: (_e) => console.log('alert click') },
    { label: 'quit', command: (_e) => console.log('quit click') },
];

function App() {
    const popup = useRef<ContextMenu>(null);

    const nodeTemplate: TreeProps['nodeTemplate'] = (_node, { element }) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {element}
            <button type="button" aria-hidden="true" className="p-tree-toggler" onClick={() => console.log('plus click')} >
                <PlusIcon />
            </button>
        </div>
    );

    return (
        <div className={b()} style={{ background: 'var(--surface-100)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Toolbar start={<span>[start]</span>} center={<span>[center]</span>} end={<span>[end]</span>} />

            <div className={b('main')} style={{ background: 'var(--surface-300)', height: '100%', display: 'flex', flexDirection: 'row' }}>
                <div className={b('main')} style={{ background: 'var(--surface-500)', width: '100%' }}>main</div>
                <div className={b('sidebar')} style={{ background: 'var(--surface-400)', display: 'flex', width: '450px' }}>
                    <ScrollPanel style={{ width: '100%' }}>
                        <ContextMenu model={popupMenu} ref={popup} />
                        <Tree value={treeNodes} nodeTemplate={nodeTemplate} onContextMenu={(e) => popup.current?.show(e.originalEvent)} />
                    </ScrollPanel>
                </div>
            </div>
        </div>
    );
}

export default App;