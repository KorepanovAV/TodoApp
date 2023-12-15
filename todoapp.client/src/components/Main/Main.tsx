import { ReactNode } from 'react';
import { Panel } from '../Panel/Panel';

export const Main = (props: { children?: ReactNode; }) => <Panel className="main" children={props.children} />;
