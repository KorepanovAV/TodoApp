import { ReactNode } from 'react';
import { Panel } from '../Panel/Panel';

export const Right = (props: { children?: ReactNode; }) => <Panel className="right" children={props.children} />;
