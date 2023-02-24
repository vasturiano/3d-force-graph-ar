import { ThreeForceGraphGeneric } from 'three-forcegraph';

export interface ConfigOptions {
  markerAttrs?: object;
}

// don't surface these internal props from inner ThreeForceGraph
type ExcludedInnerProps = 'onLoading' | 'onFinishLoading' | 'onUpdate' | 'onFinishUpdate' | 'tickFrame' | 'd3AlphaTarget' | 'resetCountdown';

export interface ForceGraphARGenericInstance<ChainableInstance>
    extends Omit<ThreeForceGraphGeneric<ChainableInstance>, ExcludedInnerProps> {
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
  onNodeHover(callback: (node: object | null, previousNode: object | null) => void): ChainableInstance;
  onLinkHover(callback: (link: object | null, previousLink: object | null) => void): ChainableInstance;
  onNodeClick(callback: (node: object) => void): ChainableInstance;
  onLinkClick(callback: (link: object) => void): ChainableInstance;
}

export type ForceGraphARInstance = ForceGraphARGenericInstance<ForceGraphARInstance>;

declare function ForceGraphAR(configOptions?: ConfigOptions): ForceGraphARInstance;

export default ForceGraphAR;
