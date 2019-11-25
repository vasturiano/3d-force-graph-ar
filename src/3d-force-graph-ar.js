import 'aframe-forcegraph-component';

//import * as a from 'ar.js/aframe/build/aframe-ar.js';

import Kapsule from 'kapsule';

//

export default Kapsule({

  props: {
    width: {},
    height: {},
    yOffset: { default: 1.5 }, // marker size units
    glScale: { default: 200 }, // gl units per marker width
    jsonUrl: {},
    graphData: { default: { nodes: [], links: [] }},
    numDimensions: { default: 3 },
    dagMode: {},
    dagLevelDistance: {},
    nodeRelSize: { default: 4 }, // volume per val unit
    nodeId: { default: 'id' },
    nodeLabel: { default: 'name' },
    nodeDesc: { default: 'desc' },
    nodeVal: { default: 'val' },
    nodeResolution: { default: 8 }, // how many slice segments in the sphere's circumference
    nodeVisibility: { default: true },
    nodeColor: { default: 'color' },
    nodeAutoColorBy: {},
    nodeOpacity: { default: 0.75 },
    nodeThreeObject: {},
    nodeThreeObjectExtend: { default: false },
    linkSource: { default: 'source' },
    linkTarget: { default: 'target' },
    linkLabel: { default: 'name' },
    linkDesc: { default: 'desc' },
    linkHoverPrecision: { default: 2 },
    linkVisibility: { default: true },
    linkColor: { default: 'color' },
    linkAutoColorBy: {},
    linkOpacity: { default: 0.2 },
    linkWidth: { default: 0 },
    linkResolution: { default: 6 }, // how many radial segments in each line cylinder's geometry
    linkCurvature: { default: 0 },
    linkCurveRotation: { default: 0 },
    linkMaterial: {},
    linkThreeObject: {},
    linkThreeObjectExtend: { default: false },
    linkPositionUpdate: {},
    linkDirectionalArrowLength: { default: 0 },
    linkDirectionalArrowColor: {},
    linkDirectionalArrowRelPos: { default: 0.5 }, // value between 0<>1 indicating the relative pos along the (exposed) line
    linkDirectionalArrowResolution: { default: 8 }, // how many slice segments in the arrow's conic circumference
    linkDirectionalParticles: { default: 0 }, // animate photons travelling in the link direction
    linkDirectionalParticleSpeed: { default: 0.01 }, // in link length ratio per frame
    linkDirectionalParticleWidth: { default: 0.5 },
    linkDirectionalParticleColor: {},
    linkDirectionalParticleResolution: { default: 4 }, // how many slice segments in the particle sphere's circumference
    forceEngine: { default: 'd3' }, // d3 or ngraph
    d3AlphaDecay: { default: 0.0228 },
    d3VelocityDecay: { default: 0.4 },
    warmupTicks: { default: 0 }, // how many times to tick the force engine at init before starting to render
    cooldownTicks: {},
    cooldownTime: { default: 15000 }, // ms
    onEngineTick: {},
    onEngineStop: {}
  },

  methods: {
    d3Force: function(state, ...args) {
      const aframeComp = state.forcegraph.components.forcegraph;
      const returnVal = aframeComp.d3Force(...args);

      return returnVal === aframeComp
        ? this // chain based on this object, not the inner aframe component
        : returnVal;
    },
    d3ReheatSimulation: function(state) {
      state.forcegraph.components.forcegraph.d3ReheatSimulation();
      return this;
    },
    refresh: function(state) {
      state.forcegraph.components.forcegraph.refresh();
      return this;
    },
    _destructor: function() {
      this.graphData({ nodes: [], links: []});
    }
  },

  init(domNode, state, { markerAttrs = { preset: 'hiro' }} = {}) {
    // Wipe DOM
    domNode.innerHTML = '';

    state.container = document.createElement('div');
    domNode.appendChild(state.container);

    // Create scene
    const scene = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute('arjs', 'debugUIEnabled: false;');

    const arMarker = document.createElement('a-marker');
    // add marker attributes
    Object.entries(markerAttrs).forEach(([attr, val]) => arMarker.setAttribute(attr, val));
    scene.appendChild(arMarker);

    // Add forcegraph entity
    state.forcegraph = document.createElement('a-entity')
    state.forcegraph.setAttribute('forcegraph', null);
    arMarker.appendChild(state.forcegraph);

    const cameraEntity = document.createElement('a-entity');
    cameraEntity.setAttribute('camera', '');
    scene.appendChild(cameraEntity);

    // attach scene
    state.container.appendChild(scene);
    //domNode.appendChild(scene);
  },

  update(state, changedProps) {
    changedProps.hasOwnProperty('width') && state.width && (state.container.style.width = state.width);
    changedProps.hasOwnProperty('height') && state.height && (state.container.style.height = state.height);

    changedProps.hasOwnProperty('glScale') &&
      state.forcegraph.setAttribute('scale', [...new Array(3)].map(() => 1 / state.glScale).join(' '));

    changedProps.hasOwnProperty('yOffset') &&
    state.forcegraph.setAttribute('position', `0 ${state.yOffset} 0`);

    const passThroughProps = [
      'jsonUrl',
      'numDimensions',
      'dagMode',
      'dagLevelDistance',
      'nodeRelSize',
      'nodeId',
      'nodeLabel',
      'nodeDesc',
      'nodeVal',
      'nodeResolution',
      'nodeVisibility',
      'nodeColor',
      'nodeAutoColorBy',
      'nodeOpacity',
      'nodeThreeObject',
      'nodeThreeObjectExtend',
      'linkSource',
      'linkTarget',
      'linkLabel',
      'linkDesc',
      'linkHoverPrecision',
      'linkVisibility',
      'linkColor',
      'linkAutoColorBy',
      'linkOpacity',
      'linkWidth',
      'linkResolution',
      'linkCurvature',
      'linkCurveRotation',
      'linkMaterial',
      'linkThreeObject',
      'linkThreeObjectExtend',
      'linkPositionUpdate',
      'linkDirectionalArrowLength',
      'linkDirectionalArrowColor',
      'linkDirectionalArrowRelPos',
      'linkDirectionalArrowResolution',
      'linkDirectionalParticles',
      'linkDirectionalParticleSpeed',
      'linkDirectionalParticleWidth',
      'linkDirectionalParticleColor',
      'linkDirectionalParticleResolution',
      'forceEngine',
      'd3AlphaDecay',
      'd3VelocityDecay',
      'warmupTicks',
      'cooldownTicks',
      'cooldownTime',
      'onEngineTick',
      'onEngineStop'
    ];

    const newProps = Object.assign({},
      ...Object.entries(state)
        .filter(([prop, val]) => passThroughProps.indexOf(prop) != -1 && val !== undefined && val !== null)
        .map(([key, val]) => ({ [key]: serialize(val) })),
      ...Object.entries(state.graphData)
        .map(([key, val]) => ({ [key]: JSON.stringify(val) })) // convert nodes & links to strings
    );

    state.forcegraph.setAttribute('forcegraph', newProps, true);

    //

    function serialize(p) {
      return p instanceof Function ? p.toString() : p; // convert functions to strings
    }
  }
});