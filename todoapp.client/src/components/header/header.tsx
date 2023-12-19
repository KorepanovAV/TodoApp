import { ReactNode } from 'react';
import { Panel } from '../panel/panel';
import block from 'bem-cn-lite';

import './header.css';

const b = block('header');

export const Header = (props: { children?: ReactNode; }) => <Panel className={b()} children={props.children} />;
