import { ReactNode } from 'react';
import { Panel } from '../panel/panel';
import block from 'bem-cn-lite';

import './content.css';

const b = block('content');

export const Content = (props: { children?: ReactNode; }) => <Panel className={b()} children={props.children} />;
