import { ThreeForceGraphGeneric, NodeObject, LinkObject } from 'three-forcegraph';

export interface ConfigOptions {
  markerAttrs?: object;
}

// don't surface these internal props from inner ThreeForceGraph
type ExcludedInnerProps = 'onLoading' | 'onFinishLoading' | 'onUpdate' | 'onFinishUpdate' | 'tickFrame' | 'd3AlphaTarget' | 'resetCountdown';

export interface ForceGraphARGenericInstance<ChainableInstance, N extends NodeObject = NodeObject, L extends LinkObject<N> = LinkObject<N>>
    extends Omit<ThreeForceGraphGeneric<ChainableInstance, N, L>, ExcludedInnerProps> {
  (element: HTMLElement): ChainableInstance;
  _destructor(): void;

  // Container layout
  width(): number;
  width(width: number): ChainableInstance;
  height(): number;
  height(height: number): ChainableInstance;
  yOffset(): number;
  yOffset(numMarkers: number): ChainableInstance;
  glScale(): number;
  glScale(glUnits: number): ChainableInstance;

  // Interaction
  onNodeHover(callback: (node: N | null, previousNode: N | null) => void): ChainableInstance;
  onLinkHover(callback: (link: L | null, previousLink: L | null) => void): ChainableInstance;
  onNodeClick(callback: (node: N) => void): ChainableInstance;
  onLinkClick(callback: (link: L) => void): ChainableInstance;
}

export type ForceGraphARInstance<NodeType = NodeObject, LinkType = LinkObject<NodeType>> = ForceGraphARGenericInstance<ForceGraphARInstance<NodeType, LinkType>, NodeType, LinkType>;

declare function ForceGraphAR<NodeType = NodeObject, LinkType = LinkObject<NodeType>>(configOptions?: ConfigOptions): ForceGraphARInstance<NodeType, LinkType>;

export default ForceGraphAR;
