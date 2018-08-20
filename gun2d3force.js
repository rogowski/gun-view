/**
 * This function load a *gun* node into a data object like {nodes: [], links: []}
 *  
 * @param {} gunref Gun reference
 * @param {} data Object that store the nodes and links
 * @param Function render Render function called when data changes 
 * @param Number debounce_time Debounce to call the render function 
 */
function gun2d3force(gunref, data, render, debounce_time) {
  const NODES_LIMIT = 100;
  const LINKS_LIMIT = 100;

  debounce_time = debounce_time || 1500;
  data.nodes = [], data.links = [];

  let nodes = {};
  let last_render;

  let superRender = function() {
    if (!last_render || typeof render === 'function' && (Date.now() - last_render) > debounce_time) {
      last_render = Date.now();
      render();
    }
  };

  const addNode = (at, x) => {

    let soul = at.$._.link || at.$._.soul;

    if (!soul) {
      /// The attributes are here. Not renderized.
      return;
    }

    if (data.nodes.length > NODES_LIMIT) {
      //console.log('NODE LIMIT!!! NODE #%s  NODES.LENGTH (%s) > NODE_LIMIT (%s)', soul, data.nodes.length, NODE_LIMIT);
      return;
    }
    if (data.links.length > LINKS_LIMIT) {
      //console.log('NODE LIMIT!!! NODE #%s  NODES.LENGTH (%s) > NODE_LIMIT (%s)', soul, data.nodes.length, NODE_LIMIT);
      return;
    }

    let parentSoul = null;
    if (at.via && (at.via.$._.soul || at.via.$._.link)) {
      parentSoul = at.via.$._.soul || at.via.$._.link;
    }
    if (parentSoul && !nodes[parentSoul]) {
      let nodeParent = {
        id: parentSoul,
        group: 2,
        at: at.via
      };
      nodes[nodeParent.id] = nodeParent;
      data.nodes.push(nodeParent);
    }

    if (parentSoul) {
      data.links.push({
        source: parentSoul,
        target: soul,
        label: at.get,
        group: 5,
        value: 3
      });
    }

    let n = nodes[soul];
    if (!n) {
      n = {
        id: soul,
        group: 3,
        at
      };
      nodes[soul] = n;
      data.nodes.push(nodes[soul]);
    }

    at.$.map().get(addNode);

    superRender();

  };

  gunref.map().get(addNode);

};
