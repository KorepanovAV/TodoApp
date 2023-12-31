﻿import { ReactNode } from 'react';
import { Panel } from '../panel/panel';
import block from 'bem-cn-lite';

import './main.css';

const b = block("main");

export const Main = (props: { children?: ReactNode; }) => <Panel className={b()} children={props.children} />;
