import { ReactNode } from 'react';
import { Panel } from '../Panel/Panel';
import block from 'bem-cn-lite';

import './right.css';

const b = block('right');

export const Right = (props: { children?: ReactNode; }) => <Panel className={b()} children={props.children} />;
