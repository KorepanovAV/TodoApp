import { ReactNode } from 'react';
import { Panel } from '../Panel/Panel';

export const Content = (props: { children?: ReactNode; }) => <Panel className="content" children={props.children} />;
